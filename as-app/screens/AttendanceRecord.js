import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Calendar } from 'react-native-calendars';

export default function AttendanceRecordScreen({ route }) {
  const { sectionId, sectionName } = route.params;
  const [dates, setDates] = useState([]);
  const [markedDates, setMarkedDates] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch available attendance dates for the section
  useEffect(() => {
    fetch(`http://192.168.1.19/as-system/api/attendance_dates.php?section_id=${sectionId}`)
      .then(res => res.json())
      .then(data => {
        setDates(data);
        // Mark only available dates as enabled
        const marks = {};
        data.forEach(date => {
          marks[date] = {
            marked: true,
            dotColor: '#007aff',
            disabled: false,
          };
        });
        setMarkedDates(marks);
      })
      .catch(() => setDates([]));
  }, [sectionId]);

  // Fetch attendance for selected date
  useEffect(() => {
    if (!selectedDate) return;
    setLoading(true);
    fetch(`http://192.168.1.19/as-system/api/attendance_by_date.php?section_id=${sectionId}&date=${selectedDate}`)
      .then(res => res.json())
      .then(data => setAttendance(data))
      .catch(() => setAttendance([]))
      .finally(() => setLoading(false));
  }, [selectedDate, sectionId]);

  // Handle date selection
  const onDayPress = (day) => {
    if (dates.includes(day.dateString)) {
      setSelectedDate(day.dateString);
      setMarkedDates(prev => ({
        ...Object.fromEntries(
          Object.entries(prev).map(([date, obj]) => [date, { ...obj, selected: false }])
        ),
        [day.dateString]: {
          ...prev[day.dateString],
          selected: true,
          selectedColor: '#007aff',
        },
      }));
    }
  };

  return (
    <View style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.header}>Attendance Dates for {sectionName}</Text>
        <Calendar
          markedDates={markedDates}
          onDayPress={onDayPress}
          disableAllTouchEventsForDisabledDays={true}
        />
        {selectedDate && (
          <>
            <Text style={styles.subHeader}>Attendance on {selectedDate}</Text>
            {loading ? (
              <ActivityIndicator size="large" color="#007aff" />
            ) : (
              attendance.length > 0 ? attendance.map(item => (
                <View style={styles.studentCard} key={item.id}>
                  <Text style={styles.studentName}>{item.full_name}</Text>
                  <Text style={item.status === 'Present' ? styles.present : styles.absent}>
                    {item.status}
                  </Text>
                </View>
              )) : (
                <Text style={styles.emptyText}>No attendance records for this date.</Text>
              )
            )}
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, backgroundColor: '#f4f8fb' },
  container: { flex: 1, padding: 24, alignItems: 'center' },
  header: { fontSize: 24, fontWeight: 'bold', color: '#007aff', marginBottom: 20, textAlign: 'center' },
  subHeader: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 10, textAlign: 'center' },
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  studentName: { fontSize: 18, fontWeight: 'bold', color: '#007aff' },
  present: { fontSize: 16, color: '#28a745', fontWeight: 'bold' },
  absent: { fontSize: 16, color: 'red', fontWeight: 'bold' },
  emptyText: { fontSize: 18, color: '#999', textAlign: 'center', marginTop: 40 },
  dayAvailable: { alignItems: 'center', justifyContent: 'center', width: 32, height: 32, borderRadius: 16 },
  dayDisabled: { alignItems: 'center', justifyContent: 'center', width: 32, height: 32, borderRadius: 16, backgroundColor: '#eee' },
  dayText: { color: '#222', fontWeight: 'bold' },
  dayTextDisabled: { color: '#bbb' },
});