import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [userData, setUserData] = useState({});
  const [content, setContent] = useState('');
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState('');
  const navigate = useNavigate();

  const cardStyle = {
    width: '200px',
    padding: '16px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    margin: '8px',
    backgroundColor: '#fff',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  };

  const titleStyle = {
    fontSize: '18px',
    marginBottom: '8px',
  };

  const contentStyle = {
    fontSize: '14px',
    color: '#666',
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const username = localStorage.getItem('username');
        if (!username) {
          navigate('/login'); // Redirect to the login page if the user is not logged in
          return;
        }

        const response = await axios.post(
          'http://localhost:5000/api/dashboard',
          { username }
        );
        setUserData(response.data.user);
        setPosts(Array.from(response.data.user.post));
      } catch (err) {
        console.error('Error fetching user data:', err);
      }
    };

    fetchData();
  }, [navigate]);

  const handlePosts = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/posts', {
        title,
        content,
        author: userData.username,
      });

      console.log(response.data);
      if (response.data.message === 'Added Post') {
        const updatedPostsResponse = await axios.post(
          'http://localhost:5000/api/dashboard',
          { username: userData.username }
        );
        setPosts(Array.from(updatedPostsResponse.data.user.post));
        setTitle('');
        setContent('');
      }
    } catch (err) {
      console.error('Error adding post:', err);
    }
  };

  const handleDeletePost = async (tit, content) => {
    try {
      await axios.post('http://localhost:5000/api/deltposts', {
        tit,
        content,
        author: userData.username,
      });
      console.log('Post deleted:', tit);
      setPosts((prevPosts) => prevPosts.filter(([title, content]) => title !== tit));
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('username');
    navigate('/login');
  };

  return (
    <div
      style={{
        background: 'linear-gradient(to right, #b92b27, #1565c0)',
        minHeight: '100vh',
        padding: '20px',
        position: 'relative',
      }}
    >
      {/* Logout button in the top-right corner */}
      <button
        onClick={handleLogout}
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          border: 'none',
          background: 'none',
          textAlign: 'center',
          border: '2px solid #e74c3c',
          padding: '10px 20px',
          outline: 'none',
          color: 'white',
          borderRadius: '24px',
          transition: '0.25s',
          cursor: 'pointer',
        }}
      >
        Logout
      </button>

      <h2 style={{ color: 'white' }}>Welcome to the Dashboard {userData.username}!</h2>
      <h2 style={{ color: 'white' }}>Add New Post</h2>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{
          border: 'none',
          background: 'none',
          display: 'block',
          margin: '20px auto',
          textAlign: 'center',
          border: '2px solid #3498db',
          padding: '10px 10px',
          width: '250px',
          outline: 'none',
          color: 'white',
          borderRadius: '24px',
          transition: '0.25s',
        }}
      />
      <textarea
        type="text"
        placeholder="Type Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        style={{
          border: 'none',
          background: 'none',
          display: 'block',
          margin: '20px auto',
          textAlign: 'center',
          border: '2px solid #3498db',
          padding: '10px 10px',
          width: '250px',
          height: '100px',
          outline: 'none',
          color: 'white',
          borderRadius: '10px',
          transition: '0.25s',
        }}
      />
      <input
        type="submit"
        value="Add Post"
        onClick={handlePosts}
        style={{
          border: 'none',
          background: 'none',
          display: 'block',
          margin: '20px auto',
          textAlign: 'center',
          border: '2px solid #2ecc71',
          padding: '14px 40px',
          outline: 'none',
          color: 'white',
          borderRadius: '24px',
          transition: '0.25s',
          cursor: 'pointer',
        }}
      />
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {posts.map(([title, content], index) => (
          <div key={index} style={cardStyle}>
            <h3 style={titleStyle}>{title}</h3>
            <p style={contentStyle}>{content}</p>
            <button onClick={() => handleDeletePost(title, content)} style={{ cursor: 'pointer' }}>
              Delete Post
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
