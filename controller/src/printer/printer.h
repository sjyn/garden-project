#ifndef CONTROLLER_PRINTER_H
#define CONTROLLER_PRINTER_H

#include "Arduino.h"

class Printer {
private:
    String logs;
public:
    Printer();
    void print(String content);
    void println(String content);
    String popLog();
};

#endif //CONTROLLER_PRINTER_H
