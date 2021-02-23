#include "pins.h"

#include <OneWire.h>
#include <DallasTemperature.h>
#include <EEPROM.h>
#include "DHT.h"

void initSensors() {
  dallasTemp.begin();
}

float getTemperatureNutrient() {
  dallasTemp.requestTemperatures();
  float solnTemp = dallasTemp.getTempCByIndex(0);

  Serial.print("Nutrient Temperature = ");
  Serial.print(solnTemp);
  Serial.println(" Celsius");

  return solnTemp;
}

float getTDSNutrient() {  
  for(int i = 0; i < sampleCount; i++) {
    analogBufferTemp[i] = analogBuffer[i];
  }
  
  averageVoltage = getMedianNum(analogBufferTemp, sampleCount) * (float)voltageRef / 1024.0; // read the analog value more stable by the median filtering algorithm, and convert to voltage value
  float compensationCoefficient = 1.0 + 0.02 * (getTemperatureNutrient() - 25.0);    //temperature compensation formula: fFinalResult(25^C) = fFinalResult(current)/(1.0+0.02*(fTP-25.0));
  float compensationVoltage = averageVoltage/compensationCoefficient;  //temperature compensation
  tdsValue = (133.42 * compensationVoltage * compensationVoltage * compensationVoltage 
    - 255.86 * compensationVoltage * compensationVoltage + 857.39 * compensationVoltage) * 0.5; //convert voltage value to tds value
  
  //Serial.print("voltage:");
  //Serial.print(averageVoltage,2);
  //Serial.print("V   ");
  
  Serial.print("Nutrient TDS: ");
  Serial.print(tdsValue,0);
  Serial.println(" ppm");
  
  return tdsValue;
}

float getPHNutrient() {
  int sensorValue = 0; 
  unsigned long int avgValue; 
  float b;
  int buf[10], temp;
  float calibration = 0;
  
  
  for(int i = 0; i < 10; i++) { 
    buf[i] = analogRead(PIN_PH);
    delay(10);
  }
  
  for(int i=0;i<9;i++) {
    
    for(int j=i+1;j<10;j++) {
      
      if(buf[i]>buf[j]) {
        temp=buf[i];
        buf[i]=buf[j];
        buf[j]=temp;
      }
    }
  }
  
  avgValue = 0;
  for(int i = 2; i < 8; i++) {
    avgValue += buf[i];
  }
  
  float pHVolt = (float) avgValue * 3.3 / 1024 / 6;
  float phValue = -5.70 * pHVolt + calibration;

  Serial.print("Nutrient pH: ");
  Serial.print(phValue);
  Serial.println();

  return phValue;
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

int getMedianNum(int bArray[], int iFilterLen) {
  int bTab[iFilterLen];
  for (byte i = 0; i<iFilterLen; i++) {
    bTab[i] = bArray[i];
  }
  
  int i, j, bTemp;
  for (j = 0; j < iFilterLen - 1; j++) {
    
    for (i = 0; i < iFilterLen - j - 1; i++) {
      
      if (bTab[i] > bTab[i + 1]) {
        bTemp = bTab[i];
        bTab[i] = bTab[i + 1];
        bTab[i + 1] = bTemp;
      }
    }
  }
  if ((iFilterLen & 1) > 0) {
    bTemp = bTab[(iFilterLen - 1) / 2];
    
  } else {
    bTemp = (bTab[iFilterLen / 2] + bTab[iFilterLen / 2 - 1]) / 2;
  }
  
  return bTemp;
}
