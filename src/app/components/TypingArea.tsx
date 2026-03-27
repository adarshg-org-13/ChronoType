// main typing area where the words will be shown
"use client";

import React, { useEffect, useRef, memo, useState } from 'react';
import { useTypingTest, TestMode } from '../hooks/useTypingTest';
import { VirtualKeyboard } from './VirtualKeyboard';

const Caret = ({ top, left }: { top: number, left: number }) => (
  <div
    className="absolute w-[4px] bg-primary rounded-sm -ml-[2px] transition-all duration-100 ease-out z-10"
    style={{ top: `${top + 4}px`, left: `${left}px`, height: '34px' }}
  >
    <div className="w-full h-full animate-pulse bg-primary rounded-sm" />
  </div>
);

const Word = memo(({ 
  word, 
  typedWord, 
  isActive, 
  activeCharRef 
}: { 
  word: string, 
  typedWord?: string, 
  isActive: boolean, 
  activeCharRef: React.MutableRefObject<HTMLSpanElement | null> 
}) => {
  return (
    <div className={`flex flex-wrap ${isActive ? 'active-word' : ''}`}>
      {word.split('').map((char, charIdx) => {
        let charClass = "text-muted";
        if (typedWord !== undefined) {
          if (charIdx < typedWord.length) {
            charClass = typedWord[charIdx] === char ? "text-text" : "text-error";
          }
        }
        
        // Only attach ref if this is the ACTIVE character in the ACTIVE word
        const isCaretHere = isActive && (typedWord?.length || 0) === charIdx;
        
        return (
          <span 
            key={charIdx} 
            ref={isCaretHere ? activeCharRef : null} 
            className={`${charClass}`}
          >
            {char}
          </span>
        );
      })}
      
      {/* Extra characters typed beyond word length */}
      {typedWord && typedWord.length > word.length && typedWord.slice(word.length).split('').map((char, charIdx) => {
        const isCaretHere = isActive && typedWord.length === word.length + charIdx;
        return (
          <span 
            key={`extra-${charIdx}`} 
            ref={isCaretHere ? activeCharRef : null} 
            className="text-error opacity-70"
          >
            {char}
          </span>
        );
      })}
      
      {/* Empty span for caret at the end of the word */}
      {isActive && (typedWord?.length || 0) >= word.length && (
        <span ref={((typedWord?.length || 0) === word.length) ? activeCharRef : null}></span>
      )}
    </div>
  );
});

export const TypingArea: React.FC<{ mode: TestMode; onFinish: (stats: any) => void }> = ({ mode, onFinish }) => {
  const { status, timeLeft, words, typedWords, stats, initTest } = useTypingTest(mode);
  const containerRef = useRef<HTMLDivElement>(null);
  const restartBtnRef = useRef<HTMLButtonElement>(null);
  const hasFinishedRef = useRef(false);
  const activeCharRef = useRef<HTMLSpanElement | null>(null);
  const [caretPos, setCaretPos] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (status === 'idle') {
      hasFinishedRef.current = false;
    }
    if (status === 'finished' && !hasFinishedRef.current) {
      hasFinishedRef.current = true;
      onFinish(stats);
      setTimeout(() => {
        restartBtnRef.current?.focus();
      }, 100);
    }
  }, [status, stats, onFinish]);

  // Update caret position
  useEffect(() => {
    if (activeCharRef.current && containerRef.current && status !== 'finished') {
      const charRect = activeCharRef.current.getBoundingClientRect();
      const containerRect = containerRef.current.getBoundingClientRect();
      
      setCaretPos({
        top: charRect.top - containerRect.top + containerRef.current.scrollTop,
        left: charRect.left - containerRect.left + containerRef.current.scrollLeft,
      });
    }
  }, [typedWords, status, words]);

  // Scroll to active line
  useEffect(() => {
    const activeWordEl = containerRef.current?.querySelector('.active-word') as HTMLElement;
    const containerEl = containerRef.current;
    
    if (activeWordEl && containerEl) {
      const wordTop = activeWordEl.offsetTop;
      const containerScrollTop = containerEl.scrollTop;
      
      if (wordTop - containerScrollTop > 100) {
        containerEl.scrollTo({
          top: wordTop - 50,
          behavior: 'smooth'
        });
      }
    }
  }, [typedWords.length]);

  if (status === 'finished') {
    let formattedPercentile = 0;
    if (stats.wpm > 0) {
      const p = 100 / (1 + Math.exp(-0.07 * (stats.wpm - 40)));
      formattedPercentile = p >= 99.9 ? 99.9 : Math.round(p);
    }

    let flavorText = "";
    if (stats.wpm === 0) flavorText = "Keyboard not plugged in?";
    else if (formattedPercentile < 20) flavorText = "You need to practice a lot!";
    else if (formattedPercentile < 50) flavorText = "Average typing speed.";
    else if (formattedPercentile < 80) flavorText = "Above average speed.";
    else if (formattedPercentile < 95) flavorText = "Professional standard.";
    else if (formattedPercentile < 99) flavorText = "Incredible speed! Top tier typist.";
    else flavorText = "You're a legend! Are you Albert Wesker?";

    return (
      <div className="flex flex-col items-center justify-center space-y-8 mt-12 duration-500">
        <div className="grid grid-cols-2 gap-12 text-center">
          <div>
            <div className="text-muted text-2xl mb-2 font-mono">wpm</div>
            <div className="text-primary text-6xl font-bold">{stats.wpm}</div>
          </div>
          <div>
            <div className="text-muted text-2xl mb-2 font-mono">acc</div>
            <div className="text-primary text-6xl font-bold">{stats.accuracy}%</div>
          </div>
        </div>
        
        <div className="flex flex-col items-center space-y-4 w-full">
          <div className="text-center p-4 bg-muted/10 rounded-xl border border-muted/20 max-w-md w-full">
            <div className="text-xl font-bold text-text mb-1">
              {stats.wpm > 0 ? `You are faster than ${formattedPercentile}% of people!` : "You are faster than 0% of people."}
            </div>
            <div className="text-muted text-sm">
              {flavorText}
            </div>
          </div>
          
          <div className="flex space-x-8 text-muted text-lg font-mono pt-2">
            <div>test type: {mode}s</div>
            <div>characters: {stats.correctChars}/{stats.incorrectChars}</div>
          </div>
        </div>

        <button 
          ref={restartBtnRef}
          onClick={initTest}
          className="mt-4 p-4 rounded-full hover:bg-muted/20 transition-colors text-text focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto mt-12 relative">
      <div className="flex items-center justify-between mb-8 text-primary text-2xl font-mono">
        <div className={status === 'idle' ? 'opacity-0' : 'opacity-100 transition-opacity'}>
          {Math.ceil(timeLeft)}
        </div>
      </div>
      
      <div 
        ref={containerRef}
        className="text-3xl leading-[1.5em] font-mono font-bold h-[225px] overflow-hidden relative duration-500"
        style={{ userSelect: 'none' }}
      >
        {(status as string) !== 'finished' && <VirtualKeyboard />}
        <div className="flex flex-wrap gap-x-4 gap-y-2">
          {words.map((word, wordIdx) => {
            const typedWord = typedWords[wordIdx];
            // Only the word being typed is active
            const isActive = wordIdx === typedWords.length - 1;

            return (
              <Word 
                key={`${wordIdx}-${word}`} 
                word={word} 
                typedWord={typedWord} 
                isActive={isActive} 
                activeCharRef={activeCharRef}
              />
            );
          })}
        </div>
      </div>

      {(status as string) !== 'finished' && <Caret top={caretPos.top} left={caretPos.left} />}
    </div>
  );
};