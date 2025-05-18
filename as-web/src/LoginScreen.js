import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const login = async () => {
    if (!email || !password) {
      alert('Please enter email and password.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/accounts/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include', // Include cookies for session-based login
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          localStorage.setItem('userEmail', data.teacher.email); // Save email
          navigate('/home', { state: { teacherName: data.teacher.name, teacherId: data.teacher.id } });
        } else {
          alert('Login successful!');
          navigate('/home', { state: { userEmail: email } });
        }
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Invalid email or password.');
      }
    } catch (error) {
      alert('Failed to login. Please try again.');
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
    logo: {
      width: '120px',
      height: '120px',
      marginBottom: '20px',
      borderRadius: '50%',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
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
      <img src="/assets/logo.png" alt="Logo" style={styles.logo} />
      <h1 style={styles.title}>Welcome Back!</h1>
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
      <button onClick={login} style={styles.button}>
        Login
      </button>
      <p onClick={() => navigate('/register')} style={styles.signUpText}>
        No account? Sign up
      </p>
    </div>
  );
}