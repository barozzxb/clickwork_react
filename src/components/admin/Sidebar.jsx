import { NavLink } from "react-router-dom";
import { useState } from "react";

export default function Sidebar() {
    const [collapsed, setCollapsed] = useState(false);

    const toggleSidebar = () => {
        setCollapsed(!collapsed);
    };

    return (
        <div className={`sidebar-wrapper ${collapsed ? 'collapsed' : ''}`}>
            <div className="sidebar-header py-3 px-2 d-flex justify-content-between align-items-center">
                <span className="fs-4 fw-bold text-primary">Job Admin</span>
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
                        <NavLink to="#" className="nav-link">
                            <i className="bi bi-gear me-2"></i>
                            <span>Settings</span>
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to="#" className="nav-link">
                            <i className="bi bi-box-arrow-right me-2"></i>
                            <span>Logout</span>
                        </NavLink>
                    </li>
                </ul>
            </div>
        </div>
    );
}