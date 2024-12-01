const wheel = document.querySelector('.wheel');
const startButton = document.querySelector('.button');
const arrow = document.querySelector('.pin');
let spinAgainButton = document.getElementById('spin-btn');
let spinAgainSection = document.getElementById('spin-again-section');
let timerDisplay = document.getElementById('timer');
let successModal = document.getElementById('success-modal');
let contentSection = document.getElementById('game');
 // Assuming this is the main game content div

let cooldownTime = 24 * 60 * 60 * 1000; // 24 hours in milliseconds (for timer)
let lastSpinTime = localStorage.getItem('lastSpinTime');

let deg = 0;
let spinning = false; // Flag to prevent multiple spins
let startDeg = 0; // Store the initial rotation position

startButton.addEventListener('click', () => {
    if (spinning) {
        alert('You can only spin the wheel once');
        return;
    }

    spinning = true; // Set flag to true to prevent multiple spins
    startButton.style.pointerEvents = 'none'; // Disable the button after the first click

    // Store the initial position of the wheel before spin
    startDeg = parseInt(getComputedStyle(wheel).transform.split(',')[4]) || 0;

    // Apply a larger degree for the spin (e.g., 2880 degrees for a faster, dramatic spin)
    deg += 2880; // Increased to 2880 degrees for a faster spin
    wheel.style.transition = 'transform 10s cubic-bezier(0.25, 0.1, 0.25, 1)';  // Set duration to 10s
    wheel.style.transform = `rotate(${deg}deg)`; // Apply the spin

    wheel.classList.add('blur');
    playSound();
});

   

wheel.addEventListener('transitionend', () => {
    if (spinning) {
        // After the spin ends, apply the reset transition with a small delay to smooth the stop
        setTimeout(() => {
            wheel.style.transition = 'transform 3s ease-out';   // Reset the rotation to the start position
        }, 100); // Small delay to allow spin to finish before easing into starting position

        spinning = false; // Reset the spinning flag after transition completes
        stopSound();
        arrow.classList.add('bounce');
        update();
        draw();

        // Show the congratulations popup
        showCongratulationsModal();
    }
});

// Function to display the congratulations modal
function showCongratulationsModal() {
    const modal = document.getElementById('congratulations-modal');
    modal.style.display = 'flex'; // Make the modal visible
}

// Add functionality for the claim button
document.getElementById('claim-btn').addEventListener('click', () => {
    // Optionally, close the modal after claiming
    document.getElementById('congratulations-modal').style.display = 'none';
});


// Sound functions
let audio = new Audio('tick.mp3');

function playSound() {
    audio.currentTime = 0;
    audio.play();
    audio.loop = true;
}

function stopSound() {
    audio.pause();
}

// Confetti code (remains unchanged)
let canvas = document.getElementById('confetti');
canvas.width = 1320;

let ctx = canvas.getContext('2d');
let pieces = [];
let numberOfPieces = 100;
let lastUpdateTime = Date.now();

function randomColor() {
    let colors = ['#f00', '#0f0', '#00f', '#0ff', '#f0f', '#ff0'];
    return colors[Math.floor(Math.random() * colors.length)];
}

function update() {
    let now = Date.now(),
        dt = now - lastUpdateTime;

    for (let i = pieces.length - 1; i >= 0; i--) {
        let p = pieces[i];

        if (p.y > canvas.height) {
            pieces.splice(i, 1);
            continue;
        }

        p.y += p.gravity * dt;
        p.rotation += p.rotationSpeed * dt;
    }

    while (pieces.length < numberOfPieces) {
        pieces.push(new Piece(Math.random() * canvas.width, -20));
    }

    lastUpdateTime = now;

    setTimeout(update, 1);
}
// Function to show verification modal with timer and progress bar
function showVerificationModal() {
    const verificationModal = document.getElementById('verification-modal');
    const progressBar = document.getElementById('progress-bar');
    const timerSpan = document.getElementById('timer');
    
    let timeRemaining = 30; // 30 seconds countdown timer
    let progress = 0; // Initial progress value
    const interval = 1000; // Update every second

    // Show the verification modal
    verificationModal.style.display = 'flex';

    // Update progress bar and timer
    const verificationInterval = setInterval(() => {
        timeRemaining--;
        progress += 3.33; // Increase progress by 3.33% every second (100% / 30 seconds)

        // Update progress bar and timer text
        progressBar.value = progress;
        timerSpan.textContent = timeRemaining;

        // Once the timer reaches 0, stop the interval and show success
        if (timeRemaining <= 0) {
            clearInterval(verificationInterval);
            finishVerification();
        }
    }, interval);
}

// Function to finish verification and show success message
function finishVerification() {
    const verificationModal = document.getElementById('verification-modal');
    verificationModal.style.display = 'none'; // Hide the verification modal

    // Show success message (you could display another modal or alert)
    alert('Verification complete! Your 10 Rupees Google Play Voucher has been successfully claimed!');
    // Optionally, close the "Congratulations" modal after verification is complete
    document.getElementById('congratulations-modal').style.display = 'none';
}

// Add functionality for the claim button (triggering verification)
document.getElementById('claim-btn').addEventListener('click', () => {
    document.getElementById('congratulations-modal').style.display = 'none'; // Hide congratulations modal
    showVerificationModal(); // Show verification modal
});
// Function to finish verification and show success message
function finishVerification() {
    const verificationModal = document.getElementById('verification-modal');
    verificationModal.style.display = 'none'; // Hide the verification modal

    // Show success modal with voucher code
    showSuccessModal();
}

// Function to show the success modal with the voucher code
function showSuccessModal() {
    const successModal = document.getElementById('success-modal');
    successModal.style.display = 'flex'; // Show the success modal
}
// Function to copy the code to clipboard
function copyCodeToClipboard() {
    const codeElement = document.getElementById('voucher-code');
    const codeText = codeElement.textContent;

    // Create a temporary input element to copy the code
    const tempInput = document.createElement('input');
    tempInput.value = codeText;
    document.body.appendChild(tempInput);

    // Select and copy the text
    tempInput.select();
    document.execCommand('copy');

    // Remove the temporary input element
    document.body.removeChild(tempInput);

    // Optionally, show a message to the user that the code was copied
    alert('Voucher code copied to clipboard!');
}

// Add event listener for the "Copy Code" button
document.getElementById('copy-btn').addEventListener('click', copyCodeToClipboard);

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    pieces.forEach(function (p) {
        ctx.save();

        ctx.fillStyle = p.color;

        ctx.translate(p.x + p.size / 2, p.y + p.size / 2);
        ctx.rotate(p.rotation);

        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
    });

    requestAnimationFrame(draw);
}

function Piece(x, y) {
    this.x = x;
    this.y = y;
    this.size = (Math.random() * 0.5 + 0.75) * 15;
    this.gravity = (Math.random() * 0.5 + 0.75) * 0.03;
    this.rotation = (Math.PI * 2) * Math.random();
    this.rotationSpeed = (Math.PI * 2) * Math.random() * 0.0001;
    this.color = randomColor();
}

while (pieces.length < numberOfPieces) {
    pieces.push(new Piece(Math.random() * canvas.width, Math.random() * canvas.height));
}
