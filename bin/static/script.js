const socket = io();

const msgModalZero = 'Czas nie może wynosić 0';
let btnStartClick = 0;
const alarmSound = document.getElementById("alarmSound");

// Timer Functions
function startTimer() {
    const hours = parseInt(document.getElementById('hours').value);
    const minutes = parseInt(document.getElementById('minutes').value);
    const seconds = parseInt(document.getElementById('seconds').value);

    // Check if the timer is set to 0
    if (hours === 0 && minutes === 0 && seconds === 0) {
        showModal(msgModalZero); // Show a modal if the timer value is zero
        return; 
    }

    // Start the timer or resume it
    if (btnStartClick == 0) {        
        btnStartClick++;
        socket.emit('start_timer', { hours, minutes, seconds }); // Emit event to start the timer
    } else {
        socket.emit('start_timer', {}); // Resume the timer
    }
}

function stopTimer() {
    socket.emit('stop_timer'); // Emit event to stop the timer
}

function resetTimer() {
    btnStartClick = 0;
    socket.emit('reset_timer'); // Emit event to reset the timer
}

// Listen for timer updates from the server
socket.on('update_timer', function(data) {
    document.getElementById('timerDisplay').innerText = data.time; // Update the timer display
});

// Listen for the timer completion event
socket.on('timer_done', function(data) {
    showModal(data.message); // Show a modal with a message when the timer finishes
});

// Stopwatch Functions
function startStopwatch() {
    socket.emit('start_stopwatch'); // Emit event to start the stopwatch
}

function stopStopwatch() {
    socket.emit('stop_stopwatch'); // Emit event to stop the stopwatch
}

function resetStopwatch() {
    socket.emit('reset_stopwatch'); // Emit event to reset the stopwatch
}

// Listen for stopwatch updates from the server
socket.on('update_stopwatch', function(data) {
    document.getElementById('stopwatchDisplay').innerText = data.time; // Update the stopwatch display
});

// Function to close the modal
function closeModal() {
    stopAlarm(); // Stop the alarm sound
    socket.emit('close_modal'); // Notify the server that the modal is closing
}

// Listen for the 'close_modal' event from the server to close the modal
socket.on('close_modal', function() {
    const modal = document.getElementById("myModal");
    modal.style.display = "none"; // Close the modal
    stopAlarm(); // Stop the alarm sound when the modal is closed
});

// Close the modal when clicking the "X" (close) button
const span = document.getElementsByClassName("close")[0];
span.onclick = function() {
    stopAlarm(); // Stop the alarm sound when the modal is closed
    closeModal(); // Close the modal on both the server and all clients
}

// Close the modal when clicking outside of it
window.onclick = function(event) {
    const modal = document.getElementById("myModal");
    if (event.target == modal) {
        closeModal(); // Close the modal on both the server and all clients
    }
}

// Function to display the modal with a custom message
function showModal(message) {
    document.getElementById("modalMessage").innerText = message;
    const modal = document.getElementById("myModal");
    modal.style.display = "block"; // Show the modal
    if (message != msgModalZero ) {
        playAlarm(); // Play the alarm sound
    } 
}

// Function to play the alarm sound
function playAlarm() {
    alarmSound.currentTime = 0; // Reset the sound to the beginning
    alarmSound.play();
}

// Function to stop the alarm sound
function stopAlarm() {
    alarmSound.pause(); // Pause the sound
    alarmSound.currentTime = 0; // Reset the sound to the beginning
}
