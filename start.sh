#!/bin/bash

cd bin

# Start the Python server and capture its PID
python server.py &
SERVER_PID=$!

# We pause to give the server time to start up
sleep 1 

# Checking if the process is running
if ! ps -p $SERVER_PID > /dev/null; then
  echo "Błąd: Nie udało się uruchomić serwera. Sprawdź błędy w kodzie server.py."
  read -p "Naciśnij Enter, aby zakończyć działanie skryptu..."
  printf "\n"
  exit 1
fi

# Extract the IPv4 address from the block
IP_ADDRESS=$(ipconfig | awk '/Wireless LAN adapter Wi-Fi:/ {n=5} n > 0 {print; n--}' | grep -E "IPv4 Address" | awk -F: '{print $2}' | tr -d '\r\n ' | head -n 1)

# Check if the IP address was found
if [ -z "$IP_ADDRESS" ]; then
  echo "Błąd: Nie udało się wykryć adresu IP. Upewnij się, że jesteś połączony z siecią Wi-Fi."
  read -p "Naciśnij Enter, aby zakończyć działanie skryptu..."
  printf "\n"
  kill $SERVER_PID
  exit 1
fi

# Output instructions for opening the website on different devices
echo "Serwer uruchomiony."
printf "\n"
echo "W przeglądarce na laptopie wprowadź:"
echo "127.0.0.1:5000 lub localhost:5000 lub $IP_ADDRESS:5000"
echo "W przeglądarce na telefonie wprowadź:"
echo "$IP_ADDRESS:5000"
printf "\n"

# Terminate the server when the script exits (on terminal closure)
trap "kill $SERVER_PID" EXIT

# Pause to allow reading the instructions
read -p "Naciśnij Enter, aby zakończyć działanie skryptu..."
printf "\n"

kill $SERVER_PID
