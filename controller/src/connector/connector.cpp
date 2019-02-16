#include "connector.h"

Connector::Connector(void (*turnOnCallback)()) {
    printer = new Printer();
    this->turnOnHandler = turnOnCallback;
    WiFi.begin(GARDEN_SSID, GARDEN_PASSWORD);
    while (WiFi.status() != WL_CONNECTED) {
        delay(1000);
        printer->print("Attempting to connect to ");
        printer->println(GARDEN_SSID);
    }
}

Connector::~Connector() {
    delete printer;
}

void Connector::checkMessages() {
    if (WiFi.status() == WL_CONNECTED) {
        while(1) {
            HTTPClient http;
            http.begin("http://" + HOST + ":" + PORT + ENDPOINT_MESSAGES);
            int httpCode = http.GET();
            if (httpCode == 200) {
                String payload = http.getString();
                printer->print("Received Payload ");
                printer->println(payload);
                if (payload.equals(COMMAND_TURN_ON)) {
                    turnOnHandler();
                } else if (payload.equals(COMMAND_SEND_LOGS)) {
                    this->flushLog();
                } else {
                    break;
                }
            }
            http.end();
        }
    }
}

void Connector::flushLog() {
    if (WiFi.status() == WL_CONNECTED) {
        HTTPClient http;
        http.begin("http://" + HOST + ":" + PORT + ENDPOINT_LOGS);
        http.POST(printer->popLog());
        http.end();
    }
}
