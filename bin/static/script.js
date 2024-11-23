const socket = io();

let btnStartClick = 0;

// Timer Functions
function startTimer() {
    
    const hours = parseInt(document.getElementById('hours').value);
    const minutes = parseInt(document.getElementById('minutes').value);
    const seconds = parseInt(document.getElementById('seconds').value);

    if (hours === 0 && minutes === 0 && seconds === 0) {
        showModal('Czas nie może wynosić 0');
        return; 
    }

    // Start from OR Resume timer functional  
    if (btnStartClick == 0) {        
        btnStartClick++;
        socket.emit('start_timer', { hours, minutes, seconds });
    } else {
        socket.emit('start_timer', {});
    }
   
}

function stopTimer() {
    socket.emit('stop_timer');
}

function resetTimer() {
    btnStartClick = 0;
    socket.emit('reset_timer');
}

// Listen for timer updates from server
socket.on('update_timer', function(data) {
    document.getElementById('timerDisplay').innerText = data.time;
});

// Listen for when the timer finishes
socket.on('timer_done', function(data) {
    showModal(data.message);
});

// Stopwatch Functions
function startStopwatch() {
    socket.emit('start_stopwatch');
}

function stopStopwatch() {
    socket.emit('stop_stopwatch');
}

function resetStopwatch() {
    socket.emit('reset_stopwatch');
}

// Listen for stopwatch updates from server
socket.on('update_stopwatch', function(data) {
    document.getElementById('stopwatchDisplay').innerText = data.time;
});

// Function to close the modal
function closeModal() {
    socket.emit('close_modal');  // Notify server that the modal is closing
}

// Listen for the 'close_modal' event from the server to close the modal
socket.on('close_modal', function() {
    const modal = document.getElementById("myModal");
    modal.style.display = "none";  // Close the modal
});

// Close the modal when clicking the "X" (close) button
const span = document.getElementsByClassName("close")[0];
span.onclick = function() {
    closeModal();  // Close the modal on both server and all clients
}

// Close the modal when clicking outside of it
window.onclick = function(event) {
    const modal = document.getElementById("myModal");
    if (event.target == modal) {
        closeModal();  // Close the modal on both server and all clients
    }
}

// Function to display the modal with a custom message
function showModal(message) {
    document.getElementById("modalMessage").innerText = message;
    const modal = document.getElementById("myModal");
    modal.style.display = "block";  // Show the modal
}
