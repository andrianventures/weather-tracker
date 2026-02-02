
import React, { useState, useEffect } from 'react';
import { AppMode, WeatherStore, WeatherType, TimeOfDay } from './types';
import Calendar from './components/Calendar';
import DayEntry from './components/DayEntry';
import MonthlyReport from './components/MonthlyReport';
import { loadRecords, saveRecords, loadLastViewedMonth, saveLastViewedMonth } from './services/storage';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.CALENDAR);
  const [showHelp, setShowHelp] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(2026, 0, 1));
  const [records, setRecords] = useState<WeatherStore>({});
  const [lastViewedMonth, setLastViewedMonth] = useState<number | null>(null);

  useEffect(() => {
    loadRecords().then(setRecords);
    loadLastViewedMonth().then(setLastViewedMonth);
  }, []);

  const handleDaySelect = (date: Date) => {
    setSelectedDate(date);
    setMode(AppMode.ENTRY);
  };

  const handleSaveEntry = (timeOfDay: TimeOfDay, temp: number, weather: WeatherType) => {
    const dateStr = selectedDate.toISOString().split('T')[0];
    const existing = records[dateStr] || {};
    const next: WeatherStore = {
      ...records,
      [dateStr]: {
        ...existing,
        [timeOfDay]: {
          date: dateStr,
          temperature: temp,
          weather: weather
        }
      }
    };
    setRecords(next);
    saveRecords(next).catch(() => {});
    const month = selectedDate.getMonth();
    setLastViewedMonth(month);
    saveLastViewedMonth(month).catch(() => {});
    setMode(AppMode.CALENDAR);
  };

  const handleMonthChange = (month: number) => {
    setLastViewedMonth(month);
    saveLastViewedMonth(month).catch(() => {});
  };

  return (
    <div className="min-h-screen w-full p-4 md:p-8 flex flex-col items-center bg-blue-100">
      <header className="mb-10 text-center w-full max-w-[1400px] flex flex-col items-center">
        <div className="flex items-center gap-6">
           <h1 className="text-5xl md:text-7xl font-black text-blue-800 drop-shadow-xl tracking-tighter uppercase italic">
            Дневник Погоды 2026
          </h1>
          <button 
            onClick={() => setShowHelp(!showHelp)}
            className="bg-blue-700 text-white w-14 h-14 rounded-full font-black text-3xl bouncy flex items-center justify-center shadow-2xl border-4 border-white"
          >
            ?
          </button>
        </div>
        <p className="text-2xl md:text-3xl text-blue-600 font-black mt-3 drop-shadow-sm">Твой супер-дневник наблюдений! 🌡️✨</p>
      </header>

      {showHelp && (
        <div className="fixed inset-0 bg-blue-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4" onClick={() => setShowHelp(false)}>
          <div className="bg-white rounded-[3rem] p-10 max-w-3xl w-full shadow-2xl space-y-8 border-[12px] border-blue-500" onClick={e => e.stopPropagation()}>
            <h2 className="text-4xl font-black text-blue-700 text-center">Привет, юный метеоролог! 🍦</h2>
            <div className="space-y-6 text-slate-800 font-bold text-xl">
              <div className="flex items-center gap-4 bg-blue-50 p-4 rounded-2xl">
                <span className="text-4xl">🗓️</span>
                <p>Нажми на любой день в календаре</p>
              </div>
              <div className="flex items-center gap-4 bg-blue-50 p-4 rounded-2xl">
                <span className="text-4xl">🌡️</span>
                <p>Выбери температуру — крути шкалу стрелочками!</p>
              </div>
              <div className="flex items-center gap-4 bg-blue-50 p-4 rounded-2xl">
                <span className="text-4xl">☀️</span>
                <p>Выбери погоду: солнце, тучки, дождь или снег</p>
              </div>
              <div className="flex items-center gap-4 bg-blue-50 p-4 rounded-2xl">
                <span className="text-4xl">🌟</span>
                <p>Нажми "Запомнить!", и всё сохранится!</p>
              </div>
            </div>
            
            <div className="bg-blue-100 p-6 rounded-3xl">
              <h3 className="text-2xl font-black text-blue-600 mb-3 uppercase">Как поставить на экран? 🖥️</h3>
              <p className="text-slate-700 font-bold italic">На компьютере: значок «Установить» в браузере или ярлык на рабочем столе. На планшете: кнопка «Поделиться» → «На экран» — и дневник будет как приложение!</p>
            </div>

            <button 
              onClick={() => setShowHelp(false)}
              className="w-full bg-blue-600 text-white py-6 rounded-3xl font-black text-3xl hover:bg-blue-700 transition-all shadow-xl bouncy border-b-8 border-blue-800"
            >
              ВПЕРЁД! 🚀
            </button>
          </div>
        </div>
      )}

      <main className="w-full max-w-[1400px] bg-white rounded-[4rem] shadow-2xl shadow-blue-400/30 p-8 md:p-12 relative overflow-hidden border-8 border-white">
        {mode === AppMode.CALENDAR && (
          <Calendar 
            records={records} 
            initialMonth={lastViewedMonth}
            onDaySelect={handleDaySelect} 
            onMonthChange={handleMonthChange}
            onShowReport={() => setMode(AppMode.REPORT)}
          />
        )}

        {mode === AppMode.ENTRY && (
          <DayEntry 
            date={selectedDate} 
            existingEntries={records[selectedDate.toISOString().split('T')[0]] || {}}
            onSave={handleSaveEntry} 
            onCancel={() => setMode(AppMode.CALENDAR)} 
          />
        )}

        {mode === AppMode.REPORT && (
          <MonthlyReport 
            records={records} 
            onBack={() => setMode(AppMode.CALENDAR)} 
          />
        )}
      </main>

      <footer className="mt-10 text-blue-400 font-black text-lg uppercase tracking-widest pb-10">
        🚀 Научная станция 2026 • Ведём наблюдения каждый день!
      </footer>
    </div>
  );
};

export default App;
