void initHardware() {
  pinMode(PIN_LED_1, OUTPUT);
  pinMode(PIN_LED_2, OUTPUT);
  pinMode(PIN_FAN_1, OUTPUT);
  pinMode(PIN_FAN_2, OUTPUT);
  pinMode(PIN_SV_WATER, OUTPUT);
  pinMode(PIN_SV_RESERVOIR, OUTPUT);  
}

void updateHardware(int led1, int led2, int fan1, int fan2, int svWater, int svReservoir) {
  digitalWrite(PIN_LED_1, led1);
  digitalWrite(PIN_LED_2, led2);
  digitalWrite(PIN_FAN_1, fan1);
  digitalWrite(PIN_FAN_2, fan2);
  digitalWrite(PIN_SV_WATER, svWater);
  digitalWrite(PIN_SV_RESERVOIR, svReservoir);
}
