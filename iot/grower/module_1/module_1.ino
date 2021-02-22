#include "pins.h"

#include <OneWire.h>
#include <DallasTemperature.h>
#include <EEPROM.h>
#include <GravityTDS.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <arduino-timer.h>
#include <cstddef>

auto timer = timer_create_default();

OneWire oneWire(PIN_SOLNTEMP);
DallasTemperature dallasTemp(&oneWire);
GravityTDS gravityTds;

WiFiServer server(8090);
WiFiClient client;
IPAddress dns(8, 8, 8, 8);
IPAddress local_ip(192, 168, 1, 169);
IPAddress gateway(192, 168, 1, 1);
IPAddress subnet(255, 255, 255, 0);

char serverURL[] = "http://192.168.1.53:9090/iot/update/module/sensor";
const char* API_KEY = "MODKJ2021";

const char* ssid = "xincaima";
const char* password = "020416651";

unsigned long currentTime = millis();
unsigned long previousLEDToggleTime = 0;

int levels = 2;
int previousStateLED1 = 0;
int previousStateLED2 = 0;

struct Settings {
  boolean isAuto;
  boolean isWaterOnly;
  long lightOnTime;
  long lightOffTime;
  float humidityRootLow;
  float humidityRootHigh;
};
struct Settings settings;

struct ManualSettings {
  int led1;
  int led2;
  int fan1;
  int fan2;
  int svWater;
  int svReservoir;
  int sv1;
  int sv2;
};
struct ManualSettings manualSettings;

void setup() {
  Serial.begin(115200); 
  Serial.println("Module 1");

  WiFi.begin(ssid, password);
  Serial.println("Establishing WiFi connection...");

  WiFi.config(local_ip, dns, gateway, subnet);

  while(WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.print("Connected to WiFi network with IP Address: ");
  Serial.println(WiFi.localIP());
  printWiFiStatus();

  settings.isAuto = false;
  settings.isWaterOnly = false;
  settings.lightOnTime = 0;
  settings.lightOffTime = 0;
  settings.humidityRootLow = 0;
  settings.humidityRootHigh = 0;

  initSensors();
  initHardware();
  
  server.begin();

  timer.every(2000, updateModuleSensor);
}

void loop() {
  timer.tick();
  
  checkForConnections();

  int led1 = manualSettings.led1;
  int led2 = manualSettings.led2;
  int fan1 = manualSettings.fan1;
  int fan2 = manualSettings.fan2;
  int svWater = manualSettings.svWater;
  int svReservoir = manualSettings.svReservoir;
  int sv1 = manualSettings.sv1;
  int sv2 = manualSettings.sv2;

  DynamicJsonDocument doc(1024);
  char received[1024], body[512];

  if (client) {
    while (client.connected()) {
      if(client.available()) {
        client.readString().toCharArray(received, sizeof received);

        if(strchr(received, '{') != NULL) {
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
    
        settings.isAuto = root["is_auto"];

        if(settings.isAuto) {
          settings.isWaterOnly = root["is_water_only"];
          settings.lightOnTime = root["light_on_time"];
          settings.lightOffTime = root["light_off_time"];
          settings.humidityRootLow = root["humidity_root_low"];
          settings.humidityRootHigh = root["humidity_root_high"];
          continue;
          
        } else {
          manualSettings.led1 = root["led_1"];
          manualSettings.led2 = root["led_2"];
          manualSettings.fan1 = root["fan_1"];
          manualSettings.fan2 = root["fan_2"];
          manualSettings.svWater = root["sv_water"];
          manualSettings.svReservoir = root["sv_reservoir"];
          manualSettings.sv1 = root["sv_1"];
          manualSettings.sv2 = root["sv_2"];
        }
        
        int led1 = manualSettings.led1;
        int led2 = manualSettings.led2;
        int fan1 = manualSettings.fan1;
        int fan2 = manualSettings.fan2;
        int svWater = manualSettings.svWater;
        int svReservoir = manualSettings.svReservoir;
        int sv1 = manualSettings.sv1;
        int sv2 = manualSettings.sv2;

        client.println("HTTP/1.0 200 OK");
        client.println("Content-Type: application/json");
        client.println(getHardwareStatus_Json(led1, led2, fan1, fan2, svWater, svReservoir, sv1, sv2));
        client.println();
        client.stop();
        Serial.println("Client disconnected");
        
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
  
  if(settings.isAuto) {
    if(settings.isWaterOnly) {
      useWater();
    } else {
      useNutrientSolution();
    }
    
    for(int i = 1; i <= levels; i++) {
      if(getHumidityRoot(i) <= settings.humidityRootLow) {
        setLevelMist(i, 1);
      } else {
        setLevelMist(i, 0);
      }
    }
  }
  
  updateHardware(led1, led2, fan1, fan2, svWater, svReservoir, sv1, sv2);
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
  HTTPClient http;
  http.begin(serverURL);
  http.addHeader("Content-Type", "application/json");

  int httpResponseCode = http.POST(getLogSensorModule_Json());
  Serial.print("HTTP Response Code = ");
  Serial.println(httpResponseCode);
  
  return true;
}

char * getLogSensorModule_Json() {
  DynamicJsonDocument doc(1024);
  doc["api_key"] = API_KEY;
  doc["module_id"] = 1;
  for(int i = 1; i <= levels; i++) {
    doc[i]["temperature_root"] = getTemperatureRoot(1);
    doc[i]["humidity_root"] = getHumidityRoot(1);
  }
  
  char jsonPayload[512];
  serializeJson(doc, jsonPayload);

  return jsonPayload;
}

char * getHardwareStatus_Json(int led1, int led2, int fan1, int fan2, int svWater, int svReservoir, int sv1, int sv2) {
  DynamicJsonDocument doc(1024);
  doc["api_key"] = API_KEY;
  doc["led1"] = led1;
  doc["led2"] = led2;
  doc["fan1"] = fan2;
  doc["fan2"] = fan2;
  doc["svWater"] = svWater;
  doc["svReservoir"] = svReservoir;
  doc["sv1"] = sv1;
  doc["sv2"] = sv2;

  char jsonPayload[512];
  serializeJson(doc, jsonPayload);

  return jsonPayload;
}
