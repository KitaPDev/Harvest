#include <WiFi.h>
#include <HTTPClient.h>
#include <stdio.h>
#include <ArduinoJson.h>

const char* API_KEY = "MODKJ2021";

const char* ssid = "xincaima";
const char* password = "020416651";

char serverAddress[] = "http://192.168.1.53";
int port = 9090;

WiFiClient wifiClient;

IPAddress dns(8, 8, 8, 8);
IPAddress local_ip(192, 168, 1, 111);
IPAddress gateway(192, 168, 1, 255);
IPAddress subnet(255, 255, 255, 0);

HTTPClient httpClient;

void setup() {
  Serial.begin(115200);
  Serial.println("HTTP Test");

  WiFi.begin(ssid, password);
  Serial.println("Establishing WiFi connection");

  WiFi.config(local_ip, gateway, subnet, dns);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.print("Connected to WiFi network\n");
  printWiFiStatus();
}

void loop() {
  if(WiFi.status() == WL_CONNECTED) {   //Check WiFi connection status
    DynamicJsonDocument doc(1024);
    doc["api_key"] = API_KEY;
    doc["id"] = 1;
    doc["message"] = "test message";

    char jsonPayload[512];
    serializeJson(doc, jsonPayload);

    sendPostRequest(jsonPayload);
  }
  
  delay(5000);
}

void sendPostRequest(char* postData) {
  if (httpClient.begin("192.168.1.53", 9090, "/iot/test")) {
    Serial.println("HTTP Client connected...Sending POST Request");
    httpClient.addHeader("Content-Type", "application/json");

    Serial.println(postData);
    int statusCode = httpClient.POST(postData);
  
    if (statusCode > 0) {
      String response = httpClient.getString();
      
      Serial.print("Status Code: ");
      Serial.println(statusCode);
      Serial.print("Response: ");
      Serial.println(response);
      
    } else {
      Serial.printf("Error occurred while sending HTTP POST: %s\n\n", httpClient.errorToString(statusCode).c_str());
    }
    
  } else {
    Serial.println("HTTP Client failed to connect.\n");
  }

  httpClient.end();
}

//void loop() {
//  checkForConnections();
//
//  DynamicJsonDocument doc(1024);
//  char received[1024], body[512];
//
//  if (client) {
//    while (client.connected()) {
//      boolean currentLineIsBlank = true;
//
//      if(client.available()) {
//        client.readString().toCharArray(received, sizeof received);
//        
//      } else {
//        client.println("HTTP/1.0 200 OK");
//        client.println("Content-Type: text/html");
//        client.println();
//        client.stop();
//        Serial.println("Client disconnected");
//      }
//    }
//
//    Serial.println(received);
//    Serial.println(strlen(received));
//
//    if(strlen(received)) {
//      strncpy(body, received + (strchr(received, '{') - received), (strlen(received)) - (strchr(received, '{') - received));
//      body[sizeof body + 1] = '\0';
//
//      DeserializationError error = deserializeJson(doc, body);
//      if (error) {
//        Serial.print(F("deserializeJson() failed: "));
//        Serial.println(error.f_str());
//        return;
//      }
//
//      Serial.println(doc.size());
//      Serial.println(body);
//    }
//    
//    JsonObject root = doc.as<JsonObject>();
//
//    int test = root["test"];
//    const char* test2 = root["test2"];
//
//    Serial.print("parsed JSON: ");
//    Serial.println(test);
//    Serial.println(test2);
//  }
//
//  memset(received, 0, sizeof received);
//}
//
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
//
//void checkForConnections() {
//  if (server.hasClient()) {
//    if (client.connected()) {
//      Serial.println("Connection rejected");
//      server.available().stop();
//    } else {
//      Serial.println("Connection accepted");
//      client = server.available();
//    }
//  }
//}
