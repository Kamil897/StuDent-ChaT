import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Report {
  id: number;
  reporter: { id: number; email: string; name: string };
  target: { id: number; email: string; name: string } | null;
  reason: string;
  status: 'pending'|'in_review'|'resolved'|'rejected';
  priority: 'low'|'normal'|'high'|'critical';
  toxicityScore: number;
  assignedAdminId?: number|null;
  createdAt: string;
}

const priorityColor: Record<string,string> = {
  low: '#5bc0de',
  normal: '#999',
  high: '#f0ad4e',
  critical: '#d9534f',
};

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token') || '';

  const load = async () => {
    setLoading(true);
    try {
      const res = await axios.get<Report[]>('http://localhost:3000/reports', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReports(res.data);
    } finally { setLoading(false); }
  };

  useEffect(()=>{ load(); },[]);

  const assign = async (id: number) => {
    await axios.patch(`http://localhost:3000/reports/${id}/assign`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    load();
  };

  const setStatus = async (id: number, status: 'in_review'|'resolved'|'rejected') => {
    await axios.patch(`http://localhost:3000/reports/${id}/status`, { status }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    load();
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Reports</h1>
      {loading ? <p>Loading…</p> : (
        <table style={{ 
          width:'100%', 
          borderCollapse:'collapse',
          border: '1px solid #d9d9d9',
          borderRadius: '6px',
          overflow: 'hidden'
        }}>
          <thead>
            <tr style={{ background: '#fafafa' }}>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #d9d9d9' }}>ID</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #d9d9d9' }}>Priority</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #d9d9d9' }}>Toxicity</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #d9d9d9' }}>Reporter</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #d9d9d9' }}>Target</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #d9d9d9' }}>Reason</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #d9d9d9' }}>Status</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #d9d9d9' }}>Assigned</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #d9d9d9' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reports.map(r=>(
              <tr key={r.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                <td style={{ padding: '12px' }}>{r.id}</td>
                <td style={{ padding: '12px', color: priorityColor[r.priority], fontWeight: 'bold' }}>{r.priority}</td>
                <td style={{ padding: '12px' }}>{Math.round(r.toxicityScore*100)}%</td>
                <td style={{ padding: '12px' }}>{r.reporter?.email || r.reporter?.name || r.reporter?.id}</td>
                <td style={{ padding: '12px' }}>{r.target ? (r.target.email || r.target.name || r.target.id) : '—'}</td>
                <td style={{ padding: '12px', maxWidth: 320, whiteSpace: 'pre-wrap' }}>{r.reason}</td>
                <td style={{ padding: '12px' }}>{r.status}</td>
                <td style={{ padding: '12px' }}>{r.assignedAdminId ?? '—'}</td>
                <td style={{ padding: '12px' }}>
                  <button 
                    onClick={()=>assign(r.id)}
                    style={{
                      background: '#52c41a',
                      color: 'white',
                      border: 'none',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      marginRight: '4px',
                      fontSize: '12px'
                    }}
                  >
                    Assign to me
                  </button>
                  <button 
                    onClick={()=>setStatus(r.id,'in_review')} 
                    disabled={r.status==='resolved' || r.status==='rejected'}
                    style={{
                      background: r.status==='resolved' || r.status==='rejected' ? '#d9d9d9' : '#1890ff',
                      color: 'white',
                      border: 'none',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      cursor: r.status==='resolved' || r.status==='rejected' ? 'not-allowed' : 'pointer',
                      marginRight: '4px',
                      fontSize: '12px'
                    }}
                  >
                    In review
                  </button>
                  <button 
                    onClick={()=>setStatus(r.id,'resolved')} 
                    disabled={r.status==='resolved'}
                    style={{
                      background: r.status==='resolved' ? '#d9d9d9' : '#52c41a',
                      color: 'white',
                      border: 'none',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      cursor: r.status==='resolved' ? 'not-allowed' : 'pointer',
                      marginRight: '4px',
                      fontSize: '12px'
                    }}
                  >
                    Resolve
                  </button>
                  <button 
                    onClick={()=>setStatus(r.id,'rejected')} 
                    disabled={r.status==='rejected'}
                    style={{
                      background: r.status==='rejected' ? '#d9d9d9' : '#ff4d4f',
                      color: 'white',
                      border: 'none',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      cursor: r.status==='rejected' ? 'not-allowed' : 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
