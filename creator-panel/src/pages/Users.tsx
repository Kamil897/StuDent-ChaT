import { useEffect, useState } from 'react';
import { Table, Button, Space, Tag, message } from 'antd';
import api from '../api';

export default function Users() {
  const [data, setData] = useState<any[]>([]);
  const load = () => api.get('/users').then(res => setData(res.data));
  useEffect(() => { load(); }, []);

  async function ban(id:number) { await api.patch(`/users/${id}/ban`); message.success('User banned'); load(); }
  async function unban(id:number) { await api.patch(`/users/${id}/unban`); message.success('User unbanned'); load(); }

  return (
    <Table rowKey="id" dataSource={data} columns={[
      { title: 'ID', dataIndex: 'id' },
      { title: 'Email', dataIndex: 'email' },
      { title: 'Name', dataIndex: 'name' },
      { title: 'Role', dataIndex: 'role' },
      { title: 'Status', dataIndex: 'status', render: (s:string) => <Tag color={s==='banned'?'red':'green'}>{s}</Tag> },
      { title: 'Actions', render: (_:any, r:any) => <Space>
          {r.status==='active' ? <Button danger onClick={()=>ban(r.id)}>Ban</Button> : <Button onClick={()=>unban(r.id)}>Unban</Button>}
        </Space>
      }
    ]} />
  );
}
