//main functions and init of the typing
"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { generateWords } from '../utils/words';
import { playSound } from '../utils/sounds';
import { useTheme } from '../context/ThemeContext';

export type TestMode = 15 | 30 | 60;
export type TestStatus = 'idle' | 'running' | 'finished';

export const useTypingTest = (mode: TestMode) => {
  const [status, setStatus] = useState<TestStatus>('idle');
  const [timeLeft, setTimeLeft] = useState<number>(mode);
  const [words, setWords] = useState<string[]>([]);
  const [typedWords, setTypedWords] = useState<string[]>(['']);
  
  const { soundEnabled, soundTheme, volume } = useTheme();
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const initTest = useCallback(() => {
    setWords(generateWords(500)); // Generate enough words
    setTypedWords(['']);
    setStatus('idle');
    setTimeLeft(mode);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, [mode]);

  useEffect(() => {
    initTest();
  }, [initTest]);

  const startTest = useCallback(() => {
    if (status !== 'idle' || timerRef.current) return;
    setStatus('running');
    const now = Date.now();
    
    timerRef.current = setInterval(() => {
      const elapsed = (Date.now() - now) / 1000;
      const remaining = Math.max(0, mode - elapsed);
      setTimeLeft(remaining);
      
      if (remaining <= 0) {
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        setStatus('finished');
      }
    }, 100); // Update every 100ms for better performance
  }, [status, mode]);

  let correctChars = 0;
  let incorrectChars = 0;

  typedWords.forEach((typedWord, i) => {
    const actualWord = words[i];
    if (!actualWord) return;
    
    for (let j = 0; j < Math.max(typedWord.length, actualWord.length); j++) {
      if (typedWord[j] === actualWord[j]) {
        correctChars++;
      } else {
        incorrectChars++;
      }
    }
    
    if (i < typedWords.length - 1) {
      if (typedWord === actualWord) {
        correctChars++; // space
      } else {
        incorrectChars++;
      }
    }
  });

  const totalChars = correctChars + incorrectChars;
  const accuracy = totalChars === 0 ? 0 : Math.round((correctChars / totalChars) * 100);
  const timeElapsed = mode - timeLeft;
  const minutes = timeElapsed / 60;
  const wpm = minutes > 0 ? Math.round((correctChars / 5) / minutes) : 0;

  const stats = useMemo(() => ({ wpm, accuracy, correctChars, incorrectChars }), [wpm, accuracy, correctChars, incorrectChars]);

  useEffect(() => {
    if (status === 'finished') {
      if (soundEnabled) playSound('finish', soundTheme, volume);
    }
  }, [status, soundEnabled, soundTheme, volume]);

  const handleKeyDown = useCallback((e: globalThis.KeyboardEvent) => {
    if (status === 'finished') return;
    
    if (e.key === ' ') {
      e.preventDefault();
      if (status === 'idle') {
        if (!e.repeat) initTest();
        return;
      }
      setTypedWords((prev) => {
        if (prev[prev.length - 1] === '') return prev; // Prevent multiple spaces
        if (soundEnabled) playSound('type', soundTheme, volume);
        return [...prev, ''];
      });
      return;
    }

    if (e.key === 'Backspace') {
      e.preventDefault(); // Prevent browser navigation
      if (status === 'idle') return;
      setTypedWords((prev) => {
        const newTyped = [...prev];
        const currentWordIdx = newTyped.length - 1;
        
        if (newTyped[currentWordIdx].length > 0) {
          newTyped[currentWordIdx] = newTyped[currentWordIdx].slice(0, -1);
          if (soundEnabled) playSound('type', soundTheme, volume);
        } else if (currentWordIdx > 0) {
          newTyped.pop();
          if (soundEnabled) playSound('type', soundTheme, volume);
        }
        return newTyped;
      });
      return;
    }

    // Start test on first valid keypress
    if (status === 'idle' && e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
      startTest();
    }

    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
      e.preventDefault(); // Prevent default browser actions like quick search
      setTypedWords((prev) => {
        const newTyped = [...prev];
        const currentWordIdx = newTyped.length - 1;
        const currentWord = newTyped[currentWordIdx];
        const targetWord = words[currentWordIdx];
        
        // Determine correctness for sound
        if (soundEnabled) {
          const isCorrect = targetWord && targetWord[currentWord.length] === e.key;
          playSound(isCorrect ? 'correct' : 'incorrect', soundTheme, volume);
        }

        newTyped[currentWordIdx] += e.key;
        return newTyped;
      });
    }
  }, [status, startTest, initTest, soundEnabled, soundTheme, volume, words]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return { status, timeLeft, words, typedWords, stats, initTest };
};
