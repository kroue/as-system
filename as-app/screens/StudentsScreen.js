import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, StyleSheet
} from 'react-native';

export default function StudentsScreen({ route }) {
  const { sectionId, sectionName } = route.params;
  const [students, setStudents] = useState([]);
  const [sections, setSections] = useState([]);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetch(`http://192.168.1.36/as-system/api/students.php?section_id=${sectionId}`)
      .then(res => res.json())
      .then(data => setStudents(data));

    fetch('http://192.168.1.36/as-system/api/sections.php')
      .then(res => res.json())
      .then(data => setSections(data));

    fetch('http://192.168.1.36/as-system/api/courses.php')
      .then(res => res.json())
      .then(data => setCourses(data));
  }, [sectionId]);

  const getSectionName = (id) => {
    const section = sections.find(s => String(s.id) === String(id));
    return section ? section.name : 'Unknown Section';
  };

  const getCourseName = (id) => {
    const course = courses.find(c => String(c.id) === String(id));
    return course ? course.name : 'Unknown Course';
  };

  return (
    <View style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.header}>Students in {sectionName}</Text>
        <View style={styles.tableContainer}>
          {/* Table Header */}
          <View style={styles.tableRowHeader}>
            <Text style={styles.tableHeaderCell}>ID</Text>
            <Text style={styles.tableHeaderCell}>Full Name</Text>
            <Text style={styles.tableHeaderCell}>Gender</Text>
            <Text style={styles.tableHeaderCell}>Phone</Text>
            <Text style={styles.tableHeaderCell}>Section</Text>
            <Text style={styles.tableHeaderCell}>Course</Text>
          </View>
          {/* Table Rows */}
          <FlatList
            data={students}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>{item.student_id}</Text>
                <Text style={styles.tableCell}>{item.full_name}</Text>
                <Text style={styles.tableCell}>{item.gender}</Text>
                <Text style={styles.tableCell}>{item.phone_number}</Text>
                <Text style={styles.tableCell}>{getSectionName(item.section_id)}</Text>
                <Text style={styles.tableCell}>{getCourseName(item.course_id)}</Text>
              </View>
            )}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No students enrolled in this section.</Text>
            }
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1, padding: 20 },
  header: { fontSize: 24, fontWeight: 'bold', color: '#007aff', marginBottom: 20, textAlign: 'center' },
  tableContainer: { marginTop: 20 },
  tableRowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    backgroundColor: '#f0f8ff',
    borderRadius: 15,
    marginBottom: 10,
  },
  tableHeaderCell: { fontSize: 14, fontWeight: 'bold', color: '#007aff', flex: 1, textAlign: 'center' },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    backgroundColor: '#f0f8ff',
    borderRadius: 15,
    marginBottom: 10,
  },
  tableCell: { fontSize: 14, color: '#007aff', flex: 1, textAlign: 'center' },
  emptyText: { fontSize: 16, color: '#007aff', textAlign: 'center', marginTop: 20 },
});