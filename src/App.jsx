import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { isMobile, addResizeListener } from './utils/deviceDetector';

// Desktop Components
import { DesktopLogin } from './screens/DesktopLogin/DesktopLogin';
import { DesktopSignup } from './screens/DesktopSignup/DesktopSignup';
import { DesktopDashboard } from './screens/DesktopDashboard/DesktopDashboard';
import { DesktopEntryWindow } from './screens/DesktopEntryWindow/DesktopEntryWindow';
import { DesktopMymeals } from './screens/DesktopMymeals/DesktopMymeals';
import { DesktopSettings } from './screens/DesktopSettings/DesktopSettings';
import { DesktopWeightEntry } from './screens/DesktopWeightEntry/DesktopWeightEntry';

// Mobile Components
import { MobileLogin } from './screens/MobileLogin/MobileLogin';
import { MobileSignup } from './screens/MobileSignup/MobileSignup';
import { MobileDashboard } from './screens/MobileDashboard/MobileDashboard';
import { MobileEntryWindow } from './screens/MobileEntryWindow/MobileEntryWindow';
import { MobileMymeals } from './screens/MobileMymeals/MobileMymeals';
import { MobileSettings } from './screens/MobileSettings/MobileSettings';
import { MobileWeightEntry } from './screens/MobileWeightEntry/MobileWeightEntry';

const App = () => {
  const [isMobileDevice, setIsMobileDevice] = useState(isMobile());

  useEffect(() => {
    // Update device type on mount
    setIsMobileDevice(isMobile());

    // Add resize listener for responsive updates
    const handleResize = () => {
      setIsMobileDevice(isMobile());
    };

    const cleanup = addResizeListener(handleResize);

    // Cleanup
    return () => {
      cleanup && cleanup();
    };
  }, []);

  // Helper function to get the appropriate login path
  const getLoginPath = () => isMobileDevice ? "/mobile-login" : "/desktop-login";

  return (
    <Router>
      <Routes>
        {/* Root redirect */}
        <Route
          path="/"
          element={<Navigate to={getLoginPath()} replace />}
        />

        {/* Desktop Routes */}
        <Route
          path="/desktop-login"
          element={
            isMobileDevice ? (
              <Navigate to="/mobile-login" replace />
            ) : (
              <DesktopLogin />
            )
          }
        />
        <Route
          path="/desktop-signup"
          element={
            isMobileDevice ? (
              <Navigate to="/mobile-signup" replace />
            ) : (
              <DesktopSignup />
            )
          }
        />
        <Route
          path="/desktop-dashboard"
          element={
            isMobileDevice ? (
              <Navigate to="/mobile-dashboard" replace />
            ) : (
              <DesktopDashboard />
            )
          }
        />
        <Route
          path="/desktop-entry-window"
          element={
            isMobileDevice ? (
              <Navigate to="/mobile-entry-window" replace />
            ) : (
              <DesktopEntryWindow />
            )
          }
        />
        <Route
          path="/desktop-mymeals"
          element={
            isMobileDevice ? (
              <Navigate to="/mobile-mymeals" replace />
            ) : (
              <DesktopMymeals />
            )
          }
        />
        <Route
          path="/desktop-settings"
          element={
            isMobileDevice ? (
              <Navigate to="/mobile-settings" replace />
            ) : (
              <DesktopSettings />
            )
          }
        />
        <Route
          path="/desktop-weight-entry"
          element={
            isMobileDevice ? (
              <Navigate to="/mobile-weight-entry" replace />
            ) : (
              <DesktopWeightEntry />
            )
          }
        />

        {/* Mobile Routes */}
        <Route
          path="/mobile-login"
          element={
            !isMobileDevice ? (
              <Navigate to="/desktop-login" replace />
            ) : (
              <MobileLogin />
            )
          }
        />
        <Route
          path="/mobile-signup"
          element={
            !isMobileDevice ? (
              <Navigate to="/desktop-signup" replace />
            ) : (
              <MobileSignup />
            )
          }
        />
        <Route
          path="/mobile-dashboard"
          element={
            !isMobileDevice ? (
              <Navigate to="/desktop-dashboard" replace />
            ) : (
              <MobileDashboard />
            )
          }
        />
        <Route
          path="/mobile-entry-window"
          element={
            !isMobileDevice ? (
              <Navigate to="/desktop-entry-window" replace />
            ) : (
              <MobileEntryWindow />
            )
          }
        />
        <Route
          path="/mobile-mymeals"
          element={
            !isMobileDevice ? (
              <Navigate to="/desktop-mymeals" replace />
            ) : (
              <MobileMymeals />
            )
          }
        />
        <Route
          path="/mobile-settings"
          element={
            !isMobileDevice ? (
              <Navigate to="/desktop-settings" replace />
            ) : (
              <MobileSettings />
            )
          }
        />
        <Route
          path="/mobile-weight-entry"
          element={
            !isMobileDevice ? (
              <Navigate to="/desktop-weight-entry" replace />
            ) : (
              <MobileWeightEntry />
            )
          }
        />

        {/* Catch all unmatched routes and redirect to login */}
        <Route
          path="*"
          element={<Navigate to={getLoginPath()} replace />}
        />
      </Routes>
    </Router>
  );
}

export default App; 