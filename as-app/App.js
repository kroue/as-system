// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import HistoryScreen from './screens/AttendanceRecord';
import RegisterScreen from './screens/RegisterScreen';
import CoursesScreen from './screens/CoursesScreen'
import SectionsScreen from './screens/SectionsScreen';
import StudentsScreen from './screens/StudentsScreen';
import SelectSectionScreen from './screens/SelectSectionScreen';
import SectionAttendanceScreen from './screens/SectionAttendance';
import CheckAttendanceScreen from './screens/CheckAttendance';
import AttendanceRecordScreen from './screens/AttendanceRecord';
import StudentAttendanceHistory from './screens/StudentAttendanceHistory';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="History" component={HistoryScreen} />
        <Stack.Screen name ="Courses" component={CoursesScreen} />
        <Stack.Screen name ="Sections" component={SectionsScreen} />
        <Stack.Screen name ="Students" component={StudentsScreen} />
        <Stack.Screen name="SelectSection" component={SelectSectionScreen} />
        <Stack.Screen name="SectionAttendance" component={SectionAttendanceScreen} />
        <Stack.Screen name="AttendanceRecord" component={AttendanceRecordScreen} />
        <Stack.Screen name="CheckAttendance" component={CheckAttendanceScreen} />
        <Stack.Screen name="StudentAttendanceHistory" component={StudentAttendanceHistory} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
