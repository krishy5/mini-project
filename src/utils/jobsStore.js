const JOBS_KEY = 'campus_jobs';
const INTERNSHIPS_KEY = 'campus_internships';

export const getJobs = () => {
  const stored = localStorage.getItem(JOBS_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const saveJobs = (jobs) => {
  localStorage.setItem(JOBS_KEY, JSON.stringify(jobs));
  window.dispatchEvent(new Event('storage'));
};

export const getInternships = () => {
  const stored = localStorage.getItem(INTERNSHIPS_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const saveInternships = (internships) => {
  localStorage.setItem(INTERNSHIPS_KEY, JSON.stringify(internships));
  window.dispatchEvent(new Event('storage'));
};
