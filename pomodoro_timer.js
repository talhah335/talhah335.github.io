let timer;
let minutes = 25;
let seconds = 0;
let pomodoroDuration = 25;
let shortBreak = 5;
let longBreak = 15;
let isPaused = false;
let enteredTime = null;

let autoSwitch = true;
let pomodoroCount = 0;
let currentMode = "Pomodoro";

const circle = document.querySelector('.progress-ring__circle');
const RADIUS = 110;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
circle.style.strokeDasharray = `${CIRCUMFERENCE} ${CIRCUMFERENCE}`;
circle.style.strokeDashoffset = 0;

function startTimer() {
    timer = setInterval(updateTimer, 1000);
}

function resetAndStart(duration) {
    enteredTime = duration;
    minutes = duration;
    seconds = 0;
    isPaused = false;
    clearInterval(timer);

    document.getElementById('timer').textContent = formatTime(minutes, seconds);
    document.getElementById('start-button').textContent = 'Pause';
    startTimer();
}

function setPomodoro() {
    currentMode = "Pomodoro";
    resetAndStart(pomodoroDuration);
}

function setShortBreak() {
    currentMode = "ShortBreak";
    resetAndStart(shortBreak);
}

function setLongBreak() {
    currentMode = "LongBreak";
    resetAndStart(longBreak);
}

function setProgress(percent) {
    const offset = CIRCUMFERENCE - (percent / 100) * CIRCUMFERENCE;
    circle.style.strokeDashoffset = offset;
}

function updateTimer() {
    const timerElement = document.getElementById('timer');
    timerElement.textContent = formatTime(minutes, seconds);

    const total = (enteredTime || pomodoroDuration) * 60;
    const remaining = minutes * 60 + seconds;
    const percent = (remaining / total) * 100;
    setProgress(percent);

    if (minutes === 0 && seconds === 0) {
        clearInterval(timer);
    
        var audio = document.getElementById('alarm-sound');
        audio.volume = 1.0;
        audio.play();
    
        if (currentMode === "Pomodoro" || currentMode === "Custom") {
            document.querySelector('.task-input').value = '';
        }
    
        if (autoSwitch) {
            if (currentMode === "Pomodoro") {
                pomodoroCount++;
                if (pomodoroCount % 4 === 0) {
                    setLongBreak();
                } else {
                    setShortBreak();
                }
            } else if (currentMode === "ShortBreak" || currentMode === "LongBreak") {
                setPomodoro();
            }
        } 

    } else if (!isPaused) {
        if (seconds > 0) {
            seconds--;
        } else {
            seconds = 59;
            minutes--;
        }
    }
}

function formatTime(minutes, seconds) {
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function togglePauseResume() {
    const pauseResumeButton = document.getElementById('start-button');

    if (!timer || pauseResumeButton.textContent === 'Start' || pauseResumeButton.textContent === 'Resume') {
        startTimer();
        isPaused = false;
        pauseResumeButton.textContent = 'Pause';
    } else {
        isPaused = true;
        clearInterval(timer);
        pauseResumeButton.textContent = 'Resume';
    }
}

function restartTimer() {
    clearInterval(timer);
    minutes = enteredTime || pomodoroDuration;
    seconds = 0;
    isPaused = false;

    document.getElementById('timer').textContent = formatTime(minutes, seconds);
    document.getElementById('start-button').textContent = 'Pause';
    startTimer();
}

function chooseTime() {
    const newTime = prompt('Enter an amount of time in minutes:');
    if (newTime === null) return;

    if (!isNaN(newTime) && newTime > 0) {
        enteredTime = parseInt(newTime);
        minutes = enteredTime;
        seconds = 0;
        isPaused = false;
        currentMode = "Custom";

        document.getElementById('timer').textContent = formatTime(minutes, seconds);
        clearInterval(timer);
        document.getElementById('start-button').textContent = 'Pause';
        startTimer();
    } else {
        alert('Please enter a valid number greater than 0.');
    }
}

function toggleAutoSwitch() {
    autoSwitch = document.getElementById('auto-switch').checked;
}
