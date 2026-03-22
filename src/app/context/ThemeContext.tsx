// Defining and calling the font themes and sound and the toggle sound
"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Theme = 'light' | 'dark' | 'dracula' | 'nord' | 'midnight' | 'monokai' | 'synthwave' | 'solarized' | 'matrix' | 'impossible';
export type Font = 'fira' | 'jetbrains' | 'vt323' | 'courier' | 'sharetech' | 'syne' | 'ibm' | 'space' | 'glitch' | 'creepster' | 'arcade' | 'montserrat';
export type SoundTheme = 'mechanical' | 'arcade' | 'pop' | 'vine-boom' | 'meow';

export const THEMES: Theme[] = ['light', 'dark', 'dracula', 'nord', 'midnight', 'monokai', 'synthwave', 'solarized', 'matrix', 'impossible'];
export const FONTS: Font[] = ['fira', 'jetbrains', 'vt323', 'courier', 'sharetech', 'syne', 'ibm', 'space', 'glitch', 'creepster', 'arcade', 'montserrat'];
export const SOUND_THEMES: SoundTheme[] = ['mechanical', 'arcade', 'pop', 'vine-boom', 'meow'];

interface ThemeContextType {
  theme: Theme;
  font: Font;
  soundTheme: SoundTheme;
  soundEnabled: boolean;
  volume: number;
  setTheme: (theme: Theme) => void;
  setFont: (font: Font) => void;
  setSoundTheme: (theme: SoundTheme) => void;
  setVolume: (volume: number) => void;
  cycleTheme: () => void;
  cycleFont: () => void;
  cycleSoundTheme: () => void;
  toggleSound: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('dark');
  const [font, setFont] = useState<Font>('montserrat');
  const [soundTheme, setSoundTheme] = useState<SoundTheme>('mechanical');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [volume, setVolume] = useState<number>(0.5);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(...THEMES);
    if (theme !== 'light') {
      root.classList.add(theme);
    }
  }, [theme]);

  useEffect(() => {
    const root = window.document.documentElement;
    const fontClasses = FONTS.map(f => `font-${f}`);
    root.classList.remove(...fontClasses);
    root.classList.add(`font-${font}`);
  }, [font]);

  const cycleTheme = () => {
    setTheme((prev) => {
      const currentIndex = THEMES.indexOf(prev);
      return THEMES[(currentIndex + 1) % THEMES.length];
    });
  };

  const cycleFont = () => {
    setFont((prev) => {
      const currentIndex = FONTS.indexOf(prev);
      return FONTS[(currentIndex + 1) % FONTS.length];
    });
  };

  const cycleSoundTheme = () => {
    setSoundTheme((prev) => {
      const currentIndex = SOUND_THEMES.indexOf(prev);
      return SOUND_THEMES[(currentIndex + 1) % SOUND_THEMES.length];
    });
  };

  const toggleSound = () => {
    setSoundEnabled((prev) => !prev);
  };

  return (
    <ThemeContext.Provider value={{ theme, font, soundTheme, soundEnabled, volume, setTheme, setFont, setSoundTheme, setVolume, cycleTheme, cycleFont, cycleSoundTheme, toggleSound }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};
