import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import NavBar from './components/common/nav-bar.js';
import EmployerNavbar from './components/employer/EmployerNavbar.jsx';
import Footer from './components/common/footer.js';
import Homepage from './components/common/homepage.js';
import Login from './components/common/login.js';
import Register from './components/common/register.js';

import './components/assets/css/styles.css';
import PostJob from './components/employer/PostJob.jsx';
import ManageJobs from './components/employer/ManageJobs.jsx';
import ViewDetailJob from './components/employer/ViewDetailJob.jsx';
<<<<<<< Updated upstream
=======
import ManageSavedJobs from './components/applicant/ManageSavedJobs.jsx';
import ViewAppliedHistory from './components/applicant/ViewAppliedHistory.jsx';

import AdminLayout from './components/admin/AdminLayout.jsx';
import Dashboard from './components/admin/Dashboard.jsx';
import SendEmail from './components/admin/SendEmail.jsx';
import ManageAccounts from './components/admin/ManageAccounts.jsx';
import SupportUser from './components/admin/SupportUser.jsx';
import ViewReports from './components/admin/ViewReports.jsx';
import EmployerNavBar from './components/employer/EmployerNavbar.jsx';

const queryClient = new QueryClient();

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
>>>>>>> Stashed changes

function App() {
  return (
<<<<<<< Updated upstream
    <Router>
      <NavBar />
      
=======
    <>
    {/* //{!isAdminRoute && <EmployerNavbar />} */}
    {!isAdminRoute && (
      location.pathname.startsWith('/employer') ? <EmployerNavBar /> : <NavBar />
    )}
>>>>>>> Stashed changes
      <main>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
<<<<<<< Updated upstream
=======
          <Route path="/employee" element={<Employee />} />
          <Route path="/employer" element={<Employer />} />
          <Route path="/verify" element={<VerifyOTP />} />
          <Route path="/applicant/profile" element={<ApplicantProfile />} />

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
>>>>>>> Stashed changes
        </Routes>
      </main>

        {/* Trang danh cho nguoi tuyen dung */}
      {/* <EmployerNavbar/> */}
      <Routes>
        {/* <Route path="/" element={<Home />} /> */}
        <Route path="/post-job" element={<PostJob />} />
        <Route path="/manage-job" element={<ManageJobs />} />
        <Route path="/view-detail-job" element={<ViewDetailJob />} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
