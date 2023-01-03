#include <EEPROM.h>
#include <WiFiUdp.h>
#include <WiFi.h>

char serverUrl[] = "us-central1-system-collab-garbage.cloudfunctions.net";
int lastTime = 0;
int timeDelay = 15000;
int optimalMoisture = 0.5;
WiFiSSLClient wifi;

void setup()
{
    Serial.begin(9600);
    Serial.println("Connecting to WiFi…");
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
    while (status != WL_CONNECTED)
    {
        // I've redacted my WiFi password.
        status = WiFi.begin(_ssid, _pass);
        delay(300);
        // If this doesn't print the number 3, that means something went wrong while connecting.
        // Make sure you spelled your WiFi network name right!
        Serial.println(WiFi.status());
    }
}

void loop()
{
    if ((millis() - lastTime) > timeDelay)
    {
      Serial.println("test");
        if (WiFi.status() == WL_CONNECTED)
        {
            // Sends test data, modify this so that the values for powerOutput and totalPower are dynamic.
            // Hint: Use string concatenation.
            String content = "{ \"arduinoID\": \"";
            content += readStringFromEEPROM(97);
            content += "\", \"moisture\": 0.5, \"hasWatered\": true }";
            if (wifi.connect(serverUrl, 443))
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
                    Serial.print(line);
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