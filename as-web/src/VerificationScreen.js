import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function VerificationScreen() {
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const navigate = useNavigate();

  const verifyEmail = async () => {
    try {
      const response = await fetch('http://localhost:8000/accounts/verify-email/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, verification_code: verificationCode }),
      });

      if (response.ok) {
        alert('Email verified successfully!');
        navigate('/');
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to verify email.');
      }
    } catch (error) {
      alert('Failed to verify email. Please try again.');
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
    backText: {
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
      <h1 style={styles.title}>Verify Your Email</h1>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={styles.input}
      />
      <input
        type="text"
        placeholder="Verification Code"
        value={verificationCode}
        onChange={(e) => setVerificationCode(e.target.value)}
        style={styles.input}
      />
      <button onClick={verifyEmail} style={styles.button}>
        Verify
      </button>
      <p onClick={() => navigate('/')} style={styles.backText}>
        Back to Login
      </p>
    </div>
  );
}