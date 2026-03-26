/* Main page website with all the analytics modes themes added to it also the delte data works for that specific period of time and the data is shown again after revisting of the website to prevent accidental data deletion*/
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import React, { useState, useCallback, useEffect } from 'react';
import { ThemeProvider,useTheme } from './context/ThemeContext';
import { TypingArea } from './components/TypingArea';
import { Analytics } from './components/Analytics';
import { TestMode } from './hooks/useTypingTest';

const Header = ({ mode, setMode, currentView, setView, onLogoClick }: any) => {
  const { theme, cycleTheme, font, cycleFont, soundEnabled, toggleSound, soundTheme, cycleSoundTheme, volume, setVolume } = useTheme();

  return (
    <header className="w-full max-w-5xl mx-auto py-8 flex items-center justify-between">
      <div 
        className="flex items-center gap-2 text-primary font-bold text-3xl tracking-tighter cursor-pointer"
        onClick={onLogoClick}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 8h.01"/><path d="M12 12h.01"/><path d="M14 8h.01"/><path d="M16 12h.01"/><path d="M18 8h.01"/><path d="M6 8h.01"/><path d="M7 16h10"/><path d="M8 12h.01"/><rect width="20" height="16" x="2" y="4" rx="2"/></svg>
        <span>ChronoType</span>
      </div>
      
      {currentView === 'test' && (
        <div className="flex bg-muted/20 rounded-lg p-1">
          {[15, 30, 60].map((m) => (
            <button
              key={m}
              onClick={() => setMode(m as TestMode)}
              className={`px-4 py-1 rounded-md text-sm font-medium transition-colors font-mono ${
                mode === m ? 'bg-bg text-primary shadow-sm' : 'text-muted hover:text-text'
              }`}
            >
              {m}s
            </button>
          ))}
        </div>
      )}

      <div className="flex items-center gap-6 text-muted">
        <button 
          onClick={() => setView('analytics')}
          className={`transition-colors ${currentView === 'analytics' ? 'text-primary' : 'hover:text-text'}`}
          title="Analytics"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" x2="18" y1="20" y2="10"/><line x1="12" x2="12" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="14"/></svg>
        </button>
        <div className="flex items-center gap-2 group relative">
          <button onClick={toggleSound} className={`transition-colors ${soundEnabled ? 'text-primary' : 'hover:text-text'}`} title={soundEnabled ? "Sound On" : "Sound Off"}>
            {soundEnabled ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>
            )}
          </button>
          {soundEnabled && (
            <>
              <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.05" 
                value={volume} 
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-20 h-1.5 bg-muted/30 rounded-lg appearance-none cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity absolute top-full left-1/2 -translate-x-1/2 mt-3 z-10 accent-primary"
                title="Volume"
              />
              <button onClick={cycleSoundTheme} className="hover:text-text transition-colors flex items-center gap-1" title={`Current sound: ${soundTheme}`}>
                <span className="text-xs font-mono capitalize hidden sm:inline-block bg-muted/10 px-2 py-0.5 rounded">{soundTheme}</span>
              </button>
            </>
          )}
        </div>
        <button onClick={cycleFont} className="hover:text-text transition-colors flex items-center gap-2" title={`Current font: ${font}`}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" x2="15" y1="20" y2="20"/><line x1="12" x2="12" y1="4" y2="20"/></svg>
          <span className="text-sm font-mono capitalize hidden sm:inline-block">{font}</span>
        </button>
        <button onClick={cycleTheme} className="hover:text-text transition-colors flex items-center gap-2" title={`Current theme: ${theme}`}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>
          <span className="text-sm font-mono capitalize hidden sm:inline-block">{theme}</span>
        </button>
      </div>
    </header>
  );
};

const Main = () => {
  const [mode, setMode] = useState<TestMode>(30);
  const [history, setHistory] = useState<any[]>([]);
  const [view, setView] = useState<'test' | 'analytics'>('test');
  const [testKey, setTestKey] = useState(0);

  // Load history on mount
  useEffect(() => {
    const saved = localStorage.getItem('chronotype_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        // ignore
      }
    }
  }, []);

  // Save history on change
  useEffect(() => {
    if (history.length > 0) {
      localStorage.setItem('chronotype_history', JSON.stringify(history));
    }
  }, [history]);

  const handleFinish = useCallback((stats: any) => {
    setHistory(prev => {
      const newHistory = [...prev, { ...stats, date: new Date().toISOString(), mode }];
      return newHistory.slice(-50); // Keep only the last 50 tests
    });
  }, [mode]);

  const handleLogoClick = () => {
    setView('test');
    setTestKey(k => k + 1);
  };

  return (
    <div className="min-h-screen flex flex-col px-6">
      <Header mode={mode} setMode={setMode} currentView={view} setView={setView} onLogoClick={handleLogoClick} />
      <main className="flex-1 flex flex-col justify-center pb-32">
        {view === 'test' ? (
          <div className="duration-300">
            <TypingArea key={testKey} mode={mode} onFinish={handleFinish} />
          </div>
        ) : (
          <div className="duration-300">
            <Analytics history={history} onReset={() => setHistory([])} />
          </div>
        )}
      </main>
      <footer className="py-6 text-center text-muted text-sm font-mono">
        <p>Press <kbd className="bg-muted/20 px-2 py-1 rounded">space</kbd> to reload sentence • Just start typing to begin</p>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <Main />
    </ThemeProvider>
  );
}

