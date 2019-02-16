#include "printer.h"

Printer::Printer() {
    Serial.begin(115200);
    logs = "";
}

void Printer::print(String content) {
    Serial.print(content);
    logs += content;
}

void Printer::println(String content) {
    Serial.println(content);
    logs += content + '\n';
}

String Printer::popLog() {
    String cpy = String(logs);
    logs = "";
    return cpy;
}
