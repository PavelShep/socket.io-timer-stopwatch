from flask import Flask, render_template
from flask_socketio import SocketIO, emit
import time
import sys
import logging
import os

app = Flask(__name__)
socketio = SocketIO(app)

# Create 'log' directory if it does not exist
if not os.path.exists('log'):
    os.makedirs('log')

# Configure logging with overwrite mode for 'server_logs.log' in the 'log' folder (python)
logging.basicConfig(filename='log/server_logs.log', level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s', filemode='w')
# Redirect stdout and stderr to files inside the 'log' folder (bash)
sys.stdout = open('log/bash_log.log', 'w')
sys.stderr = sys.stdout

logger = logging.getLogger(__name__)

# Global variables
timer_running = False
stopwatch_running = False
timer_time = 0  # time in seconds for timer
stopwatch_time = 0  # time in seconds for stopwatch

# Function to format time (hours:minutes:seconds)
def format_time(seconds):
    hours = seconds // 3600
    minutes = (seconds % 3600) // 60
    seconds = seconds % 60
    return f"{hours:02}:{minutes:02}:{seconds:02}"

# Main page
@app.route('/')
def index():
    return render_template('index.html')

# Start timer
@socketio.on('start_timer')
def start_timer(data=None):
    global timer_time, timer_running

    # Check if the timer is already running (it can't be started more than once)
    if timer_running:
        return

    # Start from OR Resume timer functional 
    if data:
        timer_time = data['hours'] * 3600 + data['minutes'] * 60 + data['seconds']
    
    emit('update_timer', {'time': format_time(timer_time)}, broadcast=True)
    timer_running = True
    while timer_running and timer_time > 0:
        time.sleep(1)
        if timer_running:
            timer_time -= 1
            #logger.debug("-1s timer")
        emit('update_timer', {'time': format_time(timer_time)}, broadcast=True)
    if timer_time == 0 and timer_running:
        emit('timer_done', {'message': 'Timer finished!'}, broadcast=True)
        timer_running = False

# Stop timer
@socketio.on('stop_timer')
def stop_timer():
    global timer_running
    timer_running = False
    #logger.debug("Stop timer")

# Reset timer
@socketio.on('reset_timer')
def reset_timer():
    global timer_time, timer_running
    timer_time = 0
    timer_running = False
    #logger.debug("Reset timer")
    emit('update_timer', {'time': format_time(timer_time)}, broadcast=True)

# Start stopwatch
@socketio.on('start_stopwatch')
def start_stopwatch():
    global stopwatch_time, stopwatch_running

    # Check if the stopwatch is already running (it can't be started more than once)
    if stopwatch_running:
        return  

    stopwatch_running = True

    while stopwatch_running:
        time.sleep(1)
        if stopwatch_running:
            stopwatch_time += 1
            #logger.debug("+1s stopwatch")
        emit('update_stopwatch', {'time': format_time(stopwatch_time)}, broadcast=True)

# Stop stopwatch
@socketio.on('stop_stopwatch')
def stop_stopwatch():
    global stopwatch_running, stopwatch_time
    stopwatch_running = False
    #logger.debug("Stop stopwatch")

# Reset stopwatch
@socketio.on('reset_stopwatch')
def reset_stopwatch():
    global stopwatch_time, stopwatch_running
    stopwatch_running = False
    #logger.debug("Reset stopwatch")
    stopwatch_time = 0
    emit('update_stopwatch', {'time': format_time(stopwatch_time)}, broadcast=True)

# Handler for closing the modal window
@socketio.on('close_modal')
def handle_close_modal():
    # Broadcast event to close the modal window for all clients
    emit('close_modal', broadcast=True)

# Run the application
if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000, allow_unsafe_werkzeug=True)
