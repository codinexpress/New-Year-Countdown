import React from 'react';
import { TimeRemaining } from '../types';

interface CountdownDisplayProps {
  time: TimeRemaining;
}

const CountdownDisplay: React.FC<CountdownDisplayProps> = ({ time }) => {
  const Unit: React.FC<{ value: number; label: string }> = ({ value, label }) => (
    <div className="flex flex-col items-center mx-1 sm:mx-2 md:mx-4">
      <div className="text-3xl sm:text-4xl md:text-7xl font-bold font-mono tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-500">
        {value.toString().padStart(2, '0')}
      </div>
      <div className="text-[8px] sm:text-[10px] md:text-sm uppercase tracking-[0.1em] md:tracking-widest text-gray-400 mt-1 md:mt-2 font-light">
        {label}
      </div>
    </div>
  );

  return (
    <div className="flex items-center justify-center p-4 sm:p-6 md:p-8 backdrop-blur-md bg-black/30 rounded-2xl md:rounded-3xl border border-white/10 shadow-2xl">
      <Unit value={time.days} label="Days" />
      <div className="text-2xl sm:text-4xl md:text-7xl text-white/20 pb-4 md:pb-6 mx-1 md:mx-0">:</div>
      <Unit value={time.hours} label="Hours" />
      <div className="text-2xl sm:text-4xl md:text-7xl text-white/20 pb-4 md:pb-6 mx-1 md:mx-0">:</div>
      <Unit value={time.minutes} label="Mins" />
      <div className="text-2xl sm:text-4xl md:text-7xl text-white/20 pb-4 md:pb-6 mx-1 md:mx-0">:</div>
      <Unit value={time.seconds} label="Secs" />
    </div>
  );
};

export default CountdownDisplay;