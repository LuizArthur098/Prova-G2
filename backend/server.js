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

// --- ROTAS DE POSTS E CURTIDAS ---

app.get('/posts', async (req, res) => {
    const db = await openDb();
    const posts = await db.all(`
        SELECT p.id, p.content, p.created_at, u.username, 
        (SELECT COUNT(*) FROM favorites WHERE post_id = p.id) as likes
        FROM posts p JOIN users u ON p.user_id = u.id
        ORDER BY p.created_at DESC
    `);
    res.json(posts);
});

app.post('/posts', verificarToken, async (req, res) => {
    const { content } = req.body;
    const db = await openDb();
    await db.run('INSERT INTO posts (user_id, content) VALUES (?, ?)', [req.userId, content]);
    res.status(201).json({ message: "Post publicado!" });
});

app.post('/posts/:id/like', verificarToken, async (req, res) => {
    const postId = req.params.id;
    const db = await openDb();
    const jaCurtiu = await db.get('SELECT * FROM favorites WHERE user_id = ? AND post_id = ?', [req.userId, postId]);

    if (jaCurtiu) {
        await db.run('DELETE FROM favorites WHERE user_id = ? AND post_id = ?', [req.userId, postId]);
        res.json({ message: "Descurtido." });
    } else {
        await db.run('INSERT INTO favorites (user_id, post_id) VALUES (?, ?)', [req.userId, postId]);
        res.json({ message: "Curtido!" });
    }
});

async function iniciarServidor() {
    try {
        // Força o servidor a abrir o banco primeiro para garantir que as tabelas existam
        const db = await openDb(); 
        
        app.listen(3000, () => {
            console.log('🚀 Backend rodando na porta 3000 e banco de dados pronto!');
        });
    } catch (error) {
        console.error("Erro ao iniciar o banco de dados:", error);
    }
}

iniciarServidor();