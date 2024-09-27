// Ensure Tone.js is started on the first interaction
document.addEventListener("click", async () => {
    await Tone.start();
    console.log("Tone.js is ready");
    
    // Initialize synth and effects
    const reverb = new Tone.Reverb(8).toDestination();
    const delay = new Tone.FeedbackDelay("8n", 0.5).toDestination();
    const synth = new Tone.PolySynth(Tone.Synth).chain(reverb, delay);
    
    // Define notes for generative music and ambient sound
    const notes = ["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5"];
    let noteSequence = [];
    let activeNotes = [];
    let noteIndex = 0;

    // Function to play the current note sequence
    function playNotes() {
        noteSequence.forEach((note, i) => {
            synth.triggerAttackRelease(note, "8n", Tone.now() + i * 0.5);
        });
    }

    // Function to play ambient sound
    function playAmbientSound() {
        if (activeNotes.length > 0) {
            const note = activeNotes[Math.floor(Math.random() * activeNotes.length)];
            synth.triggerAttackRelease(note, "8n");
        }
    }

    // Add event listener to the send button
    document.getElementById("sendButton").addEventListener("click", () => {
        const input = document.getElementById("inputText").value;

        if (input) {
            // Add a note from the predefined list of notes to the sequence
            noteSequence.push(notes[noteIndex % notes.length]);
            activeNotes.push(notes[noteIndex % notes.length]); // Add to active notes for ambient sound
            noteIndex++;

            // Play the sequence
            playNotes();

            // Schedule ambient sound generation
            Tone.Transport.scheduleRepeat(() => {
                playAmbientSound();
            }, "1n");
            Tone.Transport.start(); // Start the transport if it's not already running

            // Clear the input field
            document.getElementById("inputText").value = "";
        }
    });
});