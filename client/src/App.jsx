import Register from './pages/Register';
import Login from './pages/Login';
import Jobs from './pages/Jobs';

export default function App() {
  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '30px' }}>
        <Register />
        <Login />
      </div>
      <hr style={{ margin: '30px 0' }} />
      <Jobs />
    </div>
  );
}