import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import '../styles/admin-dashboard.css'; // Import your CSS file for admin layout

export default function AdminLayout() {
    return (
        <div className="admin-layout">
            <Sidebar />
            <div className="main-content">
                <Header />
                <Outlet />
                <Footer />
            </div>
        </div>
    );
}