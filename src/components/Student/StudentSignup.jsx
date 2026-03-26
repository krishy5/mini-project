import './StudentSignup.css?v=3';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { signUp } from '../../api/auth';
import { createDocument } from '../../api/db';

function StudentSignup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '', student_id: '', semester: '', phone: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const data = await signUp(formData.student_id, formData.email, formData.password);
      await createDocument('student_profiles', formData.student_id, {
        student_id: formData.student_id,
        phone: formData.phone,
        semester: formData.semester
      });
      alert('Registration successful!');
      navigate('/login');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-card">
        <button className="back-btn" onClick={() => navigate('/')}>←</button>
        <div className="signup-header">
          <h1>Create Account</h1>
          <p>Sign Up to your Smart Campus Account</p>
        </div>
        <form className="signup-form" onSubmit={handleSubmit}>
          {error && <div style={{color: '#ef4444', marginBottom: '16px', textAlign: 'center'}}>{error}</div>}
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" placeholder="student@kdkce.edu.in" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" placeholder="Enter your password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} required />
          </div>
          <div className="form-group">
            <label>Student Id</label>
            <input type="text" placeholder="Enter your Kf ID" value={formData.student_id} onChange={(e) => setFormData({...formData, student_id: e.target.value})} required />
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <input type="tel" placeholder="9876543210" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} required />
          </div>
          <div className="form-group">
            <label>Semester</label>
            <select value={formData.semester} onChange={(e) => setFormData({...formData, semester: e.target.value})} required>
              <option value="">Enter Your Semester</option>
              <option value="1">Semester 1</option>
              <option value="2">Semester 2</option>
              <option value="3">Semester 3</option>
              <option value="4">Semester 4</option>
              <option value="5">Semester 5</option>
              <option value="6">Semester 6</option>
              <option value="7">Semester 7</option>
              <option value="8">Semester 8</option>
            </select>
          </div>
          <button type="submit" className="signup-btn">Sign Up</button>
        </form>
        <div className="student-signin-link">
          Already have an Account? <Link to="/login">Sign In</Link>
        </div>
      </div>
    </div>
  );
}

export default StudentSignup;
