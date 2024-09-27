document.addEventListener('DOMContentLoaded', function () {
    const submitButton = document.getElementById('sendButton');
    const randomizeButton = document.getElementById('randomizeButton');
    const inputText = document.getElementById('inputText');
    const questionElement = document.querySelector('.asker .question');
    const guideElements = document.querySelectorAll('.guide h1'); 
    const guideContainer = document.querySelector('.guide'); 
    let isGuideVisible = false; 
    let isToneInitialized = false; 

    const questions = [
        "<<So, what do you feel?>>",
        "<<What are your dreams telling you?>>",
        "<<How will you remember this life?>>",
        "<<Are you still you?>>",
        "<<What is a feeling you thought you’d forgotten?>>",
        "<<What do you fear?>>",
        "<<Does it matter if everything returns to nothingness?>>",
        "<<How do you live?>>",
        "<<What brings you peace?>>",
        "<<What do you want to be remembered for?>>"
    ];

    let currentVolume = 1; // Start with full volume
    let cooldownTime = 1000; // Cooldown period in milliseconds
    let lastSoundTime = 0; // Time when the last sound was played

    function shuffleTextAnimation(element, newText) {
        let currentText = element.textContent;
        let shuffledText = '';
        let maxLength = Math.max(currentText.length, newText.length);
        let progress = 0;

        const interval = setInterval(() => {
            shuffledText = '';
            for (let i = 0; i < maxLength; i++) {
                if (i < progress) {
                    shuffledText += newText[i] || '';
                } else {
                    shuffledText += String.fromCharCode(33 + Math.floor(Math.random() * 94)); // Random characters
                }
            }
            element.textContent = shuffledText;
            progress++;
            if (progress > maxLength) {
                clearInterval(interval);
                element.textContent = newText; // Final text
            }
        }, 50);
    }

    function randomizeQuestion() {
        const randomIndex = Math.floor(Math.random() * questions.length);
        const newQuestion = questions[randomIndex];
        shuffleTextAnimation(questionElement, newQuestion);
    }

    randomizeQuestion();

    submitButton.addEventListener('click', function (event) {
        event.preventDefault();

        if (!isToneInitialized) {
            initTone();
            isToneInitialized = true; 
        }

        const inputValue = inputText.value.trim();
        const currentTime = Date.now();

        if (inputValue && (currentTime - lastSoundTime >= cooldownTime)) {
            playSendSound();
            generateParticles();
            randomizeQuestion(); 
            inputText.value = ''; 
            lastSoundTime = currentTime; // Update last sound time
        }
    });

    randomizeButton.addEventListener('click', function () {
        randomizeQuestion();
    });

    function generateParticles() {
        for (let i = 0; i < 3; i++) {
            let randomX = Math.random() * (window.innerWidth * 0.8); 
            let randomY = Math.random() * (window.innerHeight * 0.7); 
            particles.push(new Particle(randomX, randomY, 5, 75));
        }
    }

    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && !isGuideVisible) {
            guideContainer.style.display = 'block';
            isGuideVisible = true; 
        }
    });

    document.addEventListener('keyup', function (event) {
        if (event.key === 'Escape' && isGuideVisible) {
            guideContainer.style.display = 'none';
            isGuideVisible = false; 
        }
    });

    guideElements.forEach(guide => {
        guide.addEventListener('click', function () {
            alert(`You clicked on: ${guide.innerText}`);
        });
    });

    const reverb = new Tone.Reverb(8).toDestination();
    const delay = new Tone.FeedbackDelay("8n", 0.5).toDestination();
    const synth = new Tone.PolySynth(Tone.Synth).chain(reverb, delay);
    const notes = [
        "C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5", 
        "D5", "E5", "F5", "G5", "A5", "B5", "C6", 
        "C3", "D3", "E3" // Added lower and higher notes for more range
    ];
    
    function playSendSound() {
        if (notes.length > 0) {
            const note = notes[Math.floor(Math.random() * notes.length)];
            synth.volume.value = currentVolume * 10; // Scale volume for Tone.js
            synth.triggerAttackRelease(note, "8n");

            // Gradually decrease volume for next sound
            currentVolume *= 0.9; // Decrease volume by 10% each time
            if (currentVolume < 0.1) { // Reset if too quiet
                currentVolume = 1;
            }
        }
    }

    function initTone() {
        Tone.Transport.scheduleRepeat(() => {
            playSendSound();
        }, "4n"); // More ambient effect with longer intervals
        Tone.Transport.start();
    }

    let particles = []; 

    function setup() {
        const canvas = createCanvas(windowWidth * 0.8, windowHeight * 0.7);
        canvas.parent('canvas-container');
        background(0); 
        frameRate(60);
    }

    function draw() {
        for (let i = particles.length - 1; i >= 0; i--) {
            particles[i].update(particles);
            particles[i].show();
            if (particles[i].alpha <= 2) particles.splice(i, 1); 
        }
    }

    class Particle {
        constructor(x, y, r, a) {
            this.location = createVector(x, y);
            this.velocity = createVector(random(-1, 1), random(-1, 1));
            this.acceleration = createVector();
            this.alpha = this.palpha = a;
            this.amp = 3; 
            this.rate = r;
        }

        update(p) {
            this.acceleration.add(
                createVector(noise(this.location.x) * 2 - 1, noise(this.location.y) * 2 - 1)
            );
            this.velocity.add(this.acceleration);
            this.acceleration.set(0, 0);
            this.location.add(this.velocity);
            this.alpha -= this.rate;

            if (this.alpha <= this.palpha * 0.25 && this.palpha > 10) {
                p.push(
                    new Particle(this.location.x, this.location.y, this.rate * 0.25, this.palpha * 0.5)
                );
            }
        }

        show() {
            noStroke();
            fill(255, this.alpha);
            ellipse(this.location.x, this.location.y, this.amp);
        }
    }

    // Capture and download canvas when '1' key is pressed
    document.addEventListener('keydown', function (event) {
        if (event.key === '1') {
            const canvas = document.querySelector('canvas'); 
            const imageUrl = canvas.toDataURL("image/png"); 
            const anchor = document.createElement("a");
            anchor.href = imageUrl; 
            anchor.download = "canvas.png"; 
            anchor.click(); 
        }
        
        // Reset functionality when '3' key is pressed
        if (event.key === '3') {
            particles = []; // Clear particles
            Tone.Transport.stop(); // Stop sound
            Tone.Transport.cancel(); // Cancel scheduled events
            isToneInitialized = false; // Reset Tone.js initialization flag
            setup(); // Reset canvas
        }
    });
});


