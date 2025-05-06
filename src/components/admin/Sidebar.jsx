import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { jwtDecode } from 'jwt-decode';

export default function Sidebar() {
    const [collapsed, setCollapsed] = useState(false);

    const toggleSidebar = () => {
        setCollapsed(!collapsed);
    };

    const navigate = useNavigate();

    const handleLogout = () => {
        const confirmLogout = window.confirm("Bạn có chắc chắn muốn đăng xuất?");
        if (confirmLogout) {
            // Xoá token và thông tin người dùng
            localStorage.removeItem("token");
            // localStorage.removeItem("user");

            // Chuyển hướng về trang login
            navigate("/login");
        }
    };

    return (
        <div className={`sidebar-wrapper ${collapsed ? 'collapsed' : ''}`}>
            <div className="sidebar-header py-3 px-2 d-flex justify-content-between align-items-center">
                <span className="fs-4 fw-bold text-primary">ClickWork</span>
                <button className="btn btn-sm d-md-none" onClick={toggleSidebar}>
                    <i className="bi bi-list"></i>
                </button>
            </div>

            <div className="sidebar-nav">
                <ul className="nav flex-column">
                    <li className="nav-item">
                        <NavLink to="/admin/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                            <i className="bi bi-grid me-2"></i>
                            <span>Dashboard</span>
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to="/admin/support-user" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                            <i className="bi bi-headset me-2"></i>
                            <span>Support</span>
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to="/admin/manage-accounts" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                            <i className="bi bi-people me-2"></i>
                            <span>Accounts</span>
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to="/admin/view-reports" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                            <i className="bi bi-bar-chart me-2"></i>
                            <span>Reports</span>
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to="/admin/send-email" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                            <i className="bi bi-envelope me-2"></i>
                            <span>Emails</span>
                        </NavLink>
                    </li>
                </ul>

                <hr className="my-3" />

                <ul className="nav flex-column">
                    <li className="nav-item">
                        <NavLink to="/admin/profile" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                            <i className="bi bi-person me-2"></i>
                            <span>Profile</span>
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <span className="nav-link" onClick={handleLogout} style={{ cursor: 'pointer' }}>
                            <i className="bi bi-box-arrow-right me-2"></i>
                            <span>Logout</span>
                        </span>
                    </li>
                </ul>
            </div>
        </div>
    );
}