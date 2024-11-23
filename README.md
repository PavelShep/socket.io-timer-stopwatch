# Timer and Stopwatch with Flask and Socket.IO

This project provides a timer and stopwatch application that can be controlled remotely through a web interface on both mobile and desktop devices. It uses Flask for the backend, Socket.IO for real-time communication, and basic HTML/CSS/JavaScript for the frontend.

## Requirements

- Python 3.10.8
- `Flask`
- `Flask-SocketIO`
- Git Bash
- A modern web browser (e.g., Chrome, Firefox, Safari)
- Internet connection (for Socket.IO to work)

## Installation

Follow these steps to set up and run the project on your local machine:

### 1. Clone the repository or download the project files

If you're cloning from a Git repository, run:

```bash
git clone https://github.com/PavelShep/socket.io-timer-stopwatch
cd socket.io-timer-stopwatch
```

### 2. Install the required Python dependencies

```bash
pip install flask flask-socketio
```

### 3. Start the server

```bash
./start.sh
```

OR 

```bash
python server.py
```

This will start the Flask application, and the server should now be available at http://localhost:5000 on your laptop

### 4 Access the application from other devices

Access the application from other devices
If you're using your phone or any other device connected to the same Wi-Fi network:

- Find the local IP address of your laptop by running ipconfig (on Windows) or ifconfig (on Mac/Linux) in your terminal.
- Use the IP address of the laptop with port 5000, for example: http://192.168.x.x:5000
