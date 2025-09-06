import { Layout, Menu } from 'antd';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Login from './pages/Login';
import Users from './pages/Users';
import Dashboard from './pages/Dashboard';
import Admins from './pages/Admins';
import Cogniya from './pages/Cogniya';
import ServerStatusPage from './pages/ServerStatusPage';

const { Header, Content, Sider } = Layout;

export default function App() {
  const nav = useNavigate();
  useEffect(() => {
    if (!localStorage.getItem('token')) nav('/login');
  }, []);
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider theme='light'>
        <div style={{ color: '#fff', padding: 16, fontWeight: 700 }}>Creator Panel</div>
        <Menu theme='light' mode="inline" items={[
          { key: 'users', label: 'Users', onClick: () => nav('/users') },
          { key: 'server', label: 'Server Status', onClick: () => nav('/server-status') },
          { key: 'dashboard', label: 'Dashboard', onClick: () => nav('/dashboard') },
          { key: 'admins', label: 'Admins', onClick: () => nav('/admins') },
          { key: 'cogniya', label: 'Cogniya', onClick: () => nav('/cogniya') }
          ,
          { key: 'logout', label: 'Logout', onClick: () => { localStorage.removeItem('token'); nav('/login'); } }
        ]} />
      </Sider>
      <Layout>
        <Header style={{ background: 'transparent' }} />
        <Content style={{ margin: 16 }}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/users" element={<Users />} />
            <Route path="/server-status" element={<ServerStatusPage />} />
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/admins' element={<Admins />} />
            <Route path='/cogniya' element={<Cogniya />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
}
