import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardNavigation from '../../components/navigation/DashboardNavigation';
import BreadcrumbNavigation from '../../components/navigation/BreadcrumbNavigation';
import AttendanceStatusCard from './components/AttendanceStatusCard';
import WiFiValidationCard from './components/WiFiValidationCard';
import AttendanceHistoryWidget from './components/AttendanceHistoryWidget';
import AttendancePolicyCard from './components/AttendancePolicyCard';
import AttendanceModal from './components/AttendanceModal';
import Icon from '../../components/AppIcon';
import { resetTodayAttendance } from '../../utils/attendanceService';

// Use VITE_API_URL env var when available, otherwise localhost
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const MarkAttendance = () => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [todayMarked, setIsMarkedToday] = useState(false);
  const [markedTime, setMarkedTime] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [wifiStatus, setWifiStatus] = useState({
    isConnected: false,
    isValidNetwork: false,
    networkName: 'Checking...',
    clientIP: ''
  });

  const [attendanceRecords, setAttendanceRecords] = useState([]);

  const [currentStreak, setCurrentStreak] = useState(0);
  //const currentStreak = 3;
  const breadcrumbItems = [
    { label: 'Dashboard', path: '/student-dashboard' },
    { label: 'Mark Attendance', path: '/mark-attendance' }
  ];

  // ✅ Real-time clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // ✅ WiFi status check with dynamic API URL
  useEffect(() => {
    const checkWiFiStatus = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          `${API_URL}/api/attendance/validate-wifi`, // ✅ Using API_URL
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const data = await res.json();
        
        console.log('🔍 WiFi Response:', data);
        
        setWifiStatus({
          isConnected: true,
          isValidNetwork: data.isHostelWifi,
          networkName: data.isHostelWifi ? 'Hostel WiFi' : 'Non-College WiFi',
          clientIP: data.ip || 'unknown'
        });

      } catch (err) {
        console.log('❌ Backend Offline - Using fallback');
        setWifiStatus({
          isConnected: true,
          isValidNetwork: false,
          networkName: 'Backend Offline',
          clientIP: 'Unknown'
        });
      }
    };

    checkWiFiStatus();
    const interval = setInterval(checkWiFiStatus, 10000);
    return () => clearInterval(interval);
  }, []);

  // ✅ Attendance history with dynamic API URL
  const fetchAttendance = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        console.error('No token found');
        return;
      }

      const res = await fetch(
        `${API_URL}/api/attendance/history`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (res.status === 401) {
        console.error('Token expired or invalid');
        localStorage.removeItem('token');
        localStorage.removeItem('studentId');
        localStorage.removeItem('userId');
        navigate('/login');
        return;
      }

      const data = await res.json();
      console.log("Attendance API response:", data);

      if (data.success) {
        setAttendanceRecords(data.records);
        setIsMarkedToday(data.todayMarked);
        setCurrentStreak(data.currentStreak);

        if (data.todayMarked && data.records?.length > 0) {
          const today = new Date().toISOString().split('T')[0];
          const todayRec = data.records.find(r => r.date === today && r.status === 'present');
          if (todayRec && todayRec.time_marked) {
            setMarkedTime(todayRec.time_marked);
          }
        }
      }
    } catch (error) {
      console.error('Failed to fetch attendance:', error);
    }
  }, [navigate]);

  useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance]);

  const formatDate = (date) => date?.toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric'
  });

  const formatTime = (date) => date?.toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true
  });

  // ✅ Open modal on Mark Present click
  const handleMarkAttendance = () => {
    if (todayMarked) return;
    setShowAttendanceModal(true);
  };

  // ✅ Callback after successful two-step verification + attendance marking
  const handleAttendanceMarked = (timeStr) => {
    setIsMarkedToday(true);
    if (timeStr) {
      setMarkedTime(timeStr);
    }
    fetchAttendance();
  };

  const handleResetAttendance = async () => {
  try {
    setIsLoading(true);

    const result = await resetTodayAttendance();

    console.log("🧪 Reset response:", result);

    if (result.success) {
      setIsMarkedToday(false);
      setMarkedTime(null);
      setShowAttendanceModal(false);

      // Refresh attendance history/status
      window.location.reload();
    } else {
      alert(result.message || "Failed to reset attendance.");
    }

  } catch (error) {
    console.error("❌ Reset attendance error:", error);
    alert(error.message || "Failed to reset attendance.");
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-background pt-6">
      <DashboardNavigation userRole="student" notificationCount={3} />
      <BreadcrumbNavigation items={breadcrumbItems} />
      
      <div className="max-w-screen-2xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8 lg:py-10">
        {/* Header Section */}
        <div className="mb-6 md:mb-8">
          <button
            onClick={() => navigate('/student-dashboard')}
            className="group flex items-center gap-2 px-4 py-2 text-sm md:text-base font-medium text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 mb-4"
          >
            <Icon name="ArrowLeft" size={18} className="transition-transform group-hover:-translate-x-1" />
            <span>Back to Dashboard</span>
          </button>
          
          <div className="flex items-start justify-between gap-6">
            <div className="flex-1">
              <div className="inline-block mb-3">
                <div className="flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                  <Icon name="Calendar" size={14} />
                  <span>Daily Check-in</span>
                </div>
              </div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-2">
                Mark Attendance
              </h1>
              <p className="text-sm md:text-base lg:text-lg text-muted-foreground">
                Record your daily hostel presence with Wi-Fi validation
              </p>
            </div>
            
            {/* 🆕 TODAY'S DEADLINE - RIGHT OF MARK ATTENDANCE */}
            <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-4 border border-gray-100 min-w-[280px]">
              <div className="flex items-center gap-2 mb-3">
                <Icon name="Clock" size={16} color="#6b7280" />
                <h3 className="text-sm font-bold text-gray-900">
                  Today's Deadline
                </h3>
              </div>
              <div className="text-center py-3 bg-gray-50 rounded-lg">
                <div className="text-3xl font-extrabold text-blue-600 mb-1">
                  11:59 PM
                </div>
                <p className="text-xs text-gray-600">
                  Time remaining to mark attendance
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* WiFi Status Banner */}
        <div className="mb-6 md:mb-8">
          <div className={`rounded-xl p-4 border-2 transition-all duration-300 ${
            wifiStatus.isValidNetwork 
              ? 'bg-green-50 border-green-200 hover:border-green-300' 
              : 'bg-red-50 border-red-200 hover:border-red-300'
          }`}>
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${
                wifiStatus.isValidNetwork 
                  ? 'bg-green-500 animate-pulse shadow-lg shadow-green-500/50' 
                  : 'bg-red-500 shadow-lg shadow-red-500/50'
              }`} />
              <div className="flex-1">
                <span className={`font-semibold ${
                  wifiStatus.isValidNetwork ? 'text-green-900' : 'text-red-900'
                }`}>
                  {wifiStatus.networkName}
                </span>
                <span className={`text-sm ml-2 ${
                  wifiStatus.isValidNetwork ? 'text-green-700' : 'text-red-700'
                }`}>
                  IP: {wifiStatus.clientIP}
                </span>
              </div>
              {wifiStatus.isValidNetwork ? (
                <div className="flex items-center gap-2 bg-green-100 px-3 py-1.5 rounded-full">
                  <Icon name="CheckCircle2" size={16} color="#16a34a" />
                  <span className="text-xs font-semibold text-green-700">Connected</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 bg-red-100 px-3 py-1.5 rounded-full">
                  <Icon name="XCircle" size={16} color="#dc2626" />
                  <span className="text-xs font-semibold text-red-700">Disconnected</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {errorMessage && (
          <div className="mb-6 md:mb-8">
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 hover:border-red-300 transition-all duration-300">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                  <Icon name="AlertTriangle" size={20} color="#dc2626" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-red-900 mb-1">Error</h4>
                  <p className="text-sm text-red-700">{errorMessage}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content - Professional White Cards */}
        <div className="space-y-6 md:space-y-8">
          <AttendanceStatusCard
            isMarked={todayMarked}
            currentDate={formatDate(currentTime)}
            currentTime={formatTime(currentTime)}
            markedTime={markedTime}
          />

          <WiFiValidationCard
            isConnected={wifiStatus.isConnected}
            isValidNetwork={wifiStatus.isValidNetwork}
            networkName={wifiStatus.networkName}
            clientIP={wifiStatus.clientIP}
            onMarkAttendance={handleMarkAttendance}
            isLoading={isLoading}
            isMarked={todayMarked}
          />

          {process.env.NODE_ENV !== 'production' && (
  <div className="bg-amber-50 border-2 border-dashed border-amber-300 rounded-xl p-4">
    <div className="flex items-center justify-between gap-4">
      <div>
        <h3 className="font-semibold text-amber-900">
          🧪 Development Testing
        </h3>
        <p className="text-sm text-amber-700">
          Reset today's attendance so you can test again.
        </p>
      </div>

      <button
        onClick={handleResetAttendance}
        disabled={isLoading}
        className="px-4 py-2 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors"
      >
        {isLoading ? 'Resetting...' : "Reset Today's Attendance"}
      </button>
    </div>
  </div>
)}

          <AttendanceHistoryWidget
            attendanceRecords={attendanceRecords}
            currentStreak={currentStreak}
          />
        </div>
      </div>

      {/* Two-Step Verification Attendance Modal */}
      <AttendanceModal
        isOpen={showAttendanceModal}
        onClose={() => setShowAttendanceModal(false)}
        wifiStatus={wifiStatus}
        onAttendanceMarked={handleAttendanceMarked}
      />
    </div>
  );
};

export default MarkAttendance;