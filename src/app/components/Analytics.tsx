"use client";

import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const Analytics = ({ history, onReset }: { history: any[], onReset: () => void }) => {
  if (history.length === 0) {
    return (
      <div 
        className="text-center text-muted mt-12 font-mono flex flex-col items-center justify-center h-64 border border-dashed border-muted/30 rounded-2xl animate-in fade-in zoom-in-95 duration-300"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-4 opacity-20"><path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.48 12H2"/></svg>
        <p>No data yet. Complete a test to see your analytics.</p>
      </div>
    );
  }

  const data = history.map((h, i) => ({
    name: `T${i + 1}`,
    wpm: h.wpm,
    accuracy: h.accuracy,
    mode: h.mode,
    date: h.date
  }));

  const bestWpm = Math.max(...history.map(h => h.wpm));
  const avgWpm = Math.round(history.reduce((acc, h) => acc + h.wpm, 0) / history.length);
  const avgAcc = Math.round(history.reduce((acc, h) => acc + h.accuracy, 0) / history.length);

  return (
    <div className="w-full max-w-5xl mx-auto mt-8">
      <div className="flex justify-between items-end mb-6 animate-in fade-in duration-300">
        <h2 className="text-2xl font-bold text-text font-mono">Your Performance</h2>
        <div className="flex gap-3">
          <button 
            onClick={onReset}
            className="flex items-center gap-2 px-4 py-2 bg-error/10 text-error hover:bg-error/20 rounded-lg transition-colors font-mono text-sm font-medium"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
            Reset Data
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div 
          className="bg-muted/5 border border-muted/10 rounded-2xl p-6 flex items-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100 fill-mode-both"
        >
          <div className="p-4 bg-primary/10 rounded-xl text-primary">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
          </div>
          <div>
            <div className="text-sm text-muted font-mono mb-1">Highest WPM</div>
            <div className="text-3xl font-bold text-text">{bestWpm}</div>
          </div>
        </div>
        
        <div 
          className="bg-muted/5 border border-muted/10 rounded-2xl p-6 flex items-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200 fill-mode-both"
        >
          <div className="p-4 bg-secondary/10 rounded-xl text-secondary">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.48 12H2"/></svg>
          </div>
          <div>
            <div className="text-sm text-muted font-mono mb-1">Average WPM</div>
            <div className="text-3xl font-bold text-text">{avgWpm}</div>
          </div>
        </div>

        <div 
          className="bg-muted/5 border border-muted/10 rounded-2xl p-6 flex items-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300 fill-mode-both"
        >
          <div className="p-4 bg-primary/10 rounded-xl text-primary">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
          </div>
          <div>
            <div className="text-sm text-muted font-mono mb-1">Average Accuracy</div>
            <div className="text-3xl font-bold text-text">{avgAcc}%</div>
          </div>
        </div>
      </div>

      <div 
        className="h-[350px] bg-muted/5 border border-muted/10 rounded-2xl p-6 pt-8 flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500 delay-400 fill-mode-both"
      >
        <div className="text-sm text-muted font-mono mb-4">WPM History</div>
        <div className="flex-1 w-full h-full min-h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorWpm" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-muted/20" vertical={false} />
              <XAxis dataKey="name" stroke="currentColor" className="text-muted text-xs font-mono" tickLine={false} axisLine={false} />
              <YAxis stroke="currentColor" className="text-muted text-xs font-mono" tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'var(--bg)', borderColor: 'var(--muted)', borderRadius: '8px', fontFamily: 'monospace' }}
                itemStyle={{ color: 'var(--primary)' }}
              />
              <Area type="monotone" dataKey="wpm" stroke="var(--primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorWpm)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
