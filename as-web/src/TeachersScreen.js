import React, { useEffect, useState } from 'react';

export default function TeachersScreen() {
  const [teachers, setTeachers] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [editingTeacher, setEditingTeacher] = useState(null);

  // Fetch teachers from backend
  useEffect(() => {
    fetch('http://localhost/as-system/api/teachers.php')
      .then(res => res.json())
      .then(data => setTeachers(data));
  }, []);

  const addOrUpdateTeacher = () => {
    if (!name.trim() || !email.trim() || (!editingTeacher && !password.trim())) {
      alert('Please enter name, email, and password.');
      return;
    }

    if (editingTeacher) {
      // Update teacher
      fetch('http://localhost/as-system/api/teachers.php', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editingTeacher.id, name, email, password }),
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setTeachers(teachers.map(t =>
              t.id === editingTeacher.id ? { ...t, name, email } : t
            ));
            setEditingTeacher(null);
            setName('');
            setEmail('');
            setPassword('');
          } else {
            alert('Failed to update teacher.');
          }
        });
    } else {
      // Add teacher
      fetch('http://localhost/as-system/api/teachers.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setTeachers([...teachers, { id: data.id, name, email }]);
            setName('');
            setEmail('');
            setPassword('');
          } else {
            alert('Failed to add teacher.');
          }
        });
    }
  };

  const handleEditTeacher = (teacher) => {
    setEditingTeacher(teacher);
    setName(teacher.name);
    setEmail(teacher.email);
    setPassword('');
  };

  const handleDeleteTeacher = (id) => {
    if (!window.confirm('Are you sure you want to delete this teacher?')) return;
    fetch('http://localhost/as-system/api/teachers.php', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `id=${id}`,
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setTeachers(teachers.filter(t => t.id !== id));
          if (editingTeacher && editingTeacher.id === id) {
            setEditingTeacher(null);
            setName('');
            setEmail('');
            setPassword('');
          }
        } else {
          alert('Failed to delete teacher.');
        }
      });
  };

  const styles = {
    background: {
      backgroundColor: '#f9f9f9',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '40px 0',
    },
    header: {
      fontSize: '32px',
      fontWeight: 'bold',
      color: '#333',
      marginBottom: '25px',
      textAlign: 'center',
    },
    formGroup: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      marginBottom: '30px',
      width: '100%',
      maxWidth: '500px',
    },
    input: {
      maxWidth: '500px',
      width: '100%',
      border: '1px solid #007aff',
      padding: '15px',
      marginBottom: '20px',
      borderRadius: '25px',
      backgroundColor: '#f0f8ff',
      color: '#007aff',
      fontSize: '16px',
      display: 'block',
    },
    button: {
      maxWidth: '500px',
      width: '100%',
      padding: '15px',
      backgroundColor: '#007aff',
      borderRadius: '25px',
      color: '#fff',
      fontSize: '20px',
      fontWeight: 'bold',
      textAlign: 'center',
      border: 'none',
      cursor: 'pointer',
      marginBottom: '10px',
      display: 'block',
    },
    table: {
      width: '100%',
      maxWidth: '600px',
      borderCollapse: 'collapse',
      backgroundColor: '#fff',
      borderRadius: '10px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.03)',
      marginTop: '10px',
    },
    th: {
      backgroundColor: '#007aff',
      color: '#fff',
      padding: '12px',
      textAlign: 'left',
      border: '1px solid #ddd',
      fontSize: '16px',
    },
    td: {
      padding: '12px',
      textAlign: 'left',
      border: '1px solid #ddd',
      fontSize: '16px',
      color: '#333',
      backgroundColor: '#f9f9f9',
    },
    actionButton: {
      padding: '6px 12px',
      borderRadius: '6px',
      color: '#fff',
      fontSize: '14px',
      fontWeight: 'bold',
      border: 'none',
      cursor: 'pointer',
      marginRight: '8px',
    },
    editButton: {
      backgroundColor: '#007aff',
    },
    deleteButton: {
      backgroundColor: '#f44336',
    },
    emptyText: {
      fontSize: '16px',
      color: '#666',
      textAlign: 'center',
      marginTop: '20px',
    },
  };

  return (
    <div style={styles.background}>
      <h1 style={styles.header}>Manage Teachers</h1>
      <div style={styles.formGroup}>
        <input
          type="text"
          placeholder="Enter teacher name"
          value={name}
          onChange={e => setName(e.target.value)}
          style={styles.input}
        />
        <input
          type="email"
          placeholder="Enter teacher email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={styles.input}
        />
        <input
          type="password"
          placeholder={editingTeacher ? "Enter new password (leave blank to keep current)" : "Enter password"}
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={styles.input}
        />
        <button onClick={addOrUpdateTeacher} style={styles.button}>
          {editingTeacher ? 'Update Teacher' : 'Add Teacher'}
        </button>
        {editingTeacher && (
          <button
            onClick={() => {
              setEditingTeacher(null);
              setName('');
              setEmail('');
              setPassword('');
            }}
            style={{ ...styles.button, backgroundColor: '#aaa' }}
          >
            Cancel Edit
          </button>
        )}
      </div>
      {teachers.length === 0 ? (
        <p style={styles.emptyText}>No teachers available. Add a teacher to get started.</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {teachers.map((teacher) => (
              <tr key={teacher.id}>
                <td style={styles.td}>{teacher.name}</td>
                <td style={styles.td}>{teacher.email}</td>
                <td style={styles.td}>
                  <button
                    style={{ ...styles.actionButton, ...styles.editButton }}
                    onClick={() => handleEditTeacher(teacher)}
                  >
                    Edit
                  </button>
                  <button
                    style={{ ...styles.actionButton, ...styles.deleteButton }}
                    onClick={() => handleDeleteTeacher(teacher.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}