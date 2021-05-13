void initHardware() {
  pinMode(PIN_LED_1, OUTPUT);
  pinMode(PIN_LED_2, OUTPUT);
  pinMode(PIN_FAN_1, OUTPUT);
  pinMode(PIN_FAN_2, OUTPUT);
  pinMode(PIN_SV_WATER, OUTPUT);
  pinMode(PIN_SV_RESERVOIR, OUTPUT);
  pinMode(PIN_SV_1, OUTPUT);
  pinMode(PIN_SV_2, OUTPUT);
}

void updateHardware(int led1, int led2, int fan1, int fan2, int sv1, int sv2, int svWater, int svReservoir) {
  digitalWrite(PIN_LED_1, led1);
  digitalWrite(PIN_LED_2, led2);
  digitalWrite(PIN_FAN_1, fan1);
  digitalWrite(PIN_FAN_2, fan2);
  digitalWrite(PIN_SV_WATER, svWater);
  digitalWrite(PIN_SV_RESERVOIR, svReservoir);
  digitalWrite(PIN_SV_1, sv1);
  digitalWrite(PIN_SV_2, sv2);
}

void setLevelMist(int level, int state) {
  switch(level) {
    case 1:
      moduleSettings.sv1 = state;
      break;
    case 2:
      moduleSettings.sv2 = state;
      break;
  }
}

void useNutrientSolution() {
  digitalWrite(PIN_SV_RESERVOIR, 1);
  digitalWrite(PIN_SV_WATER, 0);
}

void useWater() {
  digitalWrite(PIN_SV_RESERVOIR, 0);
  digitalWrite(PIN_SV_WATER, 1);
}

void setLEDState(int state) {
  digitalWrite(PIN_LED_1, state);
  digitalWrite(PIN_LED_2, state);
}
