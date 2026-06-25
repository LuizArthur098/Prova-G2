import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import Feed from './pages/Feed';
import './index.css';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    document.body.className = darkMode ? 'theme-dark' : '';
  }, [darkMode]);

  const logout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  return (
    <Router>
      <div className="container">
        <div style={{display: 'flex', gap: '10px', marginBottom: '15px'}}>
          <nav className="box" style={{flexGrow: 1, marginBottom: 0}}>
            <Link to="/">Início</Link> | 
            {!token && <><Link to="/login"> Login</Link> | <Link to="/register"> Cadastrar</Link></>}
            {token && <span onClick={logout} style={{cursor: 'pointer', color: 'red', marginLeft: '5px'}}>Sair</span>}
          </nav>
          <button onClick={() => setDarkMode(!darkMode)} style={{width: 'auto'}}>
            {darkMode ? '☀️ Claro' : '🌙 Escuro'}
          </button>
        </div>
        <Routes>
          <Route path="/" element={<Feed />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;