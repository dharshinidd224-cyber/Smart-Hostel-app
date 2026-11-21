import React, { useState, useRef, useEffect, useCallback } from 'react';
import Icon from '../../../components/AppIcon';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const STEP_WIFI = 1;
const STEP_FACE = 2;
const STEP_SUCCESS = 3;

// ─── Stepper ─────────────────────────────────────────────────────────────────
const Stepper = ({ currentStep }) => (
  <div className="flex items-center justify-center gap-2 mb-5">
    {/* Step 1 */}
    <div className="flex items-center gap-2">
      <div
        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
          currentStep > STEP_WIFI
            ? 'bg-blue-600 text-white'
            : currentStep === STEP_WIFI
              ? 'bg-blue-600 text-white ring-2 ring-blue-100'
              : 'border border-gray-300 text-gray-400 bg-white'
        }`}
      >
        {currentStep > STEP_WIFI ? (
          <Icon name="Wifi" size={12} color="white" />
        ) : (
          '1'
        )}
      </div>
      <span
        className={`text-xs font-semibold ${
          currentStep >= STEP_WIFI ? 'text-gray-900' : 'text-gray-400'
        }`}
      >
        Wi-Fi Verification
      </span>
    </div>

    {/* Connecting line */}
    <div
      className={`h-[1.5px] w-12 sm:w-16 transition-colors duration-300 ${
        currentStep > STEP_WIFI ? 'bg-blue-600' : 'bg-gray-200'
      }`}
    />

    {/* Step 2 */}
    <div className="flex items-center gap-2">
      <div
        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
          currentStep === STEP_FACE
            ? 'bg-blue-600 text-white ring-2 ring-blue-100'
            : currentStep > STEP_FACE
              ? 'bg-emerald-600 text-white'
              : 'border border-blue-400 text-blue-600 bg-white'
        }`}
      >
        {currentStep > STEP_FACE ? (
          <Icon name="Check" size={12} color="white" />
        ) : (
          '2'
        )}
      </div>
      <span
        className={`text-xs font-semibold ${
          currentStep >= STEP_FACE ? 'text-gray-900' : 'text-gray-400'
        }`}
      >
        Face Recognition
      </span>
    </div>
  </div>
);

// ─── Step 1: Wi-Fi Verification ───────────────────────────────────────────────
const WifiStep = ({ wifiStatus, onContinue, onCancel }) => {
  const { isValidNetwork, networkName, clientIP } = wifiStatus;

  return (
    <div>
      <Stepper currentStep={STEP_WIFI} />

      {/* Info card */}
      <div className="bg-[#f0f7ff] border border-blue-100 rounded-2xl p-4 mb-4 flex items-center gap-3.5">
        <div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center flex-shrink-0 shadow-sm text-white">
          <Icon name="Wifi" size={24} color="white" />
        </div>
        <div>
          <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wide">
            Step 1 of 2
          </span>
          <h4 className="text-base font-bold text-gray-900 leading-tight">
            Wi-Fi Verification
          </h4>
          <p className="text-xs text-gray-500 mt-0.5">
            Checking and verifying your hostel Wi-Fi connection.
          </p>
        </div>
      </div>

      {/* Connection result panel */}
      {isValidNetwork ? (
        <div className="bg-[#ecfdf5] border border-emerald-200 rounded-2xl p-4 mb-6 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
              <Icon name="CheckCircle2" size={20} color="#10b981" />
            </div>
            <div>
              <p className="text-sm font-bold text-emerald-900 leading-snug">
                Connected to Hostel WiFi
              </p>
              <p className="text-xs text-gray-600 mt-0.5 font-medium">
                Network: <span className="text-gray-800">{networkName || 'Hostel WiFi'}</span>
                &nbsp;&nbsp;|&nbsp;&nbsp;
                IP Address: <span className="font-mono text-gray-800">{clientIP || '127.0.0.1'}</span>
              </p>
            </div>
          </div>
          <span className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100/90 border border-emerald-300 px-3 py-1 rounded-full flex-shrink-0">
            <Icon name="Check" size={12} color="#047857" strokeWidth={3} />
            Verified
          </span>
        </div>
      ) : (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
              <Icon name="AlertTriangle" size={20} color="#ef4444" />
            </div>
            <div>
              <p className="text-sm font-bold text-red-900 leading-snug">
                Not Connected to Hostel WiFi
              </p>
              <p className="text-xs text-gray-600 mt-0.5 font-medium">
                Current IP: <span className="font-mono text-red-700">{clientIP || 'Unknown'}</span>
                &nbsp;— Connect to hostel network.
              </p>
            </div>
          </div>
          <span className="flex items-center gap-1 text-xs font-bold text-red-700 bg-red-100 border border-red-200 px-3 py-1 rounded-full flex-shrink-0">
            <Icon name="X" size={12} color="#b91c1c" strokeWidth={3} />
            Invalid
          </span>
        </div>
      )}

      {/* Buttons */}
      <div className="flex items-center justify-between gap-3 pt-1">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2.5 rounded-xl border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onContinue}
          disabled={!isValidNetwork}
          className={`flex-1 py-2.5 px-5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200 shadow-sm ${
            isValidNetwork
              ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/25 hover:shadow-md'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
          }`}
        >
          <span>Continue to Face Recognition</span>
          <Icon name="ArrowRight" size={16} />
        </button>
      </div>
    </div>
  );
};

