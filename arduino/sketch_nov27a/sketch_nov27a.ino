#include <ArduinoBLE.h>
#include <EEPROM.h>

// Naming conventions stupid.
// I camelcase where want.
// code is garbage.
BLEService InternetService("bb6e107f-a364-45cc-90ad-b02df8261caf");
BLEStringCharacteristic WiFiUsername("fe6a4a69-1125-4eb3-ba33-08249ef05bbd", BLEWrite, 32);
BLEStringCharacteristic WiFiPassword("c347d530-854b-42a9-a5be-7bcd8c5bd432", BLEWrite, 64);
BLEStringCharacteristic UUIDConnect("9ee24231-0201-4fa1-96b1-d05690f65a84", BLEWrite, 64);
String ssid = "";
String password = "";
String firebaseUUID = "";
int state = 0;
int maxWrite = 10;

void setup()
{
  Serial.begin(9600);
  while (!Serial)
    ;
  if (!BLE.begin())
  {
    while (1)
      ;
  }
  ssid = readStringFromEEPROM(0);
  password = readStringFromEEPROM(33);
  Serial.println(ssid);
  Serial.println(password);
  if (ssid == "")
  {
    Serial.println("start over");
    initBLE();
  }
}

void resetEEPROM()
{
  for (int i = 0; i < 97; i++)
  {
    EEPROM.write(i, 0xFF);
  }
}

void initBLE()
{
  BLE.setDeviceName("system-plant-waterer-ilya");
  InternetService.addCharacteristic(WiFiUsername);
  InternetService.addCharacteristic(WiFiPassword);
  BLE.addService(InternetService);
  WiFiUsername.writeValue(ssid);
  WiFiPassword.writeValue(password);
  BLE.setAdvertisedService(InternetService);
  BLE.advertise();
  Serial.println(ssid);
  Serial.println(password);
}

void loop()
{
  BLEDevice central = BLE.central();

  if (central)
  {
    while (central.connected())
    {
      if (WiFiUsername.written())
      {
        ssid = WiFiUsername.value();
        Serial.println(ssid);
        writeStringToEEPROM(0, ssid);
      }
      if (WiFiPassword.written())
      {
        password = WiFiPassword.value();
        Serial.println(password);
        writeStringToEEPROM(33, password);
      }
    }
  }
}

void writeStringToEEPROM(int addrOffset, const String &strToWrite)
{
  if (maxWrite < 0)
    return;
  maxWrite--;
  byte len = strToWrite.length();
  EEPROM.write(addrOffset, len);
  for (int i = 0; i < len; i++)
  {
    EEPROM.write(addrOffset + 1 + i, strToWrite[i]);
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
