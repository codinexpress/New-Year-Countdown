
import React, { useState } from 'react';
import { AppSettings, ParticleShape } from '../types';

interface SettingsPanelProps {
  settings: AppSettings;
  setSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
  onLaunchTest: () => void;
}

const THEMES = [
  { name: 'Radiant', colors: ['#FF1461', '#18FF92', '#5A87FF', '#FBF38C', '#E91E63', '#9C27B0', '#00BCD4'] },
  { name: 'Midas', colors: ['#FFD700', '#C0C0C0', '#B8860B', '#FFFFFF', '#FF8C00'] },
  { name: 'Cyber', colors: ['#39FF14', '#FF00FF', '#00FFFF', '#FFFF00', '#FF0000'] },
  { name: 'Frozen', colors: ['#E0FFFF', '#AFEEEE', '#ADD8E6', '#B0C4DE', '#FFFFFF'] }
];

const SettingsPanel: React.FC<SettingsPanelProps> = ({ settings, setSettings, onLaunchTest }) => {
  const [activeTab, setActiveTab] = useState<'visuals' | 'physics' | 'content'>('visuals');

  const updateSetting = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const applyTheme = (theme: typeof THEMES[0]) => {
    setSettings(prev => ({ ...prev, themeName: theme.name, fireworkColors: theme.colors }));
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <div className="group relative">
        <div className="bg-slate-900/90 backdrop-blur-2xl border border-white/10 p-5 rounded-3xl shadow-2xl transition-all duration-300 transform scale-95 opacity-0 group-hover:scale-100 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto w-80 max-h-[80vh] overflow-y-auto custom-scrollbar">
          
          <div className="flex border-b border-white/5 mb-4 pb-1 gap-4">
            {(['visuals', 'physics', 'content'] as const).map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-[10px] uppercase tracking-widest font-bold pb-2 transition-all ${activeTab === tab ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-gray-500'}`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {activeTab === 'visuals' && (
              <>
                <div>
                  <label className="text-[10px] uppercase text-gray-500 block mb-3">Color Themes</label>
                  <div className="grid grid-cols-2 gap-2">
                    {THEMES.map(theme => (
                      <button
                        key={theme.name}
                        onClick={() => applyTheme(theme)}
                        className={`px-3 py-2 rounded-xl text-[10px] border transition-all ${settings.themeName === theme.name ? 'bg-white/10 border-white/30 text-white' : 'border-white/5 text-gray-500 hover:bg-white/5'}`}
                      >
                        {theme.name}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-[10px] uppercase text-gray-500 block mb-2">Particle Shape</label>
                  <div className="flex gap-4">
                    {(['circle', 'star', 'square'] as ParticleShape[]).map(shape => (
                      <button 
                        key={shape}
                        onClick={() => updateSetting('particleShape', shape)}
                        className={`p-2 rounded-lg border transition-all ${settings.particleShape === shape ? 'bg-indigo-500/20 border-indigo-500 text-white' : 'border-white/5 text-gray-500'}`}
                      >
                        <i className={`fas fa-${shape === 'square' ? 'stop' : shape === 'star' ? 'star' : 'circle'} text-xs`}></i>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-[10px] uppercase text-gray-500 block mb-1">Trail Length ({settings.trailLength.toFixed(2)})</label>
                  <input 
                    type="range" min="0.01" max="0.5" step="0.01"
                    value={settings.trailLength}
                    onChange={(e) => updateSetting('trailLength', parseFloat(e.target.value))}
                    className="w-full accent-indigo-500"
                  />
                </div>
              </>
            )}

            {activeTab === 'physics' && (
              <>
                <div>
                  <label className="text-[10px] uppercase text-gray-500 block mb-1">Gravity Intensity</label>
                  <input 
                    type="range" min="0" max="0.2" step="0.005"
                    value={settings.gravity}
                    onChange={(e) => updateSetting('gravity', parseFloat(e.target.value))}
                    className="w-full accent-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase text-gray-500 block mb-1">Explosion Power</label>
                  <input 
                    type="range" min="2" max="15" 
                    value={settings.explosionPower}
                    onChange={(e) => updateSetting('explosionPower', parseInt(e.target.value))}
                    className="w-full accent-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase text-gray-500 block mb-1">Particle Density</label>
                  <input 
                    type="range" min="30" max="300" 
                    value={settings.particleDensity}
                    onChange={(e) => updateSetting('particleDensity', parseInt(e.target.value))}
                    className="w-full accent-indigo-500"
                  />
                </div>
              </>
            )}

            {activeTab === 'content' && (
              <>
                <div>
                  <label className="text-[10px] uppercase text-gray-500 block mb-1">Personal Greeting</label>
                  <textarea 
                    value={settings.userMessage}
                    onChange={(e) => updateSetting('userMessage', e.target.value)}
                    placeholder="Type your resolution here..."
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500/50 resize-none h-20"
                  />
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-xs text-gray-400">Audio Feedback</span>
                  <button 
                    onClick={() => updateSetting('soundEnabled', !settings.soundEnabled)}
                    className={`w-9 h-5 rounded-full transition-colors relative ${settings.soundEnabled ? 'bg-indigo-600' : 'bg-gray-700'}`}
                  >
                    <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform ${settings.soundEnabled ? 'translate-x-4' : 'translate-x-0'}`} />
                  </button>
                </div>
              </>
            )}

            <button 
              onClick={onLaunchTest}
              className="w-full mt-2 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-[11px] font-bold transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
            >
              <i className="fas fa-bolt"></i> Burst Test
            </button>
          </div>
        </div>

        <button className="bg-white/10 hover:bg-indigo-500/20 backdrop-blur-xl border border-white/20 w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-2xl group-hover:rotate-90">
          <i className="fas fa-sliders text-white text-xl"></i>
        </button>
      </div>
    </div>
  );
};

export default SettingsPanel;
