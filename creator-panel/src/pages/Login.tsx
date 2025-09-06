import { useState } from 'react';
import { Card, Input, Button, message } from 'antd';
import api from '../api';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const nav = useNavigate();

  async function handleLogin() {
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.access_token);
      message.success('Logged in');
      nav('/users');
    } catch (e:any) {
      message.error(e?.response?.data?.message || 'Login failed');
    }
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <Card title="Login" style={{ width: 360 }}>
        <Input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} style={{ marginBottom: 8 }} />
        <Input.Password placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} style={{ marginBottom: 8 }} />
        <Button type="primary" block onClick={handleLogin}>Login</Button>
      </Card>
    </div>
  );
}
