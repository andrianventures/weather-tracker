import React, { useState, useEffect, useMemo } from 'react';
import { MONTHS_RU, DAYS_FULL_RU, WEATHER_ICONS, TIME_OF_DAY } from '../constants';
import { WeatherStore, DayEntries } from '../types';

function getLastEntryMonth(records: WeatherStore): number {
  const dates = Object.keys(records);
  if (dates.length === 0) return 0;
  const sorted = [...dates].sort();
  return new Date(sorted[sorted.length - 1]).getMonth();
}

interface CalendarProps {
  records: WeatherStore;
  initialMonth: number | null;
  onDaySelect: (date: Date) => void;
  onMonthChange: (month: number) => void;
  onShowReport: () => void;
}

const Calendar: React.FC<CalendarProps> = ({ records, initialMonth, onDaySelect, onMonthChange, onShowReport }) => {
  const lastEntryMonth = useMemo(() => getLastEntryMonth(records), [records]);
  const [currentMonth, setCurrentMonth] = useState(() => initialMonth ?? lastEntryMonth);

  useEffect(() => {
    setCurrentMonth(initialMonth !== null ? initialMonth : lastEntryMonth);
  }, [initialMonth, lastEntryMonth]);

  const daysInMonth = new Date(2026, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(2026, currentMonth, 1).getDay();
  const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

  const goPrev = () => {
    const next = Math.max(0, currentMonth - 1);
    setCurrentMonth(next);
    onMonthChange(next);
  };
  const goNext = () => {
    const next = Math.min(11, currentMonth + 1);
    setCurrentMonth(next);
    onMonthChange(next);
  };

  const renderCells = () => {
    const cells = [];
    for (let i = 0; i < adjustedFirstDay; i++) {
      cells.push(<div key={`empty-${i}`} className="h-24 md:h-36"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(2026, currentMonth, day);
      const dateStr = date.toISOString().split('T')[0];
      const entries: DayEntries = records[dateStr] || {};
      const hasAny = entries.morning || entries.evening;
      const dayOfWeek = (adjustedFirstDay + day - 1) % 7;
      const isWeekend = dayOfWeek >= 5;

      cells.push(
        <button
          key={day}
          onClick={() => onDaySelect(date)}
          className={`h-24 md:h-36 border-4 border-transparent hover:border-blue-500 rounded-3xl flex flex-col items-center justify-center bouncy transition-all bg-blue-50/50 hover:bg-white shadow-md ${hasAny ? 'ring-4 ring-blue-400 bg-white' : ''}`}
        >
          <span className={`text-2xl font-black ${isWeekend ? 'text-red-600' : 'text-slate-800'}`}>{day}</span>
          <div className="flex flex-col items-center gap-0.5 mt-1">
            {entries.morning && (
              <div className="flex items-center gap-1 leading-tight">
                <span className="text-lg" title="Утро">{TIME_OF_DAY.morning.icon}</span>
                <span className="text-2xl md:text-3xl">{WEATHER_ICONS[entries.morning.weather].emoji}</span>
                <span className={`text-sm font-black ${entries.morning.temperature >= 0 ? 'text-orange-500' : 'text-blue-700'}`}>
                  {entries.morning.temperature > 0 ? `+${entries.morning.temperature}` : entries.morning.temperature}°
                </span>
              </div>
            )}
            {entries.evening && (
              <div className="flex items-center gap-1 leading-tight">
                <span className="text-lg" title="Вечер">{TIME_OF_DAY.evening.icon}</span>
                <span className="text-2xl md:text-3xl">{WEATHER_ICONS[entries.evening.weather].emoji}</span>
                <span className={`text-sm font-black ${entries.evening.temperature >= 0 ? 'text-orange-500' : 'text-blue-700'}`}>
                  {entries.evening.temperature > 0 ? `+${entries.evening.temperature}` : entries.evening.temperature}°
                </span>
              </div>
            )}
          </div>
        </button>
      );
    }
    return cells;
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between mb-8 px-4">
        <button 
          onClick={goPrev}
          disabled={currentMonth === 0}
          className="text-6xl bouncy disabled:opacity-20 bg-blue-200 text-blue-800 p-6 rounded-full hover:bg-blue-300 shadow-xl border-4 border-white"
        >
          ⬅️
        </button>
        <div className="text-center">
          <h2 className="text-4xl md:text-7xl font-black text-blue-700 uppercase tracking-tighter drop-shadow-sm">{MONTHS_RU[currentMonth]}</h2>
          <p className="text-3xl text-blue-400 font-black italic">2026 ГОД</p>
        </div>
        <button 
          onClick={goNext}
          disabled={currentMonth === 11}
          className="text-6xl bouncy disabled:opacity-20 bg-blue-200 text-blue-800 p-6 rounded-full hover:bg-blue-300 shadow-xl border-4 border-white"
        >
          ➡️
        </button>
      </div>

      <div className="grid grid-cols-7 gap-4">
        {DAYS_FULL_RU.map((day, i) => (
          <div
            key={day}
            className={`text-center text-xs md:text-sm font-black uppercase py-3 border-b-4 border-blue-200 tracking-widest ${i >= 5 ? 'text-red-600' : 'text-blue-600'}`}
          >
            {day}
          </div>
        ))}
        {renderCells()}
      </div>

      <div className="flex justify-center pt-10">
        <button
          onClick={onShowReport}
          className="bg-emerald-500 hover:bg-emerald-600 text-white text-3xl md:text-5xl font-black py-8 px-16 rounded-[3rem] shadow-2xl bouncy transform hover:scale-105 transition-all border-b-8 border-emerald-700"
        >
          📈 МОЙ ОТЧЁТ ЗА МЕСЯЦ!
        </button>
      </div>
    </div>
  );
};

export default Calendar;
