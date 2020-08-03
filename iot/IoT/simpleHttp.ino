#include <ArduinoJson.h>

#include "HTTPClient.h"
#include "WiFi.h"

const int capacity = JSON_OBJECT_SIZE(3);
StaticJsonDocument<capacity> doc;

void setup() {
    Serial.begin(115200);
    ConnectToWifi();
}

void loop() {
    delay(2000);

    doc["test1"].set("data1");
    doc["test2"].set("data2");

    String output;
    serializeJson(doc, output);

    if((WiFi.status() == WL_CONNECTED)) {
        // Serial.println("making Post Request");
        // String contentType = "application/json";
        // String jsonData = "jsonString";
        // client.post("/testData", contentType, jsonData);

        HTTPClient http;
        http.begin("http://192.168.2.192:3000/testData");
        http.addHeader("Content-Type", "application/json");
        int httpCode = http.POST(output);

        if(httpCode > 0) {
            Serial.printf("[HTTP] Post... succeed: %d\n", httpCode);
        } else {
            Serial.println("[HTTP] Post... failed: " + http.errorToString(httpCode));
        }

        http.end();
    } else {
        ConnectToWifi();
    }

    delay(3000);
}

void ConnectToWifi() {
    WiFi.begin("83MainAccess", "watt8ba3A1809.");
    Serial.print("Connecting to "); Serial.println("83MainAccess");

    uint8_t i = 0;
    while(WiFi.status() != WL_CONNECTED) {
        Serial.print('.');
        delay(500);

        if((++i % 16) == 0) {
            Serial.println(F(" still trying to connect"));
        }
    }

    Serial.println("Connected to WIFI. My IP Address is: ");
    Serial.println(WiFi.localIP());
}