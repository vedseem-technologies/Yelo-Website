export const isCampaignExpired = (endDate) => {
  if (!endDate) return false;
  return new Date() > new Date(endDate);
};

export const formatCountdown = (endDate) => {
  const total = Date.parse(endDate) - Date.parse(new Date());
  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const days = Math.floor(total / (1000 * 60 * 60 * 24));

  return {
    total,
    days,
    hours,
    minutes,
    seconds,
  };
};
