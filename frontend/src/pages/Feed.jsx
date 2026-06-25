import { useState, useEffect } from 'react';
import axios from 'axios';

function Feed() {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState('');
  const token = localStorage.getItem('token');
  const currentUser = localStorage.getItem('username');

  const fetchPosts = async () => {
    const response = await axios.get('http://localhost:3000/posts');
    setPosts(response.data);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handlePost = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:3000/posts', { content }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setContent('');
    fetchPosts();
  };

  const handleLike = async (postId) => {
    if (!token) return alert("Faça login para curtir!");
    await axios.post(`http://localhost:3000/posts/${postId}/like`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchPosts();
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
          <button 
            onClick={() => handleLike(post.id)} 
            style={{backgroundColor: '#e0245e', width: 'auto'}}
          >
            ❤️ {post.likes} Curtidas
          </button>
        </div>
      ))}
    </div>
  );
}

export default Feed;