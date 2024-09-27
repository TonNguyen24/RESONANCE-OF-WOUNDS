let userInput = ""; // Variable to store user input
let inputBox; // Variable for the input box

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);
  
  // Create an input box and set it to take input
  inputBox = createInput();
  inputBox.position(20, 20); // Position the input box
  inputBox.size(200); // Size of the input box
  inputBox.input(() => { userInput = inputBox.value(); }); // Update userInput whenever text is typed
}

function draw() {
  var h = hour();
  var m = minute();
  var s = second();
  var mw = map(minute(), 0, 59, 0, width);
  var sw = map(second(), 0, 59, 0, 360);
  
  push();
  translate(width / 2, height / 2);
  rotate(radians(sw * 10)); // Keeps the rotation, feel free to remove this if not needed
  
  var x = 0 + map(noise(frameCount * 0.01), 0, 1, -width / 2, -width / 12);
  var y = 0 + map(noise(s + frameCount * 0.01), 0, 1, -30, 30);
  
  // Draw the user input
  textSize((s + 1) * 2);
  textAlign(CENTER, CENTER);
  noFill();
  stroke(255, 32);
  
  text(userInput, x, y); // Draw the user input instead of the second
  
  pop();
}

// Detect when the Enter key is pressed
function keyPressed() {
  if (keyCode === ENTER) {
    userInput = inputBox.value(); // Update userInput on Enter
    inputBox.value(''); // Clear the input box after pressing Enter
  }
}
