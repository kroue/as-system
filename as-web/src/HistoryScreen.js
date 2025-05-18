import React, { useEffect, useState } from 'react';

export default function HistoryScreen() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = () => {
      const storedHistory = JSON.parse(localStorage.getItem('history')) || [];
      setHistory(storedHistory);
    };

    fetchHistory();
  }, []);

  const clearHistory = () => {
    if (window.confirm('Are you sure you want to clear all attendance history?')) {
      try {
        localStorage.removeItem('history');
        setHistory([]); // Clear the local state
        alert('Attendance history cleared.');
      } catch (error) {
        alert('Failed to clear history.');
      }
    }
  };

  return (
    <div style={styles.background}>
      <div style={styles.container}>
        <h1 style={styles.header}>Attendance History</h1>
        {history.length === 0 ? (
          <p style={styles.emptyText}>No attendance history available.</p>
        ) : (
          <ul style={styles.list}>
            {history.map((item, index) => (
              <li key={index} style={styles.item}>
                <span style={styles.itemText}>
                  {item.date} - {item.status} at {item.time} ({item.email})
                </span>
              </li>
            ))}
          </ul>
        )}
        <button style={styles.clearButton} onClick={clearHistory}>
          Clear History
        </button>
      </div>
    </div>
  );
}

const styles = {
  background: {
    backgroundColor: '#a8e063', // Gradient start color
    backgroundImage: 'linear-gradient(to bottom, #a8e063, #56ab2f)', // CSS gradient
    minHeight: '100vh',
    padding: '20px',
  },
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    backgroundColor: '#fff',
    borderRadius: '15px',
    padding: '20px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  header: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '20px',
    textAlign: 'center',
  },
  list: {
    listStyleType: 'none',
    padding: 0,
  },
  item: {
    padding: '15px',
    marginBottom: '10px',
    backgroundColor: '#f9f9f9',
    borderRadius: '10px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  itemText: {
    fontSize: '16px',
    color: '#333',
  },
  emptyText: {
    fontSize: '16px',
    color: '#666',
    textAlign: 'center',
    marginTop: '20px',
  },
  clearButton: {
    marginTop: '20px',
    padding: '15px',
    backgroundColor: '#f44336',
    borderRadius: '25px',
    color: '#fff',
    fontSize: '18px',
    fontWeight: 'bold',
    textAlign: 'center',
    border: 'none',
    cursor: 'pointer',
  },
};