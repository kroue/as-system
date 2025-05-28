import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginScreen from './LoginScreen';
import HomeScreen from './HomeScreen';
import HistoryScreen from './HistoryScreen';
import RegisterScreen from './RegisterScreen';
import CoursesScreen from './CoursesScreen';
import SectionsScreen from './SectionsScreen';
import StudentsScreen from './StudentsScreen';
import VerificationScreen from './VerificationScreen';
import TeachersScreen from './TeachersScreen'; // Import TeachersScreen
import SidebarLayout from './SidebarLayout';

export default function App() {
  
  return (
    <Router>
      <Routes>
        {/* Routes without Sidebar */}
        <Route path="/" element={<LoginScreen />} />
        <Route path="/register" element={<RegisterScreen />} />
        <Route path="/verify" element={<VerificationScreen />} />

        {/* Routes with Sidebar */}
        <Route
          path="/home"
          element={
            <SidebarLayout>
              <HomeScreen />
            </SidebarLayout>
          }
        />
        <Route
          path="/history"
          element={
            <SidebarLayout>
              <HistoryScreen />
            </SidebarLayout>
          }
        />
        <Route
          path="/courses"
          element={
            <SidebarLayout>
              <CoursesScreen />
            </SidebarLayout>
          }
        />
        <Route
          path="/sections"
          element={
            <SidebarLayout>
              <SectionsScreen />
            </SidebarLayout>
          }
        />
        <Route
          path="/students"
          element={
            <SidebarLayout>
              <StudentsScreen />
            </SidebarLayout>
          }
        />
        <Route
          path="/teachers"
          element={
            <SidebarLayout>
              <TeachersScreen />
            </SidebarLayout>
          }
        />
      </Routes>
    </Router>
  );
}
