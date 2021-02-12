#include "pins.h"

#include <OneWire.h>
#include <DallasTemperature.h>
#include <EEPROM.h>
#include "GravityTDS.h"
#include "DHT.h"

void initSensors() {
  gravityTds.setPin(PIN_TDS);
  gravityTds.setAref(3.3);
  gravityTds.setAdcRange(4096);
  
  dallasTemp.begin();
  gravityTds.begin();
}

float getSolutionTemperature() {
  dallasTemp.requestTemperatures();
  float solnTemp = dallasTemp.getTempCByIndex(0);

  Serial.print("Temperature = ");
  Serial.print(solnTemp);
  Serial.println(" Celsius");

  return solnTemp;
}

float getTDS() {
  gravityTds.setTemperature(getSolutionTemperature());
  gravityTds.update();
  float tds = gravityTds.getTdsValue();
  
  Serial.print("TDS = ");
  Serial.print(tds);
  Serial.println(" ppm");

  return tds;
}

float getPH() {
  int measurements = 0;
  int samples = 10;
  float adcResolution = 4096.0;
  
  for (int i = 0; i < maxSample; i++) {
    measurements += analogRead(PIN_PH);
    delay(10);
  }
  
  float voltage = 5 / adcResolution * measurements/maxSample;
  float pH = 7 + ((2.5 - voltage) / 0.18)
  Serial.print("pH = ");
  Serial.println(pH);
}

float getRootTemperature(int level) {
  float temperature = 0;
  
  switch(int) {
    case 1:
      DHT dht(PIN_DHT22_1, DHT22);
      dht.begin();
      temperature = dht.readTemperature();
      break;
    case 2:
      DHT dht(PIN_DHT22_2, DHT22);
      dht.begin();
      temperature = dht.readTemperature();
      break;
  }

  Serial.print("Temperature = ");
  Serial.print(temperature);
  Serial.println(" Celsius");
  
  return temperature;
}

float getRootHumidity(int level) {
  float humidity = 0;
  
  switch(int) {
    case 1:
      DHT dht(PIN_DHT22_1, DHT22);
      dht.begin();
      humidity = dht.readHumidity();
      break;
    case 2:
      DHT dht(PIN_DHT22_2, DHT22);
      dht.begin();
      humidity = dht.readHumidity();
      break;
  }

  Serial.print("Humidity = ");
  Serial.print(humidity);
  Serial.println(" %");

  return humidity;
}

float getRoomTemperature() {
  DHT dht(PIN_DHT11, DHT11);
  dht.begin();
  temperature = dht.readTemperature();

  Serial.print("Temperature = ");
  Serial.print(temperature);
  Serial.println(" Celsius");
  
  return temperature;
}

float getRoomHumidity() {
  DHT dht(PIN_DHT11, DHT11);
  dht.begin();
  humidity = dht.readHumidity();

  Serial.print("Humidity = ");
  Serial.print(humidity);
  Serial.println(" %");
  
  return humidity;
}
