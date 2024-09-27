document.addEventListener('DOMContentLoaded', function() {
  const audio = document.getElementById('background-music');
  audio.volume = 0.5; // Set desired volume

  // Play background music when any part of the page is clicked
  document.addEventListener('click', function() {
      audio.muted = false; // Unmute before playing
      audio.play().catch((error) => {
          console.error('Audio playback failed:', error);
      });
  });

  // Handle Enter key press to redirect to main.html
  document.addEventListener('keydown', function(event) {
      if (event.key === 'Enter') {
          window.location.href = 'main.html'; // Redirect to main.html
      }
  });
});




