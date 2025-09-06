import { Layout, Menu } from 'antd';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Login from './pages/Login';
import Users from './pages/Users';
import ReportsPage from './pages/ReportsPage';
import NotificationsBell from './components/NotificationsBell';

const { Header, Content, Sider } = Layout;

export default function App() {
  const nav = useNavigate();
  useEffect(() => {
    if (!localStorage.getItem('token')) nav('/login');
  }, []);
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider theme='dark'>
        <div style={{ color: '#fff', padding: 16, fontWeight: 700 }}>Admin Panel</div>
        <Menu theme='dark' mode="inline" items={[
          { key: 'users', label: 'Users', onClick: () => nav('/users') },
          { key: 'reports', label: 'Reports', onClick: () => nav('/reports') },
          ,
          { key: 'logout', label: 'Logout', onClick: () => { localStorage.removeItem('token'); nav('/login'); } }
        ]} />
      </Sider>
      <Layout>
        <Header style={{ 
          background: '#fff', 
          display: 'flex', 
          justifyContent: 'flex-end', 
          alignItems: 'center',
          padding: '0 24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <NotificationsBell />
        </Header>
        <Content style={{ margin: 16 }}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/users" element={<Users />} />
            <Route path="/reports" element={<ReportsPage />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
}