// ─── Step 2: Face Recognition ─────────────────────────────────────────────────
const FaceStep = ({ onBack, onSuccess, onCancel }) => {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [cameraStatus, setCameraStatus] = useState('idle'); // idle | loading | ready | error
  const [cameraError, setCameraError] = useState('');
  const [verifyStatus, setVerifyStatus] = useState('idle'); // idle | verifying | success | failed
  const [verifyMessage, setVerifyMessage] = useState('');

  const startCamera = useCallback(async () => {
    setCameraStatus('loading');
    setCameraError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraStatus('ready');
    } catch (err) {
      console.error('Camera error:', err);
      setCameraStatus('error');
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraError('Camera permission denied. Please allow camera access in your browser settings.');
      } else if (err.name === 'NotFoundError') {
        setCameraError('No camera found on this device.');
      } else {
        setCameraError(`Camera error: ${err.message || 'Unable to access camera'}`);
      }
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }, []);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, [startCamera, stopCamera]);

  const captureFrame = () => {
    const video = videoRef.current;
    if (!video || video.readyState < 2) return null;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg', 0.9);
  };

  const handleVerify = async () => {
    if (cameraStatus !== 'ready') return;

    const image = captureFrame();
    if (!image) {
      setVerifyStatus('failed');
      setVerifyMessage('Could not capture frame from camera. Please ensure camera is active.');
      return;
    }

    setVerifyStatus('verifying');
    setVerifyMessage('');

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/attendance/verify-face`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ image })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setVerifyStatus('success');
        setVerifyMessage(data.message || 'Face verified successfully!');
        stopCamera();
        setTimeout(() => {
          onSuccess();
        }, 800);
      } else {
        setVerifyStatus('failed');
        setVerifyMessage(data.message || 'Face does not match. Please try again.');
      }
    } catch (err) {
      console.error('Verification error:', err);
      setVerifyStatus('failed');
      setVerifyMessage('Could not connect to face verification service. Please try again.');
    }
  };

  const handleBack = () => {
    stopCamera();
    onBack();
  };

  return (
    <div>
      <Stepper currentStep={STEP_FACE} />

      {/* Info card */}
      <div className="bg-[#f0f7ff] border border-blue-100 rounded-2xl p-4 mb-4 flex items-center gap-3.5">
        <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0 text-blue-600">
          <Icon name="Scan" size={24} color="#2563eb" />
        </div>
        <div>
          <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wide">
            Step 2 of 2
          </span>
          <h4 className="text-base font-bold text-gray-900 leading-tight">
            Face Recognition
          </h4>
          <p className="text-xs text-gray-500 mt-0.5">
            Verify your identity using the camera.
          </p>
        </div>
      </div>

      {/* Camera + Instructions row */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        {/* Camera Preview */}
        <div className="relative flex-1 aspect-[4/3] bg-gray-900 rounded-2xl overflow-hidden flex items-center justify-center">
          {cameraStatus === 'loading' && (
            <div className="flex flex-col items-center justify-center gap-2 p-4 text-center">
              <svg className="animate-spin w-8 h-8 text-blue-400" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
              <p className="text-xs text-gray-300">Starting camera...</p>
            </div>
          )}

          {cameraStatus === 'error' && (
            <div className="flex flex-col items-center justify-center gap-2 p-4 text-center">
              <Icon name="CameraOff" size={28} color="#f87171" />
              <p className="text-xs text-red-200">{cameraError}</p>
              <button
                type="button"
                onClick={startCamera}
                className="mt-1 px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700"
              >
                Retry
              </button>
            </div>
          )}

          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`w-full h-full object-cover -scale-x-100 ${
              cameraStatus === 'ready' ? 'block' : 'hidden'
            }`}
          />

          {/* 4 White Corner Brackets Overlay */}
          {cameraStatus === 'ready' && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="relative w-36 h-44">
                {/* Top-left */}
                <span className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-white rounded-tl-md drop-shadow" />
                {/* Top-right */}
                <span className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-white rounded-tr-md drop-shadow" />
                {/* Bottom-left */}
                <span className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-white rounded-bl-md drop-shadow" />
                {/* Bottom-right */}
                <span className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-white rounded-br-md drop-shadow" />
              </div>
            </div>
          )}

          {/* Verification in-progress overlay */}
          {verifyStatus === 'verifying' && (
            <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-2 z-10">
              <svg className="animate-spin w-8 h-8 text-blue-400" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
              <p className="text-xs font-semibold text-white">Comparing face with InsightFace...</p>
            </div>
          )}

          {/* Success overlay */}
          {verifyStatus === 'success' && (
            <div className="absolute inset-0 bg-emerald-900/80 flex flex-col items-center justify-center gap-2 z-10 animate-in fade-in">
              <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg">
                <Icon name="Check" size={28} color="white" strokeWidth={3} />
              </div>
              <p className="text-xs font-bold text-white">Face Matched!</p>
            </div>
          )}
        </div>

        {/* Instructions Box */}
        <div className="w-full sm:w-44 flex-shrink-0 bg-white border border-gray-100 rounded-2xl p-3.5 shadow-sm">
          <div className="flex items-center gap-1.5 mb-2.5 pb-1.5 border-b border-gray-100">
            <Icon name="Info" size={14} color="#2563eb" />
            <span className="text-xs font-bold text-gray-900">Instructions</span>
          </div>
          <ul className="space-y-2 text-left">
            {[
              'Look straight at the camera',
              'Keep your face within the frame',
              'Ensure good lighting',
              'Remove masks and sunglasses'
            ].map((text, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <Icon
                  name="Check"
                  size={12}
                  color="#2563eb"
                  strokeWidth={2.5}
                  className="mt-0.5 flex-shrink-0"
                />
                <span className="text-[11px] text-gray-700 leading-tight">
                  {text}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Error feedback if verification failed */}
      {verifyStatus === 'failed' && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-3 flex items-start gap-2.5">
          <Icon name="AlertCircle" size={16} color="#ef4444" className="mt-0.5 flex-shrink-0" />
          <p className="text-xs text-red-700 font-medium">{verifyMessage}</p>
        </div>
      )}

      {/* Verify Face Button */}
      <button
        type="button"
        onClick={handleVerify}
        disabled={cameraStatus !== 'ready' || verifyStatus === 'verifying' || verifyStatus === 'success'}
        className={`w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all duration-200 mb-3 shadow-md ${
          cameraStatus === 'ready' && verifyStatus !== 'verifying' && verifyStatus !== 'success'
            ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/25'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
        }`}
      >
        <Icon name="Camera" size={18} />
        <span>Verify Face</span>
      </button>

      {/* Back button */}
      <div className="flex items-center justify-start">
        <button
          type="button"
          onClick={handleBack}
          disabled={verifyStatus === 'verifying'}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          <Icon name="ArrowLeft" size={14} />
          <span>Back</span>
        </button>
      </div>
    </div>
  );
};

// ─── Step 3: Attendance Success ───────────────────────────────────────────────
const SuccessStep = ({ attendanceData, onDone }) => {
  const { date, time } = attendanceData;

  return (
    <div className="text-center py-2">
      {/* Centered green check icon with burst dots */}
      <div className="relative inline-flex items-center justify-center mx-auto mb-4">
        {/* Radiating sparkle dots */}
        <span className="absolute -top-1 -left-2 w-2 h-2 rounded-full bg-emerald-400 opacity-80" />
        <span className="absolute top-1 -right-2.5 w-1.5 h-1.5 rounded-full bg-emerald-300 opacity-90" />
        <span className="absolute -bottom-1 -left-3 w-1.5 h-1.5 rounded-full bg-emerald-300 opacity-80" />
        <span className="absolute -bottom-1 -right-2 w-2 h-2 rounded-full bg-emerald-400 opacity-90" />
        <span className="absolute top-4 -left-4 w-1 h-1 rounded-full bg-emerald-400" />
        <span className="absolute top-3 -right-4 w-1 h-1 rounded-full bg-emerald-400" />

        <div className="w-16 h-16 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30">
          <Icon name="Check" size={32} color="white" strokeWidth={3} />
        </div>
      </div>

      <h3 className="text-xl font-bold text-emerald-800 mb-1">
        Attendance Marked Successfully!
      </h3>
      <p className="text-xs text-gray-500 mb-6">
        Your presence has been recorded.
      </p>

      {/* Date and Time cards */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {/* Date card */}
        <div className="bg-gray-50/90 border border-gray-200 rounded-2xl p-3.5 flex items-center gap-3 text-left">
          <div className="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center flex-shrink-0 text-gray-500 shadow-2xs">
            <Icon name="Calendar" size={18} color="#4b5563" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
              Date
            </span>
            <p className="text-xs font-bold text-gray-900 mt-0.5">
              {date}
            </p>
          </div>
        </div>

        {/* Time card */}
        <div className="bg-gray-50/90 border border-gray-200 rounded-2xl p-3.5 flex items-center gap-3 text-left">
          <div className="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center flex-shrink-0 text-gray-500 shadow-2xs">
            <Icon name="Clock" size={18} color="#4b5563" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
              Time
            </span>
            <p className="text-xs font-bold text-gray-900 mt-0.5">
              {time}
            </p>
          </div>
        </div>
      </div>

      {/* Done button */}
      <button
        type="button"
        onClick={onDone}
        className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/25 transition-all"
      >
        Done
      </button>
    </div>
  );
};

// ─── Main Modal Component ─────────────────────────────────────────────────────
const AttendanceModal = ({ isOpen, onClose, wifiStatus, onAttendanceMarked }) => {
  const [step, setStep] = useState(STEP_WIFI);
  const [attendanceData, setAttendanceData] = useState({ date: '', time: '' });
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setStep(STEP_WIFI);
    }
  }, [isOpen]);

  // Lock background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    setStep(STEP_WIFI);
    onClose();
  };

  const handleFaceSuccess = async () => {
    setIsRecording(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/attendance/mark`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({})
      });

      const data = await res.json();

      const now = new Date();
      const dateStr = now.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
      const timeStr = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      });

      setAttendanceData({
        date: dateStr,
        time: timeStr
      });
      setStep(STEP_SUCCESS);

      if (onAttendanceMarked) {
        onAttendanceMarked(timeStr);
      }
    } catch (err) {
      console.error('Error marking attendance after face verification:', err);
    } finally {
      setIsRecording(false);
    }
  };

  const handleDone = () => {
    handleClose();
  };

  return (
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget && step !== STEP_FACE) {
          handleClose();
        }
      }}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-[490px] mx-auto overflow-hidden border border-gray-100 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-3">
          <h3 className="text-lg font-bold text-gray-900">Mark Attendance</h3>
          <button
            type="button"
            onClick={handleClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <Icon name="X" size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 pb-6 pt-1">
          {isRecording ? (
            <div className="py-12 flex flex-col items-center justify-center gap-3">
              <svg className="animate-spin w-10 h-10 text-blue-600" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
              <p className="text-sm font-semibold text-gray-700">Recording attendance...</p>
            </div>
          ) : (
            <>
              {step === STEP_WIFI && (
                <WifiStep
                  wifiStatus={wifiStatus}
                  onContinue={() => setStep(STEP_FACE)}
                  onCancel={handleClose}
                />
              )}

              {step === STEP_FACE && (
                <FaceStep
                  onBack={() => setStep(STEP_WIFI)}
                  onSuccess={handleFaceSuccess}
                  onCancel={handleClose}
                />
              )}

              {step === STEP_SUCCESS && (
                <SuccessStep
                  attendanceData={attendanceData}
                  onDone={handleDone}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendanceModal;
