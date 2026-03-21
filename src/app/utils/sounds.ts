let audioCtx: AudioContext | null = null;

const initAudio = () => {
  if (typeof window === 'undefined') return;
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
};

export const playSound = (type: 'type' | 'correct' | 'incorrect' | 'finish', theme: string = 'mechanical', volume: number = 0.5) => {
  try {
    initAudio();
    if (!audioCtx) return;

    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    const now = audioCtx.currentTime;

    if (theme === 'vine-boom' && type === 'incorrect') {
      // Vine boom effect
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(120, now);
      oscillator.frequency.exponentialRampToValueAtTime(30, now + 0.5);
      
      const osc2 = audioCtx.createOscillator();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(80, now);
      osc2.frequency.exponentialRampToValueAtTime(10, now + 0.4);
      
      const gain2 = audioCtx.createGain();
      osc2.connect(gain2);
      gain2.connect(audioCtx.destination);
      
      gainNode.gain.setValueAtTime(1 * volume, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01 * volume, now + 0.5);
      
      gain2.gain.setValueAtTime(0.8 * volume, now);
      gain2.gain.exponentialRampToValueAtTime(0.01 * volume, now + 0.4);
      
      oscillator.start(now);
      oscillator.stop(now + 0.5);
      osc2.start(now);
      osc2.stop(now + 0.4);
      return;
    }

    if (theme === 'vine-boom' && (type === 'type' || type === 'correct')) {
      // Small thud for regular typing in vine-boom mode
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(100, now);
      oscillator.frequency.exponentialRampToValueAtTime(40, now + 0.05);
      gainNode.gain.setValueAtTime(0.2 * volume, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001 * volume, now + 0.05);
      oscillator.start(now);
      oscillator.stop(now + 0.05);
      return;
    }

    if (theme === 'meow' && type !== 'finish') {
      // Meow sound
      oscillator.type = 'sine';
      const isCorrect = type === 'correct' || type === 'type';
      const baseFreq = isCorrect ? 600 : 300;
      oscillator.frequency.setValueAtTime(baseFreq, now);
      oscillator.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, now + 0.1);
      oscillator.frequency.exponentialRampToValueAtTime(baseFreq, now + 0.2);
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.2 * volume, now + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.001 * volume, now + 0.2);
      oscillator.start(now);
      oscillator.stop(now + 0.2);
      return;
    }

    if (theme === 'pop' && type !== 'finish') {
      // Bubble pop
      oscillator.type = 'sine';
      const isCorrect = type === 'correct' || type === 'type';
      oscillator.frequency.setValueAtTime(isCorrect ? 800 : 300, now);
      oscillator.frequency.exponentialRampToValueAtTime(isCorrect ? 400 : 150, now + 0.05);
      gainNode.gain.setValueAtTime(0.3 * volume, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01 * volume, now + 0.05);
      oscillator.start(now);
      oscillator.stop(now + 0.05);
      return;
    }

    if (theme === 'arcade' && type !== 'finish') {
      // Retro arcade blip
      oscillator.type = 'square';
      const isCorrect = type === 'correct' || type === 'type';
      oscillator.frequency.setValueAtTime(isCorrect ? 440 : 150, now);
      oscillator.frequency.setValueAtTime(isCorrect ? 880 : 100, now + 0.05);
      gainNode.gain.setValueAtTime(0.05 * volume, now);
      gainNode.gain.setValueAtTime(0, now + 0.1);
      oscillator.start(now);
      oscillator.stop(now + 0.1);
      return;
    }

    // Default mechanical sounds
    if (type === 'type') {
      // Generic mechanical click (for backspace, space, etc.)
      oscillator.type = 'square';
      oscillator.frequency.setValueAtTime(120, now);
      oscillator.frequency.exponentialRampToValueAtTime(40, now + 0.03);
      gainNode.gain.setValueAtTime(0.05 * volume, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001 * volume, now + 0.03);
      oscillator.start(now);
      oscillator.stop(now + 0.03);
    } else if (type === 'correct') {
      // Soft high-pitched click
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(600, now);
      oscillator.frequency.exponentialRampToValueAtTime(200, now + 0.04);
      gainNode.gain.setValueAtTime(0.08 * volume, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001 * volume, now + 0.04);
      oscillator.start(now);
      oscillator.stop(now + 0.04);
    } else if (type === 'incorrect') {
      // Error buzz
      oscillator.type = 'sawtooth';
      oscillator.frequency.setValueAtTime(150, now);
      oscillator.frequency.exponentialRampToValueAtTime(50, now + 0.1);
      gainNode.gain.setValueAtTime(0.1 * volume, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001 * volume, now + 0.1);
      oscillator.start(now);
      oscillator.stop(now + 0.1);
    } else if (type === 'finish') {
      // Success sfx
      oscillator.type = 'sine';
      
      oscillator.frequency.setValueAtTime(523.25, now);      
      oscillator.frequency.setValueAtTime(659.25, now + 0.1);
      oscillator.frequency.setValueAtTime(783.99, now + 0.2); 
      oscillator.frequency.setValueAtTime(1046.50, now + 0.3); 
      
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.1 * volume, now + 0.05);
      gainNode.gain.setValueAtTime(0.1 * volume, now + 0.3);
      gainNode.gain.exponentialRampToValueAtTime(0.001 * volume, now + 0.8);
      
      oscillator.start(now);
      oscillator.stop(now + 0.8);
    }
  } catch (e) {
    console.error("Audio playback failed", e);
  }
};