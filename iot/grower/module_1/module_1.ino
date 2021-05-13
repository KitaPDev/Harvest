#include "pins.h"

#include <OneWire.h>
#include <DallasTemperature.h>
#include <EEPROM.h>
#include <GravityTDS.h>
#include <DHT.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <arduino-timer.h>
#include <cstddef>

#define moduleID 2;
#define reservoirID 10;
#define roomID 6;

#if C
#include <esp_wifi.h>
void SetWifi (B4R::Object* o) {
  esp_wifi_set_ps(WIFI_PS_NONE);
}
#endif

auto timer = timer_create_default();

OneWire oneWire(PIN_SOLNTEMP);
DallasTemperature dallasTemp(&oneWire);
GravityTDS gravityTds;
DHT dht11_room(PIN_DHT11, DHT11);
DHT dht22_level1(PIN_DHT22_1, DHT22);
DHT dht22_level2(PIN_DHT22_2, DHT22);

// TDS Sensor Variables
#define sampleCount 30
int voltageRef = 3.3;
int analogBuffer[30];
int analogBufferTemp[30];
int analogBufferIndex = 0;
float averageVoltage = 0, tdsValue = 0;

// pH Sensor Variables
int phBufferIndex = 0;

WiFiServer server(8090);
WiFiClient client;
IPAddress dns(8, 8, 8, 8);
IPAddress local_ip(172, 20, 10, 5);
IPAddress gateway(192, 168, 1, 1);
IPAddress subnet(255, 255, 255, 0);

char serverURL[] = "172.20.10.3";
int serverPort = 9090;
char updateModuleSensorURL[] = "/iot/update/module/sensor";
char updateReservoirSensorURL[] = "/iot/update/reservoir/sensor";
char updateRoomSensorURL[] = "/iot/update/room/sensor";

const char* API_KEY = "MODKJ2021";

const char* ssid = "First iPhone";
const char* password = "ma282828";

unsigned long prevToggleTime = 0;

int levels = 2;

struct ModuleSettings {
  int isAuto;
  long lightOnTime;
  long lightOffTime;
  float humidityRootLow;
  float humidityRootHigh;
  int led1;
  int led2;
  int fan1;
  int fan2;
  int sv1;
  int sv2;
};
struct ModuleSettings moduleSettings;

struct ReservoirSettings {
  int isAuto;
  float tdsLow;
  float tdsHigh;
  float phLow;
  float phHigh;
  int svWater;
  int svNutrient;
};
struct ReservoirSettings reservoirSettings;

void setup() {
  Serial.begin(115200);
  Serial.println("Module 1");

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

  moduleSettings.isAuto = 0;
  moduleSettings.lightOnTime = 0;
  moduleSettings.lightOffTime = 0;
  moduleSettings.humidityRootLow = 0;
  moduleSettings.humidityRootHigh = 0;
  moduleSettings.led1 = 0;
  moduleSettings.led2 = 0;
  moduleSettings.fan1 = 0;
  moduleSettings.fan2 = 0;
  moduleSettings.sv1 = 0;
  moduleSettings.sv2 = 0;

  //lettuce
  reservoirSettings.tdsLow = 560;
  reservoirSettings.tdsHigh = 840;
  reservoirSettings.phLow = 5.5;
  reservoirSettings.phHigh = 6.5;
  reservoirSettings.svWater = 0;
  reservoirSettings.svNutrient = 0;

  initSensors();
  initHardware();

  server.begin();

  timer.every(2000, updateModuleSensor);
  timer.every(2000, updateRoomSensor);
  timer.every(2000, updateReservoirSensor);
  timer.every(40, updateTDSBuffer);
}

