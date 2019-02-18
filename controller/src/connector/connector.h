#ifndef CONTROLLER_CONNECTOR_H
#define CONTROLLER_CONNECTOR_H

#include "Arduino.h"
#include <ESP8266WiFi.h>
#include <ESP8266WiFiMulti.h>
#include <ESP8266HTTPClient.h>
#include "../secrets.h"
#include "./commands.h"
#include "../printer/printer.h"
#include "./boards.h"

class Connector {
private:
    Printer *printer;
    bool registered;
    void (*turnOnHandler)();
    const String ENDPOINT_LOGS = "/arduino/logs";
    const String ENDPOINT_MESSAGES = "/arduino/messages";
    const String ENDPOINT_REGISTER = "/arduino/register";
    const String ENDPOINT_DEREGISTER = "/arduino/deregister";

    void registerBoard();
    void deregisterBoard();
    String getEndpointURL(String endpoint);
    HTTPClient* getRequestClient(String &endpoint);
public:
    explicit Connector(void (*turnOnCallback)());
    ~Connector();
    void checkMessages();
    void flushLog();
};

#endif //CONTROLLER_CONNECTOR_H
