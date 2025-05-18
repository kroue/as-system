import React, { useEffect, useState } from 'react';

export default function StudentsScreen() {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [sections, setSections] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [studentID, setStudentID] = useState('');
  const [fullName, setFullName] = useState('');
  const [gender, setGender] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [editingStudent, setEditingStudent] = useState(null);

  // Fetch students, courses, and sections from backend
  useEffect(() => {
    const fetchData = async () => {
      const studentsRes = await fetch('http://localhost/as-system/api/students.php');
      setStudents(await studentsRes.json());

      const coursesRes = await fetch('http://localhost/as-system/api/courses.php');
      setCourses(await coursesRes.json());

      const sectionsRes = await fetch('http://localhost/as-system/api/sections.php');
      setSections(await sectionsRes.json());
    };
    fetchData();
  }, []);

  const fetchStudents = async () => {
    const res = await fetch('http://localhost/as-system/api/students.php');
    setStudents(await res.json());
  };

  const handleAddStudent = async () => {
    if (
      !studentID ||
      !fullName ||
      !gender ||
      !selectedCourse ||
      !selectedSection ||
      !phoneNumber
    ) {
      alert('Please fill in all fields.');
      return;
    }

    try {
      let url = 'http://localhost/as-system/api/students.php';
      let method = 'POST';
      let body = {
        student_id: studentID,
        full_name: fullName,
        gender,
        course_id: selectedCourse,
        section_id: selectedSection,
        phone_number: phoneNumber,
      };

      if (editingStudent) {
        method = 'PUT';
        body.id = editingStudent.id;
      }

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      if (data.success) {
        fetchStudents();
        setStudentID('');
        setFullName('');
        setGender('');
        setSelectedCourse(null);
        setSelectedSection(null);
        setPhoneNumber('');
        setEditingStudent(null);
      } else {
        alert('Failed to save student.');
      }
    } catch (error) {
      alert('Failed to save student.');
    }
  };

  const handleEditStudent = student => {
    setStudentID(student.student_id);
    setFullName(student.full_name);
    setGender(student.gender);
    setSelectedCourse(student.course_id);
    setSelectedSection(student.section_id);
    setPhoneNumber(student.phone_number);
    setEditingStudent(student);
  };

  const handleDeleteStudent = async studentId => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await fetch('http://localhost/as-system/api/students.php', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: `id=${studentId}`,
        });
        fetchStudents();
      } catch (error) {
        alert('Failed to delete student.');
      }
    }
  };

  const getCourseName = courseId => {
    const course = courses.find(course => course.id === courseId);
    return course ? course.name : 'Unknown Course';
  };

  const getSectionName = sectionId => {
    const section = sections.find(section => section.id === sectionId);
    return section ? section.name : 'Unknown Section';
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
      maxWidth: '900px',
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
      maxWidth: '400px',
      border: '1px solid #007aff',
      padding: '15px',
      marginBottom: '20px',
      borderRadius: '25px',
      backgroundColor: '#f0f8ff',
      color: '#007aff',
      display: 'block',
    },
    select: {
      width: '100%',
      maxWidth: '400px',
      border: '1px solid #007aff',
      backgroundColor: '#f0f8ff',
      marginBottom: '20px',
      borderRadius: '25px',
      padding: '10px',
      color: '#007aff',
      display: 'block',
    },
    button: {
      width: '100%',
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
    formGroup: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%',
    },
  };

  return (
    <div style={styles.background}>
      <div style={styles.container}>
        <h1 style={styles.header}>Manage Students</h1>
        <div style={styles.formGroup}>
          <input
            type="text"
            placeholder="Student ID"
            value={studentID}
            onChange={e => setStudentID(e.target.value)}
            style={styles.input}
          />
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={e => setFullName(e.target.value)}
            style={styles.input}
          />
          <input
            type="text"
            placeholder="Phone Number"
            value={phoneNumber}
            onChange={e => setPhoneNumber(e.target.value)}
            style={styles.input}
          />
          <select value={gender} onChange={e => setGender(e.target.value)} style={styles.select}>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
          <select
            value={selectedCourse ?? ''}
            onChange={e => setSelectedCourse(e.target.value ? Number(e.target.value) : null)}
            style={styles.select}
          >
            <option value="">Select a Course</option>
            {courses.map(course => (
              <option key={course.id} value={course.id}>
                {course.name}
              </option>
            ))}
          </select>
          <select
            value={selectedSection ?? ''}
            onChange={e => setSelectedSection(e.target.value ? Number(e.target.value) : null)}
            style={styles.select}
            disabled={!selectedCourse}
          >
            <option value="">Select a Section</option>
            {sections
              .filter(section => section.course_id === selectedCourse)
              .map(section => (
                <option key={section.id} value={section.id}>
                  {section.name}
                </option>
              ))}
          </select>
          <button onClick={handleAddStudent} style={styles.button}>
            {editingStudent ? 'Update Student' : 'Add Student'}
          </button>
        </div>

        {students.length === 0 ? (
          <p style={styles.emptyText}>No students available. Add a student to get started.</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Student ID</th>
                <th style={styles.th}>Full Name</th>
                <th style={styles.th}>Gender</th>
                <th style={styles.th}>Course</th>
                <th style={styles.th}>Section</th>
                <th style={styles.th}>Phone Number</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map(student => (
                <tr key={student.id}>
                  <td style={styles.td}>{student.student_id}</td>
                  <td style={styles.td}>{student.full_name}</td>
                  <td style={styles.td}>{student.gender}</td>
                  <td style={styles.td}>{getCourseName(student.course_id)}</td>
                  <td style={styles.td}>{getSectionName(student.section_id)}</td>
                  <td style={styles.td}>{student.phone_number}</td>
                  <td style={styles.td}>
                    <button
                      style={styles.actionButton}
                      onClick={() => handleEditStudent(student)}
                    >
                      Edit
                    </button>
                    <button
                      style={{ ...styles.actionButton, ...styles.deleteButton }}
                      onClick={() => handleDeleteStudent(student.id)}
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