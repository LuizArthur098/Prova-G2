import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/register', { username, password });
      alert('Conta criada! Faça login.');
      navigate('/login');
    } catch (error) {
      alert('Erro ao criar conta. Usuário pode já existir.');
    }
  };

  return (
    <div className="box">
      <h2>Criar Conta</h2>
      <form onSubmit={handleRegister}>
        <input type="text" placeholder="Usuário" onChange={e => setUsername(e.target.value)} required />
        <input type="password" placeholder="Senha" onChange={e => setPassword(e.target.value)} required />
        <button type="submit">Cadastrar</button>
      </form>
    </div>
  );
}

export default Register;