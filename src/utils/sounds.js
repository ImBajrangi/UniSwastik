// Utility to handle UI sounds
const CLICK_SOUND_URL = 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3';

let clickAudio = null;

if (typeof window !== 'undefined') {
  clickAudio = new Audio(CLICK_SOUND_URL);
  clickAudio.volume = 0.2; // Keep it soft and subtle
  clickAudio.preload = 'auto';
}

export const playClick = () => {
  if (clickAudio) {
    // Reset and play to allow rapid consecutive clicks
    clickAudio.currentTime = 0;
    clickAudio.play().catch(err => console.log('Audio play blocked:', err));
  }
};
