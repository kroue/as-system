import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SectionsScreen({ navigation }) {
  const [sections, setSections] = useState([]);
  const [courses, setCourses] = useState([]);
  const [sectionName, setSectionName] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');

  // Fetch sections and courses from backend
  useEffect(() => {
    fetch('http://192.168.1.43/as-system/api/sections.php')
      .then(res => res.json())
      .then(data => setSections(data));

    fetch('http://192.168.1.43/as-system/api/courses.php')
      .then(res => res.json())
      .then(data => setCourses(data));
  }, []);

  const handleAddSection = async () => {
    if (!sectionName.trim() || !selectedCourse) {
      Alert.alert('Error', 'Please enter a section name and select a course.');
      return;
    }

    try {
      const response = await fetch('http://192.168.1.36/as-system/api/sections.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: sectionName, course_id: selectedCourse }),
      });
      const data = await response.json();
      if (data.success) {
        setSections([...sections, { id: data.id, name: sectionName, course_id: selectedCourse }]);
        setSectionName('');
        setSelectedCourse('');
      } else {
        Alert.alert('Error', 'Failed to add section.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to save section.');
    }
  };

  const handleDeleteSection = async sectionId => {
    Alert.alert('Delete Section', 'Are you sure you want to delete this section?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Yes',
        onPress: async () => {
          try {
            await fetch('http://192.168.1.43/as-system/api/sections.php', {
              method: 'DELETE',
              headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
              body: `id=${sectionId}`,
            });
            setSections(sections.filter(section => section.id !== sectionId));
          } catch (error) {
            Alert.alert('Error', 'Failed to delete section.');
          }
        },
      },
    ]);
  };

  const getCourseName = courseId => {
    const course = courses.find(course => String(course.id) === String(courseId));
    return course ? course.name : 'Unknown Course';
  };

  return (
    <View style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.header}>Manage Sections</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter section name"
          placeholderTextColor="#007aff"
          value={sectionName}
          onChangeText={setSectionName}
        />
        <Text style={{ color: '#007aff', marginBottom: 10 }}>Select a course:</Text>
        <FlatList
          data={courses}
          horizontal
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={{
                backgroundColor: selectedCourse === item.id ? '#007aff' : '#f0f8ff',
                padding: 10,
                borderRadius: 10,
                marginRight: 10,
              }}
              onPress={() => setSelectedCourse(item.id)}
            >
              <Text style={{ color: selectedCourse === item.id ? '#fff' : '#007aff' }}>
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
        />
        <TouchableOpacity style={styles.button} onPress={handleAddSection}>
          <Text style={styles.buttonText}>Add Section</Text>
        </TouchableOpacity>

        <FlatList
          data={sections}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.sectionItem}>
              <Text style={styles.sectionText}>
                {item.name} - {getCourseName(item.course_id)}
              </Text>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: '#f44336' }]}
                onPress={() => handleDeleteSection(item.id)}
              >
                <Text style={styles.actionButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              No sections available. Add a section to get started.
            </Text>
          }
        />
      </View>
    </View>
  );
}

export function SelectSectionScreen({ navigation }) {
  const [sections, setSections] = useState([]);

  useEffect(() => {
    fetch('http://192.168.1.43/as-system/api/sections.php')
      .then(res => res.json())
      .then(data => setSections(data));
  }, []);

  const handleSelectSection = (section) => {
    navigation.navigate('Students', { sectionId: section.id, sectionName: section.name });
  };

  return (
    <View style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.title}>Select Section</Text>
        <FlatList
          data={sections}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.sectionItem}
              onPress={() => handleSelectSection(item)}
            >
              <Text style={styles.sectionText}>{item.name}</Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No sections available.</Text>
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#fff', // White background
  },
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007aff', // Blue text
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#007aff', // Blue border
    padding: 15,
    marginBottom: 15,
    borderRadius: 25,
    backgroundColor: '#f0f8ff', // Light blue background for input
    color: '#007aff', // Blue text
  },
  button: {
    width: '100%',
    padding: 15,
    backgroundColor: '#007aff', // Blue button
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff', // White text
    fontSize: 18,
    fontWeight: 'bold',
  },
  sectionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#f0f8ff', // Light blue background
    borderRadius: 15,
  },
  sectionText: {
    fontSize: 16,
    color: '#007aff', // Blue text
  },
  actionButton: {
    padding: 10,
    borderRadius: 10,
  },
  actionButtonText: {
    color: '#fff', // White text
    fontSize: 14,
    fontWeight: 'bold',
  },
  emptyText: {
    fontSize: 16,
    color: '#007aff', // Blue text
    textAlign: 'center',
    marginTop: 20,
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: '#007aff', 
    marginBottom: 20, 
    textAlign: 'center' 
  },
});