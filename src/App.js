import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './App.css';
import './components/assets/css/styles.css';

import NavBar from './components/common/nav-bar.jsx';
import Footer from './components/common/footer.jsx';
import Homepage from './components/common/homepage.jsx';
import Login from './components/common/login.jsx';
import Register from './components/common/register.jsx';
import Employee from './components/applicant/employee.jsx';
import Employer from './components/employer/employer.jsx';
import VerifyOTP from './components/common/verify-otp.jsx';
import ApplicantProfile from './components/applicant/profile.jsx';
import PostJob from './components/employer/PostJob.jsx';
import ManageJobs from './components/employer/ManageJobs.jsx';
import ViewDetailJob from './components/employer/ViewDetailJob.jsx';
import ManageSavedJobs from './components/applicant/ManageSavedJobs.jsx';
import ViewAppliedHistory from './components/applicant/ViewAppliedHistory.jsx';

import AdminLayout from './components/admin/AdminLayout.jsx';
import Dashboard from './components/admin/Dashboard.jsx';
import SendEmail from './components/admin/SendEmail.jsx';
import ManageAccounts from './components/admin/ManageAccounts.jsx';
import SupportUser from './components/admin/SupportUser.jsx';
import ViewReports from './components/admin/ViewReports.jsx';

const queryClient = new QueryClient();

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      {!isAdminRoute && <NavBar />}
      <main>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/employee" element={<Employee />} />
          <Route path="/employer" element={<Employer />} />
          <Route path="/verify" element={<VerifyOTP />} />
          <Route path="/applicant/profile" element={<ApplicantProfile />} />
          <Route path="/post-job" element={<PostJob />} />
          <Route path="/manage-job" element={<ManageJobs />} />
          <Route path="/view-detail-job" element={<ViewDetailJob />} />
          <Route path="/manage-saved-jobs" element={<ManageSavedJobs />} />
          <Route path="/view-applied-history" element={<ViewAppliedHistory />} />

          {/* Các route dành cho admin */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="send-email" element={<SendEmail />} />
            <Route path="manage-accounts" element={<ManageAccounts />} />
            <Route path="support-user" element={<SupportUser />} />
            <Route path="view-reports" element={<ViewReports />} />
          </Route>
        </Routes>
      </main>
      {!isAdminRoute && <Footer />}
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AppContent />
      </Router>
    </QueryClientProvider>
  );
}

export default App;
