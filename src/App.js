import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './App.css';

import 'bootstrap/dist/css/bootstrap.min.css';

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
import ForgotPassword from './components/common/forgotpassword.jsx';

import JobDetail from './components/common/jobdetail.jsx';
import JobList from './components/common/listjobs.jsx';

import './components/assets/css/styles.css';

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
import EmployerNavBar from './components/employer/EmployerNavbar.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const queryClient = new QueryClient();

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
    {/* //{!isAdminRoute && <EmployerNavbar />} */}
    {!isAdminRoute && (
      location.pathname.startsWith('/employer') ? <EmployerNavBar /> : <NavBar />
    )}

    <>
      {!isAdminRoute && <NavBar />}

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnHover
        draggable
      />


      <main>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/employee" element={<Employee />} />
          <Route path="/employer" element={<Employer />} />
          <Route path="/verify" element={<VerifyOTP />} />
          <Route path="/applicant/profile" element={<ApplicantProfile />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Các Route dành cho ứng viên */}

          <Route path="/jobs/:id" element={<JobDetail />} />
          <Route path="/jobs" element={<JobList />} />
          
          {/* Các Route dành cho nhà tuyển dụng */}


          <Route path="/employer/post-job" element={<PostJob />} />
          <Route path="/employer/manage-job" element={<ManageJobs />} />
          <Route path="/employer/view-detail-job" element={<ViewDetailJob />} />
          <Route path="/employer/manage-saved-jobs" element={<ManageSavedJobs />} />
          <Route path="/employer/view-applied-history" element={<ViewAppliedHistory />} />

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
