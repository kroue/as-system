import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

export default function SectionAttendanceScreen({ navigation, route }) {
  const [sections, setSections] = useState([]);
  const teacherId = route?.params?.teacherId;
  const forRecord = route?.params?.forRecord;

  useEffect(() => {
    if (!teacherId) return;
    fetch(`http://192.168.1.19/as-system/api/sections_app.php?teacher_id=${teacherId}`)
      .then(res => res.json())
      .then(data => setSections(data));
  }, [teacherId]);

  const handleSelectSection = (section) => {
    if (forRecord) {
      navigation.navigate('AttendanceRecord', { sectionId: section.id, sectionName: section.name });
    } else {
      navigation.navigate('CheckAttendance', { sectionId: section.id, sectionName: section.name });
    }
  };

  return (
    <View style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.title}>Select Section for Attendance</Text>
        <FlatList
          data={sections}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.sectionCard}
              onPress={() => handleSelectSection(item)}
              activeOpacity={0.8}
            >
              <Text style={styles.sectionName}>{item.name}</Text>
              <Text style={styles.sectionInfo}>Section ID: {item.id}</Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No sections available.</Text>
          }
          contentContainerStyle={sections.length === 0 ? styles.emptyContainer : null}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, backgroundColor: '#f4f8fb' },
  container: { flex: 1, padding: 24, alignItems: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#007aff', marginBottom: 24, marginTop: 16, textAlign: 'center' },
  sectionCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 24,
    marginBottom: 16,
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
  sectionName: { fontSize: 20, fontWeight: 'bold', color: '#007aff', marginBottom: 6 },
  sectionInfo: { fontSize: 14, color: '#666' },
  emptyText: { fontSize: 18, color: '#999', textAlign: 'center', marginTop: 40 },
  emptyContainer: { flexGrow: 1, justifyContent: 'center' },
});