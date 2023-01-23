#include <EEPROM.h>
#include <SPI.h>
#include <WiFiNINA.h>

char serverUrl[] = "us-central1-system-collab-garbage.cloudfunctions.net";
int lastTime = 0;
int timeDelay = 15000;
int optimalMoisture = 0.5;
WiFiSSLClient wifi;
constexpr int pwm = 2 ;  //initializing pin 2 as pwm
constexpr int in_1 = 8 ;
constexpr int in_2 = 9 ;
constexpr bool connectAllow = false;
String uuid = "";
bool isOn = false;

void setup()
{
  Serial.begin(9600);
  Serial.println("Connecting to WiFi…");
  pinMode(pwm, OUTPUT) ;   //we have to set PWM pin as output
  pinMode(in_1, OUTPUT) ; //Logic pins are also set as output
  pinMode(in_2, OUTPUT) ;
  int status = WL_IDLE_STATUS;
  String ssid = readStringFromEEPROM(0);
  String password = readStringFromEEPROM(33);
  // Scuffed.
  int ssid_len = ssid.length() + 1;
  char _ssid[ssid_len];
  ssid.toCharArray(_ssid, ssid_len);
  int pass_len = password.length() + 1;
  char _pass[pass_len];
  password.toCharArray(_pass, pass_len);
  uuid = readStringFromEEPROM(97);
  while (status != WL_CONNECTED && connectAllow)
  {
    // I've redacted my WiFi password.
    status = WiFi.begin(_ssid, _pass);
    delay(300);
    // If this doesn't print the number 3, that means something went wrong while connecting.
    // Make sure you spelled your WiFi network name right!
    Serial.println(WiFi.status());
  }
}

int getMoisture() {
  return map(analogRead(A0), 600, 10, 0, 100);
}

void loop()
{
  Serial.println(getMoisture());
  if ((millis() - lastTime) > timeDelay)
  {
    if (isOn) {
      digitalWrite(in_1,LOW) ;
      digitalWrite(in_2,LOW) ;
      analogWrite(pwm,0) ;
    } else {
      digitalWrite(in_1, HIGH) ;
      digitalWrite(in_2, LOW) ;
      analogWrite(pwm, 255) ;
    }
    if (WiFi.status() == WL_CONNECTED && connectAllow)
    {
      // Sends test data, modify this so that the values for powerOutput and totalPower are dynamic.
      // Hint: Use string concatenation.
      String content = "{ \"arduinoID\": \"";
      content += uuid;
      content += "\", \"moisture\": 0.5, \"hasWatered\": true }";
      if (wifi.connectSSL(serverUrl, 443))
      {
        Serial.println("Connected to server...");
        wifi.println("POST /status HTTP/1.1");
        wifi.print("Host: ");
        wifi.println(serverUrl);
        wifi.println("Content-Type: application/json");
        wifi.print("Content-Length: ");
        wifi.println(content.length());
        wifi.println();
        wifi.println(content);
        Serial.println("Done!");
        while (wifi.available())
        {
          String line = wifi.readStringUntil('\r');
          Serial.println(line);
        }
      }
      lastTime += timeDelay;
    }
  }
}

String readStringFromEEPROM(int addrOffset)
{
  int newStrLen = EEPROM.read(addrOffset);
  char data[newStrLen + 1];
  for (int i = 0; i < newStrLen; i++)
  {
    if (EEPROM.read(addrOffset + 1 + i) == 255)
      return "";
    data[i] = EEPROM.read(addrOffset + 1 + i);
  }
  data[newStrLen] = '\0';
  return String(data);
}
