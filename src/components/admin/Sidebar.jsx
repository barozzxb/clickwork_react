import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaHome, FaUsers, FaClipboardList, FaHeadset, FaBars, FaTimes, FaChartBar, FaEnvelope, FaUser, FaSignOutAlt } from 'react-icons/fa';
import './Sidebar.css';

const Sidebar = () => {
    const [isExpanded, setIsExpanded] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        const confirmLogout = window.confirm("Bạn có chắc chắn muốn đăng xuất?");
        if (confirmLogout) {
            localStorage.removeItem("token");
            navigate("/login");
        }
    };

    const menuItems = [
        { path: '/admin/dashboard', icon: <FaHome size={20} />, title: 'Dashboard' },
        { path: '/admin/support-user', icon: <FaHeadset size={20} />, title: 'Support' },
        { path: '/admin/manage-accounts', icon: <FaUsers size={20} />, title: 'Accounts' },
        { path: '/admin/view-reports', icon: <FaChartBar size={20} />, title: 'Reports' },
        { path: '/admin/send-email', icon: <FaEnvelope size={20} />, title: 'Emails' },
    ];

    const bottomMenuItems = [
        { path: '/admin/profile', icon: <FaUser size={20} />, title: 'Profile' },
        {
            path: '#',
            icon: <FaSignOutAlt size={20} />,
            title: 'Logout',
            onClick: handleLogout,
        },
    ];

    return (
        <div className={`sidebar ${isExpanded ? 'expanded' : 'collapsed'}`}>
            <div className="sidebar-header">
                <div className="logo-container">
                    {isExpanded ? (
                        <span className="logo fs-4 fw-bold" style={{ color: '#2b7a78' }}>ClickWork</span>
                    ) : (
                        <span className="logo-small fw-bold" style={{ color: '#2b7a78' }}>CW</span>
                    )}
                </div>
                <button
                    className="toggle-button"
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    {isExpanded ? <FaTimes size={20} /> : <FaBars size={20} />}
                </button>
            </div>

            <div className="menu-items">
                {menuItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`menu-item ${location.pathname === item.path ? 'active' : ''}`}
                    >
                        <span className="icon">{item.icon}</span>
                        {isExpanded && <span className="title">{item.title}</span>}
                        {!isExpanded && <div className="tooltip">{item.title}</div>}
                    </Link>
                ))}
            </div>

            <div className="menu-items mt-auto border-top pt-3">
                {bottomMenuItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        onClick={item.onClick}
                        className={`menu-item ${location.pathname === item.path ? 'active' : ''}`}
                    >
                        <span className="icon">{item.icon}</span>
                        {isExpanded && <span className="title">{item.title}</span>}
                        {!isExpanded && <div className="tooltip">{item.title}</div>}
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Sidebar;