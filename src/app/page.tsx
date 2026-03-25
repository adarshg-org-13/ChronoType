//Main page
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";
import React from "react";
import { useState,useCallback,useEffect } from "react";
import { ThemeProvider,useTheme } from "./context/ThemeContext";
import { TypingArea } from "./components/TypingArea";
import { Analytics } from "./components/Analytics";
import { TestMode } from "./hooks/useTypingTest";

const Header = ({mode,setMode,currentView,setView,onLogoClick}:any) => {
  const {theme,cycleTheme,font,cycleFont,soundEnabled,toggleSound,soundTheme,cycleSoundTheme,volume,setVolume} = useTheme();

  return(
    <header className="w-full max-w-5xl mx-auto py-8 flex items-center justify-between">
      <div
        className="flex items-center gap-2 text-primary font-bold text-3xl tracking-tighter cursor-pointer"
        onClick={onLogoClick}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height = "12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8h.01"/><path d="M12 12h.01"/><path d="M14 8h.01"/><path d="M16 12h.01"/><path d="M18 8h.01"/><path d="M6 8h.01"/><path d="M7 16h10"/><path d="M8 12h.01"/><rect width="20" height="16" x = "2" y = "4" rx = "2"/></svg>
        <span>ChronoType</span>
      </div>

      {currentView === 'test' && (
        <div className="flex bg-muted/20 rounded-lg p-1">
          {[15,30,60].map((m) => (
            <button
             key = {m}
             onClick={() => setMode(m as TestMode)}
             className={`px-4 py-1 rounded-md text-sm font-medium transition-colors font-mono ${
              mode === m? 'bg-bg text-primary shadow-sm' : 'text-muted hover:text-text'
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
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height = "20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1 = "18" x2 = "18" y1 = "20" y2 = "10"/><line x1 = "12" x2 = "12" y1 = "20" y2 = "4"/><line x1 = "6" x2 = "6" y1 = "20" y2 = "14"/></svg>
        </button>
        <div className="flex items-center gap-2 group relative">
          <button onClick={toggleSound} className={`transition-colors ${soundEnabled? 'text-primary':'hover:text-text'}`} title={soundEnabled ? "Sound on": "Sound off"}>
            {soundEnabled ? (
              <svg xmlns="htttp://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 6 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg"
            )}
          </button>
        </div>
      </div>
    </header>
  )
}