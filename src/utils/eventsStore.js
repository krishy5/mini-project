const EVENTS_KEY = 'campus_events';
const REMOVED_KEY = 'removed_events';

export const getEvents = () => {
  const stored = localStorage.getItem(EVENTS_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const saveEvents = (events) => {
  localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
};

export const getRemovedEvents = () => {
  const stored = localStorage.getItem(REMOVED_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const saveRemovedEvents = (removed) => {
  localStorage.setItem(REMOVED_KEY, JSON.stringify(removed));
};
