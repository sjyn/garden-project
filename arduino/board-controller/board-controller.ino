#include <ESP8266WiFi.h>
#include <ESP8266WiFiMulti.h>
#include <ESP8266HTTPClient.h>
#include "secrets.h"

const int TOGGLE_PIN = D2; 
const char* ssid = GARDEN_SSID;
const char* password = GARDEN_PASSWORD;

const String host = "192.168.86.34";
const uint16_t port = 8432;
int currentRead = LOW;

void setup () {
  pinMode(TOGGLE_PIN, OUTPUT);
  Serial.begin(115200);
  WiFi.begin(ssid, password);
 
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.print("Connecting..");
  }
}
 
void loop() {
  makeRequest();
//  toggleLED();
    
  /* Toggle the LED */
  digitalWrite(TOGGLE_PIN, currentRead);
//  ESP.deepSleep(5000);
}

void toggleLED() {
  if (currentRead == LOW) {
    Serial.println("Writing HIGH");
    currentRead = HIGH;
  } else {
    Serial.println("Writing LOW");
    currentRead = LOW;
  }
}

void makeRequest() {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin("http://" + host + ":" + port + "/requests");
    int httpCode = http.GET();
    if (httpCode > 0) {
      String payload = http.getString();
      Serial.println(payload);
      if (payload.equals("on")) {
        currentRead = HIGH;
      } else {
        currentRead = LOW;
      }
      delay(5000);
    }
    http.end(); 
  }
}
