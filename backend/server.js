const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { openDb } = require('./database');

const app = express();
app.use(express.json());
app.use(cors());

const SECRET_KEY = "chave_secreta_prova_g2";

const verificarToken = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) return res.status(403).json({ error: "Token não fornecido." });

    jwt.verify(token.split(" ")[1], SECRET_KEY, (err, decoded) => {
        if (err) return res.status(401).json({ error: "Token inválido." });
        req.userId = decoded.id;
        next();
    });
};

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const db = await openDb();
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword]);
        res.status(201).json({ message: "Usuário criado com sucesso!" });
    } catch (error) {
        res.status(400).json({ error: "Usuário já existe." });
    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const db = await openDb();
    const user = await db.get('SELECT * FROM users WHERE username = ?', [username]);
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ error: "Credenciais inválidas." });
    }

    const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: '2h' });
    res.json({ message: "Login realizado!", token, username: user.username });
});

app.listen(3000, () => console.log('🚀 Backend rodando na porta 3000'));