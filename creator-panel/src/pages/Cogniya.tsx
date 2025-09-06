import { useEffect, useState } from 'react';
import { Table, Drawer, Form, Input, Button, message } from 'antd';
import api from '../api';

export default function Cogniya() {
  const [data, setData] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form] = Form.useForm();

  const load = () => api.get('/cogniya/profiles').then(r=> setData(r.data));
  useEffect(()=>{ load(); }, []);

  function edit(row:any) {
    setEditing(row);
    form.setFieldsValue(row);
    setOpen(true);
  }

  async function save() {
    const values = await form.validateFields();
    await api.post(`/cogniya/profiles/${editing.userId}`, values);
    message.success('Saved');
    setOpen(false);
    load();
  }

  return (
    <div>
      <Table rowKey="id" dataSource={data} columns={[
        { title: 'User', render: (_:any, r:any) => `${r.user?.name} (${r.user?.email})` },
        { title: 'Hobbies', dataIndex: 'hobbies' },
        { title: 'Interests', dataIndex: 'interests' },
        { title: 'Bio', dataIndex: 'bio' },
        { title: 'Actions', render: (_:any, r:any) => <Button onClick={()=>edit({ ...r, userId: r.userId })}>Edit</Button> }
      ]}/>

      <Drawer open={open} onClose={()=>setOpen(false)} title="Edit Cogniya profile" width={480}
        extra={<Button type="primary" onClick={save}>Save</Button>}
      >
        <Form layout="vertical" form={form}>
          <Form.Item name="hobbies" label="Hobbies"><Input /></Form.Item>
          <Form.Item name="interests" label="Interests"><Input /></Form.Item>
          <Form.Item name="bio" label="Bio"><Input.TextArea rows={4} /></Form.Item>
        </Form>
      </Drawer>
    </div>
  );
}
