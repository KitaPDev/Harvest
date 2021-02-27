#include <DHT.h>

#define PIN_DHT22 32
#define DHTTYPE DHT22

DHT dht(PIN_DHT22, DHTTYPE);

void setup() {
  Serial.begin(115200);
  Serial.println("DHT22 Test");
  dht.begin();

  delay(2000);
}

void loop() {
  float h = dht.readHumidity();
  float t = dht.readTemperature();

  if (isnan(h) || isnan(t)) {
    Serial.println(F("Failed to read from DHT sensor!"));
    return;
  }

  Serial.print(F("Humidity: "));
  Serial.print(h);
  Serial.print(F("%  Temperature: "));
  Serial.print(t);
  Serial.print(F("°C "));
  Serial.println();
  
  delay(2000);
}
