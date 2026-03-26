import './StudentDashboard.css';
import './StudentDashboard2.css';
import '../../theme.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getEvents, getRemovedEvents } from '../../utils/eventsStore';
import { getJobs, getInternships } from '../../utils/jobsStore';
import { getClubs, saveClubs } from '../../utils/clubsStore';
import MarksheetUpload from './MarksheetUpload';
import { getStudentProfile, saveStudentProfile, saveSkills, saveExperiences, saveCertificates, saveMarksheets, registerForEvent, joinClubDB, applyForJobDB } from '../../api/profiles';

function StudentDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const navigate = useNavigate();
  const [student, setStudent] = useState(() => {
    const stored = localStorage.getItem('currentStudent');
    return stored ? JSON.parse(stored) : { student_id: 'STU2024001', email: 'student@kdkce.edu.in', semester: '5' };
  });
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash && ['internships', 'events', 'clubs', 'profile'].includes(hash)) {
        setActiveTab(hash);
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const getPageTitle = () => {
    switch(activeTab) {
      case 'dashboard': return 'Dashboard';
      case 'internships': return 'Internships';
      case 'events': return 'Events';
      case 'clubs': return 'Clubs';
      case 'profile': return 'Profile';
      default: return 'Dashboard';
    }
  };

  const renderContent = () => {
    switch(activeTab) {
      case 'dashboard':
        return <DashboardContent />;
      case 'internships':
        return <InternshipsContent />;
      case 'events':
        return <EventsContent />;
      case 'clubs':
        return <ClubsContent />;
      case 'profile':
        return <ProfileContent />;
      default:
        return <DashboardContent />;
    }
  };

  return (
    <div className="dashboard-layout student-dashboard-layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3L1 9l11 6 9-4.91V17h2V9M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/>
            </svg>
          </div>
          <div>
            <h3>Smart Campus</h3>
            <p>Student Portal</p>
          </div>
        </div>
        
        <nav className="sidebar-nav">
          <button className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => setActiveTab('dashboard')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
            </svg> Dashboard
          </button>
          <button className={activeTab === 'internships' ? 'active' : ''} onClick={() => setActiveTab('internships')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
            </svg> Internships
          </button>
          <button className={activeTab === 'events' ? 'active' : ''} onClick={() => setActiveTab('events')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
            </svg> Events
          </button>
          <button className={activeTab === 'clubs' ? 'active' : ''} onClick={() => setActiveTab('clubs')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg> Clubs
          </button>
          <button className={activeTab === 'profile' ? 'active' : ''} onClick={() => setActiveTab('profile')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg> Profile
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="user-card">
            <div className="avatar">{student.student_id ? student.student_id[0].toUpperCase() : 'D'}</div>
            <div>
              <p className="user-name">{student.email?.split('@')[0] || 'Demo Student'}</p>
              <p className="user-id">{student.student_id || 'STU2024001'}</p>
            </div>
          </div>
          <button className="signout-btn" onClick={() => navigate('/')}>Sign Out</button>
        </div>
      </aside>

      <main className="main-content">
        <div className="top-header">
          <h2 className="section-title">{getPageTitle()}</h2>
          <div className="header-right">
            <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} style={{background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '8px', padding: '8px 12px', cursor: 'pointer', marginRight: '12px'}}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {theme === 'dark' ? (
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                ) : (
                  <>
                    <circle cx="12" cy="12" r="5"/>
                    <line x1="12" y1="1" x2="12" y2="3"/>
                    <line x1="12" y1="21" x2="12" y2="23"/>
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                    <line x1="1" y1="12" x2="3" y2="12"/>
                    <line x1="21" y1="12" x2="23" y2="12"/>
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                  </>
                )}
              </svg>
            </button>
            <div className="profile-btn">{student.student_id ? student.student_id[0].toUpperCase() : 'D'}</div>
          </div>
        </div>
        <div className="content-wrapper">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

function ProfileContent() {
  const student = JSON.parse(localStorage.getItem('currentStudent') || '{}');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showMarksheetModal, setShowMarksheetModal] = useState(false);
  const [showSkillsModal, setShowSkillsModal] = useState(false);
  const [showExpModal, setShowExpModal] = useState(false);
  const [showCertModal, setShowCertModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [marksheetStep, setMarksheetStep] = useState(1);
  
  const [profileData, setProfileData] = useState({
    name: student.email?.split('@')[0] || 'Demo Student',
    email: student.email || 'student@campus.edu',
    phone: student.phone || '9876543210',
    department: 'Computer Science',
    bio: 'Final year CSE student passionate about web development and AI/ML.',
    year: 3,
    semester: parseInt(student.semester) || 5,
    cgpa: 0,
    student_id: student.student_id || 'STU2024001'
  });
  
  const [formData, setFormData] = useState({...profileData});
  const [errors, setErrors] = useState({});
  const [resume, setResume] = useState(null);
  const [marksheets, setMarksheets] = useState({});
  const [marksheetFile, setMarksheetFile] = useState(null);
  
  const [skills, setSkills] = useState([]);
  
  const [newSkill, setNewSkill] = useState({name: '', percent: 50, color: '#3b82f6'});
  const [experiences, setExperiences] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [newExp, setNewExp] = useState({role: '', company: '', duration: '', type: 'Internship', desc: '', link: ''});
  const [newCert, setNewCert] = useState({name: '', issuer: '', year: '', link: ''});

  // Load profile from MongoDB on mount
  useEffect(() => {
    if (!student.student_id) return;
    getStudentProfile(student.student_id).then(data => {
      if (data) {
        setProfileData(prev => ({ ...prev, ...data }));
        setFormData(prev => ({ ...prev, ...data }));
        setSkills(data.skills || []);
        setExperiences(data.experiences || []);
        setCertificates(data.certificates || []);
        if (Array.isArray(data.marksheets)) {
          const ms = {};
          data.marksheets.forEach(m => { ms[m.semester] = m; });
          setMarksheets(ms);
        }
      }
    }).catch(() => {});
  }, [student.student_id]);

  const showToastMsg = (msg) => {
    setToastMsg(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };
  
  const handleAddSkill = () => {
    if (!newSkill.name) { showToastMsg('Please enter skill name'); return; }
    const updatedSkills = [...skills, {...newSkill}];
    setSkills(updatedSkills);
    saveSkills(student.student_id, updatedSkills).catch(() => {});
    setNewSkill({name: '', percent: 50, color: '#3b82f6'});
    showToastMsg('Skill added successfully');
  };

  const handleRemoveSkill = (index) => {
    const updatedSkills = skills.filter((_, i) => i !== index);
    setSkills(updatedSkills);
    saveSkills(student.student_id, updatedSkills).catch(() => {});
    showToastMsg('Skill removed');
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email';
    if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = 'Phone must be 10 digits';
    if (formData.cgpa < 0 || formData.cgpa > 10) newErrors.cgpa = 'CGPA must be 0-10';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSaveProfile = () => {
    if (validateForm()) {
      setProfileData({...formData});
      saveStudentProfile(student.student_id, {...formData, skills, experiences, certificates}).catch(() => {});
      setShowEditModal(false);
      showToastMsg('Profile updated successfully');
    }
  };
  
  const handleDownloadProfile = () => {
    showToastMsg('Generating PDF...');
    setTimeout(() => {
      const link = document.createElement('a');
      link.href = '#';
      link.download = 'DemoStudent_Profile.pdf';
      showToastMsg('Profile downloaded successfully');
    }, 1000);
  };
  
  const handleResumeUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        showToastMsg('Only PDF files allowed');
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        showToastMsg('File size must be less than 2MB');
        return;
      }
      setResume(file);
      showToastMsg('Resume uploaded successfully');
    }
  };
  
  const handleMarksheetUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        showToastMsg('Only PDF files allowed');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        showToastMsg('File size must be less than 5MB');
        return;
      }
      setMarksheetFile(file);
    }
  };
  
  const handleMarksheetSubmit = () => {
    if (!selectedSemester) {
      showToastMsg('Please select a semester');
      return;
    }
    if (!marksheetFile) {
      showToastMsg('Please upload a file');
      return;
    }
    if (marksheets[selectedSemester]) {
      if (!window.confirm(`You already uploaded marksheet for Semester ${selectedSemester}. Replace?`)) {
        return;
      }
    }
    setMarksheets({...marksheets, [selectedSemester]: marksheetFile});
    showToastMsg(`Marksheet uploaded for Semester ${selectedSemester}`);
    setShowMarksheetModal(false);
    setMarksheetStep(1);
    setSelectedSemester('');
    setMarksheetFile(null);
  };
  
  const handleAddExperience = () => {
    if (!newExp.role || !newExp.company || !newExp.duration) { showToastMsg('Please fill all required fields'); return; }
    const updatedExp = [...experiences, {...newExp, id: Date.now()}];
    setExperiences(updatedExp);
    saveExperiences(student.student_id, updatedExp).catch(() => {});
    setNewExp({role: '', company: '', duration: '', type: 'Internship', desc: '', link: ''});
    setShowExpModal(false);
    showToastMsg('Experience added successfully');
  };
  
  const handleAddCertificate = () => {
    if (!newCert.name || !newCert.issuer || !newCert.year) { showToastMsg('Please fill all required fields'); return; }
    const updatedCerts = [...certificates, {...newCert, id: Date.now()}];
    setCertificates(updatedCerts);
    saveCertificates(student.student_id, updatedCerts).catch(() => {});
    setNewCert({name: '', issuer: '', year: '', link: ''});
    setShowCertModal(false);
    showToastMsg('Certificate added successfully');
  };
  
  const handleRemoveCertificate = (id) => {
    const updated = certificates.filter(cert => cert.id !== id);
    setCertificates(updated);
    saveCertificates(student.student_id, updated).catch(() => {});
    showToastMsg('Certificate removed');
  };
  
  const handleRemoveExperience = (id) => {
    const updated = experiences.filter(exp => exp.id !== id);
    setExperiences(updated);
    saveExperiences(student.student_id, updated).catch(() => {});
    showToastMsg('Experience removed');
  };
  
  return (
    <div className="profile-content">
      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
                <h2>Personal Information</h2>
              </div>
              <button className="close-btn" onClick={() => setShowEditModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Demo Student" />
                {errors.name && <span className="error">{errors.name}</span>}
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} placeholder="+91 9876543210" />
                {errors.phone && <span className="error">{errors.phone}</span>}
              </div>
              <div className="form-group">
                <label>Address</label>
                <input type="text" placeholder="" />
              </div>
              <div className="form-group">
                <label>Bio</label>
                <textarea value={formData.bio} onChange={(e) => setFormData({...formData, bio: e.target.value})} rows="4" placeholder="Final year CSE student passionate about web development and AI/ML."></textarea>
              </div>
              <button className="save-changes-btn" onClick={handleSaveProfile}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>
                </svg>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="profile-header-card">
        <div className="profile-avatar-section">
          <div className="profile-avatar-large">{profileData.student_id ? profileData.student_id[0].toUpperCase() : 'D'}
          </div>
          <div className="profile-header-info">
            <h2>{profileData.name}</h2>
            <p>{profileData.department} · Semester {profileData.semester}</p>
            <span className="student-id-badge">Student ID: {profileData.student_id}</span>
          </div>
        </div>
        <div className="profile-actions">
          <button className="edit-profile-btn" onClick={handleDownloadProfile}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Download Profile
          </button>
          <button className="edit-profile-btn" onClick={() => {setFormData({...profileData}); setShowEditModal(true);}}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
            Edit Profile
          </button>
        </div>
      </div>

      <div className="profile-grid">
        <div className="profile-left">
          <div className="profile-section">
            <h3>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
              Personal Information
            </h3>
            <div className="info-grid">
              <div className="info-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                <div><label>Full Name</label><p>{profileData.name}</p></div>
              </div>
              <div className="info-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                <div><label>Email</label><p>{profileData.email}</p></div>
              </div>
              <div className="info-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                <div><label>Phone</label><p>+91 {profileData.phone}</p></div>
              </div>
              <div className="info-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                <div><label>Department</label><p>{profileData.department}</p></div>
              </div>
              <div className="info-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                <div><label>Student ID</label><p>{profileData.student_id}</p></div>
              </div>
            </div>
          </div>

          <div className="profile-section">
            <h3>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
              Experience
              <button className="add-btn" onClick={() => setShowExpModal(true)} style={{marginLeft: 'auto', padding: '4px 12px', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '6px', color: '#60a5fa', cursor: 'pointer', fontSize: '12px'}}>Edit</button>
            </h3>
            <div className="experience-list">
              {experiences.length === 0 ? (
                <p style={{color: 'rgba(255,255,255,0.5)', textAlign: 'center', padding: '20px'}}>No experience added yet. Click Edit to add.</p>
              ) : (
                experiences.map(exp => (
                  <div key={exp.id} className="experience-item">
                    <div className="exp-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg></div>
                    <div className="exp-details">
                      <h4>{exp.role}</h4>
                      <p>{exp.company}</p>
                      <div className="exp-meta"><span>{exp.duration}</span><span className={`exp-badge ${exp.type === 'Volunteer' ? 'volunteer' : ''}`}>{exp.type}</span></div>
                    </div>
                    <button onClick={() => handleRemoveExperience(exp.id)} style={{marginLeft: 'auto', padding: '6px 12px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '6px', color: '#f87171', cursor: 'pointer', fontSize: '12px'}}>Remove</button>
                  </div>
                ))
              )}
            </div>
          </div>

          {showExpModal && (
            <div className="modal-overlay" onClick={() => setShowExpModal(false)}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <h2>Edit Experience</h2>
                  <button className="close-btn" onClick={() => setShowExpModal(false)}>×</button>
                </div>
                <div className="modal-body">
                  <div className="form-group">
                    <label>Role *</label>
                    <input type="text" value={newExp.role} onChange={(e) => setNewExp({...newExp, role: e.target.value})} placeholder="Web Dev Intern" />
                  </div>
                  <div className="form-group">
                    <label>Company *</label>
                    <input type="text" value={newExp.company} onChange={(e) => setNewExp({...newExp, company: e.target.value})} placeholder="TechStartup Inc." />
                  </div>
                  <div className="form-group">
                    <label>Duration *</label>
                    <input type="text" value={newExp.duration} onChange={(e) => setNewExp({...newExp, duration: e.target.value})} placeholder="Jun-Aug 2024" />
                  </div>
                  <div className="form-group">
                    <label>Type *</label>
                    <select value={newExp.type} onChange={(e) => setNewExp({...newExp, type: e.target.value})} style={{width: '100%', padding: '14px 16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: 'white', fontSize: '16px', fontFamily: 'Inter, sans-serif'}}>
                      <option value="Internship">Internship</option>
                      <option value="Volunteer">Volunteer</option>
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea value={newExp.desc} onChange={(e) => setNewExp({...newExp, desc: e.target.value})} rows="3" placeholder="Brief description of your role..."></textarea>
                  </div>
                  <div className="form-group">
                    <label>Link</label>
                    <input type="url" value={newExp.link} onChange={(e) => setNewExp({...newExp, link: e.target.value})} placeholder="https://..." />
                  </div>
                  <button className="save-changes-btn" onClick={handleAddExperience}>Add Experience</button>
                </div>
              </div>
            </div>
          )}

          <div className="profile-section">
            <h3>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
              Certificates
              <button className="add-btn" onClick={() => setShowCertModal(true)} style={{marginLeft: 'auto', padding: '4px 12px', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '6px', color: '#60a5fa', cursor: 'pointer', fontSize: '12px'}}>Edit</button>
            </h3>
            <div className="certificates-list">
              {certificates.length === 0 ? (
                <p style={{color: 'rgba(255,255,255,0.5)', textAlign: 'center', padding: '20px'}}>No certificates added yet. Click Edit to add.</p>
              ) : (
                certificates.map(cert => (
                  <div key={cert.id} className="cert-item">
                    <div className="cert-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5M2 12l10 5 10-5"/></svg></div>
                    <div><h4>{cert.name}</h4><p>{cert.issuer} · {cert.year}</p></div>
                    <button onClick={() => handleRemoveCertificate(cert.id)} style={{marginLeft: 'auto', padding: '6px 12px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '6px', color: '#f87171', cursor: 'pointer', fontSize: '12px'}}>Remove</button>
                  </div>
                ))
              )}
            </div>
          </div>

          {showCertModal && (
            <div className="modal-overlay" onClick={() => setShowCertModal(false)}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <h2>Edit Certificates</h2>
                  <button className="close-btn" onClick={() => setShowCertModal(false)}>×</button>
                </div>
                <div className="modal-body">
                  <div className="form-group">
                    <label>Certificate Name *</label>
                    <input type="text" value={newCert.name} onChange={(e) => setNewCert({...newCert, name: e.target.value})} placeholder="AWS Cloud Practitioner" />
                  </div>
                  <div className="form-group">
                    <label>Provider *</label>
                    <input type="text" value={newCert.issuer} onChange={(e) => setNewCert({...newCert, issuer: e.target.value})} placeholder="Amazon Web Services" />
                  </div>
                  <div className="form-group">
                    <label>Year *</label>
                    <input type="text" value={newCert.year} onChange={(e) => setNewCert({...newCert, year: e.target.value})} placeholder="2024" />
                  </div>
                  <div className="form-group">
                    <label>Certificate Link</label>
                    <input type="url" value={newCert.link} onChange={(e) => setNewCert({...newCert, link: e.target.value})} placeholder="https://..." />
                  </div>
                  <button className="save-changes-btn" onClick={handleAddCertificate}>Add Certificate</button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="profile-right">
          <div className="profile-section">
            <h3>Academic Info</h3>
            {profileData.cgpa === 0 ? (
              <p style={{color: 'rgba(255,255,255,0.5)', textAlign: 'center', padding: '40px 20px'}}>No academic data yet. Update your profile.</p>
            ) : (
              <>
                <div className="cgpa-display">
                  <h2>{profileData.cgpa}</h2>
                  <p>CGPA / 10.0</p>
                  <div className="cgpa-bar"><div className="cgpa-fill" style={{width: `${(profileData.cgpa/10)*100}%`}}></div></div>
                </div>
                <div className="academic-details">
                  <div><span>Year {profileData.year}</span><label>Year</label></div>
                  <div><span>Sem {profileData.semester}</span><label>Semester</label></div>
                </div>
              </>
            )}
          </div>

          <div className="profile-section">
            <h3>
              Skills
              <button className="add-btn" onClick={() => setShowSkillsModal(true)} style={{marginLeft: 'auto', padding: '4px 12px', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '6px', color: '#60a5fa', cursor: 'pointer', fontSize: '12px'}}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{display: 'inline', marginRight: '4px'}}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                Edit
              </button>
            </h3>
            <div className="skills-list">
              {skills.length === 0 ? (
                <p style={{color: 'rgba(255,255,255,0.5)', textAlign: 'center', padding: '20px'}}>No skills added yet. Click Edit to add.</p>
              ) : (
                skills.map((skill, idx) => (
                  <div key={idx} className="skill-item">
                    <span>{skill.name}</span>
                    <div className="skill-bar"><div style={{width: `${skill.percent}%`, backgroundColor: skill.color}}></div></div>
                    <span>{skill.percent}%</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {showSkillsModal && (
            <div className="modal-overlay" onClick={() => setShowSkillsModal(false)}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <h2>Edit Skills</h2>
                  <button className="close-btn" onClick={() => setShowSkillsModal(false)}>×</button>
                </div>
                <div className="modal-body">
                  <div style={{marginBottom: '20px'}}>
                    <h3 style={{fontSize: '16px', marginBottom: '12px'}}>Current Skills</h3>
                    {skills.map((skill, idx) => (
                      <div key={idx} style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px'}}>
                        <span style={{flex: 1}}>{skill.name} - {skill.percent}%</span>
                        <button onClick={() => handleRemoveSkill(idx)} style={{padding: '6px 12px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '6px', color: '#f87171', cursor: 'pointer', fontSize: '12px'}}>Remove</button>
                      </div>
                    ))}
                  </div>
                  <h3 style={{fontSize: '16px', marginBottom: '12px'}}>Add New Skill</h3>
                  <div className="form-group">
                    <label>Skill Name *</label>
                    <input type="text" value={newSkill.name} onChange={(e) => setNewSkill({...newSkill, name: e.target.value})} placeholder="JavaScript" />
                  </div>
                  <div className="form-group">
                    <label>Proficiency Level: {newSkill.percent}%</label>
                    <input type="range" min="0" max="100" value={newSkill.percent} onChange={(e) => setNewSkill({...newSkill, percent: parseInt(e.target.value)})} style={{width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', cursor: 'pointer'}} />
                  </div>
                  <div className="form-group">
                    <label>Color</label>
                    <div style={{display: 'flex', gap: '8px'}}>
                      {['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4'].map(color => (
                        <button key={color} onClick={() => setNewSkill({...newSkill, color})} style={{width: '40px', height: '40px', background: color, border: newSkill.color === color ? '3px solid white' : 'none', borderRadius: '8px', cursor: 'pointer'}}></button>
                      ))}
                    </div>
                  </div>
                  <button className="save-changes-btn" onClick={handleAddSkill}>Add Skill</button>
                </div>
              </div>
            </div>
          )}

          <div className="profile-section">
            <h3>Documents</h3>
            <div className="documents-list">
              <label htmlFor="resume-upload" className="doc-btn" style={{cursor: 'pointer'}}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                {resume ? resume.name : 'Resume / CV'}
                <input id="resume-upload" type="file" accept=".pdf" onChange={handleResumeUpload} style={{display: 'none'}} />
              </label>
              <button className="doc-btn" onClick={() => showToastMsg('ID Card not generated yet')}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                ID Card
              </button>
              <button className="doc-btn" onClick={() => setShowMarksheetModal(true)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                Upload Marksheet
              </button>
            </div>
            {Object.keys(marksheets).length > 0 && (
              <div style={{marginTop: '20px'}}>
                <h4 style={{fontSize: '14px', marginBottom: '12px', color: 'rgba(255,255,255,0.8)'}}>Uploaded Marksheets</h4>
                <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
                  {[1,2,3,4,5,6,7,8].map(sem => (
                    <div key={sem} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', fontSize: '13px'}}>
                      <span>Semester {sem}</span>
                      {marksheets[sem] ? (
                        <div style={{display: 'flex', gap: '8px'}}>
                          <button style={{padding: '4px 12px', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '6px', color: '#60a5fa', cursor: 'pointer', fontSize: '11px'}}>View</button>
                          <button onClick={() => {setSelectedSemester(sem); setMarksheetStep(2); setShowMarksheetModal(true);}} style={{padding: '4px 12px', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '6px', color: '#fbbf24', cursor: 'pointer', fontSize: '11px'}}>Replace</button>
                        </div>
                      ) : (
                        <span style={{color: 'rgba(255,255,255,0.4)', fontSize: '11px'}}>Not Uploaded</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showMarksheetModal && (
        <div className="modal-overlay" onClick={() => setShowMarksheetModal(false)}>
          <div className="modal-content" style={{maxWidth: '900px'}} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Upload Marksheet</h2>
              <button className="close-btn" onClick={() => setShowMarksheetModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <MarksheetUpload onDataExtracted={(data) => {
                showToastMsg(`Semester ${data.semester} SGPA: ${data.sgpa} saved!`);
                setShowMarksheetModal(false);
              }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PaymentsContent() {
  const [filter, setFilter] = useState('Pending');
  const [showReceipt, setShowReceipt] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('upi');
  
  const payments = [
    { id: 1, title: 'Hostel Fee', semester: '2025-26 · Semester 5', amount: 25000, due: 'Due 15 Mar 2026', status: 'pending', transactionId: null },
    { id: 2, title: 'Library Fee', semester: '2025-26 · Semester 5', amount: 2000, due: 'Due 31 Mar 2026', status: 'pending', transactionId: null },
    { id: 3, title: 'Tuition Fee', semester: '2025-26 · Semester 5', amount: 45000, due: 'Paid 10 Jan 2026', status: 'paid', transactionId: 'TXN123456789', paidDate: '10 Jan 2026' },
    { id: 4, title: 'Lab Fee', semester: '2025-26 · Semester 5', amount: 8000, due: 'Paid 10 Jan 2026', status: 'paid', transactionId: 'TXN987654321', paidDate: '10 Jan 2026' },
    { id: 5, title: 'Sports Fee', semester: '2025-26 · Semester 5', amount: 1500, due: 'Paid 10 Jan 2026', status: 'paid', transactionId: 'TXN456789123', paidDate: '10 Jan 2026' }
  ];

  const totalPending = payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0);
  const totalPaid = payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);
  const pendingCount = payments.filter(p => p.status === 'pending').length;
  const paidCount = payments.filter(p => p.status === 'paid').length;
  
  const filtered = payments.filter(p => filter === 'Pending' ? p.status === 'pending' : p.status === 'paid');
  
  const handleViewReceipt = (payment) => {
    setSelectedPayment(payment);
    setShowReceipt(true);
  };
  
  const handlePayNow = (payment) => {
    setSelectedPayment(payment);
    setShowPaymentModal(true);
  };
  
  const handleProcessPayment = () => {
    alert('Payment processed successfully!');
    setShowPaymentModal(false);
  };
  
  const handleDownloadReceipt = () => {
    alert('Receipt downloaded successfully!');
  };

  return (
    <div className="payments-content">
      <div className="payments-header">
        <div>
          <h2>Fee Management</h2>
          <p>Track and manage your fee payments</p>
        </div>
      </div>
      <div className="payment-summary">
        <div className="summary-card pending">
          <div className="summary-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
              <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
          </div>
          <h3>₹{totalPending.toLocaleString()}</h3>
          <p>Total Pending</p>
        </div>
        <div className="summary-card paid">
          <div className="summary-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <h3>₹{totalPaid.toLocaleString()}</h3>
          <p>Total Paid</p>
        </div>
        <div className="summary-card dues">
          <div className="summary-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2">
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/>
            </svg>
          </div>
          <h3>{pendingCount}</h3>
          <p>Pending Dues</p>
        </div>
      </div>
      <div className="payment-filters">
        <button className={filter === 'Pending' ? 'active' : ''} onClick={() => setFilter('Pending')}>Pending ({pendingCount})</button>
        <button className={filter === 'Paid' ? 'active' : ''} onClick={() => setFilter('Paid')}>Paid ({paidCount})</button>
      </div>
      <div className="payments-list">
        {filtered.map(payment => (
          <div key={payment.id} className="payment-item">
            <div className="payment-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/>
              </svg>
            </div>
            <div className="payment-details">
              <h3>{payment.title}</h3>
              <p>{payment.semester}</p>
            </div>
            <div className="payment-amount">
              <h3>₹{payment.amount.toLocaleString()}</h3>
              <p className="payment-due">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                </svg>
                {payment.due}
              </p>
            </div>
            {payment.status === 'pending' ? (
              <button className="pay-now-btn" onClick={() => handlePayNow(payment)}>Pay Now</button>
            ) : (
              <button className="view-receipt-btn" onClick={() => handleViewReceipt(payment)}>View Receipt</button>
            )}
          </div>
        ))}
      </div>
      
      {showPaymentModal && selectedPayment && (
        <div className="modal-overlay" onClick={() => setShowPaymentModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Payment Gateway</h2>
              <button className="close-btn" onClick={() => setShowPaymentModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="payment-summary">
                <div className="payment-summary-header">
                  <div className="payment-icon-large">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/>
                    </svg>
                  </div>
                  <div>
                    <h3>{selectedPayment.title}</h3>
                    <p>{selectedPayment.semester}</p>
                  </div>
                </div>
                <div className="payment-amount-display">
                  <span>Total Amount</span>
                  <strong>₹{selectedPayment.amount.toLocaleString()}</strong>
                </div>
              </div>
              <div className="payment-methods">
                <h4>Payment Method</h4>
                <div className="payment-method-options">
                  <label className="payment-option selected">
                    <input type="radio" name="payment" value="upi" checked readOnly />
                    <div className="payment-option-content">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="#60a5fa">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                      </svg>
                      <span>UPI Payment</span>
                    </div>
                  </label>
                </div>
              </div>
              <div className="form-group">
                <label>Enter UPI ID</label>
                <input type="text" placeholder="yourname@paytm" />
              </div>
              <button className="save-changes-btn" onClick={handleProcessPayment}>Pay ₹{selectedPayment.amount.toLocaleString()}</button>
            </div>
          </div>
        </div>
      )}
      
      {showReceipt && selectedPayment && (
        <div className="modal-overlay" onClick={() => setShowReceipt(false)}>
          <div className="modal-content receipt-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Payment Receipt</h2>
              <button className="close-btn" onClick={() => setShowReceipt(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="receipt-content">
                <div className="receipt-header">
                  <h3>Smart Campus</h3>
                  <p>KDK College of Engineering</p>
                </div>
                <div className="receipt-divider"></div>
                <div className="receipt-details">
                  <div className="receipt-row">
                    <span>Student Name:</span>
                    <strong>Demo Student</strong>
                  </div>
                  <div className="receipt-row">
                    <span>Student ID:</span>
                    <strong>STU2024001</strong>
                  </div>
                  <div className="receipt-row">
                    <span>Payment Type:</span>
                    <strong>{selectedPayment.title}</strong>
                  </div>
                  <div className="receipt-row">
                    <span>Semester:</span>
                    <strong>{selectedPayment.semester}</strong>
                  </div>
                  <div className="receipt-row">
                    <span>Transaction ID:</span>
                    <strong>{selectedPayment.transactionId}</strong>
                  </div>
                  <div className="receipt-row">
                    <span>Payment Date:</span>
                    <strong>{selectedPayment.paidDate}</strong>
                  </div>
                  <div className="receipt-divider"></div>
                  <div className="receipt-row receipt-total">
                    <span>Amount Paid:</span>
                    <strong>₹{selectedPayment.amount.toLocaleString()}</strong>
                  </div>
                </div>
                <div className="receipt-footer">
                  <p>This is a computer-generated receipt</p>
                </div>
              </div>
              <button className="save-changes-btn" onClick={handleDownloadReceipt}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                Download Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ClubsContent() {
  const [filter, setFilter] = useState('All');
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [selectedClub, setSelectedClub] = useState(null);
  const [joinStep, setJoinStep] = useState('payment');
  const [joinedClubs, setJoinedClubs] = useState(() => {
    const student = JSON.parse(localStorage.getItem('currentStudent') || '{}');
    const saved = localStorage.getItem(`joinedClubs_${student.student_id}`);
    return saved ? JSON.parse(saved) : [];
  });
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptClub, setReceiptClub] = useState(null);
  const defaultClubs = [
    { id: 1, name: 'NSS - National Service Scheme', desc: 'Community service, blood donation drives, cleanliness campaigns, and rural outreach programs.', members: 334, category: 'Social', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z', color: '#10b981' },
    { id: 2, name: 'Coding Club', desc: 'Weekly coding challenges, competitive programming, and project building. Open to all branches.', members: 245, category: 'Technical', icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4', color: '#3b82f6' },
    { id: 3, name: 'Music Club', desc: 'Instrumental and vocal training, jam sessions, and performances at college events.', members: 203, category: 'Cultural', icon: 'M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3', color: '#ec4899' },
    { id: 4, name: 'Entrepreneurship Cell', desc: 'Startup ideas to reality. Mentorship programs, investor connections, and pitch competitions.', members: 178, category: 'Academic', icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z', color: '#f59e0b' },
    { id: 5, name: 'Photography Club', desc: 'Capture campus life and memories. Monthly photo walks and workshops by professional photographers.', members: 156, category: 'Cultural', icon: 'M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z M15 13a3 3 0 11-6 0 3 3 0 016 0z', color: '#8b5cf6' },
    { id: 6, name: 'Debate & MUN Society', desc: 'Model United Nations, parliamentary debates, and public speaking workshops.', members: 134, category: 'Academic', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z', color: '#06b6d4' },
    { id: 7, name: 'Drama & Theatre Club', desc: 'Perform in campus plays, street plays, and competitions. No prior experience needed!', members: 112, category: 'Cultural', icon: 'M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z', color: '#f59e0b' },
    { id: 8, name: 'Robotics Society', desc: 'Build and program robots for national competitions. Annual RoboWars event organized by us.', members: 89, category: 'Technical', icon: 'M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z', color: '#ef4444' }
  ];
  const [clubs, setClubs] = useState(defaultClubs);

  useEffect(() => {
    getClubs().then(data => { if (Array.isArray(data) && data.length > 0) setClubs(data); }).catch(() => {});
  }, []);

  const totalMembers = clubs.reduce((sum, club) => sum + club.members, 0);
  const technicalCount = clubs.filter(c => c.category === 'Technical').length;
  const culturalCount = clubs.filter(c => c.category === 'Cultural').length;
  
  const filtered = filter === 'All' ? clubs : clubs.filter(c => c.category === filter);
  
  const handleJoinClub = (club) => {
    setSelectedClub(club);
    setShowJoinModal(true);
    setJoinStep('payment');
  };

  const handlePaymentComplete = () => {
    setJoinStep('joining');
    setTimeout(() => {
      setJoinStep('success');
      const student = JSON.parse(localStorage.getItem('currentStudent') || '{}');
      const updated = [...joinedClubs, selectedClub.id];
      setJoinedClubs(updated);
      localStorage.setItem(`joinedClubs_${student.student_id}`, JSON.stringify(updated));
      
      const updatedClubs = clubs.map(c => 
        c.id === selectedClub.id ? {...c, members: c.members + 1} : c
      );
      setClubs(updatedClubs);
      saveClubs(updatedClubs);
    }, 2000);
  };

  const handleWhatsAppJoin = () => {
    if (selectedClub?.whatsapp) {
      window.open(selectedClub.whatsapp, '_blank');
    }
  };

  const handleViewReceipt = (club) => {
    setReceiptClub(club);
    setShowReceipt(true);
  };

  return (
    <div className="clubs-content">
      <div className="clubs-header">
        <div>
          <h2>Campus Clubs</h2>
          <p>{clubs.length} active clubs · {totalMembers.toLocaleString()} total members</p>
        </div>
      </div>
      <div className="clubs-stats">
        <div className="club-stat">
          <h3>{clubs.length}</h3>
          <p>Total Clubs</p>
        </div>
        <div className="club-stat">
          <h3>{totalMembers.toLocaleString()}</h3>
          <p>Members</p>
        </div>
        <div className="club-stat">
          <h3>{technicalCount}</h3>
          <p>Technical</p>
        </div>
        <div className="club-stat">
          <h3>{culturalCount}</h3>
          <p>Cultural</p>
        </div>
      </div>
      <div className="club-filters">
        <button className={filter === 'All' ? 'active' : ''} onClick={() => setFilter('All')}>All</button>
        <button className={filter === 'Social' ? 'active' : ''} onClick={() => setFilter('Social')}>Social</button>
        <button className={filter === 'Technical' ? 'active' : ''} onClick={() => setFilter('Technical')}>Technical</button>
        <button className={filter === 'Cultural' ? 'active' : ''} onClick={() => setFilter('Cultural')}>Cultural</button>
        <button className={filter === 'Academic' ? 'active' : ''} onClick={() => setFilter('Academic')}>Academic</button>
      </div>
      <div className="clubs-grid">
        {filtered.map(club => (
          <div key={club.id} className="club-card">
            <div className="club-card-header">
              <div className="club-icon" style={{backgroundColor: club.color + '20'}}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={club.color} strokeWidth="2">
                  <path d={club.icon}/>
                </svg>
              </div>
              <span className="club-category" style={{backgroundColor: club.color + '20', color: club.color}}>{club.category}</span>
            </div>
            <h3>{club.name}</h3>
            <p className="club-desc">{club.desc}</p>
            <div className="club-footer">
              <div className="club-members">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
                {club.members} members
              </div>
              {joinedClubs.includes(club.id) ? (
                <div style={{display: 'flex', gap: '8px'}}>
                  <button className="join-btn" style={{borderColor: '#10b981', color: '#10b981', background: 'rgba(16,185,129,0.1)', cursor: 'default'}} disabled>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 6L9 17l-5-5"/>
                    </svg>
                    Joined
                  </button>
                  <button className="join-btn" style={{borderColor: club.color, color: club.color, background: 'rgba(59,130,246,0.1)'}} onClick={() => handleViewReceipt(club)}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    </svg>
                    Receipt
                  </button>
                </div>
              ) : (
                <button className="join-btn" style={{borderColor: club.color, color: club.color}} onClick={() => handleJoinClub(club)}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/>
                  </svg>
                  Join
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {showJoinModal && selectedClub && (
        <div className="modal-overlay" onClick={() => setShowJoinModal(false)}>
          <div className="modal-content join-modal" onClick={(e) => e.stopPropagation()}>
            {joinStep === 'payment' ? (
              <div>
                <div className="modal-header">
                  <h2>Join Club</h2>
                  <button className="close-btn" onClick={() => setShowJoinModal(false)}>×</button>
                </div>
                <div className="modal-body">
                  <div className="club-payment-card">
                    <div className="club-payment-icon" style={{backgroundColor: selectedClub.color}}>
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                        <path d={selectedClub.icon}/>
                      </svg>
                    </div>
                    <h3>{selectedClub.name}</h3>
                    <p className="club-payment-desc">Annual Membership • {selectedClub.members}+ Members</p>
                    <div className="club-payment-price">
                      <span className="price-label">Membership Fee</span>
                      <span className="price-amount">₹500</span>
                      <span className="price-period">/year</span>
                    </div>
                  </div>
                  <div className="club-benefits">
                    <h4>What's Included:</h4>
                    <div className="benefit-item">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
                        <path d="M20 6L9 17l-5-5"/>
                      </svg>
                      <span>Access to all club events</span>
                    </div>
                    <div className="benefit-item">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
                        <path d="M20 6L9 17l-5-5"/>
                      </svg>
                      <span>WhatsApp group membership</span>
                    </div>
                    <div className="benefit-item">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
                        <path d="M20 6L9 17l-5-5"/>
                      </svg>
                      <span>Exclusive workshops & resources</span>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>UPI ID</label>
                    <input type="text" placeholder="yourname@paytm" />
                  </div>
                  <button className="club-pay-btn" style={{background: selectedClub.color}} onClick={handlePaymentComplete}>
                    Pay ₹500 & Join Club
                  </button>
                </div>
              </div>
            ) : joinStep === 'joining' ? (
              <div className="join-animation">
                <div className="spinner-container">
                  <div className="spinner" style={{borderTopColor: selectedClub.color}}></div>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={selectedClub.color} strokeWidth="2" className="club-icon-anim">
                    <path d={selectedClub.icon}/>
                  </svg>
                </div>
                <h3>Joining {selectedClub.name}...</h3>
                <p>Please wait while we process your request</p>
              </div>
            ) : (
              <div className="join-success">
                <div className="success-checkmark">
                  <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="#10b981" strokeWidth="2" className="check-circle"/>
                    <path d="M8 12l2 2 4-4" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="check-path"/>
                  </svg>
                </div>
                <h2>Welcome to {selectedClub.name}!</h2>
                <p>You've successfully joined the club. Connect with {selectedClub.members}+ members on WhatsApp.</p>
                <button className="whatsapp-btn" onClick={handleWhatsAppJoin}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  Join WhatsApp Group
                </button>
                <button className="close-modal-btn" onClick={() => { 
                  setShowJoinModal(false);
                }}>Close</button>
              </div>
            )}
          </div>
        </div>
      )}
      
      {showReceipt && receiptClub && (
        <div className="modal-overlay" onClick={() => setShowReceipt(false)}>
          <div className="modal-content receipt-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Payment Receipt</h2>
              <button className="close-btn" onClick={() => setShowReceipt(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="receipt-content">
                <div className="receipt-header">
                  <h3>Smart Campus</h3>
                  <p>KDK College of Engineering</p>
                </div>
                <div className="receipt-divider"></div>
                <div className="receipt-details">
                  <div className="receipt-row">
                    <span>Student Name:</span>
                    <strong>Demo Student</strong>
                  </div>
                  <div className="receipt-row">
                    <span>Student ID:</span>
                    <strong>STU2024001</strong>
                  </div>
                  <div className="receipt-row">
                    <span>Club Name:</span>
                    <strong>{receiptClub.name}</strong>
                  </div>
                  <div className="receipt-row">
                    <span>Category:</span>
                    <strong>{receiptClub.category}</strong>
                  </div>
                  <div className="receipt-row">
                    <span>Transaction ID:</span>
                    <strong>TXN{Date.now().toString().slice(-9)}</strong>
                  </div>
                  <div className="receipt-row">
                    <span>Payment Date:</span>
                    <strong>{new Date().toLocaleDateString('en-GB', {day: 'numeric', month: 'short', year: 'numeric'})}</strong>
                  </div>
                  <div className="receipt-divider"></div>
                  <div className="receipt-row receipt-total">
                    <span>Amount Paid:</span>
                    <strong>₹500</strong>
                  </div>
                </div>
                <div className="receipt-footer">
                  <p>This is a computer-generated receipt</p>
                </div>
              </div>
              <button className="save-changes-btn" onClick={() => alert('Receipt downloaded!')}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                Download Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MessagesContent() {
  const [selectedChat, setSelectedChat] = useState(null);
  const [messageText, setMessageText] = useState('');
  
  const chats = [
    { id: 1, name: 'CSE Batch 2024', type: 'group', lastMsg: 'Rahul: Assignment deadline extended', time: '10:30 AM', unread: 3, avatar: 'C' },
    { id: 2, name: 'Dr. Sharma', type: 'personal', lastMsg: 'Your project looks good', time: '9:15 AM', unread: 1, avatar: 'D' },
    { id: 3, name: 'Tech Club', type: 'group', lastMsg: 'Priya: Hackathon tomorrow!', time: 'Yesterday', unread: 0, avatar: 'T' },
    { id: 4, name: 'Placement Cell', type: 'group', lastMsg: 'Google drive on March 5', time: 'Yesterday', unread: 5, avatar: 'P' }
  ];
  
  const chatMessages = {
    1: [
      { id: 1, sender: 'Rahul', text: 'Hey everyone! Assignment deadline extended to Friday', time: '10:25 AM', isMine: false },
      { id: 2, sender: 'You', text: 'Great news! Thanks for the update', time: '10:26 AM', isMine: true },
      { id: 3, sender: 'Priya', text: 'Finally some relief 😅', time: '10:28 AM', isMine: false },
      { id: 4, sender: 'Amit', text: 'Does anyone have the reference material?', time: '10:30 AM', isMine: false }
    ],
    2: [
      { id: 1, sender: 'Dr. Sharma', text: 'I reviewed your project proposal', time: '9:10 AM', isMine: false },
      { id: 2, sender: 'Dr. Sharma', text: 'Your project looks good. Just add more details in methodology', time: '9:15 AM', isMine: false },
      { id: 3, sender: 'You', text: 'Thank you sir! I will update it by tomorrow', time: '9:20 AM', isMine: true }
    ]
  };

  const handleSendMessage = () => {
    if (messageText.trim()) {
      setMessageText('');
    }
  };

  return (
    <div className="messages-content-whatsapp">
      <div className="chat-sidebar">
        <div className="chat-sidebar-header">
          <h2>Messages</h2>
        </div>
        <div className="chats-list">
          {chats.map(chat => (
            <div key={chat.id} className={`chat-item ${selectedChat === chat.id ? 'active' : ''}`} onClick={() => setSelectedChat(chat.id)}>
              <div className="chat-avatar">{chat.avatar}</div>
              <div className="chat-info">
                <div className="chat-header">
                  <h3>{chat.name}</h3>
                  <span className="chat-time">{chat.time}</span>
                </div>
                <p className="chat-last-msg">{chat.lastMsg}</p>
              </div>
              {chat.unread > 0 && <div className="chat-unread-badge">{chat.unread}</div>}
            </div>
          ))}
        </div>
      </div>
      
      <div className="chat-main">
        {selectedChat ? (
          <>
            <div className="chat-main-header">
              <div className="chat-avatar">{chats.find(c => c.id === selectedChat)?.avatar}</div>
              <div>
                <h3>{chats.find(c => c.id === selectedChat)?.name}</h3>
                <p>{chats.find(c => c.id === selectedChat)?.type === 'group' ? 'Group' : 'Personal'}</p>
              </div>
            </div>
            <div className="chat-messages">
              {(chatMessages[selectedChat] || []).map(msg => (
                <div key={msg.id} className={`chat-message ${msg.isMine ? 'mine' : ''}`}>
                  {!msg.isMine && <span className="message-sender">{msg.sender}</span>}
                  <div className="message-bubble">
                    <p>{msg.text}</p>
                    <span className="message-time">{msg.time}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="chat-input">
              <input type="text" placeholder="Type a message..." value={messageText} onChange={(e) => setMessageText(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()} />
              <button onClick={handleSendMessage}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                </svg>
              </button>
            </div>
          </>
        ) : (
          <div className="chat-empty">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1">
              <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
            </svg>
            <h3>Select a chat to start messaging</h3>
          </div>
        )}
      </div>
    </div>
  );
}

function EventsContent() {
  const [filter, setFilter] = useState('All');
  const [registeredEvents, setRegisteredEvents] = useState(() => {
    const saved = localStorage.getItem('registeredEvents');
    return saved ? JSON.parse(saved) : [];
  });
  const [eventCounts, setEventCounts] = useState(() => {
    const saved = localStorage.getItem('eventCounts');
    return saved ? JSON.parse(saved) : {};
  });
  const [events, setEvents] = useState([]);

  useEffect(() => {
    getEvents().then(apiEvents => {
      if (Array.isArray(apiEvents)) setEvents(apiEvents);
    }).catch(() => {});
  }, []);

  const filtered = filter === 'All' ? events : events.filter(e => e.type === filter);


  const handleRegister = async (eventKey) => {
    if (!registeredEvents.includes(eventKey)) {
      const student = JSON.parse(localStorage.getItem('currentStudent') || '{}');
      const newRegistered = [...registeredEvents, eventKey];
      const newCounts = {...eventCounts, [eventKey]: (eventCounts[eventKey] || 0) + 1};
      setRegisteredEvents(newRegistered);
      setEventCounts(newCounts);
      localStorage.setItem('registeredEvents', JSON.stringify(newRegistered));
      localStorage.setItem('eventCounts', JSON.stringify(newCounts));
      
      try {
        const token = localStorage.getItem('token');
        await fetch(`http://localhost:5000/api/events/${eventKey}/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            student_id: student.student_id,
            email: student.email,
            phone: student.phone || 'N/A',
            name: student.email?.split('@')[0] || 'Student',
            department: 'Computer Science'
          })
        });
      } catch (err) {}
    }
  };

  const getRegisteredCount = (event) => {
    if (typeof event.registered !== 'string' || !event.registered.includes('/')) {
      const count = (event.registered_count || 0) + (eventCounts[event._id || event.id] || 0);
      const cap = event.capacity || 100;
      return `${count}/${cap}`;
    }
    const [current, total] = event.registered.split('/');
    const newCurrent = parseInt(current) + (eventCounts[event.id] || 0);
    return `${newCurrent}/${total}`;
  };

  const getPercent = (event) => {
    if (typeof event.registered !== 'string' || !event.registered.includes('/')) {
      const count = (event.registered_count || 0) + (eventCounts[event._id || event.id] || 0);
      const cap = event.capacity || 100;
      return Math.round((count / cap) * 100);
    }
    const [current, total] = event.registered.split('/');
    const newCurrent = parseInt(current) + (eventCounts[event.id] || 0);
    return Math.round((newCurrent / parseInt(total)) * 100);
  };

  return (
    <div className="events-content">
      <div className="events-header">
        <div>
          <h2>All Events</h2>
          <p>{events.length} events scheduled</p>
        </div>
      </div>
      <div className="event-filters">
        <button className={filter === 'All' ? 'active' : ''} onClick={() => setFilter('All')}>All</button>
        <button className={filter === 'Workshop' ? 'active' : ''} onClick={() => setFilter('Workshop')}>Workshop</button>
        <button className={filter === 'Seminar' ? 'active' : ''} onClick={() => setFilter('Seminar')}>Seminar</button>
        <button className={filter === 'Placement' ? 'active' : ''} onClick={() => setFilter('Placement')}>Placement</button>
        <button className={filter === 'Technical' ? 'active' : ''} onClick={() => setFilter('Technical')}>Technical</button>
        <button className={filter === 'Sports' ? 'active' : ''} onClick={() => setFilter('Sports')}>Sports</button>
        <button className={filter === 'Cultural' ? 'active' : ''} onClick={() => setFilter('Cultural')}>Cultural</button>
      </div>
      <div className="events-grid">
        {filtered.map(event => {
          const eventKey = event._id || event.id;
          return (
          <div key={eventKey} className="event-card" style={{borderColor: event.color + '40'}}>
            <div className="event-card-header">
              <span className="event-type" style={{backgroundColor: event.color + '30', color: event.color}}>{event.type}</span>
              <span className="days-left">{event.daysLeft} days left</span>
            </div>
            <h3>{event.title}</h3>
            <p className="event-desc">{event.desc}</p>
            <div className="event-details">
              <div><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> {event.date}</div>
              <div><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> {event.time}</div>
              <div><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg> {event.location}</div>
            </div>
            <div className="event-registration">
              <div className="reg-info">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                <span>{getRegisteredCount(event)} registered</span>
                <span className="reg-percent">{getPercent(event)}% full</span>
              </div>
              <div className="reg-progress">
                <div className="reg-bar" style={{width: getPercent(event) + '%', backgroundColor: getPercent(event) > 90 ? '#ef4444' : getPercent(event) > 70 ? '#f59e0b' : '#3b82f6'}}></div>
              </div>
            </div>
            <button className="register-btn" style={{borderColor: event.color, color: event.color, ...(registeredEvents.includes(eventKey) && {background: event.color, color: 'white'})}} onClick={() => handleRegister(eventKey)} disabled={registeredEvents.includes(eventKey)}>
              {registeredEvents.includes(eventKey) ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 6L9 17l-5-5"/>
                  </svg>
                  Registered
                </>
              ) : 'Register Now'}
            </button>
          </div>
          );
        })}
      </div>
    </div>
  );
}

function MeritListContent() {
  const students = [
    { rank: 1, name: 'Sneha Patel', id: 'IT2021001', dept: 'Information Technology', subject: 'Web Technologies', marks: '95/100', percent: '95%', grade: 'O', medal: 'gold' },
    { rank: 2, name: 'Rahul Sharma', id: 'CSE2021001', dept: 'Computer Science', subject: 'Data Structures', marks: '92/100', percent: '92%', grade: 'O', medal: 'silver' },
    { rank: 3, name: 'Ananya Reddy', id: 'ECE2021001', dept: 'Electronics', subject: 'Digital Circuits', marks: '91/100', percent: '91%', grade: 'O', medal: 'bronze' },
    { rank: 4, name: 'Arjun Mehta', id: 'IT2021045', dept: 'Information Technology', subject: 'Web Technologies', marks: '89/100', percent: '89%', grade: 'A+' },
    { rank: 5, name: 'Priya Singh', id: 'CSE2021002', dept: 'Computer Science', subject: 'Data Structures', marks: '88/100', percent: '88%', grade: 'A+' },
    { rank: 6, name: 'Demo Student', id: 'STU2024001', dept: 'Computer Science', subject: 'Data Structures', marks: '87/100', percent: '87%', grade: 'A+' },
    { rank: 7, name: 'Amit Kumar', id: 'CSE2021003', dept: 'Computer Science', subject: 'Data Structures', marks: '85/100', percent: '85%', grade: 'A' },
    { rank: 8, name: 'Kavya Nair', id: 'CSE2021004', dept: 'Computer Science', subject: 'Data Structures', marks: '82/100', percent: '82%', grade: 'A' },
    { rank: 9, name: 'Rohan Gupta', id: 'IT2021002', dept: 'Information Technology', subject: 'Web Technologies', marks: '78/100', percent: '78%', grade: 'B+' },
    { rank: 10, name: 'Vikram Joshi', id: 'ME2021001', dept: 'Mechanical', subject: 'Thermodynamics', marks: '76/100', percent: '76%', grade: 'B+' },
    { rank: 11, name: 'Divya Sharma', id: 'ECE2021002', dept: 'Electronics', subject: 'Digital Circuits', marks: '73/100', percent: '73%', grade: 'B' }
  ];

  return (
    <div className="merit-list-content">
      <div className="merit-header">
        <div>
          <h2>Merit List</h2>
          <p>{students.length} students</p>
        </div>
        <button className="export-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          Export Excel
        </button>
      </div>
      <div className="merit-filters">
        <input type="text" placeholder="Search by name or enrollment..." className="merit-search" />
        <select className="merit-select"><option>All Departments</option></select>
        <select className="merit-select"><option>All Semesters</option></select>
        <button className="sort-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/>
          </svg>
          Highest First
        </button>
      </div>
      <div className="top-performers">
        {students.slice(0, 3).map(student => (
          <div key={student.rank} className="performer-card">
            <div className="medal-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill={student.medal === 'gold' ? '#fbbf24' : student.medal === 'silver' ? '#9ca3af' : '#3b82f6'}>
                <circle cx="12" cy="8" r="6"/><path d="M15.5 2L12 8l3.5 2L18 4z"/><path d="M8.5 2L12 8 8.5 10 6 4z"/>
              </svg>
            </div>
            <h3>{student.name}</h3>
            <p>{student.id}</p>
            <div className="performer-score">{student.percent}</div>
            <div className="performer-grade">{student.grade}</div>
          </div>
        ))}
      </div>
      <div className="merit-table-container">
        <table className="merit-table">
          <thead>
            <tr>
              <th>#</th>
              <th>STUDENT</th>
              <th>DEPARTMENT</th>
              <th>SUBJECT</th>
              <th>MARKS</th>
              <th>%</th>
              <th>GRADE</th>
            </tr>
          </thead>
          <tbody>
            {students.map(student => (
              <tr key={student.rank}>
                <td>{student.rank}</td>
                <td>
                  <div className="student-cell">
                    <strong>{student.name}</strong>
                    <span>{student.id}</span>
                  </div>
                </td>
                <td>{student.dept}</td>
                <td>{student.subject}</td>
                <td>{student.marks}</td>
                <td>{student.percent}</td>
                <td><span className={`grade-badge grade-${student.grade.replace('+', 'plus').toLowerCase()}`}>{student.grade}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function InternshipsContent() {
  const [filter, setFilter] = useState('All');
  const [appliedJobs, setAppliedJobs] = useState(() => {
    const student = JSON.parse(localStorage.getItem('currentStudent') || '{}');
    const saved = localStorage.getItem(`appliedJobs_${student.student_id}`);
    return saved ? JSON.parse(saved) : [];
  });
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [internships, setInternships] = useState([]);

  useEffect(() => {
    getJobs().then(data => { if (Array.isArray(data)) setJobs(data); }).catch(() => {});
    getInternships().then(data => { if (Array.isArray(data)) setInternships(data); }).catch(() => {});
  }, []);
  
  const opportunities = [...internships, ...jobs];
  const filtered = filter === 'All' ? opportunities : opportunities.filter(o => o.type === filter);

  const handleViewDetails = (job) => {
    setSelectedJob(job);
    setShowDetailModal(true);
  };

  const handleApply = (jobId) => {
    const student = JSON.parse(localStorage.getItem('currentStudent') || '{}');
    const updated = [...appliedJobs, jobId];
    setAppliedJobs(updated);
    localStorage.setItem(`appliedJobs_${student.student_id}`, JSON.stringify(updated));
    
    const applications = JSON.parse(localStorage.getItem('applications') || '[]');
    const score = 70 + Math.floor(Math.random() * 30);
    applications.push({
      id: `${student.student_id}_${jobId}`,
      student_id: student.student_id,
      jobId: jobId,
      score: score,
      appliedAt: new Date().toISOString()
    });
    localStorage.setItem('applications', JSON.stringify(applications));
  };

  return (
    <div className="internships-content">
      <div className="internships-header">
        <div>
          <h2>Internships & Placements</h2>
          <p>{opportunities.length} opportunities available</p>
        </div>
        <div className="filter-buttons">
          <button className={filter === 'All' ? 'active' : ''} onClick={() => setFilter('All')}>All</button>
          <button className={filter === 'Internship' ? 'active' : ''} onClick={() => setFilter('Internship')}>Internships</button>
          <button className={filter === 'Placement' ? 'active' : ''} onClick={() => setFilter('Placement')}>Placements</button>
        </div>
      </div>
      <div className="opportunities-grid">
        {filtered.map(opp => (
          <div key={opp.id} className="opportunity-card">
            <div className="opp-header">
              <div className="opp-logo" style={{backgroundColor: opp.color}}>{opp.logo}</div>
              <span className={`opp-badge ${opp.type.toLowerCase()}`}>{opp.type}</span>
            </div>
            <h3>{opp.role}</h3>
            <p className="opp-company">{opp.company}</p>
            <div className="opp-details">
              <div><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg> {opp.location}</div>
              <div><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg> {opp.salary}</div>
              <div><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> Deadline: {opp.deadline}</div>
            </div>
            <button className="view-details-btn" onClick={() => handleViewDetails(opp)}>
              {appliedJobs.includes(opp.id) ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 6L9 17l-5-5"/>
                  </svg>
                  Applied
                </>
              ) : 'View Details'}
            </button>
          </div>
        ))}
      </div>
      
      {showDetailModal && selectedJob && (
        <div className="modal-overlay" onClick={() => setShowDetailModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Job Details</h2>
              <button className="close-btn" onClick={() => setShowDetailModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="job-detail-header">
                <div className="opp-logo" style={{backgroundColor: selectedJob.color, width: '64px', height: '64px', fontSize: '28px'}}>{selectedJob.logo}</div>
                <div>
                  <h3>{selectedJob.role}</h3>
                  <p style={{color: 'rgba(255,255,255,0.7)', marginBottom: '8px'}}>{selectedJob.company}</p>
                  <span className={`opp-badge ${selectedJob.type.toLowerCase()}`}>{selectedJob.type}</span>
                </div>
              </div>
              <div className="job-detail-info">
                <div className="info-row">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  <span>{selectedJob.location}</span>
                </div>
                <div className="info-row">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                  <span>{selectedJob.salary}</span>
                </div>
                <div className="info-row">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  <span>Deadline: {selectedJob.deadline}</span>
                </div>
              </div>
              <button className="save-changes-btn" style={{...(appliedJobs.includes(selectedJob.id) && {background: '#10b981'})}} onClick={() => handleApply(selectedJob.id)} disabled={appliedJobs.includes(selectedJob.id)}>
                {appliedJobs.includes(selectedJob.id) ? (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 6L9 17l-5-5"/>
                    </svg>
                    Applied Successfully
                  </>
                ) : 'Apply Now'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DashboardContent() {
  const student = JSON.parse(localStorage.getItem('currentStudent') || '{}');
  const studentName = student.email?.split('@')[0] || 'Demo Student';
  const studentId = student.student_id || 'STU2024001';
  const semester = student.semester || '5';
  
  const [stats, setStats] = useState({jobs: 0, internships: 0, clubs: 0, events: 0});
  const [events, setEvents] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [cgpa, setCgpa] = useState(0);
  const [profileSemester, setProfileSemester] = useState(semester);
  
  useEffect(() => {
    Promise.all([getJobs(), getInternships(), getClubs(), getEvents()]).then(([j, i, c, e]) => {
      setStats({ jobs: (j||[]).length, internships: (i||[]).length, clubs: (c||[]).length, events: (e||[]).length });
      setJobs((j||[]).slice(0, 1));
      setClubs((c||[]).slice(0, 2));
      setEvents((e||[]).slice(0, 2));
    });
    if (studentId) {
      getStudentProfile(studentId).then(data => {
        if (data) { setCgpa(data.cgpa || 0); setProfileSemester(data.semester || semester); }
      }).catch(() => {});
    }
  }, []);
  
  const activities = [
    ...jobs.map(j => ({ text: `${j.company} job posted`, time: 'New', color: 'blue', link: 'internships' })),
    ...events.map(e => ({ text: `${e.title}`, time: `${e.daysLeft} days left`, color: 'green', link: 'events' })),
    ...clubs.map(c => ({ text: `${c.name} - ${c.members} members`, time: 'Active', color: 'yellow', link: 'clubs' }))
  ].slice(0, 4);
  
  return (
    <div className="dashboard-content">
      <div className="greeting-card">
        <div>
          <p className="greeting">Good morning,</p>
          <h1>{studentName}</h1>
          <p className="student-info">Computer Science · Semester {semester}</p>
        </div>
        <div className="badge-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
          </svg>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card blue" onClick={() => window.location.hash = 'internships'}>
          <div className="stat-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
            </svg>
          </div>
          <h2>{stats.jobs}</h2>
          <p>Jobs Posted</p>
          <span className="stat-change">Available now</span>
        </div>
        <div className="stat-card teal" onClick={() => window.location.hash = 'internships'}>
          <div className="stat-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
            </svg>
          </div>
          <h2>{stats.internships}</h2>
          <p>Internships</p>
          <span className="stat-change">Available now</span>
        </div>
        <div className="stat-card green" onClick={() => window.location.hash = 'clubs'}>
          <div className="stat-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>
          <h2>{stats.clubs}</h2>
          <p>Active Clubs</p>
          <span className="stat-change">{clubs.reduce((sum, c) => sum + c.members, 0)}+ members</span>
        </div>
        <div className="stat-card blue" onClick={() => window.location.hash = 'events'}>
          <div className="stat-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
          </div>
          <h2>{stats.events}</h2>
          <p>All Events</p>
          <span className="stat-change">{events.length > 0 ? `Next: ${events[0]?.date?.split(' ')[0] || 'Soon'}` : 'No events'}</span>
        </div>
      </div>

      <div className="bottom-section">
        <div className="activity-card">
          <h3>Recent Activity</h3>
          <div className="activity-list">
            {activities.length === 0 ? (
              <p style={{color: 'rgba(255,255,255,0.5)', textAlign: 'center', padding: '20px'}}>No recent activity</p>
            ) : (
              activities.map((activity, idx) => (
                <div key={idx} className="activity-item" onClick={() => window.location.hash = activity.link} style={{cursor: 'pointer'}}>
                  <span className={`dot ${activity.color}`}></span>
                  <div>
                    <p>{activity.text}</p>
                    <span className={`time ${activity.color}`}>{activity.time}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="quick-access">
          <h3>Quick Access</h3>
          <div className="quick-buttons">
            <button onClick={() => window.location.hash = 'internships'}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
              </svg> Apply for Internship
            </button>
            <button onClick={() => window.location.hash = 'events'}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
              </svg> Check Events
            </button>
            <button onClick={() => window.location.hash = 'clubs'}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/>
              </svg> Join Clubs
            </button>
            <button onClick={() => window.location.hash = 'profile'}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg> My Profile
            </button>
          </div>
          
          <div className="cgpa-card">
            <div className="cgpa-header">
              <span>Your SGPA</span>
              <span className="semester">Semester {profileSemester}</span>
            </div>
            <h2>{cgpa.toFixed(2)} <span>/ 10.0</span></h2>
            <div className="progress-bar">
              <div className="progress" style={{width: `${(cgpa/10)*100}%`}}></div>
            </div>
            <p style={{color: 'rgba(255,255,255,0.5)', fontSize: '12px', marginTop: '8px', textAlign: 'center'}}>{cgpa === 0 ? 'Update your profile to add SGPA' : 'Keep up the good work!'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;
