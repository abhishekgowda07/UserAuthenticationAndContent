import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/login', {
        username,
        password,
      });
      setErrorMessage(response.data.message);
      if (response.data.message === 'Login successful') {
        localStorage.setItem('username', username);
        navigate(`/dashboard`);
      }
      console.log(response.data); // Handle the response accordingly (e.g., store the token in local storage)
    } catch (err) {
      setErrorMessage('Invalid username or password');
      console.error('Login error:', err);
    }
  };

  const handleSignup = () => {
    navigate('/signup'); // Navigate to the signup page
  };

  return (
    <div
      style={{
        background: 'linear-gradient(to right, #b92b27, #1565c0)',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          width: '500px',
          padding: '40px',
          background: '#191919',
          textAlign: 'center',
          transition: '0.25s',
        }}
      >
        <form onSubmit={handleLogin}>
          <h1 style={{ color: 'white', textTransform: 'uppercase', fontWeight: 500 }}>Login</h1>
          <p className="text-muted" style={{ color: 'white', fontSize: '16px', margin: '10px 0' }}>
            Please enter your login and password!
          </p>
          <input
            type="text"
            name="username"
            placeholder="Username"
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
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="submit"
            value="Login"
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
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
        <button
          onClick={handleSignup}
          style={{
            border: 'none',
            background: 'none',
            display: 'block',
            margin: '20px auto',
            textAlign: 'center',
            border: '2px solid #3498db',
            padding: '14px 40px',
            outline: 'none',
            color: 'white',
            borderRadius: '24px',
            transition: '0.25s',
            cursor: 'pointer',
          }}
        >
          Don't have an account? Signup
        </button>
      </div>
    </div>
  );
};

export default LoginForm;
