#include <WiFi.h>
#include <HTTPClient.h>
#include <stdio.h>
#include <ArduinoJson.h>

const char* API_KEY = "MODKJ2021";

const char* ssid = "HOME108/4_2.4G";
const char* password = "ma282828";

WiFiServer server(8090);
WiFiClient client;
IPAddress dns(8, 8, 8, 8);
IPAddress local_ip(172, 20, 10, 9);
IPAddress gateway(172, 20, 10, 0);
IPAddress subnet(255, 255, 255, 0);

String serverURL = "http://192.168.1.53:9090/iot/update/module/sensor";

String moduleSensorURL = "localhost:9090/iot/update/module/sensor";
String reservoirSensorURL = "localhost:9090/iot/update/reservoir/sensor";
String roomSensorURL = "localhost:9090/iot/update/room/sensor";

void setup() {
  Serial.begin(115200);
  Serial.println("HTTP Test");

  WiFi.begin(ssid, password);
  Serial.println("Establishing WiFi connection");

//  WiFi.config(local_ip, dns, gateway, subnet);

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
  
  DynamicJsonDocument jsonBodyDoc(1024);
  char received[2048], body[1024];

  if (client) {
    while (client.connected()) {
      boolean currentLineIsBlank = true;

      if(client.available()) {
        client.readString().toCharArray(received, sizeof received);
      }

      client.println("HTTP/1.0 200 OK");
      client.println("Content-Type: text/html");
      client.println();
      client.stop();
      Serial.println("Client disconnected");
    }

    strncpy(body, received + (strchr(received, '{') - received), (sizeof received) - (strchr(received, '{') - received));
    body[sizeof body + 1] = '\0';
    Serial.println(body);

    DeserializationError error = deserializeJson(jsonBodyDoc, body);
    if(error) {
      Serial.print(F("deserializeJson() failed: "));
      Serial.println(error.f_str());
      return;
    }

    Serial.println(jsonBodyDoc.size());
    JsonObject root = jsonBodyDoc.as<JsonObject>();
    
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

void sendLogSensorModule(int moduleID, int level, float temperatureRoot, float humidityRoot) {
    HTTPClient http;
    http.addHeader("Content-Type", "application/jsonBody");
  
    timeval curTime;
    gettimeofday(&curTime, NULL);
    int milli = curTime.tv_usec / 1000;
  
    char buffer [80];
    strftime(buffer, 80, "%Y-%m-%d %H:%M:%S", localtime(&curTime.tv_sec));
  
    char currentTime[84] = "";
    sprintf(currentTime, "%s:%02d", buffer, milli);

    char chModuleID[8], chLevel[2], chTempRoot[3], chHumRoot[3];
    snprintf(chModuleID, sizeof chModuleID, "%f", moduleID);
    snprintf(chLevel, sizeof chLevel, "%f", level);
    snprintf(chTempRoot, sizeof chTempRoot, "%f", temperatureRoot);
    snprintf(chHumRoot, sizeof chHumRoot, "%f", humidityRoot);
  
    char* payload = "{\"api_key\":\"";
    strcat(payload, API_KEY);
    strcat(payload, "\",\"logged_at\":\"");
    strcat(payload, currentTime);
    strcat(payload, "\",\"module_id\":\"");
    strcat(payload, chModuleID);
    strcat(payload, "\",\"level\":\"");
    strcat(payload, chLevel);
    strcat(payload, "\",\"temperature_root\":\"");
    strcat(payload, chTempRoot);
    strcat(payload, "\",\"humidity_root\":\"");
    strcat(payload, chHumRoot);
    strcat(payload, "\"}");
  
    int httpResponseCode = http.POST(payload);
    Serial.print("HTTP Response Code = ");
    Serial.println(httpResponseCode);
}
