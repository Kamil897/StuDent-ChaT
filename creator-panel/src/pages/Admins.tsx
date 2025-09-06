import { useEffect, useState } from 'react';
import { Table, Button, Space, Tag, message } from 'antd';
import api from '../api';

export default function Admins() {
  const [data, setData] = useState<any[]>([]);
  const load = () => api.get('/users').then(res => setData(res.data));
  useEffect(() => { load(); }, []);

  async function promote(id:number) { await api.patch(`/creator/users/${id}/promote`); message.success('Promoted to admin'); load(); }
  async function demote(id:number) { await api.patch(`/creator/users/${id}/demote`); message.success('Demoted to user'); load(); }

  return (
    <Table rowKey="id" dataSource={data} columns={[
      { title: 'ID', dataIndex: 'id' },
      { title: 'Email', dataIndex: 'email' },
      { title: 'Name', dataIndex: 'name' },
      { title: 'Role', dataIndex: 'role', render:(r:string)=> <Tag color={r==='admin'?'blue': r==='creator'?'gold':'default'}>{r}</Tag> },
      { title: 'Actions', render: (_:any, r:any) => <Space>
          {r.role==='admin' ? <Button onClick={()=>demote(r.id)}>Demote</Button> : r.role==='user' ? <Button type="primary" onClick={()=>promote(r.id)}>Promote</Button> : null}
        </Space>
      }
    ]} />
  );
}
