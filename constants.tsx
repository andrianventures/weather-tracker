
import React from 'react';

export const MONTHS_RU = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
];

export const DAYS_FULL_RU = [
  'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'
];

export const WEATHER_ICONS = {
  sun: { emoji: '☀️', label: 'Солнце', color: 'bg-yellow-400' },
  cloud: { emoji: '☁️', label: 'Облака', color: 'bg-gray-400' },
  rain: { emoji: '🌧️', label: 'Дождь', color: 'bg-blue-500' },
  snow: { emoji: '❄️', label: 'Снег', color: 'bg-cyan-200' },
};

// Scale from -20 to +40
export const TEMP_RANGE = Array.from({ length: 61 }, (_, i) => i - 20);

// Morning / evening tabs (Russian)
export const TIME_OF_DAY = {
  morning: { label: 'Утро', icon: '🌅' },
  evening: { label: 'Вечер', icon: '🌙' },
} as const;
