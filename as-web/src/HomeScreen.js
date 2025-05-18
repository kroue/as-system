import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function HomeScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const userEmail = location.state?.userEmail || 'Guest';

  const [coursesCount, setCoursesCount] = useState(0);
  const [sectionsCount, setSectionsCount] = useState(0);
  const [teachersCount, setTeachersCount] = useState(0);
  const [studentsCount, setStudentsCount] = useState(0);

  useEffect(() => {
    fetch('http://localhost/as-system/api/dashboard_counts.php')
      .then(res => res.json())
      .then(data => {
        setCoursesCount(Number(data.courses));
        setSectionsCount(Number(data.sections));
        setTeachersCount(Number(data.teachers));
        setStudentsCount(Number(data.students));
      })
      .catch(() => {
        setCoursesCount(0);
        setSectionsCount(0);
        setTeachersCount(0);
        setStudentsCount(0);
      });
  }, []);

  const styles = {
    background: {
      flex: 1,
      backgroundColor: '#f9f9f9', // Light gray background
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      padding: '20px',
    },
    container: {
      textAlign: 'center',
      maxWidth: '800px',
      width: '100%',
    },
    title: {
      fontSize: '28px',
      fontWeight: 'bold',
      color: '#007aff', // Blue text
      marginBottom: '30px',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '20px',
    },
    card: {
      backgroundColor: '#fff', // White background
      borderRadius: '15px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      padding: '20px',
      textAlign: 'center',
    },
    cardTitle: {
      fontSize: '20px',
      fontWeight: 'bold',
      color: '#333',
      marginBottom: '10px',
    },
    cardCount: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#007aff', // Blue text
    },
  };

  return (
    <div style={styles.background}>
      <div style={styles.container}>
        <h1 style={styles.title}>Welcome, {userEmail}!</h1>

        {/* Grid layout for cards */}
        <div style={styles.grid}>
          <div style={styles.card}>
            <p style={styles.cardTitle}>Total Courses</p>
            <p style={styles.cardCount}>{coursesCount}</p>
          </div>
          <div style={styles.card}>
            <p style={styles.cardTitle}>Total Sections</p>
            <p style={styles.cardCount}>{sectionsCount}</p>
          </div>
          <div style={styles.card}>
            <p style={styles.cardTitle}>Total Teachers</p>
            <p style={styles.cardCount}>{teachersCount}</p>
          </div>
          <div style={styles.card}>
            <p style={styles.cardTitle}>Total Students</p>
            <p style={styles.cardCount}>{studentsCount}</p>
          </div>
        </div>
      </div>
    </div>
  );
}