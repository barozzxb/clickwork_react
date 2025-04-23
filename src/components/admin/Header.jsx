import { BellIcon, SearchIcon } from "lucide-react";
import '../styles/admin-dashboard.css';
export default function Header() {
    const user = { name: "Admin User", role: "Super Admin" };

    return (
        <header className="header">
            <div className="search-container">
                <SearchIcon className="search-icon h-4 w-4" />
                <input className="search-input input" placeholder="Search..." />
            </div>
            <div className="flex items-center gap-4">
                <div className="notification-bell">
                    <BellIcon className="h-5 w-5 text-gray-600" />
                    <span className="notification-badge">3</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="avatar-fallback">{user.name[0]}</div>
                    <div>
                        <div className="text-sm font-medium">{user.name}</div>
                        <div className="text-xs text-gray-500">{user.role}</div>
                    </div>
                </div>
            </div>
        </header>
    );
}