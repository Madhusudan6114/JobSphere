import { useState, useEffect } from 'react';

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [userRole, setUserRole] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    salary: '',
    skills: '',
    description: '',
    jobType: 'Full-time',
  });
  const [msg, setMsg] = useState('');

  const token = localStorage.getItem('token');

  const fetchUserProfile = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setUserRole(data.user.role);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchJobs = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/jobs', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setJobs(data.jobs);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUserProfile();
    fetchJobs();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePostJob = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setMsg('Job posted successfully!');
      setFormData({ title: '', company: '', location: '', salary: '', skills: '', description: '', jobType: 'Full-time' });
      fetchJobs(); // Refresh job list
    } catch (err) {
      setMsg(`Error: ${err.message}`);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '20px auto', fontFamily: 'sans-serif' }}>
      <h2>JobSphere Jobs Portal</h2>

      {/* Recruiter-only Form */}
      {userRole === 'recruiter' ? (
        <div style={{ padding: '15px', border: '1px solid #0070f3', borderRadius: '8px', marginBottom: '20px' }}>
          <h3>Post a New Job (Recruiter Only)</h3>
          {msg && <p><b>{msg}</b></p>}
          <form onSubmit={handlePostJob} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <input name="title" placeholder="Job Title" value={formData.title} onChange={handleChange} required />
            <input name="company" placeholder="Company Name" value={formData.company} onChange={handleChange} required />
            <input name="location" placeholder="Location (e.g. Pune / Remote)" value={formData.location} onChange={handleChange} required />
            <input name="salary" type="number" placeholder="Salary (LPA / INR)" value={formData.salary} onChange={handleChange} required />
            <input name="skills" placeholder="Skills (comma separated, e.g. React, Node, SQL)" value={formData.skills} onChange={handleChange} required />
            <textarea name="description" placeholder="Job Description" value={formData.description} onChange={handleChange} required />
            <select name="jobType" value={formData.jobType} onChange={handleChange}>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Internship">Internship</option>
              <option value="Contract">Contract</option>
            </select>
            <button type="submit" style={{ padding: '8px', background: '#0070f3', color: '#fff', border: 'none', cursor: 'pointer' }}>
              Post Job
            </button>
          </form>
        </div>
      ) : (
        <div style={{ padding: '10px', background: '#f0fdf4', border: '1px solid #86efac', marginBottom: '20px' }}>
          Logged in as <b>Student</b> (You can view and browse all open jobs below).
        </div>
      )}

      {/* Jobs List for both Student and Recruiter */}
      <h3>Available Job Listings</h3>
      {jobs.length === 0 ? (
        <p>No jobs found. Log in as recruiter to post one!</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {jobs.map((job) => (
            <div key={job._id} style={{ padding: '12px', border: '1px solid #ccc', borderRadius: '6px' }}>
              <h4>{job.title} — <span style={{ color: '#555' }}>{job.company}</span></h4>
              <p>📍 {job.location} | 💰 ₹{job.salary} | 🏷️ {job.jobType}</p>
              <p>{job.description}</p>
              <p><b>Skills:</b> {job.skills.join(', ')}</p>
              <small style={{ color: '#888' }}>Posted by: {job.createdBy?.name || 'Recruiter'}</small>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}