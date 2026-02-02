import React, { useState, useEffect, useMemo } from 'react';
import { WeatherStore, WeatherType, DayRecord } from '../types';
import { MONTHS_RU, WEATHER_ICONS } from '../constants';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { GoogleGenAI } from "@google/genai";

interface MonthlyReportProps {
  records: WeatherStore;
  onBack: () => void;
}

const MonthlyReport: React.FC<MonthlyReportProps> = ({ records, onBack }) => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  const monthRecords = useMemo(() => {
    const year = 2026;
    const list: DayRecord[] = [];
    for (const [dateStr, entries] of Object.entries(records)) {
      const d = new Date(dateStr);
      if (d.getFullYear() !== year || d.getMonth() !== selectedMonth) continue;
      if (entries.morning) list.push(entries.morning);
      if (entries.evening) list.push(entries.evening);
    }
    return list;
  }, [records, selectedMonth]);

  const stats = useMemo(() => {
    if (monthRecords.length === 0) return null;
    
    const temps = monthRecords.map(r => r.temperature);
    const avgTemp = Math.round(temps.reduce((a, b) => a + b, 0) / temps.length);
    
    const weatherCounts: Record<WeatherType, number> = { sun: 0, cloud: 0, rain: 0, snow: 0 };
    monthRecords.forEach(r => weatherCounts[r.weather]++);
    
    const mostCommonWeather = (Object.keys(weatherCounts) as WeatherType[]).reduce((a, b) => 
      weatherCounts[a] > weatherCounts[b] ? a : b
    );

    return { avgTemp, weatherCounts, mostCommonWeather };
  }, [monthRecords]);

  const chartData = useMemo(() => {
    const byDay: Record<number, number[]> = {};
    monthRecords.forEach(r => {
      const day = new Date(r.date).getDate();
      if (!byDay[day]) byDay[day] = [];
      byDay[day].push(r.temperature);
    });
    return Object.entries(byDay)
      .map(([day, temps]) => ({
        day: Number(day),
        temp: Math.round(temps.reduce((a, b) => a + b, 0) / temps.length),
      }))
      .sort((a, b) => a.day - b.day);
  }, [monthRecords]);

  useEffect(() => {
    if (monthRecords.length > 5) {
      const fetchAiInsight = async () => {
        setLoadingAi(true);
        try {
          const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
          const weatherSummary = monthRecords.map(r => `${r.date}: ${r.temperature}°C, ${WEATHER_ICONS[r.weather].label}`).join(', ');
          const prompt = `Ты - Веселый Мишка-Метеоролог. Расскажи 5-летнему ребенку о погоде в ${MONTHS_RU[selectedMonth]} 2026 года на основе этих данных: ${weatherSummary}. 
          Твой ответ должен быть коротким (2-3 предложения), добрым и вдохновляющим. Используй смайлики. Ответь на русском языке.`;
          
          const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
          });
          setAiInsight(response.text || "У тебя был отличный месяц наблюдений!");
        } catch (error) {
          console.error("AI Error:", error);
          setAiInsight("Твой дневник выглядит замечательно! Продолжай в том же духе! 🌟");
        } finally {
          setLoadingAi(false);
        }
      };
      fetchAiInsight();
    } else {
      setAiInsight(null);
    }
  }, [selectedMonth, monthRecords.length]);

  return (
    <div className="flex flex-col space-y-8 animate-in slide-in-from-bottom duration-500">
      <div className="flex justify-between items-center">
        <button onClick={onBack} className="text-5xl bouncy bg-gray-100 p-4 rounded-full">🏠</button>
        <div className="flex items-center gap-4">
          <select 
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className="text-2xl font-bold bg-sky-50 text-sky-700 border-none outline-none p-4 rounded-3xl"
          >
            {MONTHS_RU.map((m, i) => <option key={i} value={i}>{m}</option>)}
          </select>
          <span className="text-2xl font-bold text-sky-400">2026</span>
        </div>
        <div className="w-16"></div>
      </div>

      {!stats ? (
        <div className="text-center py-20">
          <span className="text-8xl mb-6 block">📝</span>
          <h3 className="text-4xl font-bold text-slate-400">Мало данных для отчета...</h3>
          <p className="text-xl text-slate-300 mt-2">Заполни хотя бы один день в этом месяце!</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-8">
          {/* Main Stats */}
          <div className="bg-sky-50 rounded-[3rem] p-8 space-y-8">
            <h3 className="text-3xl font-bold text-sky-600 text-center">Главное за месяц</h3>
            
            <div className="flex justify-around items-center">
              <div className="text-center">
                <p className="text-lg text-slate-500 font-bold mb-2">Средняя темп.</p>
                <div className={`text-6xl font-bold p-8 rounded-full border-8 border-white shadow-lg bg-white ${stats.avgTemp >= 0 ? 'text-orange-400' : 'text-blue-400'}`}>
                  {stats.avgTemp > 0 ? `+${stats.avgTemp}` : stats.avgTemp}°
                </div>
              </div>

              <div className="text-center">
                <p className="text-lg text-slate-500 font-bold mb-2">Чаще всего</p>
                <div className="bg-white p-8 rounded-[2rem] border-8 border-white shadow-lg text-6xl">
                  {WEATHER_ICONS[stats.mostCommonWeather].emoji}
                </div>
              </div>
            </div>

            {/* AI Insight Box */}
            <div className="bg-white rounded-[2rem] p-6 shadow-md relative mt-12 overflow-hidden min-h-[140px] flex items-center justify-center">
              {loadingAi ? (
                <div className="animate-pulse text-sky-400 text-xl font-bold italic">Мишка-Метеоролог думает... 🧸💭</div>
              ) : (
                <div className="flex gap-4 items-start">
                  <span className="text-5xl flex-shrink-0">🧸</span>
                  <p className="text-lg text-slate-700 font-bold leading-relaxed">{aiInsight || "Заполни больше дней, чтобы Мишка дал совет!"}</p>
                </div>
              )}
            </div>
          </div>

          {/* Graph */}
          <div className="bg-white rounded-[3rem] border-4 border-sky-100 p-8 shadow-sm">
            <h3 className="text-3xl font-bold text-sky-600 mb-6">График температур</h3>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 16, fill: '#bae6fd' }} />
                  <YAxis hide />
                  <Tooltip 
                    cursor={{fill: 'transparent'}}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white p-4 rounded-2xl shadow-xl border-4 border-sky-100">
                            <p className="text-2xl font-bold text-sky-600">{payload[0].value}°C</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="temp" radius={[15, 15, 15, 15]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.temp >= 0 ? '#fbbf24' : '#60a5fa'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-center text-slate-300 font-bold mt-4 italic">Как менялась погода в течение месяца</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MonthlyReport;
