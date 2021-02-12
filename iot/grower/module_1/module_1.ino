#include "pins.h"

#include <OneWire.h>
#include <DallasTemperature.h>
#include <EEPROM.h>
#include "GravityTDS.h"

OneWire oneWire(PIN_SOLNTEMP);
DallasTemperature dallasTemp(&oneWire);
GravityTDS gravityTds;
 
int isAuto;

void setup() {
  Serial.begin(115200); 
  Serial.println("Module 1");

  initSensors();
  initHardware();
}

void loop() {
  
  
  if(isAuto) {
    
  } else {
    
  }
}
