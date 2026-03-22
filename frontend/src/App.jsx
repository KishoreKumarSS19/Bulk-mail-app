import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Mail } from 'lucide-react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import History from './pages/History';
import Navbar from './components/Navbar';
import './index.css';

// Simple mockup for protect route
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route 
            path="/*" 
            element={
              <PrivateRoute>
                <Navbar />
                <main className="main-content">
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/history" element={<History />} />
                    <Route path="*" element={<Navigate to="/" />} />
                  </Routes>
                </main>
              </PrivateRoute>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
