import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function SidebarLayout({ children }) {
  const navigate = useNavigate();

  const styles = {
    container: {
      display: 'flex',
      height: '100vh',
    },
    sidebar: {
      width: '250px',
      backgroundColor: '#007bff', // Blue background
      color: '#fff',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between', // Space between buttons and logout
      alignItems: 'center',
      padding: '20px',
    },
    content: {
      flex: 1,
      padding: '20px',
      backgroundColor: '#f9f9f9', // Light gray background
    },
    button: {
      width: '100%',
      padding: '15px',
      marginBottom: '15px',
      backgroundColor: '#fff', // White button
      color: '#007bff', // Blue text
      border: 'none',
      borderRadius: '25px',
      fontSize: '16px',
      fontWeight: 'bold',
      cursor: 'pointer',
      textAlign: 'center',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
    },
    logoutButton: {
      marginTop: 'auto', // Push logout button to the bottom
      width: '100%',
      padding: '15px',
      backgroundColor: '#fff', // White button
      color: '#007bff', // Blue text
      border: 'none',
      borderRadius: '25px',
      fontSize: '16px',
      fontWeight: 'bold',
      cursor: 'pointer',
      textAlign: 'center',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
    },
  };

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:8000/accounts/logout/', {
        method: 'POST',
        credentials: 'include', // Important for session cookies
      });
    } catch (e) {
      // Optionally handle error
    }
    localStorage.removeItem('userEmail');
    navigate('/');
  };

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <div>
          <button
            style={styles.button}
            onClick={() => navigate('/home')}
          >
            Dashboard
          </button>
          <button
            style={styles.button}
            onClick={() => navigate('/courses')}
          >
            Manage Courses
          </button>
          <button
            style={styles.button}
            onClick={() => navigate('/sections')}
          >
            Manage Sections
          </button>
          <button
            style={styles.button}
            onClick={() => navigate('/students')}
          >
            Manage Students
          </button>
          <button
            style={styles.button}
            onClick={() => navigate('/teachers')}
          >
            Manage Teachers
          </button>
        </div>
        <button
          style={styles.logoutButton}
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div style={styles.content}>
        {children}
      </div>
    </div>
  );
}