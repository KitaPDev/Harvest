#include <OneWire.h>
#include <DallasTemperature.h>

OneWire oneWire(4);
DallasTemperature dallasTemp(&oneWire);

void setup() {
  dallasTemp.begin();
  Serial.begin(115200);
}

void loop() {
  dallasTemp.requestTemperatures();
  float solnTemp = dallasTemp.getTempCByIndex(0);

  Serial.print("Nutrient Temperature = ");
  Serial.print(solnTemp);
  Serial.println(" Celsius");
}
