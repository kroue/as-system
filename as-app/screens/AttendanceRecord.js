import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function AttendanceRecordScreen({ route, navigation }) {
  const { sectionId, sectionName } = route.params;
  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetch(`http://192.168.1.36/as-system/api/students.php?section_id=${sectionId}`)
      .then(res => res.json())
      .then(data => setStudents(data));
  }, [sectionId]);

  const handleStudentPress = (student) => {
    navigation.navigate('StudentAttendanceHistory', {
      studentId: student.id,
      studentName: student.full_name,
      sectionId,
      sectionName,
    });
  };

  return (
    <View style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.header}>Students in {sectionName}</Text>
        <FlatList
          data={students}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.studentCard}
              onPress={() => handleStudentPress(item)}
            >
              <Text style={styles.studentName}>{item.full_name}</Text>
              <Text style={styles.studentInfo}>ID: {item.student_id}</Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No students in this section.</Text>
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  item: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  itemText: {
    fontSize: 16,
    color: '#fff',
  },
  emptyText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginTop: 20,
  },
  clearButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f44336',
    borderRadius: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  clearButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  background: { flex: 1, backgroundColor: '#f4f8fb' },
  container: { flex: 1, padding: 24, alignItems: 'center' },
  header: { fontSize: 24, fontWeight: 'bold', color: '#007aff', marginBottom: 20, textAlign: 'center' },
  studentCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 12,
    width: 320,
    alignSelf: 'center',
    shadowColor: '#007aff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e0eaff',
  },
  studentName: { fontSize: 18, fontWeight: 'bold', color: '#007aff', marginBottom: 4 },
  studentInfo: { fontSize: 14, color: '#666' },
  emptyText: { fontSize: 18, color: '#999', textAlign: 'center', marginTop: 40 },
});