import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

export default function CheckAttendanceScreen({ route }) {
  const { sectionId, sectionName } = route.params;
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({}); // { studentId: 'present' | 'absent' }

  useEffect(() => {
    fetch(`http://192.168.1.36/as-system/api/students.php?section_id=${sectionId}`)
      .then(res => res.json())
      .then(data => setStudents(data));
  }, [sectionId]);

  const toggleAttendance = (studentId) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: prev[studentId] === 'present' ? 'absent' : 'present'
    }));
  };

  const handleSave = async () => {
    const today = new Date().toISOString().slice(0, 10);
    // Save each student's attendance
    for (const student of students) {
      await fetch('http://192.168.1.36/as-system/api/attendance.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id: student.id,
          section_id: sectionId,
          date: today,
          status: attendance[student.id] || 'absent'
        }),
      });
    }
    alert('Attendance saved!');
  };

  return (
    <View style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.header}>Attendance for {sectionName}</Text>
        <FlatList
          data={students}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <Text style={styles.name}>{item.full_name}</Text>
              <TouchableOpacity
                style={[
                  styles.toggle,
                  attendance[item.id] === 'present' ? styles.present : styles.absent
                ]}
                onPress={() => toggleAttendance(item.id)}
              >
                <Text style={styles.toggleText}>
                  {attendance[item.id] === 'present' ? 'Present' : 'Absent'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
          ListEmptyComponent={<Text style={styles.emptyText}>No students in this section.</Text>}
        />
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Attendance</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1, padding: 20 },
  header: { fontSize: 24, fontWeight: 'bold', color: '#007aff', marginBottom: 20, textAlign: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, justifyContent: 'space-between' },
  name: { fontSize: 16, color: '#007aff', flex: 1 },
  toggle: { padding: 10, borderRadius: 8, minWidth: 80, alignItems: 'center' },
  present: { backgroundColor: '#4caf50' },
  absent: { backgroundColor: '#f44336' },
  toggleText: { color: '#fff', fontWeight: 'bold' },
  saveButton: { marginTop: 20, backgroundColor: '#007aff', padding: 15, borderRadius: 25, alignItems: 'center' },
  saveButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  emptyText: { fontSize: 16, color: '#007aff', textAlign: 'center', marginTop: 20 },
});