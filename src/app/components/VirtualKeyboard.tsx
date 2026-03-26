// Main virtual keyboard file
import React from "react";
import { useState,useEffect } from "react";
const KEYBOARD_LAYOUT = [
  [
    { code: 'Backquote', label: '`' }, { code: 'Digit1', label: '1' }, { code: 'Digit2', label: '2' }, { code: 'Digit3', label: '3' }, { code: 'Digit4', label: '4' }, { code: 'Digit5', label: '5' }, { code: 'Digit6', label: '6' }, { code: 'Digit7', label: '7' }, { code: 'Digit8', label: '8' }, { code: 'Digit9', label: '9' }, { code: 'Digit0', label: '0' }, { code: 'Minus', label: '-' }, { code: 'Equal', label: '=' }, { code: 'Backspace', label: '←', width: 'w-12 sm:w-16 md:w-24' }
  ],
  [
    { code: 'Tab', label: 'Tab', width: 'w-10 sm:w-14 md:w-20' }, { code: 'KeyQ', label: 'Q' }, { code: 'KeyW', label: 'W' }, { code: 'KeyE', label: 'E' }, { code: 'KeyR', label: 'R' }, { code: 'KeyT', label: 'T' }, { code: 'KeyY', label: 'Y' }, { code: 'KeyU', label: 'U' }, { code: 'KeyI', label: 'I' }, { code: 'KeyO', label: 'O' }, { code: 'KeyP', label: 'P' }, { code: 'BracketLeft', label: '[' }, { code: 'BracketRight', label: ']' }, { code: 'Backslash', label: '\\', width: 'w-8 sm:w-12 md:w-16' }
  ],
  [
    { code: 'CapsLock', label: 'Caps', width: 'w-12 sm:w-16 md:w-24' }, { code: 'KeyA', label: 'A' }, { code: 'KeyS', label: 'S' }, { code: 'KeyD', label: 'D' }, { code: 'KeyF', label: 'F' }, { code: 'KeyG', label: 'G' }, { code: 'KeyH', label: 'H' }, { code: 'KeyJ', label: 'J' }, { code: 'KeyK', label: 'K' }, { code: 'KeyL', label: 'L' }, { code: 'Semicolon', label: ';' }, { code: 'Quote', label: '\'' }, { code: 'Enter', label: 'Enter', width: 'w-12 sm:w-16 md:w-24' }
  ],
  [
    { code: 'ShiftLeft', label: 'Shift', width: 'w-16 sm:w-20 md:w-32' }, { code: 'KeyZ', label: 'Z' }, { code: 'KeyX', label: 'X' }, { code: 'KeyC', label: 'C' }, { code: 'KeyV', label: 'V' }, { code: 'KeyB', label: 'B' }, { code: 'KeyN', label: 'N' }, { code: 'KeyM', label: 'M' }, { code: 'Comma', label: ',' }, { code: 'Period', label: '.' }, { code: 'Slash', label: '/' }, { code: 'ShiftRight', label: 'Shift', width: 'w-16 sm:w-20 md:w-32' }
  ],
  [
    { code: 'Space', label: 'Space', width: 'w-48 sm:w-64 md:w-[400px]' }
  ]
];

export const VirtualKeyboard = () => {
  const [activeKeys, setActiveKeys] = useState<Set<string>>(new Set());

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setActiveKeys(prev => {
        const next = new Set(prev);
        next.add(e.code);
        return next;
      });
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      setActiveKeys(prev => {
        const next = new Set(prev);
        next.delete(e.code);
        return next;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return (
    <div className="w-fit mx-auto mt-16 flex flex-col gap-2 p-4 sm:p-6 rounded-2xl bg-transparent border-2 border-muted/10 backdrop-blur-sm">
      {KEYBOARD_LAYOUT.map((row, i) => (
        <div key={i} className="flex justify-center gap-1 sm:gap-2">
          {row.map((key) => {
            const isActive = activeKeys.has(key.code);
            return (
              <div
                key={key.code}
                className={`
                  flex items-center justify-center rounded-md sm:rounded-lg font-mono text-xs sm:text-sm transition-all duration-75
                  ${key.width || 'w-6 sm:w-10 md:w-12'} h-10 sm:h-12
                  ${isActive 
                    ? 'bg-primary text-bg scale-95 opacity-100 shadow-sm border-2 border-primary' 
                    : 'bg-transparent text-muted border-2 border-muted/30 opacity-50'}
                `}
              >
                {key.label}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};
