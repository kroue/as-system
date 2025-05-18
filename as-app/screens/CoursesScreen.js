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

export default function CoursesScreen({ navigation }) {
  const [courses, setCourses] = useState([]);
  const [courseName, setCourseName] = useState('');
  const [editingCourse, setEditingCourse] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      const storedCourses = JSON.parse(await AsyncStorage.getItem('courses')) || [];
      setCourses(storedCourses);
    };

    fetchCourses();
  }, []);

  const handleAddCourse = async () => {
    if (!courseName.trim()) {
      Alert.alert('Error', 'Course name cannot be empty.');
      return;
    }

    try {
      let updatedCourses = [...courses];
      if (editingCourse) {
        // Update existing course
        updatedCourses = updatedCourses.map(course =>
          course.id === editingCourse.id ? { ...course, name: courseName } : course
        );
        setEditingCourse(null);
      } else {
        // Add new course
        const newCourse = { id: Date.now().toString(), name: courseName };
        updatedCourses.push(newCourse);
      }

      setCourses(updatedCourses);
      await AsyncStorage.setItem('courses', JSON.stringify(updatedCourses));
      setCourseName('');
    } catch (error) {
      Alert.alert('Error', 'Failed to save course.');
    }
  };

  const handleEditCourse = course => {
    setCourseName(course.name);
    setEditingCourse(course);
  };

  const handleDeleteCourse = async courseId => {
    Alert.alert('Delete Course', 'Are you sure you want to delete this course?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Yes',
        onPress: async () => {
          try {
            const updatedCourses = courses.filter(course => course.id !== courseId);
            setCourses(updatedCourses);
            await AsyncStorage.setItem('courses', JSON.stringify(updatedCourses));
          } catch (error) {
            Alert.alert('Error', 'Failed to delete course.');
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.header}>Manage Courses</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter course name"
          placeholderTextColor="#007aff"
          value={courseName}
          onChangeText={setCourseName}
        />
        <TouchableOpacity style={styles.button} onPress={handleAddCourse}>
          <Text style={styles.buttonText}>
            {editingCourse ? 'Update Course' : 'Add Course'}
          </Text>
        </TouchableOpacity>

        <FlatList
          data={courses}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.courseItem}>
              <Text style={styles.courseText}>{item.name}</Text>
              <View style={styles.courseActions}>
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: '#007aff' }]}
                  onPress={() => handleEditCourse(item)}
                >
                  <Text style={styles.actionButtonText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: '#f44336' }]}
                  onPress={() => handleDeleteCourse(item.id)}
                >
                  <Text style={styles.actionButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No courses available. Add a course to get started.</Text>
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
  courseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#f0f8ff', // Light blue background
    borderRadius: 15,
  },
  courseText: {
    fontSize: 16,
    color: '#007aff', // Blue text
  },
  courseActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 10,
    borderRadius: 10,
    marginLeft: 10,
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
});