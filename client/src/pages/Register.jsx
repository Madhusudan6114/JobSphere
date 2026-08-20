import { useState } from 'react';

export default function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'student' });
  const [msg, setMsg] = useState('');

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      localStorage.setItem('token', data.token); 
      setMsg(`registeres successfully ${data.user.name} (${data.user.role})`);
    } catch (err) {
      setMsg(`error: ${err.message}`);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '20px auto', padding: '20px', border: '1px solid #ddd' }}>
      <h2>JobSphere Register</h2>
      {msg && <p><b>{msg}</b></p>}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input name="name" placeholder="fullname" onChange={handleChange} required />
        <input name="email" type="email" placeholder="email" onChange={handleChange} required />
        <input name="password" type="password" placeholder="password" onChange={handleChange} required />
        <select name="role" onChange={handleChange} value={formData.role}>
          <option value="student">student (Student)</option>
          <option value="recruiter">recruiter (Recruiter)</option>
        </select>
        <button type="submit">Register</button>
      </form>
    </div>
  );
}