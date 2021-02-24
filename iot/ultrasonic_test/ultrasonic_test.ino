#define PIN_US_TRIG 33
#define PIN_US_ECHO 13

long duration;
int distance;

void setup() {
  pinMode(PIN_US_TRIG, OUTPUT);
  pinMode(PIN_US_ECHO, INPUT);
  Serial.begin(115200);
}

void loop() {
  digitalWrite(PIN_US_TRIG, LOW);
  delayMicroseconds(2);

  digitalWrite(PIN_US_TRIG, HIGH);
  delayMicroseconds(10);
  digitalWrite(PIN_US_TRIG, LOW);

  duration = pulseIn(PIN_US_ECHO, HIGH);
  distance= duration*0.034/2;

  Serial.print("Distance: ");
  Serial.println(distance);
}
