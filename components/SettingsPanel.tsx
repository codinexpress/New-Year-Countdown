
import React, { useState } from 'react';
import { AppSettings, ParticleShape } from '../types';

interface SettingsPanelProps {
  settings: AppSettings;
  setSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
  onLaunchTest: () => void;
  onMidnightTest: () => void;
}

const THEMES = [
  { name: 'Radiant', icon: 'flare', colors: ['#FF1461', '#18FF92', '#5A87FF', '#FBF38C', '#E91E63', '#9C27B0', '#00BCD4'] },
  { name: 'Midas', icon: 'coins', colors: ['#FFD700', '#C0C0C0', '#B8860B', '#FFFFFF', '#FF8C00'] },
  { name: 'Cyber', icon: 'microchip', colors: ['#39FF14', '#FF00FF', '#00FFFF', '#FFFF00', '#FF0000'] },
  { name: 'Frozen', icon: 'snowflake', colors: ['#E0FFFF', '#AFEEEE', '#ADD8E6', '#B0C4DE', '#FFFFFF'] }
];

interface SidebarTabProps {
  id: 'visuals' | 'physics' | 'content';
  activeTab: string;
  icon: string;
  label: string;
  onClick: (id: 'visuals' | 'physics' | 'content') => void;
}

const SidebarTab: React.FC<SidebarTabProps> = ({ id, activeTab, icon, label, onClick }) => {
  const isActive = activeTab === id;
  return (
    <button 
      onClick={() => onClick(id)}
      className={`w-full flex flex-col items-center justify-center py-8 gap-3 transition-all relative border-b border-white/5 group ${
        isActive 
          ? 'text-indigo-400 bg-white/10' 
          : 'text-gray-500 hover:text-gray-200 hover:bg-white/5'
      }`}
    >
      <i className={`fas fa-${icon} text-lg transition-transform group-hover:scale-110`}></i>
      <span className="text-[9px] uppercase tracking-widest font-black [writing-mode:vertical-lr] rotate-180">
        {label}
      </span>
      {isActive && (
        <div className="absolute right-0 top-0 h-full w-1 bg-indigo-500 shadow-[0_0_15px_#6366f1] z-20" />
      )}
      {isActive && (
        <div className="absolute left-0 top-0 h-full w-[2px] bg-indigo-500/50" />
      )}
    </button>
  );
};

