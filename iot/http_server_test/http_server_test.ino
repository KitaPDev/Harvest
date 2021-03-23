#include <WiFi.h>
#include <ArduinoJson.h>

const char* API_KEY = "MODKJ2021";

const char* ssid = "159291_2.4G";
const char* password = "MAY789354";

WiFiServer server(8090);

IPAddress dns(8, 8, 8, 8);
IPAddress local_ip(192, 168, 1, 111);
IPAddress gateway(192, 168, 1, 1);
IPAddress subnet(255, 255, 255, 0);

#if C
#include <esp_wifi.h>
void SetWifi (B4R::Object* o) {
esp_wifi_set_ps(WIFI_PS_NONE);
}
#endif

void setup() {  
  Serial.begin(115200);
  Serial.println("HTTP Test");

  WiFi.mode(WIFI_STA);
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

  server.begin();
}

void loop() {
  DynamicJsonDocument doc(1024);
  char received[1024], body[512];

  WiFiClient client = server.available();

  if (client) {
    Serial.println("New Client.");

    while (client.connected()) {
      Serial.println("Client connected!");
      if (client.available()) {
        Serial.println("Client has data.");
        client.readString().toCharArray(received, sizeof received);

        if (strchr(received, '{') != NULL) {
          strncpy(body, received + (strchr(received, '{') - received), (strlen(received)) - (strchr(received, '{') - received));
          body[sizeof body + 1] = '\0';

          DeserializationError error = deserializeJson(doc, body);
          if (error) {
            Serial.print(F("deserializeJson() failed: "));
            Serial.println(error.f_str());

            client.println("HTTP/1.1 500 Internal Server Error");
            client.println();
            client.stop();
            Serial.println("Client disconnected");

            continue;
          }
        }

        JsonObject root = doc.as<JsonObject>();

        Serial.print("Received: ");
        serializeJsonPretty(root, Serial);
        Serial.println();

        DynamicJsonDocument doc(1024);
        doc["api_key"] = API_KEY;
        doc["message"] = "Hello from ESP32";

        char jsonPayload[512];
        serializeJson(doc, jsonPayload);

        Serial.print("Response: ");
        Serial.println(jsonPayload);

        client.println("HTTP/1.1 200 OK");
        client.println("Content-Type: application/json; charset=utf-8");
        client.println("Vary: Origin");
        client.println("X-Content-Type-Options: nosniff");
        client.println("Connection: Closed");
        client.println();
        client.println(jsonPayload);
        client.println();
        client.stop();
        Serial.println("Client disconnected\n");
        continue;
      }
    }
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
