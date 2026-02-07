'use client';

import React, { useState, useEffect } from 'react';
import { formatCountdown } from '../../utils/date';

const CampaignCountdown = ({ endDate }) => {
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    if (!endDate) return;

    const timer = setInterval(() => {
      const remaining = formatCountdown(endDate);
      if (remaining.total <= 0) {
        clearInterval(timer);
        setTimeLeft(null);
      } else {
        setTimeLeft(remaining);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [endDate]);

  if (!timeLeft) return null;

  const TimeUnit = ({ value, label }) => (
    <div className="flex flex-col items-center px-4">
      <span className="text-2xl md:text-3xl font-bold">{String(value).padStart(2, '0')}</span>
      <span className="text-[10px] uppercase tracking-widest text-white/70">{label}</span>
    </div>
  );

  return (
    <div className="bg-black text-white py-4 flex justify-center divide-x divide-white/20">
      <TimeUnit value={timeLeft.days} label="Days" />
      <TimeUnit value={timeLeft.hours} label="Hrs" />
      <TimeUnit value={timeLeft.minutes} label="Min" />
      <TimeUnit value={timeLeft.seconds} label="Sec" />
    </div>
  );
};

export default CampaignCountdown;
