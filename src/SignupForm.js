import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SignupForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === 'username') {
      setUsername(value);
    } else if (name === 'password') {
      setPassword(value);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/signup', {
        username,
        password,
      });

      const responseData = response.data;
      if (response.status !== 200) {
        if (responseData.exists) {
          setErrorMessage(responseData.message);
        } else {
          throw new Error(responseData.message);
        }
      } else {
        console.log(responseData.message);
        if (responseData.message === "Signup successful") {
          navigate(`/login`); // Redirect to the login page after successful signup
        }
      }
    } catch (error) {
      console.error(error);
      setErrorMessage('Username already exists');
    }
  };

  const handleLogin = () => {
    navigate('/login'); // Navigate to the login page
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
        <form onSubmit={handleSignup}>
          <h1 style={{ color: 'white', textTransform: 'uppercase', fontWeight: 500 }}>Signup</h1>
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
            onChange={handleInputChange}
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
            onChange={handleInputChange}
          />
          <input
            type="submit"
            value="Signup"
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
          {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        </form>
        <button
          onClick={handleLogin}
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
          Already have an account? Login
        </button>
      </div>
    </div>
  );
};

export default SignupForm;
