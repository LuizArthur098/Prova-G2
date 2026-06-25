import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Feed from './pages/Feed';
import './index.css';

function App() {
  return (
    <Router>
      <div className="container">
        <nav className="box">
          <Link to="/">Início</Link> | <Link to="/login">Login</Link> | <Link to="/register">Cadastrar</Link>
        </nav>
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