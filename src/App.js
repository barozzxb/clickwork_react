import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ProtectedRoute from "./components/ProtectedRoutes.jsx";
import "./App.css";

import "bootstrap/dist/css/bootstrap.min.css";

import "./components/assets/css/styles.css";

import NavBar from "./components/common/nav-bar.jsx";
import Footer from "./components/common/footer.jsx";
import Homepage from "./components/common/homepage.jsx";
import Login from "./components/common/login.jsx";
import Register from "./components/common/register.jsx";
import Employee from "./components/applicant/employee.jsx";
import Employer from "./components/employer/employer.jsx";
import VerifyOTP from "./components/common/verify-otp.jsx";
import ApplicantProfile from "./components/applicant/profile.jsx";
import ForgotPassword from "./components/common/forgotpassword.jsx";

<<<<<<< HEAD
import JobDetail from "./components/common/jobdetail.jsx";
import JobList from "./components/common/listjobs.jsx";

import "./components/assets/css/styles.css";
=======
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

import JobDetail from './components/common/Jobdetail.jsx';
import JobList from './components/common/Listjobs.jsx';
>>>>>>> 0e1294f00099bc8d2672253e48f2becea143556d

// import PostJob from "./components/employer/PostJob.jsx";
import ManageJobs from "./components/employer/ManageJobs.jsx";
import ViewDetailJob from "./components/employer/ViewDetailJob.jsx";

import ManageSavedJobs from "./components/applicant/ManageSavedJobs.jsx";
import ViewAppliedHistory from "./components/applicant/ViewAppliedHistory.jsx";

import AdminLayout from "./components/admin/AdminLayout.jsx";
import Dashboard from "./components/admin/Dashboard.jsx";
import SendEmail from "./components/admin/SendEmail.jsx";
import ManageAccounts from "./components/admin/ManageAccounts.jsx";
import SupportUser from "./components/admin/SupportUser.jsx";
import ViewReports from "./components/admin/ViewReports.jsx";

import EmployerNavBar from "./components/employer/EmployerNavbar.jsx";

<<<<<<< HEAD
import SupportDetail from "./components/admin/SupportDetail.jsx";
=======
import AdminLayout from './components/admin/AdminLayout.jsx';
import Dashboard from './components/admin/Dashboard.jsx';
import SendEmail from './components/admin/SendEmail.jsx';
import ManageAccounts from './components/admin/ManageAccounts.jsx';
import SupportUser from './components/admin/SupportUser.jsx';
import ViewReports from './components/admin/ViewReports.jsx';
import AdminProfile from "./components/admin/AdminProfile.jsx"
import AdminNotificationsPage from "./components/admin/AdminNotificationsPage.jsx"
>>>>>>> 0e1294f00099bc8d2672253e48f2becea143556d

import NotFound from "./components/error/404.jsx";
import Error403 from "./components/error/403.jsx";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const queryClient = new QueryClient();

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  const isEmployerRoute = location.pathname.startsWith("/employer");

  return (
    <>
<<<<<<< HEAD
      {/* Navbar theo role */}
      {!isAdminRoute && (isEmployerRoute ? <EmployerNavBar /> : <NavBar />)}
=======
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
>>>>>>> 0e1294f00099bc8d2672253e48f2becea143556d

      <ToastContainer position="top-right" autoClose={5000} pauseOnHover />

      <main>
        <Routes>
          {/* PUBLIC */}
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify" element={<VerifyOTP />} />
          <Route path="/jobs/:id" element={<JobDetail />} />
          <Route path="/jobs" element={<JobList />} />

<<<<<<< HEAD
          {/* APPLICANT */}
          <Route element={<ProtectedRoute allowedRoles={["APPLICANT"]} />}>
            <Route path="/applicant" element={<Employee />} />
=======


          {/* Các Route dành cho ứng viên */}
          <Route element={<ProtectedRoute allowedRoles={['APPLICANT']} />}>
            <Route path="/applicant" element={<Applicant />} />
>>>>>>> 0e1294f00099bc8d2672253e48f2becea143556d
            <Route path="/applicant/profile" element={<ApplicantProfile />} />
            <Route
              path="/applicant/manage-saved-jobs"
              element={<ManageSavedJobs />}
            />
            <Route
              path="/applicant/view-applied-history"
              element={<ViewAppliedHistory />}
            />
          </Route>

          {/* EMPLOYER */}
          <Route element={<ProtectedRoute allowedRoles={["EMPLOYER"]} />}>
            <Route path="/employer" element={<Employer />} />
            {/* <Route path="/employer/post-job" element={<PostJob />} /> */}
            <Route path="/employer/job" element={<ManageJobs />} />
            <Route
              path="/employer/view-detail-job/:id"
              element={<ViewDetailJob />}
            />
          </Route>

          {/* ADMIN */}
          <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="send-email" element={<SendEmail />} />
              <Route path="manage-accounts" element={<ManageAccounts />} />
              <Route path="support-user" element={<SupportUser />} />
              <Route path="view-reports" element={<ViewReports />} />
<<<<<<< HEAD
              <Route
                path="support-user/support/:id"
                element={<SupportDetail />}
              />
=======
              <Route path="support-user/support/:id" element={<SupportDetail />} />
              <Route path="profile" element={<AdminProfile />} />
              <Route path="notifications" element={<AdminNotificationsPage />} />
>>>>>>> 0e1294f00099bc8d2672253e48f2becea143556d
            </Route>
          </Route>

          {/* ERROR */}
          <Route path="/403" element={<Error403 />} />
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