void loop() {
  timer.tick();

  checkForConnections();

  int led1 = moduleSettings.led1;
  int led2 = moduleSettings.led2;
  int fan1 = moduleSettings.fan1;
  int fan2 = moduleSettings.fan2;
  int sv1 = moduleSettings.sv1;
  int sv2 = moduleSettings.sv2;

  int svWater = reservoirSettings.svWater;
  int svNutrient = reservoirSettings.svNutrient;

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

        if (root.containsKey("is_auto")) {
          moduleSettings.isAuto = root["is_auto"];
        }


        if (root.containsKey("module_id")) {
          moduleSettings.lightOnTime = root["light_on_time"];
          moduleSettings.lightOffTime = root["light_off_time"];
          moduleSettings.humidityRootLow = root["humidity_root_low"];
          moduleSettings.humidityRootHigh = root["humidity_root_high"];
          moduleSettings.led1 = root["led_1"];
          moduleSettings.led2 = root["led_2"];
          moduleSettings.fan1 = root["fan_1"];
          moduleSettings.fan2 = root["fan_2"];
          moduleSettings.sv1 = root["sv_1"];
          moduleSettings.sv2 = root["sv_2"];

          led1 = moduleSettings.led1;
          led2 = moduleSettings.led2;
          fan1 = moduleSettings.fan1;
          fan2 = moduleSettings.fan2;
          sv1 = moduleSettings.sv1;
          sv2 = moduleSettings.sv2;

          client.println("HTTP/1.0 200 OK");
          client.println("Content-Type: application/json");
          client.println("Vary: Origin");
          client.println("X-Content-Type-Options: nosniff");
          client.println("Connection: Closed");
          client.println();
          client.println(getModuleSettings_Json());
          client.println();
          client.stop();
          Serial.println("Client disconnected");
          continue;

        } else if (root.containsKey("reservoir_id")) {
          reservoirSettings.tdsLow = root["tds_low"];
          reservoirSettings.tdsHigh = root["tds_high"];
          reservoirSettings.phLow = root["ph_low"];
          reservoirSettings.phHigh = root["ph_high"];
          reservoirSettings.svWater = root["sv_water"];
          reservoirSettings.svNutrient = root["sv_nutrient"];

          client.println("HTTP/1.0 200 OK");
          client.println("Content-Type: application/json");
          client.println("Vary: Origin");
          client.println("X-Content-Type-Options: nosniff");
          client.println("Connection: Closed");
          client.println();
          client.println(getReservoirSettings_Json());
          client.println();
          client.stop();
          Serial.println("Client disconnected");
          continue;
        }


      } else {
        client.println("HTTP/1.0 200 OK");
        client.println();
        client.stop();
        Serial.println("Client disconnected");
        continue;
      }
    }
  }

  memset(received, 0, sizeof received);

  if (moduleSettings.isAuto) {
    for (int i = 1; i <= levels; i++) {
      if (getHumidityRoot(i) <= moduleSettings.humidityRootLow) {
        setLevelMist(i, 1);
      } else {
        setLevelMist(i, 0);
      }
    }

    if (moduleSettings.led1) {
        if (millis() - prevToggleTime >= moduleSettings.lightOnTime * 3600000) {
          moduleSettings.led1 = 0;
          prevToggleTime = millis();
        }
      } else {
        if (millis() - prevToggleTime >= moduleSettings.lightOffTime * 3600000) {
          moduleSettings.led1 = 1;
          prevToggleTime = millis();
        }
      }

    if (moduleSettings.led2) {
        if (millis() - prevToggleTime >= moduleSettings.lightOnTime * 3600000) {
          moduleSettings.led2 = 0;
          prevToggleTime = millis();
        }
      } else {
        if (millis() - prevToggleTime >= moduleSettings.lightOffTime * 3600000) {
          moduleSettings.led2 = 1;
          prevToggleTime = millis();
        }
      }
  }

  updateHardware(led1, led2, fan1, fan2, sv1, sv2, svWater, svNutrient);
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

