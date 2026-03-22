import { useState } from 'react';
import { Send, Users, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import axios from 'axios';

const Dashboard = () => {
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [recipients, setRecipients] = useState('');
  const [status, setStatus] = useState(null); // { type: 'success' | 'error', message: '' }
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    setLoading(true);

    const emailList = recipients.split(',')
      .map(email => email.trim())
      .filter(email => email !== '');

    if (emailList.length === 0) {
      setStatus({ type: 'error', message: 'Please provide valid recipient emails.' });
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/emails/send', {
        subject,
        body,
        recipients: emailList
      });

      setStatus({ type: 'success', message: res.data.message });
      setSubject('');
      setBody('');
      setRecipients('');
    } catch (err) {
      setStatus({ 
        type: 'error', 
        message: err.response?.data?.details || err.response?.data?.error || 'Failed to send emails' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="page-header">
        <h1>Send Bulk Emails</h1>
        <p>Compose and dispatch your emails quickly and effectively</p>
      </div>

      <div className="glass-card" style={{ maxWidth: '800px', margin: '0 auto' }}>
        {status && (
          <div className={`alert ${status.type === 'success' ? 'alert-success' : 'alert-error'}`}>
            {status.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
            {status.message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label><Users size={16} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }}/> Recipients (comma separated)</label>
            <textarea 
              className="form-control" 
              placeholder="user1@example.com, user2@example.com" 
              value={recipients} 
              onChange={(e) => setRecipients(e.target.value)} 
              required
              rows={3}
            />
          </div>

          <div className="form-group">
            <label><FileText size={16} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }}/> Subject</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="Exciting Newsletter!" 
              value={subject} 
              onChange={(e) => setSubject(e.target.value)} 
              required 
            />
          </div>

          <div className="form-group">
            <label><FileText size={16} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }}/> Email Body</label>
            <textarea 
              className="form-control" 
              placeholder="Write your message here..." 
              value={body} 
              onChange={(e) => setBody(e.target.value)} 
              required 
              rows={8}
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            <Send size={18} /> {loading ? 'Sending Emails...' : 'Send Bulk Mail'}
          </button>
        </form>
      </div>
    </>
  );
};

export default Dashboard;
