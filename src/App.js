import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import NavBar from './components/common/nav-bar.jsx';
import Footer from './components/common/footer.jsx';
import Homepage from './components/common/homepage.jsx';
import Login from './components/common/login.jsx';
import Register from './components/common/register.jsx';
import Employee from './components/applicant/employee.jsx';
import Employer from './components/employer/employer.jsx';
import Admin from './components/admin/admin.jsx';
import VerifyOTP from './components/common/verify-otp.jsx';
import ApplicantProfile from './components/applicant/profile.jsx';
import JobDetail from './components/common/jobdetail.jsx';

import './components/assets/css/styles.css';
import PostJob from './components/employer/PostJob.jsx';
import ManageJobs from './components/employer/ManageJobs.jsx';
import ViewDetailJob from './components/employer/ViewDetailJob.jsx';
import ManageSavedJobs from './components/applicant/ManageSavedJobs.jsx';
import ViewAppliedHistory from './components/applicant/ViewAppliedHistory.jsx';


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
          <Route path="/applicant/profile" element={<ApplicantProfile />} />
          <Route path="/jobs/:id" element={<JobDetail />} />
          
          {/* Các Route dành cho nhà tuyển dụng */}
          <Route path="/post-job" element={<PostJob />} />
          <Route path="/manage-job" element={<ManageJobs />} />
          <Route path="/view-detail-job" element={<ViewDetailJob />} />

          {/* Route dành cho người tìm việc */}
          <Route path="/manage-saved-jobs" element={<ManageSavedJobs />} />
          <Route path="/view-applied-history" element={<ViewAppliedHistory/>} />

          </Routes>
      </main>

      <Footer />
    </Router>
  );
};

export default App;
