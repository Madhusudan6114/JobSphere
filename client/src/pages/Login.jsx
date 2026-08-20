import { useState } from 'react';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [profile, setProfile] = useState(null);
  const [msg, setMsg] = useState('');

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      localStorage.setItem('token', data.token);
      setMsg('Login successful!');
      fetchProfile(data.token); 
    } catch (err) {
      setMsg(`Error: ${err.message}`);
    }
  };

  const fetchProfile = async (token) => {
    const res = await fetch('/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` }, // Token in the header
    });
    const data = await res.json();
    if (res.ok) setProfile(data.user);
  };

  return (
    <div style={{ maxWidth: '400px', margin: '20px auto', padding: '20px', border: '1px solid #ddd' }}>
      <h2>JobSphere Login</h2>
      {msg && <p><b>{msg}</b></p>}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input name="email" type="email" placeholder="email" onChange={handleChange} required />
        <input name="password" type="password" placeholder="password" onChange={handleChange} required />
        <button type="submit">Login</button>
      </form>

      {profile && (
        <div style={{ marginTop: '15px', background: '#f4f4f4', padding: '10px' }}>
          <h4>Profile (/api/auth/me):</h4>
          <p>Name: {profile.name}</p>
          <p>Email: {profile.email}</p>
          <p>Role: {profile.role}</p>
        </div>
      )}
    </div>
  );
}