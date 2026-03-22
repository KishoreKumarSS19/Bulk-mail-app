import { useState, useEffect } from 'react';
import axios from 'axios';
import { History as HistoryIcon, RefreshCw, AlertCircle } from 'lucide-react';

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchHistory = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get('http://localhost:5000/api/emails/history');
      setHistory(res.data);
    } catch (err) {
      setError('Failed to fetch email history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', textAlign: 'left' }}>
        <div>
          <h1><HistoryIcon size={32} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '10px' }}/> Email History</h1>
          <p>Review previously sent email campaigns and their statuses</p>
        </div>
        <button onClick={fetchHistory} className="btn" style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', color: 'var(--text-main)' }}>
          <RefreshCw size={18} className={loading ? 'spinning' : ''} /> Refresh
        </button>
      </div>

      {error && (
        <div className="alert alert-error">
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      <div className="table-container">
        {loading && history.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            Loading history...
          </div>
        ) : history.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            No emails have been sent yet.
          </div>
        ) : (
          <table className="glass-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Subject</th>
                <th>Recipients</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {history.map((record) => (
                <tr key={record._id}>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    {new Date(record.createdAt).toLocaleString()}
                  </td>
                  <td><strong>{record.subject}</strong></td>
                  <td>
                    <div className="recipients-list" title={record.recipients.join(', ')}>
                      {record.recipients.length} recipient(s): {record.recipients[0]} 
                      {record.recipients.length > 1 && ` +${record.recipients.length - 1} more`}
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${record.status === 'Success' ? 'badge-success' : 'badge-danger'}`}>
                      {record.status}
                    </span>
                    {record.errorLogs && (
                      <div style={{ fontSize: '0.8rem', marginTop: '0.5rem', wordBreak: 'break-all', opacity: 0.8 }}>
                        {record.errorLogs.startsWith('http') ? (
                          <a href={record.errorLogs} target="_blank" rel="noreferrer" style={{ color: 'inherit' }}>Preview Link</a>
                        ) : record.errorLogs.length > 50 ? record.errorLogs.substring(0, 50) + '...' : record.errorLogs}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <style>{`
        .spinning { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </>
  );
};

export default History;
