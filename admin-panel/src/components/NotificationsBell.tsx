import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';

export default function NotificationsBell() {
  const [items, setItems] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const token = localStorage.getItem('token') || '';

  const load = async () => {
    const res = await axios.get('http://localhost:3000/notifications', {
      headers: { Authorization: `Bearer ${token}` },
    });
    setItems(res.data || []);
  };

  useEffect(()=>{ 
    load(); 
    const t=setInterval(load, 10000); 
    return ()=>clearInterval(t); 
  },[]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  const unread = items.filter(i=>!i.readAt).length;

  const markAll = async () => {
    await axios.patch('http://localhost:3000/notifications/read-all', {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    load();
  };

  return (
    <div style={{ position:'relative' }} ref={dropdownRef}>
      <button 
        onClick={()=>setOpen(v=>!v)}
        style={{
          background: 'none',
          border: 'none',
          fontSize: '18px',
          cursor: 'pointer',
          padding: '8px',
          borderRadius: '4px',
          position: 'relative'
        }}
      >
        🔔 {unread>0 ? `(${unread})` : ''}
      </button>
      {open && (
        <div style={{ 
          position:'absolute', 
          right:0, 
          top:'2rem', 
          background:'#fff', 
          border:'1px solid #ddd', 
          width:320, 
          maxHeight:360, 
          overflow:'auto', 
          padding:8,
          zIndex: 1000,
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8, alignItems: 'center' }}>
            <strong>Уведомления</strong>
            <button 
              onClick={markAll}
              style={{
                background: '#1890ff',
                color: 'white',
                border: 'none',
                padding: '4px 8px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              Прочитать все
            </button>
          </div>
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 20, color: '#999' }}>
              Нет уведомлений
            </div>
          ) : (
            items.map(n=>(
              <div key={n.id} style={{ 
                padding:8, 
                background: n.readAt ? '#fafafa' : '#eef7ff', 
                marginBottom:6, 
                borderRadius:6,
                border: n.readAt ? '1px solid #eee' : '1px solid #b3d9ff'
              }}>
                <div style={{ fontWeight:600 }}>{n.title}</div>
                <div style={{ fontSize:12, opacity:0.8 }}>{n.body}</div>
                <div style={{ fontSize:11, opacity:0.6 }}>{new Date(n.createdAt).toLocaleString()}</div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
