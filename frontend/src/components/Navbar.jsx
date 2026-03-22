import { Link, useNavigate } from 'react-router-dom';
import { Mail, Send, History as HistoryIcon, LogOut } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        <Mail size={24} />
        BulkMail
      </Link>
      <div className="nav-links">
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Send size={18} /> Send Mail
        </Link>
        <Link to="/history" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <HistoryIcon size={18} /> History
        </Link>
        <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <LogOut size={18} /> Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
