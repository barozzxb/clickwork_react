import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ProtectedRoute from './components/ProtectedRoutes.jsx';
import './App.css';

import 'bootstrap/dist/css/bootstrap.min.css';

import './components/assets/css/styles.css';


import NavBar from './components/common/Nav-bar.jsx';
import Footer from './components/common/Footer.jsx';
import Homepage from './components/common/Homepage.jsx';
import Login from './components/common/Login.jsx';
import Register from './components/common/Register.jsx';
import Applicant from './components/applicant/Applicant.jsx';
import Employer from './components/employer/employer.jsx';
import VerifyOTP from './components/common/Verify-otp.jsx';
import ApplicantProfile from './components/applicant/Profile.jsx';
import ForgotPassword from './components/common/Forgotpassword.jsx';

import ActiveAccount from './components/common/ActiveAccount.jsx';

import JobDetail from './components/common/Jobdetail.jsx';
import JobList from './components/common/Listjobs.jsx';

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

import Search from './components/common/SearchAndFilter.jsx';

import EmployerNavBar from './components/employer/EmployerNavbar.jsx';

import SupportDetail from './components/admin/SupportDetail.jsx';

import NotFound from './components/error/404.jsx';
import Error403 from './components/error/403.jsx';


import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminProfile from './components/admin/AdminProfile.jsx';

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

          <Route path="/forgot-password" element={<ForgotPassword />} />

          <Route path="/verify" element={<VerifyOTP />} />
          <Route path="/jobs/:id" element={<JobDetail />} />
          <Route path="/jobs" element={<JobList />} />

          <Route path="/search" element={<Search />} />
          <Route path="/search/:keyword" element={<Search />} />

          <Route path="/active-account" element={<ActiveAccount />} />

          {/* Các Route dành cho ứng viên */}
          <Route element={<ProtectedRoute allowedRoles={['APPLICANT']} />}>
            <Route path="/applicant" element={<Applicant />} />
            <Route path="/applicant/profile" element={<ApplicantProfile />} />
          </Route>


          {/* Các Route dành cho nhà tuyển dụng */}
          <Route element={<ProtectedRoute allowedRoles={['EMPLOYER']} />}>
            <Route path="/employer" element={<Employer />} />
            <Route path="/post-job" element={<PostJob />} />
            <Route path="/manage-job" element={<ManageJobs />} />
            <Route path="/view-detail-job" element={<ViewDetailJob />} />
            <Route path="/manage-saved-jobs" element={<ManageSavedJobs />} />
            <Route path="/view-applied-history" element={<ViewAppliedHistory />} />
          </Route>


          {/* Các route dành cho admin */}
          <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="send-email" element={<SendEmail />} />
              <Route path="manage-accounts" element={<ManageAccounts />} />
              <Route path="support-user" element={<SupportUser />} />
              <Route path="view-reports" element={<ViewReports />} />
              <Route path="support-user/support/:id" element={<SupportDetail />} />
              <Route path="profile" element={<AdminProfile />} />
            </Route>
          </Route>


          {/* Route 403 */}
          <Route path="/403" element={<Error403 />} />

          {/* Route 404 */}
          <Route path="/404" element={<NotFound />} />

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
