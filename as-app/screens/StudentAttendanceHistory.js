import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

export default function StudentAttendanceHistory({ route }) {
  const { studentId, studentName, sectionId, sectionName } = route.params;
  const [records, setRecords] = useState([]);

  useEffect(() => {
    fetch(`http://192.168.1.19/as-system/api/attendance.php?student_id=${studentId}&section_id=${sectionId}`)
      .then(res => res.json())
      .then(data => setRecords(data));
  }, [studentId, sectionId]);

  return (
    <View style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.header}>Attendance for {studentName} ({sectionName})</Text>
        <FlatList
          data={records}
          keyExtractor={(item, idx) => idx.toString()}
          renderItem={({ item }) => (
            <View style={styles.recordRow}>
              <Text style={styles.recordDate}>{item.date}</Text>
              <Text style={[styles.recordStatus, item.status === 'present' ? styles.present : styles.absent]}>
                {item.status}
              </Text>
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No attendance records found.</Text>
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, backgroundColor: '#f4f8fb' },
  container: { flex: 1, padding: 24 },
  header: { fontSize: 20, fontWeight: 'bold', color: '#007aff', marginBottom: 20, textAlign: 'center' },
  recordRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderColor: '#e0eaff' },
  recordDate: { fontSize: 16, color: '#333' },
  recordStatus: { fontSize: 16, fontWeight: 'bold' },
  present: { color: '#4caf50' },
  absent: { color: '#f44336' },
  emptyText: { fontSize: 16, color: '#999', textAlign: 'center', marginTop: 40 },
});