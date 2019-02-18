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
    this->registerBoard();
}

Connector::~Connector() {
    delete printer;
    this->deregisterBoard();
}

void Connector::checkMessages() {
    if (WiFi.status() == WL_CONNECTED) {
        registerBoard();
        while (true) {
            String endpoint = getEndpointURL(ENDPOINT_MESSAGES + "/" + BOARD_ID);
            HTTPClient *http = getRequestClient(endpoint);
            http->GET();
//            if (httpCode == 200) {
            String payload = http->getString();
            printer->print("Received Payload ");
            printer->println(payload);
            if (payload.equals(COMMAND_TURN_ON)) {
                turnOnHandler();
            } else if (payload.equals(COMMAND_SEND_LOGS)) {
                this->flushLog();
            } else {
                break;
            }
//            }
            http->end();
            delete http;
        }
    }
}

void Connector::flushLog() {
    registerBoard();
    String endpoint = getEndpointURL(ENDPOINT_LOGS + "/" + BOARD_ID);
    HTTPClient *http = getRequestClient(endpoint);
    http->POST(printer->popLog());
    http->end();
    delete http;
}

void Connector::registerBoard() {
    if (!registered) {
        String endpoint = getEndpointURL(ENDPOINT_REGISTER);
        HTTPClient *http = getRequestClient(endpoint);
        int httpCode = http->POST(BOARD_ID);
        if (httpCode == 200) {
            printer->print("Registered board ");
            printer->println(BOARD_ID);
            registered = true;
        } else {
            printer->print("Failed to register board ");
            printer->println(BOARD_ID);
            registered = false;
        }
        http->end();
        delete http;
    }
}

void Connector::deregisterBoard() {
    String url = getEndpointURL(ENDPOINT_DEREGISTER + "/" + BOARD_ID);
    HTTPClient *http = getRequestClient(url);
    http->POST("");
    http->end();
    delete http;
}

String Connector::getEndpointURL(String endpoint) {
    return "http://192.168.86.46:8432" + endpoint + "/";
}

HTTPClient *Connector::getRequestClient(String &endpoint) {
    auto *http = new HTTPClient();
    http->begin(endpoint);
    http->addHeader("content-type", "text/plain");
    return http;
}
