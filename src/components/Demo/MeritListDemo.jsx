import React, { useState, useEffect } from 'react';
import { sortStudentsByMerit } from '../../utils/meritSort';
import '../Teacher/MeritList.css';

const MeritListDemo = () => {
  const [rankedStudents, setRankedStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const exampleStudents = [
    { id: 'kf23cs101', name: 'Ananya Sharma', dept: 'Computer Science', sgpaList: [9.2, 9.4, 9.6] },
    { id: 'kf23cs102', name: 'Rahul Verma', dept: 'Computer Science', sgpaList: [8.8, 9.0, 9.6] },
    { id: 'kf23cs103', name: 'Priya Patel', dept: 'Information Technology', sgpaList: [9.0, 9.2, 9.4] },
    { id: 'kf23cs104', name: 'Arjun Kumar', dept: 'Computer Science', sgpaList: [9.5, 9.3, 9.4] },
    { id: 'kf23cs105', name: 'Sneha Reddy', dept: 'Electronics', sgpaList: [8.5, 8.8, 9.2] },
    { id: 'kf23it101', name: 'Vikram Singh', dept: 'Information Technology', sgpaList: [9.0, 9.0, 9.0] },
    { id: 'kf23cs106', name: 'Kavya Nair', dept: 'Computer Science', sgpaList: [8.7, 8.9, 9.1] },
    { id: 'kf23ec101', name: 'Aditya Mehta', dept: 'Electronics', sgpaList: [9.1, 9.2, 9.3] },
    { id: 'kf23cs107', name: 'Divya Shah', dept: 'Computer Science', sgpaList: [8.9, 9.1, 9.3] },
    { id: 'kf23it102', name: 'Rohan Gupta', dept: 'Information Technology', sgpaList: [8.6, 8.7, 8.9] },
    { id: 'kf23cs108', name: 'Ishita Joshi', dept: 'Computer Science', sgpaList: [9.3, 9.2, 9.4] },
    { id: 'kf23ec102', name: 'Karthik Rao', dept: 'Electronics', sgpaList: [8.4, 8.6, 8.8] },
    { id: 'kf23cs109', name: 'Meera Iyer', dept: 'Computer Science', sgpaList: [9.0, 9.1, 9.2] },
    { id: 'kf23it103', name: 'Siddharth Desai', dept: 'Information Technology', sgpaList: [8.8, 8.9, 9.0] },
    { id: 'kf23cs110', name: 'Tanvi Kapoor', dept: 'Computer Science', sgpaList: [9.4, 9.5, 9.6] }
  ];

  useEffect(() => {
    const loadRankings = async () => {
      setLoading(true);
      const ranked = await sortStudentsByMerit(exampleStudents);
      setRankedStudents(ranked);
      setLoading(false);
    };
    loadRankings();
  }, []);

  const getRankBadgeClass = (rank) => {
    if (rank === 1) return 'rank-gold';
    if (rank === 2) return 'rank-silver';
    if (rank === 3) return 'rank-bronze';
    return 'rank-default';
  };

  const getTrendIcon = (trend) => trend > 0 ? '📈' : trend < 0 ? '📉' : '➡️';

  if (loading) {
    return (
      <div className="merit-list-container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Calculating merit rankings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="merit-list-container">
      <div className="merit-header">
        <h2>🏆 Merit-Based Student Rankings</h2>
        <p className="merit-subtitle">
          Ranked by: CGPA → Current SGPA → Academic Trend → SHA256 Tie-Breaker
        </p>
      </div>

      <div className="merit-stats">
        <div className="stat-box">
          <span className="stat-label">Total Students</span>
          <span className="stat-value">{rankedStudents.length}</span>
        </div>
        <div className="stat-box">
          <span className="stat-label">Top CGPA</span>
          <span className="stat-value">{rankedStudents[0]?.cgpa.toFixed(2)}</span>
        </div>
        <div className="stat-box">
          <span className="stat-label">Average CGPA</span>
          <span className="stat-value">
            {(rankedStudents.reduce((sum, s) => sum + s.cgpa, 0) / rankedStudents.length).toFixed(2)}
          </span>
        </div>
      </div>

      <div className="merit-table-wrapper">
        <table className="merit-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Student ID</th>
              <th>Name</th>
              <th>CGPA</th>
              <th>Current SGPA</th>
              <th>Trend</th>
              <th>Department</th>
            </tr>
          </thead>
          <tbody>
            {rankedStudents.map((student) => (
              <tr key={student.id}>
                <td>
                  <span className={`rank-badge ${getRankBadgeClass(student.rank)}`}>
                    {student.rank === 1 && '🥇 '}
                    {student.rank === 2 && '🥈 '}
                    {student.rank === 3 && '🥉 '}
                    #{student.rank}
                  </span>
                </td>
                <td className="student-id">{student.id}</td>
                <td className="student-name">{student.name}</td>
                <td className="cgpa-cell">
                  <span className="cgpa-value">{student.cgpa.toFixed(2)}</span>
                </td>
                <td className="sgpa-cell">{student.currentSGPA.toFixed(2)}</td>
                <td className="trend-cell">
                  <span className={`trend ${student.trend >= 0 ? 'positive' : 'negative'}`}>
                    {getTrendIcon(student.trend)} {student.trend >= 0 ? '+' : ''}{student.trend.toFixed(2)}
                  </span>
                </td>
                <td className="dept-cell">{student.dept}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="merit-footer">
        <div className="algorithm-info">
          <h4>📊 Ranking Algorithm</h4>
          <ol>
            <li><strong>Step 1:</strong> CGPA (Overall Academic Strength)</li>
            <li><strong>Step 2:</strong> Current Semester SGPA (Recent Performance)</li>
            <li><strong>Step 3:</strong> Academic Trend (Improvement Score)</li>
            <li><strong>Step 4:</strong> SHA256-based Tie-Breaker (Deterministic)</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default MeritListDemo;
