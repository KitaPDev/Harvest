#include <WiFi.h>
#include <HTTPClient.h>
#include <stdio.h>
#include <ArduinoJson.h>

const char* API_KEY = "MODKJ2021";

const char* ssid = "xincaima";
const char* password = "020416651";

WiFiServer server(8090);
WiFiClient client;
IPAddress dns(8, 8, 8, 8);
IPAddress local_ip(192, 168, 1, 169);
IPAddress gateway(192, 168, 1, 1);
IPAddress subnet(255, 255, 255, 0);

char serverURL[] = "http://192.168.1.53:9090/iot/update/module/sensor";

String moduleSensorURL = "localhost:9090/iot/update/module/sensor";
String reservoirSensorURL = "localhost:9090/iot/update/reservoir/sensor";
String roomSensorURL = "localhost:9090/iot/update/room/sensor";

void setup() {
  Serial.begin(115200);
  Serial.println("HTTP Test");

  WiFi.begin(ssid, password);
  Serial.println("Establishing WiFi connection");

  WiFi.config(local_ip, dns, gateway, subnet);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.print("Connected to WiFi network\n");
  printWiFiStatus();

  server.begin();
}


void loop() {
  checkForConnections();

  DynamicJsonDocument doc(1024);
  char received[1024], body[512];

  if (client) {
    while (client.connected()) {
      boolean currentLineIsBlank = true;

      if(client.available()) {
        client.readString().toCharArray(received, sizeof received);
        
      } else {
        client.println("HTTP/1.0 200 OK");
        client.println("Content-Type: text/html");
        client.println();
        client.stop();
        Serial.println("Client disconnected");
      }
    }

    Serial.println(received);
    Serial.println(strlen(received));

    if(strlen(received)) {
      strncpy(body, received + (strchr(received, '{') - received), (strlen(received)) - (strchr(received, '{') - received));
      body[sizeof body + 1] = '\0';

      DeserializationError error = deserializeJson(doc, body);
      if (error) {
        Serial.print(F("deserializeJson() failed: "));
        Serial.println(error.f_str());
        return;
      }

      Serial.println(doc.size());
      Serial.println(body);
    }
    
    JsonObject root = doc.as<JsonObject>();

    int test = root["test"];
    const char* test2 = root["test2"];

    Serial.print("parsed JSON: ");
    Serial.println(test);
    Serial.println(test2);
  }

  memset(received, 0, sizeof received);
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

void sendLogSensorModule_httpPOST(char url[], int moduleID, int level, float temperatureRoot, float humidityRoot) {
  HTTPClient http;
  http.begin(url);
  http.addHeader("Content-Type", "application/json");

  char* currentTime = getCurrentTimeString();

  DynamicJsonDocument doc(1024);
  doc["api_key"] = API_KEY;
  doc["logged_at"] = currentTime;
  doc["module_id"] = moduleID;
  doc["level"] = level;
  doc["temperature_root"] = temperatureRoot;
  doc["humidity_root"] = humidityRoot;

  char jsonPayload[512];
  serializeJson(doc, jsonPayload);

  int httpResponseCode = http.POST(jsonPayload);
  Serial.print("HTTP Response Code = ");
  Serial.println(httpResponseCode);
}

char* getCurrentTimeString() {
  timeval curTime;
  gettimeofday(&curTime, NULL);
  int milli = curTime.tv_usec / 1000;

  char buffer [80];
  strftime(buffer, 80, "%Y-%m-%d %H:%M:%S", localtime(&curTime.tv_sec));

  char currentTime[84] = "";
  sprintf(currentTime, "%s:%02d", buffer, milli);

  return currentTime;
}