bool updateModuleSensor(void *) {
  Serial.println("Updating Module Sensor");

  HTTPClient httpClient;

  if (httpClient.begin(serverURL, serverPort, updateModuleSensorURL)) {
    httpClient.addHeader("Content-Type", "application/json");

    int httpResponseCode = httpClient.POST(getLogSensorModule_Json());
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

bool updateRoomSensor(void *) {
  Serial.println("Update Room Sensor");

  HTTPClient httpClient;
  if (httpClient.begin(serverURL, serverPort, updateRoomSensorURL)) {
    httpClient.addHeader("Content-Type", "application/json");

    int httpResponseCode = httpClient.POST(getLogSensorRoom_Json());
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

bool updateReservoirSensor(void *) {
  Serial.println("Update Reservoir Sensor");

  HTTPClient httpClient;
  if (httpClient.begin(serverURL, serverPort, updateReservoirSensorURL)) {
    httpClient.addHeader("Content-Type", "application/json");

    int httpResponseCode = httpClient.POST(getLogSensorReservoir_Json());
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

bool updateTDSBuffer(void *) {
  analogBuffer[analogBufferIndex] = analogRead(PIN_TDS); //read the analog value and store into the buffer
  analogBufferIndex++;
  if (analogBufferIndex == sampleCount) {
    analogBufferIndex = 0;
  }
  return true;
}

String getLogSensorModule_Json() {
  DynamicJsonDocument doc(1024);
  doc["api_key"] = API_KEY;
  doc["module_id"] = moduleID;

  JsonObject level = doc.createNestedObject("level");

  char clevel[2];

  for (int i = 1; i <= levels; i++) {
    memset(clevel, 0, sizeof clevel);
    itoa (i, clevel, 10);

    JsonObject obj = level.createNestedObject(clevel);
    obj["temperature_root"] = getTemperatureRoot(i);
    obj["humidity_root"] = getHumidityRoot(i);
  }

  String jsonPayload;
  serializeJson(doc, jsonPayload);
  Serial.println(jsonPayload);

  return jsonPayload;
}

String getLogSensorRoom_Json() {
  DynamicJsonDocument doc(1024);
  doc["api_key"] = API_KEY;
  doc["room_id"] = roomID;
  doc["temperature_room"] = getTemperatureRoom();
  doc["humidity_room"] = getHumidityRoom();

  String jsonPayload;
  serializeJson(doc, jsonPayload);
  Serial.println(jsonPayload);

  return jsonPayload;
}

String getLogSensorReservoir_Json() {
  DynamicJsonDocument doc(1024);
  doc["api_key"] = API_KEY;
  doc["reservoir_id"] = reservoirID;
  doc["tds"] = getTDSNutrient();
  doc["ph"] = getPHNutrient();
  doc["temperature_solution"] = getTemperatureSolution();

  String jsonPayload;
  serializeJson(doc, jsonPayload);
  Serial.println(jsonPayload);

  return jsonPayload;
}

String getModuleSettings_Json() {
  DynamicJsonDocument doc(1024);
  doc["api_key"] = API_KEY;
  doc["moduleID"] = moduleID;
  doc["is_auto"] = moduleSettings.isAuto;
  doc["light_on_time"] = moduleSettings.lightOnTime;
  doc["light_off_time"] = moduleSettings.lightOffTime;
  doc["humidity_root_low"] = moduleSettings.humidityRootLow;
  doc["humidity_root_high"] = moduleSettings.humidityRootHigh;
  doc["led_1"] = moduleSettings.led1;
  doc["led_2"] = moduleSettings.led2;
  doc["fan_1"] = moduleSettings.fan2;
  doc["fan_2"] = moduleSettings.fan2;
  doc["sv_1"] = moduleSettings.sv1;
  doc["sv_2"] = moduleSettings.sv2;

  String jsonPayload;
  serializeJson(doc, jsonPayload);
  Serial.print("Module Settings");
  Serial.println(jsonPayload);

  return jsonPayload;
}

String getReservoirSettings_Json() {
  DynamicJsonDocument doc(1024);
  doc["api_key"] = API_KEY;
  doc["reservoir_id"] = reservoirID;
  doc["is_auto"] = reservoirSettings.isAuto;
  doc["tds_low"] = reservoirSettings.tdsLow;
  doc["tds_high"] = reservoirSettings.tdsHigh;
  doc["ph_low"] = reservoirSettings.phLow;
  doc["ph_high"] = reservoirSettings.phHigh;
  doc["sv_water"] = reservoirSettings.svWater;
  doc["sv_nutrient"] = reservoirSettings.svNutrient;

  String jsonPayload;
  serializeJson(doc, jsonPayload);
  Serial.print("Reservoir Settings");
  Serial.println(jsonPayload);

  return jsonPayload;
}
