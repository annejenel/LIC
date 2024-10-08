import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Make sure you're using react-router-dom

import Dashboard from "./Dashboard/Dashboard";
import ManageStaff from "./Staff/ManageStaff";
const LazyLogin = React.lazy(() => import("./Login/Login"));
const LazyDashboard = React.lazy(() => import("./Dashboard/Dashboard"));
const LazyManageStaff = React.lazy(() => import("./Staff/ManageStaff"));
const LazySettings = React.lazy(() => import("./Settings/Settings"));
const LazyAnalytics = React.lazy(() => import("./Analytics/Analytics"));

//what
export default function App() {
  return (
    <Router>
      <React.Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<LazyLogin />} />
          <Route path="/dashboard" element={<LazyDashboard />} />
          <Route path="/staff" element={<LazyManageStaff />} />
          <Route path="/settings" element={<LazySettings />} />
          <Route path="/analytics" element={<LazyAnalytics />} />
        </Routes>
      </React.Suspense>
    </Router>
  );
}
