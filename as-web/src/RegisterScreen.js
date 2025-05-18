import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const register = async () => {
    if (!email || !username || !password || !confirmPassword) {
      alert('Please fill in all fields.');
      return;
    }
    if (password !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/accounts/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, username, password }),
      });

      if (response.ok) {
        alert('Registered successfully! Please check your email for verification.');
        navigate('/verify');
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to register.');
      }
    } catch (error) {
      alert('Failed to register. Please try again.');
    }
  };

  const styles = {
    background: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#f9f9f9', // Light gray background
      padding: '20px',
    },
    title: {
      fontSize: '26px',
      fontWeight: 'bold',
      color: '#007aff', // Blue text
      marginBottom: '20px',
      textAlign: 'center',
    },
    input: {
      width: '300px',
      padding: '12px',
      marginBottom: '15px',
      borderRadius: '25px',
      border: '1px solid #007aff', // Blue border
      backgroundColor: '#f0f8ff', // Light blue background
      color: '#007aff', // Blue text
      outline: 'none',
      fontSize: '14px',
    },
    button: {
      width: '300px',
      padding: '12px',
      backgroundColor: '#007aff', // Blue button
      borderRadius: '25px',
      color: '#fff',
      fontSize: '16px',
      fontWeight: 'bold',
      textAlign: 'center',
      cursor: 'pointer',
      border: 'none',
      marginTop: '10px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
    },
    signUpText: {
      marginTop: '20px',
      fontSize: '14px',
      color: '#007aff', // Blue text
      textDecoration: 'underline',
      cursor: 'pointer',
      textAlign: 'center',
    },
  };

  return (
    <div style={styles.background}>
      <h1 style={styles.title}>Create an Account</h1>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={styles.input}
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={styles.input}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={styles.input}
      />
      <input
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        style={styles.input}
      />
      <button onClick={register} style={styles.button}>
        Register
      </button>
      <p onClick={() => navigate('/')} style={styles.signUpText}>
        Back to Login
      </p>
    </div>
  );
}