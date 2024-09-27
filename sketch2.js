let particles = []; // Array of particles
let isWhiteBackground = false; // State to track background color
let originalBgColor = 0; // Original background color (black)
let originalParticleColor = 255; // Original particle color (white)
let toggledBgColor = 255; // Toggled background color (white)
let toggledParticleColor = [0, 0, 255]; // Toggled particle color (blue)
let canvas; // Declare canvas variable
const canvasRatio = 0.8; // Ratio for canvas width
const canvasHeightRatio = 0.7; // Ratio for canvas height

function setup() {
    canvas = createCanvas(windowWidth * canvasRatio, windowHeight * canvasHeightRatio); // Make canvas based on ratios
    canvas.parent('canvas-container'); // Attach canvas to the #canvas-container div
    background(originalBgColor); // Set background to black
    frameRate(60);
}

function draw() {
    // Update and show the particles
    for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update(particles);
        particles[i].show();
        if (particles[i].alpha <= 2) particles.splice(i, 1); // Remove dead particles
    }
}

// Particle class
class Particle {
    constructor(x, y, r, a) {
        this.location = createVector(x, y);
        this.velocity = createVector(random(-1, 1), random(-1, 1));
        this.acceleration = createVector();
        this.alpha = this.palpha = a;
        this.amp = 3; // Size of the particle
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

        // Recursion condition for particle splitting
        if (this.alpha <= this.palpha * 0.25 && this.palpha > 10) {
            p.push(
                new Particle(this.location.x, this.location.y, this.rate * 0.25, this.palpha * 0.5)
            );
        }
    }

    show() {
        noStroke();
        fill(isWhiteBackground ? toggledParticleColor : originalParticleColor, this.alpha); // Set particle color
        ellipse(this.location.x, this.location.y, this.amp);
    }
}

// Button interaction for particle generation
document.addEventListener('DOMContentLoaded', function () {
    const sendButton = document.getElementById('sendButton');

    // When SEND button is pressed, generate particles
    sendButton.addEventListener('click', function () {
        // Generate three particles at random locations
        for (let i = 0; i < 3; i++) {
            let randomX = random(width);
            let randomY = random(height);
            
            // Spawn a new particle at a random position
            particles.push(new Particle(randomX, randomY, 5, 75));
        }
    });

    // Key press event to invert background and particle color
    document.addEventListener('keydown', function (event) {
        if (event.key === '2') {
            isWhiteBackground = !isWhiteBackground; // Toggle the state
            background(isWhiteBackground ? toggledBgColor : originalBgColor); // Change background color
            
            // Invert particle color based on the background state
            if (isWhiteBackground) {
                originalParticleColor = [0, 11, 64, 0]; // Change to blue when background is white
            } else {
                originalParticleColor = 255; // Change to white when background is black
            }
        }
    });
});

// Maintain aspect ratio when the window is resized
function windowResized() {
    resizeCanvas(windowWidth * canvasRatio, windowHeight * canvasHeightRatio); // Adjust canvas size
    background(originalBgColor); // Reset background color after resizing
}
