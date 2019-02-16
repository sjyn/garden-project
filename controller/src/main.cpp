#include "Arduino.h"
#include "./connector/connector.h"


const int outputPin = D13;
const int sleepTime = 10e6; // 10 seconds
const int delayTime = 5000; // 5 seconds
Connector *connector;

void handleOnRequest() {
    digitalWrite(outputPin, HIGH);
    delay(delayTime);
    digitalWrite(outputPin, LOW);
}

void setup() {
    pinMode(outputPin, OUTPUT);
    connector = new Connector(handleOnRequest);
}

void loop() {
    connector->checkMessages();
    ESP.deepSleep(sleepTime);
}
