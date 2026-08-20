import Register from './pages/Register';
import Login from './pages/Login';

export default function App() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', padding: '30px' }}>
      <Register />
      <Login />
    </div>
  );
}
