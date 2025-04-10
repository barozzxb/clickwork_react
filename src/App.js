import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import NavBar from './components/common/nav-bar.jsx';
import Footer from './components/common/footer.jsx';
import Homepage from './components/common/homepage.jsx';
import Login from './components/common/login.jsx';
import Register from './components/common/register.jsx';
import Employee from './components/employee/employee.jsx';
import Employer from './components/employer/employer.jsx';
import Admin from './components/admin/admin.jsx';
import VerifyOTP from './components/common/verify-otp.jsx';
import './components/assets/css/styles.css';

function App() {
  return (
    <Router>

    

      <NavBar />

      <main>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/employee" element={<Employee />} />
          <Route path="/employer" element={<Employer />} />
          <Route path="/admin/dashboard" element={<Admin />} />
          <Route path="/verify" element={<VerifyOTP />} />
        </Routes>
      </main>

      <Footer />
    </Router>
  );
};

export default App;
