import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Make sure you're using react-router-dom

import Dashboard from './Dashboard/Dashboard';
import ManageStaff from './Staff/ManageStaff';
const LazyLogin = React.lazy(() => import('./Login/Login'))
const LazyDashboard = React.lazy(() => import('./Dashboard/Dashboard'))
const LazyManageStaff = React.lazy(() => import('./Staff/ManageStaff'))

//what
export default function App() {
  return (
    <Router>
      <React.Suspense fallback={null}>
      <Routes>
          <Route path='/' element={<LazyLogin />} />
          <Route path='/dashboard' element={<LazyDashboard />} />
          <Route path='staff' element={<LazyManageStaff/>}/>
        </Routes>
      </React.Suspense >
    </Router>
  );
}
