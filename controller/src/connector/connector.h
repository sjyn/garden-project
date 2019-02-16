#ifndef CONTROLLER_CONNECTOR_H
#define CONTROLLER_CONNECTOR_H

#include "Arduino.h"
#include <ESP8266WiFi.h>
#include <ESP8266WiFiMulti.h>
#include <ESP8266HTTPClient.h>
#include "../secrets.h"
#include "./commands.h"
#include "../printer/printer.h"

class Connector {
private:
    Printer *printer;
    void (*turnOnHandler)();
    const uint16 PORT = 8432;
    const String HOST = "192.168.86.46";
    const String ENDPOINT_LOGS = "/logs";
    const String ENDPOINT_MESSAGES = "/messages";
public:
    Connector(void (*turnOnCallback)());
    ~Connector();
    void checkMessages();
    void flushLog();
};


#endif //CONTROLLER_CONNECTOR_H
