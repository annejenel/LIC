import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Make sure you're using react-router-dom

import Dashboard from './Dashboard/Dashboard';
import ManageStaff from './Staff/ManageStaff';
const LazyLogin = React.lazy(() => import('./Login/Login'))


export default function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={
          <React.Suspense fallback={null}>
            <LazyLogin />
          </React.Suspense>
          } />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='staff' element={<ManageStaff/>}/>
      </Routes>
    </Router>
  );
}
