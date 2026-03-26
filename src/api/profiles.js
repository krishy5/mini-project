import API_BASE from './config';
import { getToken } from './auth';

const h = () => ({ 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` });

// ── Student Profile ──────────────────────────────────────────────
export const getStudentProfile = async (student_id) => {
  const res = await fetch(`${API_BASE}/students/${student_id}`, { headers: h() });
  if (res.status === 404) return null;
  return res.json();
};

export const saveStudentProfile = async (student_id, data) => {
  const res = await fetch(`${API_BASE}/students/${student_id}`, {
    method: 'PUT', headers: h(), body: JSON.stringify(data)
  });
  return res.json();
};

export const saveSkills = async (student_id, skills) => {
  const res = await fetch(`${API_BASE}/students/${student_id}/skills`, {
    method: 'PUT', headers: h(), body: JSON.stringify({ skills })
  });
  return res.json();
};

export const saveExperiences = async (student_id, experiences) => {
  const res = await fetch(`${API_BASE}/students/${student_id}/experiences`, {
    method: 'PUT', headers: h(), body: JSON.stringify({ experiences })
  });
  return res.json();
};

export const saveCertificates = async (student_id, certificates) => {
  const res = await fetch(`${API_BASE}/students/${student_id}/certificates`, {
    method: 'PUT', headers: h(), body: JSON.stringify({ certificates })
  });
  return res.json();
};

export const saveMarksheets = async (student_id, marksheets) => {
  const res = await fetch(`${API_BASE}/students/${student_id}/marksheets`, {
    method: 'PUT', headers: h(), body: JSON.stringify({ marksheets })
  });
  return res.json();
};

export const registerForEvent = async (student_id, event_id) => {
  const res = await fetch(`${API_BASE}/students/${student_id}/events/${event_id}`, {
    method: 'POST', headers: h()
  });
  return res.json();
};

export const joinClubDB = async (student_id, club_id) => {
  const res = await fetch(`${API_BASE}/students/${student_id}/clubs/${club_id}`, {
    method: 'POST', headers: h()
  });
  return res.json();
};

export const applyForJobDB = async (student_id, job_id) => {
  const res = await fetch(`${API_BASE}/students/${student_id}/jobs/${job_id}`, {
    method: 'POST', headers: h()
  });
  return res.json();
};

export const getAllStudents = async () => {
  const res = await fetch(`${API_BASE}/students`, { headers: h() });
  return res.json();
};

// ── Teacher Profile ──────────────────────────────────────────────
export const getTeacherProfile = async (teacher_id) => {
  const res = await fetch(`${API_BASE}/teachers/${teacher_id}`, { headers: h() });
  if (res.status === 404) return null;
  return res.json();
};

export const saveTeacherProfile = async (teacher_id, data) => {
  const res = await fetch(`${API_BASE}/teachers/${teacher_id}`, {
    method: 'PUT', headers: h(), body: JSON.stringify(data)
  });
  return res.json();
};

// ── Recruiter Profile ────────────────────────────────────────────
export const getRecruiterProfile = async (recruiter_id) => {
  const res = await fetch(`${API_BASE}/recruiter/profile/${recruiter_id}`, { headers: h() });
  if (res.status === 404) return null;
  return res.json();
};

export const saveRecruiterProfile = async (recruiter_id, data) => {
  const res = await fetch(`${API_BASE}/recruiter/profile/${recruiter_id}`, {
    method: 'PUT', headers: h(), body: JSON.stringify(data)
  });
  return res.json();
};
