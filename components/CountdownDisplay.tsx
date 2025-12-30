
import React from 'react';
import { TimeRemaining } from '../types';

interface CountdownDisplayProps {
  time: TimeRemaining;
}

const CountdownDisplay: React.FC<CountdownDisplayProps> = ({ time }) => {
  const Unit: React.FC<{ value: number; label: string }> = ({ value, label }) => (
    <div className="flex flex-col items-center mx-2 md:mx-4">
      <div className="text-4xl md:text-7xl font-bold font-mono tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-500">
        {value.toString().padStart(2, '0')}
      </div>
      <div className="text-[10px] md:text-sm uppercase tracking-widest text-gray-400 mt-2 font-light">
        {label}
      </div>
    </div>
  );

  return (
    <div className="flex items-center justify-center p-8 backdrop-blur-sm bg-black/20 rounded-3xl border border-white/5 shadow-2xl">
      <Unit value={time.days} label="Days" />
      <div className="text-4xl md:text-7xl text-white/20 pb-6">:</div>
      <Unit value={time.hours} label="Hours" />
      <div className="text-4xl md:text-7xl text-white/20 pb-6">:</div>
      <Unit value={time.minutes} label="Mins" />
      <div className="text-4xl md:text-7xl text-white/20 pb-6">:</div>
      <Unit value={time.seconds} label="Secs" />
    </div>
  );
};

export default CountdownDisplay;
