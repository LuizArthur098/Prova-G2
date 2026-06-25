import { useState, useEffect } from 'react';
import axios from 'axios';

function Feed() {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState('');
  const token = localStorage.getItem('token');
  const currentUser = localStorage.getItem('username');

  const fetchPosts = async () => {
    try {
      const response = await axios.get('http://localhost:3000/posts');
      setPosts(response.data);
    } catch (error) {
      console.error("Erro ao buscar posts", error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handlePost = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/posts', { content }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setContent('');
      fetchPosts(); 
    } catch (error) {
      alert("Sessão expirada ou erro ao publicar.");
    }
  };

  return (
    <div>
      {token ? (
        <div className="box">
          <h3>O que você está pensando, {currentUser}?</h3>
          <form onSubmit={handlePost}>
            <textarea value={content} onChange={e => setContent(e.target.value)} required rows="3" />
            <button type="submit">Publicar</button>
          </form>
        </div>
      ) : (
        <div className="box"><p>Faça login para publicar e curtir.</p></div>
      )}

      <h3>Feed</h3>
      {posts.map(post => (
        <div key={post.id} className="box">
          <strong>@{post.username}</strong>
          <p>{post.content}</p>
          <small>❤️ {post.likes} Curtidas</small>
        </div>
      ))}
    </div>
  );
}

export default Feed;