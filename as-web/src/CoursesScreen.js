import React, { useEffect, useState } from 'react';

export default function CoursesScreen() {
  const [courses, setCourses] = useState([]);
  const [courseName, setCourseName] = useState('');
  const [editingCourse, setEditingCourse] = useState(null);

  useEffect(() => {
    fetch('http://localhost/as-system/api/courses.php')
      .then(res => res.json())
      .then(data => setCourses(data));
  }, []);

  const handleAddCourse = () => {
    if (!courseName.trim()) {
      alert('Course name cannot be empty.');
      return;
    }

    if (editingCourse) {
      // Edit course
      fetch('http://localhost/as-system/api/courses.php', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editingCourse.id, name: courseName }),
      })
        .then(res => res.json())
        .then(() => {
          setCourses(courses.map(c =>
            c.id === editingCourse.id ? { ...c, name: courseName } : c
          ));
          setEditingCourse(null);
          setCourseName('');
        });
    } else {
      // Add course
      fetch('http://localhost/as-system/api/courses.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: courseName }),
      })
        .then(res => res.json())
        .then(data => {
          setCourses([...courses, { id: data.id, name: courseName }]);
          setCourseName('');
        });
    }
  };

  const handleEditCourse = course => {
    setCourseName(course.name);
    setEditingCourse(course);
  };

  const handleDeleteCourse = courseId => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      fetch('http://localhost/as-system/api/courses.php', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `id=${courseId}`,
      })
        .then(res => res.json())
        .then(() => {
          setCourses(courses.filter(course => course.id !== courseId));
        });
    }
  };

  const styles = {
    background: {
      backgroundColor: '#f9f9f9',
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center', // Center horizontally
      alignItems: 'flex-start', // Align content to the top
      padding: '20px',
    },
    container: {
      width: '100%',
      maxWidth: '800px',
    },
    header: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#333',
      marginBottom: '20px',
      textAlign: 'center',
    },
    input: {
      width: '100%',
      maxWidth: '400px', // Limit the input width
      border: '1px solid #007aff',
      padding: '15px',
      marginBottom: '25px', // Add space between input and button
      borderRadius: '25px',
      backgroundColor: '#f0f8ff',
      color: '#007aff',
      display: 'block', // Ensure the input behaves as a block element
    },
    button: {
      width: '100%',
      maxWidth: '400px', // Match the button width to the input
      padding: '15px',
      backgroundColor: '#007aff',
      borderRadius: '25px',
      color: '#fff',
      fontSize: '18px',
      fontWeight: 'bold',
      textAlign: 'center',
      border: 'none',
      cursor: 'pointer',
      marginBottom: '20px',
      display: 'block', // Ensure the button behaves as a block element
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      marginTop: '20px',
    },
    th: {
      backgroundColor: '#007aff',
      color: '#fff',
      padding: '10px',
      textAlign: 'left',
      border: '1px solid #ddd',
    },
    td: {
      padding: '10px',
      textAlign: 'left',
      border: '1px solid #ddd',
    },
    actionButton: {
      padding: '5px 10px',
      borderRadius: '5px',
      color: '#fff',
      fontSize: '14px',
      fontWeight: 'bold',
      border: 'none',
      cursor: 'pointer',
      marginRight: '5px',
    },
    emptyText: {
      fontSize: '16px',
      color: '#666',
      textAlign: 'center',
      marginTop: '20px',
    },
    formGroup: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
  };

  return (
    <div style={styles.background}>
      <div style={styles.container}>
        <h1 style={styles.header}>Manage Courses</h1>
        <div style={styles.formGroup}>
          <input
            style={styles.input}
            placeholder="Enter course name"
            value={courseName}
            onChange={e => setCourseName(e.target.value)}
          />
          <button style={styles.button} onClick={handleAddCourse}>
            {editingCourse ? 'Update Course' : 'Add Course'}
          </button>
        </div>

        {courses.length === 0 ? (
          <p style={styles.emptyText}>No courses available. Add a course to get started.</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Course Name</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map(course => (
                <tr key={course.id}>
                  <td style={styles.td}>{course.name}</td>
                  <td style={styles.td}>
                    <button
                      style={{ ...styles.actionButton, backgroundColor: '#007aff' }}
                      onClick={() => handleEditCourse(course)}
                    >
                      Edit
                    </button>
                    <button
                      style={{ ...styles.actionButton, backgroundColor: '#f44336' }}
                      onClick={() => handleDeleteCourse(course.id)}
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
    </div>
  );
}