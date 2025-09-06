// Cache for audio elements to prevent multiple conversions
const audioCache = {};
let isPlayingAudio = false;
let currentAudio = null;

async function playDescriptionOnHover(element) {
  // Skip if already playing audio
  console.log("called");
  if (isPlayingAudio || window.isMuted) {
    return;
  }
  
  const descriptionText = element.getAttribute('data-description');
  if (!descriptionText) return;
  
  try {
    // Use cached audio if available
    if (audioCache[descriptionText]) {
      playAudio(audioCache[descriptionText]);
      return;
    }
    
    isPlayingAudio = true;
    element.classList.add('loading-audio');
    
    // Retrieve selected language; default to Arabic ("ar") if selector not found
    const language = document.getElementById("languageSelect")?.value || "ar";
    
    const response = await fetch('http://localhost:5003/convert', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ text: descriptionText, language: language })
    });
    
    if (!response.ok) {
      throw new Error('Error converting text to speech');
    }
    
    const data = await response.json();
    
    // Create and cache the audio element
    const audio = new Audio(data.file_url);
    audioCache[descriptionText] = audio;
    
    // Remove loading indicator
    element.classList.remove('loading-audio');
    
    // Play the audio
    playAudio(audio);
  } catch (error) {
    console.error("Error playing hover audio:", error);
    isPlayingAudio = false;
    element.classList.remove('loading-audio');
  }
}

function playAudio(audio) {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
  }
  
  currentAudio = audio;
  
  audio.onended = function() {
    isPlayingAudio = false;
    currentAudio = null;
  };
  
  audio.onerror = function() {
    console.error("Error playing audio");
    isPlayingAudio = false;
    currentAudio = null;
  };
  
  audio.play().catch(error => {
    console.error("Could not play audio:", error);
    isPlayingAudio = false;
    currentAudio = null;
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const hoverElements = document.querySelectorAll('[data-description]');
  hoverElements.forEach(el => {
    el.addEventListener('mouseenter', () => playDescriptionOnHover(el));
  });
});
