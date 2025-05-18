import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function HomeScreen({ route, navigation }) {
  const teacherName = route?.params?.teacherName || 'Teacher';
  const teacherId = route?.params?.teacherId;
  const [sections, setSections] = useState([]);
  const [studentsCount, setStudentsCount] = useState(0);
  const [activeTab, setActiveTab] = useState('attendance'); // 'attendance', 'records', 'sections'

  useEffect(() => {
    fetch(`http://192.168.1.36/as-system/api/sections_app.php?teacher_id=${teacherId}`)
      .then(res => res.json())
      .then(data => setSections(data));

    fetch(`http://192.168.1.36/as-system/api/students.php?teacher_id=${teacherId}`)
      .then(res => res.json())
      .then(data => setStudentsCount(data.length));
  }, [teacherId]);

  const handleLogout = () => {
    navigation.replace('Login');
  };

  const handleSectionPress = (section) => {
    navigation.navigate('Students', { sectionId: section.id, sectionName: section.name });
  };

  // Tab content rendering
  let tabContent = null;
  if (activeTab === 'attendance') {
    tabContent = (
      <View style={styles.tabContent}>
        <TouchableOpacity
          style={styles.bigActionButton}
          onPress={() => navigation.navigate('SectionAttendance', { teacherId })}
        >
          <Text style={styles.bigActionButtonText}>Go to Check Attendance</Text>
        </TouchableOpacity>
      </View>
    );
  } else if (activeTab === 'records') {
    tabContent = (
      <View style={styles.tabContent}>
        <TouchableOpacity
          style={[styles.bigActionButton, { backgroundColor: '#34a853' }]}
          onPress={() => navigation.navigate('SectionAttendance', { teacherId, forRecord: true })}
        >
          <Text style={styles.bigActionButtonText}>Go to Attendance Records</Text>
        </TouchableOpacity>
      </View>
    );
  } else if (activeTab === 'sections') {
    tabContent = (
      <View style={styles.tabContent}>
        <Text style={styles.sectionsTitle}>Your Sections</Text>
        <FlatList
          data={sections}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.sectionCard}
              onPress={() => handleSectionPress(item)}
            >
              <Text style={styles.sectionName}>{item.name}</Text>
              <Text style={styles.sectionInfo}>Section ID: {item.id}</Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No sections assigned to you.</Text>
          }
          contentContainerStyle={sections.length === 0 ? styles.emptyContainer : null}
        />
      </View>
    );
  }

  return (
    <View style={styles.background}>
      {/* Logout button on top right */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Icon name="log-out-outline" size={22} color="#007aff" />
      </TouchableOpacity>

      <View style={styles.container}>
        <Text style={styles.welcome}>Welcome, {teacherName}</Text>
        <Text style={styles.dashboardTitle}>Dashboard</Text>

        {/* Dashboard cards */}
        <View style={styles.dashboardRow}>
          <View style={styles.dashboardCard}>
            <Text style={styles.dashboardCardTitle}>Sections</Text>
            <Text style={styles.dashboardCardCount}>{sections.length}</Text>
          </View>
          <View style={styles.dashboardCard}>
            <Text style={styles.dashboardCardTitle}>Students</Text>
            <Text style={styles.dashboardCardCount}>{studentsCount}</Text>
          </View>
        </View>

        {/* Tab Content */}
        {tabContent}
      </View>

      {/* Bottom Navbar with icons */}
      <View style={styles.navbar}>
        <TouchableOpacity
          style={[styles.navItem, activeTab === 'attendance' && styles.navItemActive]}
          onPress={() => setActiveTab('attendance')}
        >
          <Icon
            name="checkbox-outline"
            size={28}
            color={activeTab === 'attendance' ? '#007aff' : '#888'}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.navItem, activeTab === 'records' && styles.navItemActive]}
          onPress={() => setActiveTab('records')}
        >
          <Icon
            name="document-text-outline"
            size={28}
            color={activeTab === 'records' ? '#007aff' : '#888'}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.navItem, activeTab === 'sections' && styles.navItemActive]}
          onPress={() => setActiveTab('sections')}
        >
          <Icon
            name="people-outline"
            size={28}
            color={activeTab === 'sections' ? '#007aff' : '#888'}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#f4f8fb',
  },
  logoutButton: {
    position: 'absolute',
    top: 18,
    right: 18,
    zIndex: 10,
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 20,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#007aff',
  },
  logoutButtonText: {
    color: '#007aff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 80,
    paddingBottom: 80, // space for navbar
  },
  welcome: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007aff',
    marginBottom: 10,
    textAlign: 'center',
  },
  dashboardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007aff',
    marginBottom: 20,
    textAlign: 'center',
  },
  dashboardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  dashboardCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginHorizontal: 8,
    alignItems: 'center',
    shadowColor: '#007aff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e0eaff',
  },
  dashboardCardTitle: {
    fontSize: 16,
    color: '#007aff',
    marginBottom: 8,
    fontWeight: 'bold',
  },
  dashboardCardCount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#007aff',
  },
  tabContent: {
    flex: 1,
    marginTop: 10,
  },
  bigActionButton: {
    backgroundColor: '#007aff',
    padding: 24,
    borderRadius: 25,
    alignItems: 'center',
    marginVertical: 30,
    marginHorizontal: 10,
    elevation: 2,
  },
  bigActionButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  sectionsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007aff',
    marginBottom: 16,
    marginTop: 10,
    textAlign: 'center',
  },
  sectionCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 24,
    marginBottom: 14,
    width: '100%',
    alignSelf: 'center',
    shadowColor: '#007aff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e0eaff',
  },
  sectionName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007aff',
    marginBottom: 4,
  },
  sectionInfo: {
    fontSize: 14,
    color: '#666',
  },
  emptyText: {
    fontSize: 18,
    color: '#999',
    textAlign: 'center',
    marginTop: 40,
  },
  emptyContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 64,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#e0eaff',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    elevation: 10,
    zIndex: 100,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
  },
  navItemActive: {
    borderBottomWidth: 3,
    borderColor: '#007aff',
  },
  navText: {
    color: '#888',
    fontSize: 16,
    fontWeight: 'bold',
  },
  navTextActive: {
    color: '#007aff',
  },
});