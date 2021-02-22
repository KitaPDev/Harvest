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

float getTemperatureSolution() {
  dallasTemp.requestTemperatures();
  float solnTemp = dallasTemp.getTempCByIndex(0);

  Serial.print("Temperature = ");
  Serial.print(solnTemp);
  Serial.println(" Celsius");

  return solnTemp;
}

float getTDS() {
  gravityTds.setTemperature(getTemperatureSolution());
  gravityTds.update();
  float tds = gravityTds.getTdsValue();
  
  Serial.print("TDS = ");
  Serial.print(tds);
  Serial.println(" ppm");

  return tds;
}

float getPH() {
  int measurements = 0;
  int maxSample = 10;
  float adcResolution = 4096.0;
  
  
  for (int i = 0; i < maxSample; i++) {
    measurements += analogRead(PIN_PH);
    delay(10);
  }
  
  float voltage = 5 / adcResolution * measurements/maxSample;
  float pH = 7 + ((2.5 - voltage) / 0.18);
  Serial.print("pH = ");
  Serial.println(pH);
}

float getTemperatureRoot(int level) {
  float temperature = 0;
  
  switch(level) {
    case 1:
      {
        DHT dht(PIN_DHT22_1, DHT22);
        dht.begin();
        temperature = dht.readTemperature(); 
      }
      break;
    case 2:
      {
        DHT dht(PIN_DHT22_2, DHT22);
        dht.begin();
        temperature = dht.readTemperature();
      }
      break;
  }

  Serial.print("Root Temperature = ");
  Serial.print(temperature);
  Serial.println(" Celsius");
  
  return temperature;
}

float getHumidityRoot(int level) {
  float humidity = 0;
  
  switch(level) {
    case 1:
      {
        DHT dht(PIN_DHT22_1, DHT22);
        dht.begin();
        humidity = dht.readHumidity();
      }
      break;
    case 2:
      {
        DHT dht(PIN_DHT22_2, DHT22);
        dht.begin();
        humidity = dht.readHumidity();
      }
      break;
  }

  Serial.print("Root Humidity = ");
  Serial.print(humidity);
  Serial.println(" %");

  return humidity;
}

float getRoomTemperature() {
  DHT dht(PIN_DHT11, DHT11);
  dht.begin();
  float temperature = dht.readTemperature();

  Serial.print("Room Temperature = ");
  Serial.print(temperature);
  Serial.println(" Celsius");
  
  return temperature;
}

float getRoomHumidity() {
  DHT dht(PIN_DHT11, DHT11);
  dht.begin();
  float humidity = dht.readHumidity();

  Serial.print("Room Humidity = ");
  Serial.print(humidity);
  Serial.println(" %");
  
  return humidity;
}
