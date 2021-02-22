const int analogInPin = 34; 
int sensorValue = 0; 
unsigned long int avgValue; 
float b;
int buf[10], temp;
float calibration = 0;

void setup() {
  Serial.begin(115200);
}
 
void loop() {
  for(int i=0;i<10;i++) { 
    buf[i]=analogRead(analogInPin);
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
  float phValue = -5.70 * pHVolt + (7.00 + 59.67 - 3);
  
  Serial.print("sensor = ");
  Serial.println(phValue);
  delay(1000);
  }
