import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ServerStatusPage: React.FC = () => {
  const [aiRunning, setAiRunning] = useState<boolean>(false);
  const [uptime, setUptime] = useState<number>(0);
  const [onlineUsers, setOnlineUsers] = useState<number>(0);
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const token = localStorage.getItem('token') || '';

  const loadStatus = async () => {
    try {
      setLoading(true);
      
      // ServerStatus from DB (backend-login) - порт 3000
      const ss = await axios.get('http://localhost:3000/server-status', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUptime(ss.data?.uptime ?? 0);
      setOnlineUsers(ss.data?.onlineUsers ?? 0);
      setMessage(ss.data?.message ?? '');
  
      // AI status from backend-main - порт 7777
      const ai = await axios.get('http://localhost:7777/creator/ai-status', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAiRunning(Boolean(ai.data?.running));
    } catch (e) {
      console.error('Failed to load status', e);
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => { loadStatus(); }, []);

  const toggleAi = async () => {
    try {
      setLoading(true);
      await axios.patch('http://localhost:7777/creator/ai-status', { running: !aiRunning }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await loadStatus();
    } catch (e) {
      console.error('Failed to toggle AI', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Server status</h1>
      
      {loading && <div style={{ marginBottom: 16, color: '#666' }}>Loading...</div>}
      
      <div>Uptime: {uptime}s</div>
      <div>Online users: {onlineUsers}</div>
      <div>Message: {message}</div>
      
      <div style={{ marginTop: 16 }}>
        <strong>AI running:</strong> {aiRunning ? 'ON' : 'OFF'}
        <button 
          style={{ marginLeft: 12 }} 
          onClick={toggleAi}
          disabled={loading}
        >
          {aiRunning ? 'Turn OFF' : 'Turn ON'}
        </button>
      </div>
    </div>
  );
};

export default ServerStatusPage;
