import React, { useEffect, useState } from 'react';

export default function SectionsScreen() {
  const [sections, setSections] = useState([]);
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [sectionName, setSectionName] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState('');

  // Fetch sections, courses, and teachers from backend
  useEffect(() => {
    fetch('http://localhost/as-system/api/sections.php')
      .then(res => res.json())
      .then(data => setSections(data));

    fetch('http://localhost/as-system/api/courses.php')
      .then(res => res.json())
      .then(data => setCourses(data));

    fetch('http://localhost/as-system/api/teachers.php')
      .then(res => res.json())
      .then(data => setTeachers(data));
  }, []);

  const handleAddSection = () => {
    if (!sectionName.trim() || !selectedCourse || !selectedTeacher) {
      alert('Please enter a section name, select a course, and select a teacher.');
      return;
    }

    fetch('http://localhost/as-system/api/sections.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: sectionName, course_id: selectedCourse, teacher_id: selectedTeacher }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setSections([...sections, { id: data.id, name: sectionName, course_id: selectedCourse, teacher_id: selectedTeacher }]);
          setSectionName('');
          setSelectedCourse('');
          setSelectedTeacher('');
        } else {
          alert('Failed to add section.');
        }
      });
  };

  const handleDeleteSection = (sectionId) => {
    if (window.confirm('Are you sure you want to delete this section?')) {
      fetch('http://localhost/as-system/api/sections.php', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `id=${sectionId}`,
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setSections(sections.filter((section) => section.id !== sectionId));
          } else {
            alert('Failed to delete section.');
          }
        });
    }
  };

  const getCourseName = (courseId) => {
    const course = courses.find((course) => String(course.id) === String(courseId));
    return course ? course.name : 'Unknown Course';
  };

  const getTeacherName = (teacherId) => {
    const teacher = teachers.find((teacher) => String(teacher.id) === String(teacherId));
    return teacher ? teacher.name : 'Unknown Teacher';
  };

  const styles = {
    background: {
      backgroundColor: '#f9f9f9',
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
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
      maxWidth: '400px',
      border: '1px solid #007aff',
      padding: '15px',
      marginBottom: '25px',
      borderRadius: '25px',
      backgroundColor: '#f0f8ff',
      color: '#007aff',
      display: 'block',
    },
    picker: {
      maxWidth: '400px',
      border: '1px solid #007aff',
      backgroundColor: '#f0f8ff',
      marginBottom: '25px',
      borderRadius: '25px',
      padding: '10px',
      color: '#007aff',
      display: 'block',
    },
    button: {
      maxWidth: '400px',
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
      display: 'block',
    },
    formGroup: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
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
  };

  return (
    <div style={styles.background}>
      <div style={styles.container}>
        <h1 style={styles.header}>Manage Sections</h1>
        <div style={styles.formGroup}>
          <input
            style={styles.input}
            placeholder="Enter section name"
            value={sectionName}
            onChange={(e) => setSectionName(e.target.value)}
          />
          <select
            value={selectedCourse}
            style={styles.picker}
            onChange={(e) => setSelectedCourse(e.target.value)}
          >
            <option value="">Select a course</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.name}
              </option>
            ))}
          </select>
          <select
            value={selectedTeacher}
            style={styles.picker}
            onChange={(e) => setSelectedTeacher(e.target.value)}
          >
            <option value="">Select a teacher</option>
            {teachers.map((teacher) => (
              <option key={teacher.id} value={teacher.id}>
                {teacher.name}
              </option>
            ))}
          </select>
          <button style={styles.button} onClick={handleAddSection}>
            Add Section
          </button>
        </div>

        {sections.length === 0 ? (
          <p style={styles.emptyText}>No sections available. Add a section to get started.</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Section Name</th>
                <th style={styles.th}>Course</th>
                <th style={styles.th}>Teacher</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sections.map((section) => (
                <tr key={section.id}>
                  <td style={styles.td}>{section.name}</td>
                  <td style={styles.td}>{getCourseName(section.course_id)}</td>
                  <td style={styles.td}>{getTeacherName(section.teacher_id)}</td>
                  <td style={styles.td}>
                    <button
                      style={{ ...styles.actionButton, backgroundColor: '#f44336' }}
                      onClick={() => handleDeleteSection(section.id)}
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