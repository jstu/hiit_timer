document.addEventListener('DOMContentLoaded', () => {
    const titleLabel = document.getElementById('round-notification');
    const roundsLabel = document.getElementById('round-indicator');
    const startButton = document.getElementById('start-btn');
    const activeTimeInput = document.getElementById('active-time');
    const restTimeInput = document.getElementById('rest-time');
    const timerMinutes = document.getElementById('timer-minutes');
    const timerSeconds = document.getElementById('timer-seconds');
    const endSound1 = document.getElementById('end-sound1');
    const endSound2 = document.getElementById('end-sound2');
    const endSound3 = document.getElementById('end-sound3');
    const anticipationSound = document.getElementById('anticipation-sound');
    const halfwaySound = document.getElementById('halfwaySound');
    const thirtySecondSound = document.getElementById('thirtySecondSound');
    const thirtySecondCheckbox = document.getElementById('thirtySecondCheckbox');

    let activeSecondsTotal, restSecondsTotal;
    let currentTimer; // Holds the current timer (active/rest)
    let countdown; // The countdown interval
    var colorGreen = "rgb(41, 247, 65)";
    var colorOrange = "rgb(247, 178, 41)";
    
    // Additional element references
    const resetButton = document.getElementById('reset-btn');
    const cyclesInput = document.getElementById('cycles');
    const progressBar = document.getElementById('progress-bar');
    
    let currentCycle = 0;
    let totalCycles;

    resetButton.addEventListener('click', resetTimer);

    function startTimer(duration, type) {
        console.log("starting timer");
        let time = duration;
        currentTimer = type;
        setTitle(type === 'active' ? "Go!" : "Rest");
        setRounds(type);

        countdown = setInterval(() => {
            const timeFraction = (time / duration) * 100;
            updateProgressBar(timeFraction);
            updateTimerText(time);

            // Play halfway sound
            if (time === Math.floor(activeSecondsTotal / 2)) {
                halfwaySound.play();
            }

            // Play 30-second mark sound if checkbox is checked
            if (type === 'active' && time === 30 && thirtySecondCheckbox.checked) {
                thirtySecondSound.play();
            }

            if (time <= 3 && time > 0) {
                anticipationSound.play();
                let anticipationTitle = currentTimer === 'active' ? "Almost there!" : "Prepare for round " + (1 + getCurrentRound()) + "!";
                setTitle(anticipationTitle)
            }
            if (time <= 0) {
                clearInterval(countdown);
                getEndSound().play();
                if (currentTimer === 'prepare') {
                    startTimer(activeSecondsTotal, 'active');
                } else if (currentTimer === 'active') {
                    startTimer(restSecondsTotal, 'rest');
                } else if (getCurrentRound() < totalCycles) {
                    currentCycle++;
                    startTimer(activeSecondsTotal, 'active');
                } else {
                    resetTimer(); // Automatically reset when all cycles are complete
                }
            }
            time--;
        }, 1000);
    }

    function getCurrentRound() {
        return (currentCycle + 1);
    }   

    function getEndSound() {
        let round = getCurrentRound();
        if(round % 3 === 0)
            return endSound3;
        if(round % 2 === 0)
            return endSound2;
        else
            return endSound1;
    }

    function setRounds(type) {
        roundsLabel.textContent = type === 'active' ? "Round " + getCurrentRound() : "Prepare";
    }

    function setTitle(title) {
        titleLabel.textContent = title;
    }

    function resetTimer() {
        clearInterval(countdown);
        currentCycle = 0;
        startButton.textContent = 'Start';
        updateProgressBar(0);
    }

    function updateProgressBar(fraction) {
        progressBar.style.width = fraction + '%';
        console.log("currentTimer: " + currentTimer);
        if (currentTimer === 'active') {
            progressBar.style.backgroundColor = colorGreen
        } else {
            progressBar.style.backgroundColor = colorOrange
        }
    }

    function updateTimerText(time) {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;

        timerMinutes.textContent = minutes.toString().padStart(2, '0');
        timerSeconds.textContent = seconds.toString().padStart(2, '0');
    }

    function parseInputTimes() {
        // Include input validation here
        totalCycles = parseInt(cyclesInput.value);
        const [activeMin, activeSec] = activeTimeInput.value.split(':').map(num => parseInt(num));
        const [restMin, restSec] = restTimeInput.value.split(':').map(num => parseInt(num));
        activeSecondsTotal = activeMin * 60 + activeSec;
        restSecondsTotal = restMin * 60 + restSec;
    }

    startButton.addEventListener('click', () => {
        if (startButton.textContent === 'Start') {
            startButton.textContent = 'Pause';
            parseInputTimes();
            startTimer(10, 'prepare');
        } else {
            pauseTimer();
        }
    });

   
    function pauseTimer() {
        clearInterval(countdown);
        startButton.textContent = 'Start';
    }
});
