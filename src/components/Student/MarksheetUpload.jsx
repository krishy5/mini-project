import React, { useState } from 'react';
import './MarksheetUpload.css';

// Grade points mapping for SGPA calculation
const GRADE_POINTS = {
  'O': 10, 'A+': 9, 'A': 8, 'B+': 7, 'B': 6,
  'C': 5, 'D': 4, 'E': 3, 'F': 0
};

/**
 * Calculate SGPA from subjects array
 * Formula: Sum(Grade Points × Credits) / Total Credits
 */
function calculateSGPA(subjects) {
  if (!subjects || subjects.length === 0) return 0;
  let totalCredits = 0;
  let totalGradePoints = 0;
  for (const subject of subjects) {
    const gradePoint = GRADE_POINTS[subject.grade] || 0;
    totalGradePoints += gradePoint * subject.credits;
    totalCredits += subject.credits;
  }
  return totalCredits > 0 ? (totalGradePoints / totalCredits) : 0;
}

/**
 * MarksheetUpload Component
 * Allows students to manually enter semester marksheet data
 * Calculates SGPA automatically and saves to localStorage
 */
const MarksheetUpload = ({ onDataExtracted }) => {
  // State for showing/hiding manual entry form
  const [showManualEntry, setShowManualEntry] = useState(false);
  
  // Student information states
  const [semester, setSemester] = useState(1);
  const [studentId, setStudentId] = useState('');
  const [studentName, setStudentName] = useState('');
  
  // Subjects array - starts with one empty subject
  const [subjects, setSubjects] = useState([
    { name: '', credits: 3, grade: 'A' }
  ]);

  // Add a new subject row to the form
  const addSubject = () => {
    setSubjects([...subjects, { name: '', credits: 3, grade: 'A' }]);
  };

  // Remove a subject row from the form
  const removeSubject = (index) => {
    if (subjects.length > 1) {
      setSubjects(subjects.filter((_, i) => i !== index));
    }
  };

  // Update a specific field of a subject
  const updateSubject = (index, field, value) => {
    const newSubjects = [...subjects];
    newSubjects[index][field] = value;
    setSubjects(newSubjects);
  };

  /**
   * Save marksheet data to localStorage
   * Updates student profile with SGPA and semester info
   */
  const handleSaveData = () => {
    // Validate required fields
    if (!studentId || !studentName) {
      alert('Please enter Student ID and Name');
      return;
    }

    // Calculate SGPA from subjects
    const sgpa = calculateSGPA(subjects);
    const finalData = {
      studentId,
      name: studentName,
      semester,
      sgpa: parseFloat(sgpa.toFixed(2)),
      subjects
    };

    // Save to localStorage for profile display
    const student = JSON.parse(localStorage.getItem('currentStudent') || '{}');
    const profiles = JSON.parse(localStorage.getItem('studentProfiles') || '{}');
    const currentProfile = profiles[student.student_id] || {};
    
    // Update SGPA in profile - will display in dashboard and profile page
    profiles[student.student_id] = {
      ...currentProfile,
      cgpa: finalData.sgpa,
      semester: finalData.semester,
      lastUpdated: new Date().toISOString()
    };
    localStorage.setItem('studentProfiles', JSON.stringify(profiles));

    // Call parent callback with extracted data
    onDataExtracted(finalData);
    alert('Semester data saved successfully!');
    
    // Reset form for next semester entry
    setSemester(semester + 1);
    setSubjects([{ name: '', credits: 3, grade: 'A' }]);
  };

  // Calculate SGPA in real-time as user enters data
  const calculatedSGPA = calculateSGPA(subjects);

  // Initial view - shows button to start manual entry
  if (!showManualEntry) {
    return (
      <div className="marksheet-upload-container">
        <div className="upload-header">
          <h2>📝 Marksheet Entry</h2>
          <p>Enter your semester grades to calculate SGPA for merit ranking</p>
        </div>
        <div className="upload-section">
          {/* Button to show manual entry form */}
          <button onClick={() => setShowManualEntry(true)} className="extract-btn">
            ➕ Enter Marksheet Data
          </button>
          <div className="info-box">
            <h4>📋 Instructions:</h4>
            <ul>
              <li>Click the button above to start entering your grades</li>
              <li>Enter subject details and grades for each semester</li>
              <li>System will automatically calculate your SGPA</li>
              <li>Your data will be used for merit ranking</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // Main form view - manual entry of marksheet data
  return (
    <div className="marksheet-upload-container">
      <div className="upload-header">
        <h2>📝 Manual Marksheet Entry</h2>
        <p>Enter your semester grades</p>
      </div>

      <div className="extracted-data-section">
        {/* Section header */}
        <div className="section-header">
          <h3>📚 Enter Semester Details</h3>
        </div>

        {/* Student information inputs */}
        <div className="student-info-card">
          <div className="info-row">
            <label>Student ID:</label>
            <input
              type="text"
              placeholder="e.g., kf23cs164"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
            />
          </div>
          <div className="info-row">
            <label>Name:</label>
            <input
              type="text"
              placeholder="Your Name"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
            />
          </div>
          <div className="info-row">
            <label>Semester:</label>
            <input
              type="number"
              min="1"
              max="8"
              value={semester}
              onChange={(e) => setSemester(parseInt(e.target.value))}
              style={{ width: '100px' }}
            />
          </div>
          {/* Real-time SGPA display */}
          <div className="info-row sgpa-row">
            <label>Calculated SGPA:</label>
            <span className="sgpa-value">{calculatedSGPA.toFixed(2)}</span>
          </div>
        </div>

        {/* Subjects table */}
        <div className="subjects-table-wrapper">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h4>📚 Subjects & Grades</h4>
            {/* Button to add more subjects */}
            <button onClick={addSubject} className="edit-toggle-btn">
              ➕ Add Subject
            </button>
          </div>
          <table className="subjects-table">
            <thead>
              <tr>
                <th>Subject Name</th>
                <th>Credits</th>
                <th>Grade</th>
                <th>Grade Points</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {/* Map through subjects array to create table rows */}
              {subjects.map((subject, index) => (
                <tr key={index}>
                  {/* Subject name input */}
                  <td>
                    <input
                      type="text"
                      placeholder="Data Structures"
                      value={subject.name}
                      onChange={(e) => updateSubject(index, 'name', e.target.value)}
                    />
                  </td>
                  {/* Credits input */}
                  <td>
                    <input
                      type="number"
                      min="1"
                      max="6"
                      value={subject.credits}
                      onChange={(e) => updateSubject(index, 'credits', parseInt(e.target.value))}
                      style={{ width: '60px' }}
                    />
                  </td>
                  {/* Grade dropdown */}
                  <td>
                    <select
                      value={subject.grade}
                      onChange={(e) => updateSubject(index, 'grade', e.target.value)}
                    >
                      <option value="O">O</option>
                      <option value="A+">A+</option>
                      <option value="A">A</option>
                      <option value="B+">B+</option>
                      <option value="B">B</option>
                      <option value="C">C</option>
                      <option value="D">D</option>
                      <option value="F">F</option>
                    </select>
                  </td>
                  {/* Display grade points for selected grade */}
                  <td style={{ textAlign: 'center', fontWeight: 'bold', color: '#22c55e' }}>
                    {GRADE_POINTS[subject.grade]}
                  </td>
                  {/* Remove button - only show if more than 1 subject */}
                  <td style={{ textAlign: 'center' }}>
                    {subjects.length > 1 && (
                      <button onClick={() => removeSubject(index)} className="retry-btn" style={{ padding: '4px 8px', fontSize: '12px' }}>
                        🗑️
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Action buttons */}
        <div className="action-buttons">
          {/* Save button - saves data to localStorage */}
          <button onClick={handleSaveData} className="save-btn">
            💾 Save Semester {semester} Data
          </button>
          {/* Cancel button - returns to initial view */}
          <button onClick={() => setShowManualEntry(false)} className="cancel-btn">
            ❌ Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default MarksheetUpload;
