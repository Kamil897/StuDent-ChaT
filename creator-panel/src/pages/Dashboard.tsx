import { useEffect, useState } from 'react';
import { Card, Statistic, Row, Col, InputNumber, Input, Button, message } from 'antd';
import api from '../api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const [status, setStatus] = useState<any>({ uptime: 0, onlineUsers: 0, message: '' });
  const [history, setHistory] = useState<any[]>([]);

  const load = async () => {
    const s = await api.get('/creator/server-status').then(r=>r.data);
    setStatus(s);
    setHistory(prev => [...prev.slice(-19), { name: new Date().toLocaleTimeString(), uptime: s.uptime, online: s.onlineUsers }]);
  };
  useEffect(() => { load(); const t=setInterval(load, 5000); return ()=>clearInterval(t); }, []);

  async function update() {
    await api.patch('/creator/server-status', status);
    message.success('Updated');
    load();
  }

  return (
    <div>
      <Row gutter={16}>
        <Col span={8}><Card><Statistic title="Uptime (sec)" value={status.uptime} /></Card></Col>
        <Col span={8}><Card><Statistic title="Online Users" value={status.onlineUsers} /></Card></Col>
        <Col span={8}><Card><Statistic title="Message" value={status.message || '-'} /></Card></Col>
      </Row>
      <Card style={{ marginTop: 16 }} title="Update server status">
        <InputNumber value={status.uptime} onChange={(v)=>setStatus({...status, uptime:Number(v)})} />
        <InputNumber value={status.onlineUsers} onChange={(v)=>setStatus({...status, onlineUsers:Number(v)})} style={{ marginLeft: 8 }} />
        <Input value={status.message} onChange={(e)=>setStatus({...status, message:e.target.value})} style={{ width: 300, marginLeft: 8 }} />
        <Button type="primary" onClick={update} style={{ marginLeft: 8 }}>Save</Button>
      </Card>
      <Card style={{ marginTop: 16 }} title="Live Metrics">
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <LineChart data={history}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="uptime" />
              <Line type="monotone" dataKey="online" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
