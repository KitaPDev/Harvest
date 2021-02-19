#include "pins.h"

#include <OneWire.h>
#include <DallasTemperature.h>
#include <EEPROM.h>
#include <GravityTDS.h>
#include <WiFi.h>

OneWire oneWire(PIN_SOLNTEMP);
DallasTemperature dallasTemp(&oneWire);
GravityTDS gravityTds;

const char* ssid = "xincaima";
const char* password = "020416651";

WiFiServer server(80);
IPAddress ip(192, 168, 1, 169);

String moduleSensorURL = "localhost:9090/iot/update/module/sensor";
String reservoirSensorURL = "localhost:9090/iot/update/reservoir/sensor";
String roomSensorURL = "localhost:9090/iot/update/room/sensor";
 
int isAuto;

unsigned long currentTime = millis();
unsigned long previousTime = 0;

long lightOnTime = 0;
long lightOffTime = 0;
long misterOnTime = 0;
long misterOffTime = 0;

void setup() {
  Serial.begin(115200); 
  Serial.println("Module 1");

  WiFi.begin(ssid, password);
  Serial.println("Establishing WiFi connection...");

  WiFi.config(ip);

  while(WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.print("Connected to WiFi network with IP Address: ");
  Serial.println(WiFi.localIP());
  
  initSensors();
  initHardware();
}

void loop() {
  WiFiClient client = server.available();

  if(client) {
    while(client.connected()) {
      if(client.available()) {
        Serial.println(client.read());
      }
    }
  }
  
  if(isAuto) {
    
  } else {
    
  }
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