const SettingsPanel: React.FC<SettingsPanelProps> = ({ settings, setSettings, onLaunchTest, onMidnightTest }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'visuals' | 'physics' | 'content'>('visuals');

  const updateSetting = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const applyTheme = (theme: typeof THEMES[0]) => {
    setSettings(prev => ({ ...prev, themeName: theme.name, fireworkColors: theme.colors }));
  };

  const handleTabClick = (id: 'visuals' | 'physics' | 'content') => {
    setActiveTab(id);
    setIsOpen(true);
  };

  return (
    <>
      {/* Dimmer Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] transition-opacity duration-500 cursor-pointer"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <div 
        className={`fixed top-0 right-0 h-full z-[110] flex transition-transform duration-500 ease-in-out pointer-events-auto ${
          isOpen ? 'translate-x-0' : 'translate-x-[calc(100%-64px)]'
        }`}
      >
        {/* Control Strip & Toggle */}
        <div className="w-16 h-full bg-slate-950/95 backdrop-blur-3xl border-l border-white/10 flex flex-col items-center pt-8 relative z-20 shadow-2xl">
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all mb-4 group ${
              isOpen 
                ? 'bg-indigo-600 text-white shadow-[0_0_20px_rgba(79,70,229,0.4)]' 
                : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
            }`}
            title={isOpen ? "Close Settings" : "Open Settings"}
          >
            <i className={`fas fa-${isOpen ? 'times' : 'sliders-h'} text-lg transition-transform group-hover:rotate-90`}></i>
          </button>
          
          <div className="flex-1 w-full flex flex-col">
            <SidebarTab id="visuals" activeTab={activeTab} icon="palette" label="Style" onClick={handleTabClick} />
            <SidebarTab id="physics" activeTab={activeTab} icon="wind" label="Physx" onClick={handleTabClick} />
            <SidebarTab id="content" activeTab={activeTab} icon="comment-dots" label="Text" onClick={handleTabClick} />
          </div>
        </div>

        {/* Sidebar Content Area */}
        <div className="w-80 h-full bg-slate-900/98 backdrop-blur-2xl border-l border-white/5 flex flex-col shadow-[-40px_0_80px_rgba(0,0,0,0.8)] relative z-10">
          {/* Header */}
          <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
            <div>
              <h3 className="text-[11px] uppercase tracking-[0.4em] font-black text-gray-200">Engine Config</h3>
              <p className="text-[9px] text-indigo-400 mt-1 uppercase font-bold tracking-widest">{activeTab} parameters</p>
            </div>
            <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse shadow-[0_0_12px_#6366f1]" />
          </div>

          {/* Scrolling Content */}
          <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
            {activeTab === 'visuals' && (
              <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-300">
                <section>
                  <label className="text-[10px] uppercase text-gray-500 font-black block mb-5 tracking-[0.2em]">Active Palette</label>
                  <div className="grid grid-cols-1 gap-4">
                    {THEMES.map(theme => (
                      <button
                        key={theme.name}
                        onClick={() => applyTheme(theme)}
                        className={`group flex items-center justify-between px-5 py-4 rounded-2xl border transition-all ${
                          settings.themeName === theme.name 
                          ? 'bg-indigo-500/20 border-indigo-500/50 text-white shadow-[inset_0_0_20px_rgba(99,102,241,0.1)]' 
                          : 'border-white/5 bg-white/[0.03] text-gray-400 hover:bg-white/10 hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <i className={`fas fa-${theme.icon} text-sm ${settings.themeName === theme.name ? 'text-indigo-400' : 'text-gray-600'}`}></i>
                          <span className="text-[12px] font-bold tracking-wide">{theme.name}</span>
                        </div>
                        <div className="flex -space-x-1.5">
                          {theme.colors.slice(0, 4).map((c, i) => (
                            <div key={i} className="w-4 h-4 rounded-full border-2 border-slate-900 shadow-sm" style={{ backgroundColor: c }} />
                          ))}
                        </div>
                      </button>
                    ))}
                  </div>
                </section>

                <section>
                  <label className="text-[10px] uppercase text-gray-500 font-black block mb-5 tracking-[0.2em]">Particle Geometry</label>
                  <div className="grid grid-cols-3 gap-3">
                    {(['circle', 'star', 'square'] as ParticleShape[]).map(shape => (
                      <button 
                        key={shape}
                        onClick={() => updateSetting('particleShape', shape)}
                        className={`flex flex-col items-center gap-3 py-5 rounded-2xl border transition-all ${
                          settings.particleShape === shape 
                          ? 'bg-indigo-500/20 border-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.2)]' 
                          : 'border-white/5 bg-white/[0.03] text-gray-500 hover:bg-white/10'
                        }`}
                      >
                        <i className={`fas fa-${shape === 'square' ? 'stop' : shape === 'star' ? 'star' : 'circle'} text-base`}></i>
                        <span className="text-[9px] uppercase font-black tracking-widest">{shape}</span>
                      </button>
                    ))}
                  </div>
                </section>

                <section className="bg-white/[0.02] p-6 rounded-3xl border border-white/5 shadow-inner">
                  <div className="flex justify-between items-center mb-4">
                    <label className="text-[10px] uppercase text-gray-500 font-black tracking-widest">Trace Persistence</label>
                    <span className="text-[11px] text-indigo-400 font-mono font-bold">{Math.round(settings.trailLength * 100)}%</span>
                  </div>
                  <input 
                    type="range" min="0.01" max="0.5" step="0.01"
                    value={settings.trailLength}
                    onChange={(e) => updateSetting('trailLength', parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                  />
                </section>
              </div>
            )}

            {activeTab === 'physics' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                <section className="space-y-5">
                  {[
                    { label: 'G-Force (Gravity)', key: 'gravity', min: 0, max: 0.2, step: 0.005, unit: 'G' },
                    { label: 'Explosion Magnitude', key: 'explosionPower', min: 2, max: 15, step: 1, unit: 'kN' },
                    { label: 'Particle Density', key: 'particleDensity', min: 30, max: 400, step: 10, unit: 'px' },
                  ].map(item => (
                    <div key={item.key} className="bg-white/[0.02] p-6 rounded-3xl border border-white/5">
                      <div className="flex justify-between items-center mb-4">
                        <label className="text-[10px] uppercase text-gray-500 font-black tracking-widest">{item.label}</label>
                        <span className="text-[11px] text-indigo-400 font-mono font-bold">{(settings as any)[item.key]} {item.unit}</span>
                      </div>
                      <input 
                        type="range" min={item.min} max={item.max} step={item.step}
                        value={(settings as any)[item.key]}
                        onChange={(e) => updateSetting(item.key as any, parseFloat(e.target.value))}
                        className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                      />
                    </div>
                  ))}
                </section>
              </div>
            )}

            {activeTab === 'content' && (
              <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-300">
                <section>
                  <label className="text-[10px] uppercase text-gray-500 font-black block mb-5 tracking-widest">Message Override</label>
                  <textarea 
                    value={settings.userMessage}
                    onChange={(e) => updateSetting('userMessage', e.target.value)}
                    placeholder="Enter a custom New Year message or resolution..."
                    className="w-full bg-black/50 border border-white/10 rounded-3xl p-6 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/50 transition-all resize-none h-56 leading-relaxed shadow-inner font-light"
                  />
                </section>
                
                <section className="bg-white/[0.02] p-6 rounded-3xl border border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-5">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${settings.soundEnabled ? 'text-indigo-400 bg-indigo-500/10 shadow-[0_0_15px_rgba(99,102,241,0.1)]' : 'text-gray-500 bg-white/5'}`}>
                      <i className={`fas fa-volume-${settings.soundEnabled ? 'up' : 'mute'} text-base`}></i>
                    </div>
                    <div>
                      <span className="text-xs font-black text-gray-200 block uppercase tracking-wider">Atmospheric FX</span>
                      <span className="text-[10px] text-gray-500 uppercase font-bold tracking-tight">Audio Synthesis</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => updateSetting('soundEnabled', !settings.soundEnabled)}
                    className={`w-14 h-7 rounded-full transition-all relative ${settings.soundEnabled ? 'bg-indigo-600' : 'bg-gray-700'}`}
                  >
                    <div className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform shadow-md ${settings.soundEnabled ? 'translate-x-7' : 'translate-x-0'}`} />
                  </button>
                </section>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="p-8 border-t border-white/10 bg-black/30 space-y-4">
            <button 
              onClick={onLaunchTest}
              className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-[12px] font-black tracking-[0.3em] transition-all shadow-[0_15px_35px_rgba(79,70,229,0.3)] hover:shadow-[0_20px_45px_rgba(79,70,229,0.5)] active:scale-[0.98] flex items-center justify-center gap-4 uppercase"
            >
              <i className="fas fa-rocket text-xs"></i> Manual Fire
            </button>
            <button 
              onClick={onMidnightTest}
              className="w-full py-4 bg-white/[0.03] hover:bg-white/[0.08] text-white/50 hover:text-white border border-white/5 rounded-2xl text-[11px] font-black tracking-[0.2em] transition-all flex items-center justify-center gap-3 uppercase"
            >
              <i className="fas fa-magic text-[10px]"></i> Simulate Midnight
            </button>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.08);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.15);
        }
        @keyframes slideInRight {
          from { transform: translateX(30px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .slide-in-from-right-4 {
          animation: slideInRight 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}} />
    </>
  );
};

export default SettingsPanel;
