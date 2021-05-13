#include <DHT.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <arduino-timer.h>
#include <cstddef>

#define PIN_LED 16
#define PIN_PUMP 23
#define PIN_DHT11 27

#if C
#include <esp_wifi.h>
void SetWifi (B4R::Object* o) {
  esp_wifi_set_ps(WIFI_PS_NONE);
}
#endif

auto timer = timer_create_default();

DHT dht11(PIN_DHT11, DHT11);

WiFiServer server(8090);
WiFiClient client;
IPAddress dns(8, 8, 8, 8);
IPAddress local_ip(172, 20, 10, 5);
IPAddress gateway(192, 168, 1, 1);
IPAddress subnet(255, 255, 255, 0);

char serverURL[] = "172.20.10.3";
int serverPort = 9090;
char updateGerminatorSensorURL[] = "/iot/update/germinator/sensor";

const char* API_KEY = "MODKJ2021";

const char* ssid = "First iPhone";
const char* password = "ma282828";

unsigned long prevToggleTime = 0;

struct GerminatorSettings {
  int isAuto;
  long lightOnTime;
  long lightOffTime;
  float humidityLow;
  float humidityHigh;
  int led;
  int pump;
};
struct GerminatorSettings germinatorSettings;

void setup() {
  Serial.begin(115200);
  Serial.println("Germinator");

  WiFi.begin(ssid, password);
  Serial.println("Establishing WiFi connection...");

  WiFi.config(local_ip, gateway, subnet, dns);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.print("Connected to WiFi network with IP Address: ");
  Serial.println(WiFi.localIP());
  printWiFiStatus();

  germinatorSettings.isAuto = 0;
  germinatorSettings.lightOnTime = 0;
  germinatorSettings.lightOffTime = 0;
  germinatorSettings.humidityLow = 0;
  germinatorSettings.humidityHigh = 0;

  pinMode(PIN_LED, OUTPUT);
  pinMode(PIN_PUMP, OUTPUT);
  pinMode(PIN_DHT11, INPUT);

  dht11.begin();

  server.begin();

  timer.every(2000, updateGerminatorSensor);

  delay(1000);
}

void loop() {
  timer.tick();

  checkForConnections();

  int isAuto = germinatorSettings.isAuto;
  int led = germinatorSettings.led;
  int pump = germinatorSettings.pump;

  DynamicJsonDocument doc(1024);
  char received[1024], body[512];

  if (client) {
    while (client.connected()) {
      if (client.available()) {
        client.readString().toCharArray(received, sizeof received);

        if (strchr(received, '{') != NULL) {
          strncpy(body, received + (strchr(received, '{') - received), (strlen(received)) - (strchr(received, '{') - received));
          body[sizeof body + 1] = '\0';

          DeserializationError error = deserializeJson(doc, body);
          if (error) {
            Serial.print(F("deserializeJson() failed: "));
            Serial.println(error.f_str());

            client.println("HTTP/1.0 500 Internal Server Error");
            client.println();
            client.stop();
            Serial.println("Client disconnected");

            continue;
          }
        }

        JsonObject root = doc.as<JsonObject>();

        Serial.println(root);

        germinatorSettings.isAuto = root["is_auto"];
        germinatorSettings.lightOnTime = root["light_on_time"];
        germinatorSettings.lightOffTime = root["light_off_time"];
        germinatorSettings.humidityLow = root["humidity_low"];
        germinatorSettings.humidityHigh = root["humidity_high"];
        germinatorSettings.led = root["led"];
        germinatorSettings.pump = root["pump"];

        client.println("HTTP/1.0 200 OK");
        client.println("Content-Type: application/json");
        client.println("Vary: Origin");
        client.println("X-Content-Type-Options: nosniff");
        client.println("Connection: Closed");
        client.println();
        client.println(getGerminatorSettings_Json());
        client.println();
        client.stop();
        Serial.println("Client disconnected");
        continue;
      }
    }

    memset(received, 0, sizeof received);

    Serial.print("IsAuto:");
    Serial.print(isAuto);
    Serial.println(germinatorSettings.isAuto);

    if (isAuto == 0 && germinatorSettings.isAuto == 1) {
      prevToggleTime = millis();
    }

    if (germinatorSettings.isAuto) {
      Serial.println("IN AUTO LOOP");
      if (dht11.readHumidity() <= germinatorSettings.humidityLow) {
        pump = 1;
      } else {
        pump = 0;
      }

      if (germinatorSettings.led) {
        if (millis() - prevToggleTime >= germinatorSettings.lightOnTime * 3600000) {
          germinatorSettings.led = 0;
          prevToggleTime = millis();
        }
      } else {
        if (millis() - prevToggleTime >= germinatorSettings.lightOffTime * 3600000) {
          germinatorSettings.led = 1;
          prevToggleTime = millis();
        }
      }
    }
  }

    updateHardware(led, pump);
}

void updateHardware(int led, int pump) {
  digitalWrite(PIN_LED, led);
  digitalWrite(PIN_PUMP, pump);
}

bool updateGerminatorSensor(void *) {
  Serial.println("Update Germinator Sensor");

  HTTPClient httpClient;
  if (httpClient.begin(serverURL, serverPort, updateGerminatorSensorURL)) {
    httpClient.addHeader("Content-Type", "application/json");

    int httpResponseCode = httpClient.POST(getLogSensorGerminator_Json());
    String httpResponse = httpClient.getString();

    Serial.print("Status Code: ");
    Serial.println(httpResponseCode);
    Serial.print("Response: ");
    Serial.println(httpResponse);

    if (httpResponseCode < 0) {
      Serial.printf("Error occurred while sending HTTP POST: %s\n\n", httpClient.errorToString(httpResponseCode).c_str());
    }
  }

  return true;
}

String getLogSensorGerminator_Json() {
  DynamicJsonDocument doc(1024);
  doc["api_key"] = API_KEY;
  doc["temperature"] = dht11.readTemperature();
  doc["humidity"] = dht11.readHumidity();

  String jsonPayload;
  serializeJson(doc, jsonPayload);
  Serial.println(jsonPayload);

  return jsonPayload;
}

String getGerminatorSettings_Json() {
  DynamicJsonDocument doc(1024);
  doc["api_key"] = API_KEY;
  doc["is_auto"] = germinatorSettings.isAuto;
  doc["light_on_time"] = germinatorSettings.lightOnTime;
  doc["light_off_time"] = germinatorSettings.lightOffTime;
  doc["humidity_low"] = germinatorSettings.humidityLow;
  doc["humidity_high"] = germinatorSettings.humidityHigh;
  doc["led"] = germinatorSettings.led;
  doc["pump"] = germinatorSettings.pump;

  String jsonPayload;
  serializeJson(doc, jsonPayload);
  Serial.println("Germinator Settings");
  Serial.println(jsonPayload);

  return jsonPayload;
}

void printWiFiStatus() {
  // print the SSID of the network you're attached to:
  Serial.print("SSID: ");
  Serial.println(WiFi.SSID());

  // print your WiFi shield's IP address:
  IPAddress ip = WiFi.localIP();
  Serial.print("IP Address: ");
  Serial.println(ip);

  // print the received signal strength:
  long rssi = WiFi.RSSI();
  Serial.print("signal strength (RSSI):");
  Serial.print(rssi);
  Serial.println(" dBm");
}

void checkForConnections() {
  if (server.hasClient()) {
    if (client.connected()) {
      Serial.println("Connection rejected");
      server.available().stop();
    } else {
      Serial.println("Connection accepted");
      client = server.available();
    }
  }
}
