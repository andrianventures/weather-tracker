
import React, { useState, useRef, useEffect } from 'react';
import { WeatherType, DayRecord } from '../types';
import { TEMP_RANGE, WEATHER_ICONS, MONTHS_RU, DAYS_FULL_RU } from '../constants';

interface DayEntryProps {
  date: Date;
  existingEntry?: DayRecord;
  onSave: (temp: number, weather: WeatherType) => void;
  onCancel: () => void;
}

const DayEntry: React.FC<DayEntryProps> = ({ date, existingEntry, onSave, onCancel }) => {
  const [temp, setTemp] = useState<number>(existingEntry?.temperature ?? 20);
  const [weather, setWeather] = useState<WeatherType>(existingEntry?.weather ?? 'sun');
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollIntervalRef = useRef<number | null>(null);

  const dayOfWeek = date.getDay() === 0 ? 6 : date.getDay() - 1;
  const dayName = DAYS_FULL_RU[dayOfWeek];
  const dateStr = `${date.getDate()} ${MONTHS_RU[date.getMonth()]}, ${dayName}`;

  // Center the selected temperature on load
  useEffect(() => {
    if (scrollRef.current) {
      const activeBtn = scrollRef.current.querySelector(`[data-temp="${temp}"]`);
      if (activeBtn) {
        activeBtn.scrollIntoView({ behavior: 'auto', inline: 'center', block: 'nearest' });
      }
    }
  }, []);

  const startScrolling = (direction: 'left' | 'right') => {
    if (scrollIntervalRef.current) return;
    scrollIntervalRef.current = window.setInterval(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollLeft += direction === 'left' ? -15 : 15;
      }
    }, 16);
  };

  const stopScrolling = () => {
    if (scrollIntervalRef.current) {
      clearInterval(scrollIntervalRef.current);
      scrollIntervalRef.current = null;
    }
  };

  return (
    <div className="flex flex-col h-full space-y-8 animate-in fade-in zoom-in duration-300">
      {/* Header */}
      <div className="flex justify-between items-center bg-white py-2">
        <button onClick={onCancel} className="text-5xl bouncy bg-blue-100 p-4 rounded-full hover:bg-blue-200 text-blue-700 shadow-md">🏠</button>
        <h2 className="text-3xl md:text-5xl font-black text-blue-800 text-center tracking-tight">{dateStr}</h2>
        <div className="w-16"></div>
      </div>

      {/* Temperature Scale Section */}
      <div className="space-y-6">
        <h3 className="text-2xl font-black text-center text-blue-600 uppercase tracking-widest">Градусы Цельсия 🌡️</h3>
        
        <div className="relative flex items-center group">
          {/* Left Arrow */}
          <button
            onMouseEnter={() => startScrolling('left')}
            onMouseLeave={stopScrolling}
            onClick={() => { if(scrollRef.current) scrollRef.current.scrollLeft -= 200 }}
            className="absolute left-0 z-20 bg-blue-600/90 text-white w-16 h-24 md:w-20 md:h-32 rounded-r-3xl flex items-center justify-center text-4xl shadow-xl hover:bg-blue-700 transition-colors bouncy"
          >
            ◀
          </button>

          {/* Scrollable Container */}
          <div 
            ref={scrollRef}
            className="flex overflow-x-auto scroll-smooth no-scrollbar py-6 px-20 gap-4 bg-blue-50/50 rounded-[3rem] border-y-4 border-blue-100 items-center w-full min-h-[160px]"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {TEMP_RANGE.map(t => (
              <button
                key={t}
                data-temp={t}
                onClick={() => setTemp(t)}
                className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center text-xl md:text-2xl font-black bouncy transition-all border-4 shadow-lg
                  ${temp === t 
                    ? 'bg-blue-600 text-white border-white scale-125 ring-4 ring-blue-300 z-10' 
                    : 'bg-white text-blue-500 border-blue-200 hover:border-blue-400 opacity-80'}`}
              >
                {t > 0 ? `+${t}` : t}
              </button>
            ))}
          </div>

          {/* Right Arrow */}
          <button
            onMouseEnter={() => startScrolling('right')}
            onMouseLeave={stopScrolling}
            onClick={() => { if(scrollRef.current) scrollRef.current.scrollLeft += 200 }}
            className="absolute right-0 z-20 bg-blue-600/90 text-white w-16 h-24 md:w-20 md:h-32 rounded-l-3xl flex items-center justify-center text-4xl shadow-xl hover:bg-blue-700 transition-colors bouncy"
          >
            ▶
          </button>
        </div>
        <p className="text-center text-blue-400 font-bold italic">Наведи на стрелочки, чтобы прокрутить шкалу!</p>
      </div>

      {/* Weather Selection Section */}
      <div className="space-y-6">
        <h3 className="text-2xl font-black text-center text-blue-600 uppercase tracking-widest">Что на небе? ☁️</h3>
        <div className="flex justify-center gap-6 px-4">
          {(Object.keys(WEATHER_ICONS) as WeatherType[]).map(type => (
            <button
              key={type}
              onClick={() => setWeather(type)}
              className={`flex flex-col items-center gap-4 p-6 md:p-10 rounded-[3rem] bouncy transition-all border-8 shadow-xl flex-1 max-w-[200px]
                ${weather === type 
                  ? `${WEATHER_ICONS[type].color} border-white scale-110 ring-8 ring-blue-100` 
                  : 'bg-white border-blue-50 opacity-60'}`}
            >
              <span className="text-6xl md:text-8xl">{WEATHER_ICONS[type].emoji}</span>
              <span className="text-xl font-black uppercase text-blue-900">{WEATHER_ICONS[type].label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-center pt-8 pb-10">
        <button
          onClick={() => onSave(temp, weather)}
          className="bg-blue-600 hover:bg-blue-700 text-white text-3xl md:text-5xl font-black py-10 px-24 rounded-full shadow-2xl shadow-blue-300 bouncy transform hover:scale-110 transition-all flex items-center gap-6 border-8 border-white"
        >
          <span>Запомнить!</span>
          <span className="text-6xl">🌟</span>
        </button>
      </div>
    </div>
  );
};

export default DayEntry;
