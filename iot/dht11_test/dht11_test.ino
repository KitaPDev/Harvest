#include <DHT.h>

#define PIN_DHT11 26
#define DHTTYPE DHT11

DHT dht(PIN_DHT11, DHTTYPE);

void setup() {
  Serial.begin(115200);
  Serial.println("DHT Test");
  dht.begin();
}

void loop() {
  float h = dht.readHumidity();
  float t = dht.readTemperature();

  if (isnan(h) || isnan(t)) {
    Serial.println(F("Failed to read from DHT sensor!"));
    return;
  }

  Serial.print(F("Humidity: "));
  Serial.println(h);
  Serial.print(F("%  Temperature: "));
  Serial.println(t);
  Serial.println(F("°C "));
  
  delay(2000);
}
