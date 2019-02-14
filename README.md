# Garden Project

# Arduino Setup
I used fritzing for the circuit diagrams, and LinkNode D1 boards.
I installed ESP8266 support for the arduino IDE and am using the WeMosD1R1 board profile by adding in the
`http://arduino.esp8266.com/staging/package_esp8266com_index.json` in the arduino prefs and installing the
esp8266 boards in the board manager.

The code uses a `secrets.h` file for storing the network SSID and password.