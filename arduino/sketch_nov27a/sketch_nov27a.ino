#include <ArduinoBLE.h>
// Naming conventions stupid.
// I camelcase where want.
// code is garbage.
BLEService InternetService("bb6e107f-a364-45cc-90ad-b02df8261caf");
BLEStringCharacteristic WiFiUsername("fe6a4a69-1125-4eb3-ba33-08249ef05bbd", BLERead | BLEWrite, 32);
BLEStringCharacteristic WiFiPassword("c347d530-854b-42a9-a5be-7bcd8c5bd432", BLERead | BLEWrite, 64);
String initName = "";
String initPass = "";
void setup() {
  Serial.begin(9600);
  while (!Serial)
    ;
  if (!BLE.begin()) {
    Serial.println("starting Bluetooth® Low Energy module failed!");

    while (1)
      ;
  }

  BLE.setLocalName("system-plant-waterer-ilya");
  BLE.setDeviceName("system-plant-waterer-ilya");
  InternetService.addCharacteristic(WiFiUsername);
  InternetService.addCharacteristic(WiFiPassword);
  BLE.addService(InternetService);
  WiFiUsername.writeValue(initName);
  WiFiPassword.writeValue(initPass);
  BLE.setAdvertisedService(InternetService);
  BLE.advertise();
  Serial.println("test1");
}

void loop() {
  BLEDevice central = BLE.central();

  if ( central )
  {
    Serial.print( "Connected to central: " );
    Serial.println( central.address() );

    while ( central.connected() )
    {
      if ( WiFiUsername.written() )
      {
        initName = WiFiUsername.value();
        Serial.print( "New file name: " );
        Serial.println( initName );
      }
    }

    Serial.print( F( "Disconnected from central: " ) );
    Serial.println( central.address() );
  }
}
