
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import FireworksCanvas from './components/FireworksCanvas.tsx';
import CountdownDisplay from './components/CountdownDisplay.tsx';
import SettingsPanel from './components/SettingsPanel.tsx';
import { AppSettings, TimeRemaining } from './types.ts';
import { generateFestiveMessage } from './services/geminiService.ts';

const App: React.FC = () => {
  const isMobile = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }, []);

  const DEFAULT_SETTINGS: AppSettings = {
    particleDensity: isMobile ? 80 : 160,
    explosionPower: isMobile ? 5 : 8,
    fireworkColors: ['#FF1461', '#18FF92', '#5A87FF', '#FBF38C', '#E91E63', '#9C27B0', '#00BCD4'],
    soundEnabled: true,
    autoLaunch: false,
    interactiveEnabled: true,
    targetYear: new Date().getFullYear() + 1,
    userMessage: "",
    gravity: 0.05,
    trailLength: isMobile ? 0.25 : 0.2,
    particleShape: 'circle',
    themeName: 'Radiant',
  };

  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [aiMessage, setAiMessage] = useState<string>("Initializing Celebration...");
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({
    days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: false
  });
  const [testTarget, setTestTarget] = useState<Date | null>(null);
  const launchTriggerRef = useRef<((x?: number, y?: number) => void) | null>(null);
  const hasTriggeredMidnight = useRef(false);

  const calculateTime = useCallback(() => {
    const now = new Date();
    const target = testTarget || new Date(settings.targetYear, 0, 1, 0, 0, 0);
    const diff = target.getTime() - now.getTime();

    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
    }

    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / 1000 / 60) % 60),
      seconds: Math.floor((diff / 1000) % 60),
      isExpired: false
    };
  }, [settings.targetYear, testTarget]);

  useEffect(() => {
    const timer = setInterval(() => {
      const newTime = calculateTime();
      
      if (newTime.isExpired && !hasTriggeredMidnight.current) {
        hasTriggeredMidnight.current = true;
        setSettings(s => ({ 
          ...s, 
          autoLaunch: true, 
          particleDensity: isMobile ? Math.max(s.particleDensity, 120) : Math.max(s.particleDensity, 250),
          explosionPower: isMobile ? Math.max(s.explosionPower, 8) : Math.max(s.explosionPower, 11)
        }));

        if (launchTriggerRef.current) {
          const burstInitial = isMobile ? 12 : 30;
          for (let i = 0; i < burstInitial; i++) {
            setTimeout(() => launchTriggerRef.current?.(), i * (isMobile ? 100 : 50));
          }
        }
      }
      
      if (!newTime.isExpired) {
        hasTriggeredMidnight.current = false;
      }
      
      setTimeRemaining(newTime);
    }, 100);

    return () => clearInterval(timer);
  }, [calculateTime, isMobile]);

  useEffect(() => {
    const fetchMessage = async () => {
      const msg = await generateFestiveMessage(settings.targetYear);
      setAiMessage(msg);
    };
    fetchMessage();
  }, [settings.targetYear]);

  const handleManualTrigger = () => {
    if (launchTriggerRef.current) {
      const burstCount = isMobile ? 4 : 10;
      for (let i = 0; i < burstCount; i++) {
        setTimeout(() => launchTriggerRef.current?.(), i * 150);
      }
    }
  };

  const handleMidnightTest = () => {
    hasTriggeredMidnight.current = false;
    setTestTarget(new Date(Date.now() + 5500));
  };

  const handleReset = () => {
    setTestTarget(null);
    hasTriggeredMidnight.current = false;
    setSettings(prev => ({ ...prev, autoLaunch: false }));
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center selection:bg-indigo-500/30 overflow-hidden bg-[#020617]">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-[-1] overflow-hidden pointer-events-none">
        {/* Deep Galaxy Base */}
        <div className="absolute inset-0 bg-[#020617]"></div>
        
        {/* Cheerful Animated Aura Gradients */}
        <div className="absolute -top-[20%] -left-[20%] w-[80%] h-[80%] bg-indigo-900/40 rounded-full blur-[120px] animate-pulse duration-[8000ms]"></div>
        <div className="absolute -bottom-[20%] -right-[20%] w-[80%] h-[80%] bg-rose-950/40 rounded-full blur-[120px] animate-pulse duration-[10000ms] delay-1000"></div>
        <div className="absolute top-[30%] left-[40%] w-[40%] h-[40%] bg-violet-900/20 rounded-full blur-[100px] animate-pulse duration-[12000ms]"></div>

        {/* Static Star Field Effect */}
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{
          backgroundImage: `radial-gradient(circle at 10% 10%, white 1px, transparent 0),
                            radial-gradient(circle at 50% 30%, white 1px, transparent 0),
                            radial-gradient(circle at 80% 60%, white 1px, transparent 0),
                            radial-gradient(circle at 20% 80%, white 1px, transparent 0),
                            radial-gradient(circle at 90% 20%, white 1.5px, transparent 0)`,
          backgroundSize: '200px 200px'
        }}></div>
      </div>

      <FireworksCanvas settings={settings} triggerRef={launchTriggerRef} />

      <div className="relative z-10 text-center px-4 w-full max-w-4xl flex flex-col items-center pointer-events-none">
        <h1 className="text-white/40 text-[8px] md:text-xs uppercase tracking-[0.4em] md:tracking-[0.8em] mb-4 md:mb-6 font-light animate-pulse">
          {timeRemaining.isExpired ? "The Galaxy Celebrates" : `Celestial Countdown to ${settings.targetYear}`}
        </h1>
        
        <div className="mb-8 md:mb-14 w-full flex justify-center pointer-events-auto">
          {timeRemaining.isExpired ? (
            <div className="flex flex-col items-center">
              <h2 className="animate-bounce text-4xl sm:text-6xl md:text-9xl font-black bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 via-pink-500 to-indigo-500 py-4 filter drop-shadow-[0_0_20px_rgba(255,255,255,0.3)] leading-tight">
                HAPPY {settings.targetYear}!
              </h2>
              {testTarget && (
                <button 
                  onClick={handleReset}
                  className="mt-6 text-[10px] uppercase tracking-widest text-white/40 hover:text-white transition-all border border-white/10 px-6 py-2 rounded-full bg-white/5 backdrop-blur-md hover:bg-white/10 hover:border-white/30 active:scale-95"
                >
                  Exit Preview
                </button>
              )}
            </div>
          ) : (
            <CountdownDisplay time={timeRemaining} />
          )}
        </div>

        <div className="w-full max-w-[95%] sm:max-w-xl md:max-w-2xl mx-auto backdrop-blur-3xl bg-white/5 p-5 md:p-8 rounded-2xl md:rounded-[2rem] border border-white/10 transition-all hover:bg-white/10 shadow-2xl relative overflow-hidden group pointer-events-auto">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent"></div>
          
          <p className="text-gray-100 text-sm md:text-xl italic font-light tracking-wide leading-relaxed">
            "{settings.userMessage || aiMessage}"
          </p>
          
          <div className="mt-4 md:mt-6 flex items-center justify-center gap-3 md:gap-4">
            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-indigo-500/20"></div>
            <span className="text-[8px] md:text-[9px] text-indigo-400 uppercase tracking-widest font-bold">
              {settings.userMessage ? 'Personal Reflection' : 'Cosmic Greeting'}
            </span>
            <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-indigo-500/20"></div>
          </div>
        </div>
        
        {!timeRemaining.isExpired && (
          <div className="mt-8 md:mt-10 text-white/20 text-[8px] md:text-[9px] uppercase tracking-[0.2em] md:tracking-[0.4em] font-medium">
            {testTarget ? "Previewing launch in 5 seconds..." : settings.interactiveEnabled ? "Tap anywhere to launch your own!" : "Launch sequence initiates at midnight"}
          </div>
        )}
      </div>

      <SettingsPanel 
        settings={settings} 
        setSettings={setSettings} 
        onLaunchTest={handleManualTrigger}
        onMidnightTest={handleMidnightTest}
      />

      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-indigo-950/20 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black to-transparent"></div>
      </div>
    </div>
  );
};

export default App;
