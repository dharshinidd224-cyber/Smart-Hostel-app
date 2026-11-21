const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');

const authenticate = require('../middleware/auth.middleware');
const wifiCheck = require('../middleware/wifiCheck');

// 🔍 Debug (optional)
console.log('Controller functions:', Object.keys(attendanceController));


// Student routes
router.post(
  '/mark',
  authenticate,
  wifiCheck,
  attendanceController.markAttendance
);
router.get('/today', authenticate, attendanceController.getTodayAttendance);
router.get('/history', authenticate, attendanceController.getAttendanceHistory);
router.get(
  '/validate-wifi',
  authenticate,
  wifiCheck,
  attendanceController.validateWifi
);

// ── Face verification for attendance ──────────────────────────────────────────
// Called BEFORE /mark. The student's JWT identifies them; we fetch their
// stored embeddings and ask Flask to compare the live image against them.
router.post('/verify-face', authenticate, attendanceController.verifyFaceForAttendance);
router.post('/verify', authenticate, attendanceController.verifyFaceForAttendance);

// GET handlers so checking in browser shows confirmation rather than 404
router.get('/verify-face', (req, res) => {
  res.json({
    success: true,
    message: "Face verification endpoint is ready. Send POST with live image and JWT Bearer token."
  });
});
router.get('/verify', (req, res) => {
  res.json({
    success: true,
    message: "Face verification endpoint is ready. Send POST with live image and JWT Bearer token."
  });
});

// Warden routes
router.get('/report', authenticate, attendanceController.getAttendanceReport);
router.post('/auto-mark-absent', authenticate, attendanceController.autoMarkAbsent);

// 🧪 Development-only testing route
router.post(
  '/dev/reset-today',
  authenticate,
  attendanceController.resetTodayAttendance
);

module.exports = router;