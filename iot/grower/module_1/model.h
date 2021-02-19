#ifndef MODEL_H

struct structLogSensorModuleLevel {
  time_t loggedAt;
  int moduleID;
  int level;
  float tempearture;
  float humidity;
  float lux;
};

struct structLogSensorReservoir {
  time_t loggedAt;
  int reservoirID;
  float tds;
  float ph;
  float solnTemp;
  float solnLevel;
};

struct structLogSensorRoom {
  time_t loggedAt;
  int roomID;
  float temperature;
  float humidity;
};

#endif  /* MODEL_H */
