const CLUBS_KEY = 'campus_clubs';

export const getClubs = () => {
  const stored = localStorage.getItem(CLUBS_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const saveClubs = (clubs) => {
  localStorage.setItem(CLUBS_KEY, JSON.stringify(clubs));
  window.dispatchEvent(new Event('storage'));
};
