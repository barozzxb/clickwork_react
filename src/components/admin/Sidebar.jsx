import { NavLink } from "react-router-dom";
import { LayoutDashboardIcon, UsersIcon, MailIcon, BarChartIcon, HeadphonesIcon, SettingsIcon, LogOutIcon } from "lucide-react";

export default function Sidebar() {
    const isActive = (path) => window.location.pathname === path;

    return (
        <aside className="sidebar">
            <nav>
                <NavLink to="/admin/dashboard" className={`sidebar-link ${isActive("/admin/dashboard") ? "sidebar-link-active" : ""}`}>
                    <LayoutDashboardIcon className="icon h-5 w-5" />
                    <span className="text">Overview</span>
                </NavLink>
                <NavLink to="/admin/support-user" className={`sidebar-link ${isActive("/admin/support-user") ? "sidebar-link-active" : ""}`}>
                    <HeadphonesIcon className="icon h-5 w-5" />
                    <span className="text">Support</span>
                </NavLink>
                <NavLink to="/admin/manage-accounts" className={`sidebar-link ${isActive("/admin/manage-accounts") ? "sidebar-link-active" : ""}`}>
                    <UsersIcon className="icon h-5 w-5" />
                    <span className="text">Accounts</span>
                </NavLink>
                <NavLink to="/admin/view-reports" className={`sidebar-link ${isActive("/admin/view-reports") ? "sidebar-link-active" : ""}`}>
                    <BarChartIcon className="icon h-5 w-5" />
                    <span className="text">Reports</span>
                </NavLink>
                <NavLink to="/admin/send-email" className={`sidebar-link ${isActive("/admin/send-email") ? "sidebar-link-active" : ""}`}>
                    <MailIcon className="icon h-5 w-5" />
                    <span className="text">Emails</span>
                </NavLink>
                <NavLink to="#" className={`sidebar-link ${isActive("#") ? "sidebar-link-active" : ""}`}>
                    <SettingsIcon className="icon h-5 w-5" />
                    <span className="text">Settings</span>
                </NavLink>
                <NavLink to="#" className={`sidebar-link ${isActive("#") ? "sidebar-link-active" : ""}`}>
                    <LogOutIcon className="icon h-5 w-5" />
                    <span className="text">Logout</span>
                </NavLink>
            </nav>
        </aside>
    );
}