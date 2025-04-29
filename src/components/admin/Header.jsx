import { useState } from "react";

export default function Header() {
    const [showNotifications, setShowNotifications] = useState(false);
    const user = { name: "Admin User", role: "Super Admin" };

    const toggleNotifications = () => {
        setShowNotifications(!showNotifications);
    };

    return (
        <header className="header mb-4">
            <nav className="navbar navbar-expand-lg navbar-light bg-white px-3">
                <div className="container-fluid">
                    <button
                        className="navbar-toggler d-md-none collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#sidebarMenu"
                        aria-controls="sidebarMenu"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="d-flex flex-grow-1">
                        <form className="d-flex w-100 me-3">
                            <div className="input-group">
                                <span className="input-group-text bg-light border-0">
                                    <i className="bi bi-search"></i>
                                </span>
                                <input
                                    type="search"
                                    className="form-control bg-light border-0"
                                    placeholder="Search..."
                                    aria-label="Search"
                                />
                            </div>
                        </form>
                    </div>

                    <div className="d-flex align-items-center">
                        <div className="dropdown me-3 position-relative">
                            <button
                                className="btn position-relative"
                                onClick={toggleNotifications}
                                aria-expanded={showNotifications}
                            >
                                <i className="bi bi-bell fs-5"></i>
                                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                    3
                                </span>
                            </button>
                            {showNotifications && (
                                <div className="dropdown-menu dropdown-menu-end p-3 shadow show" style={{ minWidth: '300px' }}>
                                    <h6 className="dropdown-header">Notifications</h6>
                                    <div className="dropdown-divider"></div>
                                    <a href="#" className="dropdown-item d-flex align-items-center py-2">
                                        <div className="bg-primary text-white rounded-circle p-2 me-3">
                                            <i className="bi bi-person-fill"></i>
                                        </div>
                                        <div>
                                            <p className="mb-0">New user registered</p>
                                            <small className="text-muted">30 minutes ago</small>
                                        </div>
                                    </a>
                                    <div className="dropdown-divider"></div>
                                    <a href="#" className="dropdown-item d-flex align-items-center py-2">
                                        <div className="bg-success text-white rounded-circle p-2 me-3">
                                            <i className="bi bi-briefcase-fill"></i>
                                        </div>
                                        <div>
                                            <p className="mb-0">15 new jobs were posted</p>
                                            <small className="text-muted">1 hour ago</small>
                                        </div>
                                    </a>
                                    <div className="dropdown-divider"></div>
                                    <a href="#" className="dropdown-item text-center small text-muted">Show all notifications</a>
                                </div>
                            )}
                        </div>

                        <div className="dropdown">
                            <a href="#" className="d-flex align-items-center text-decoration-none dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                                <div className="avatar-circle bg-primary text-white me-2">
                                    {user.name[0]}
                                </div>
                                <div>
                                    <div className="fw-bold">{user.name}</div>
                                    <small>{user.role}</small>
                                </div>
                            </a>
                            <ul className="dropdown-menu dropdown-menu-end text-small shadow">
                                <li><a className="dropdown-item" href="#">Profile</a></li>
                                <li><a className="dropdown-item" href="#">Settings</a></li>
                                <li><hr className="dropdown-divider" /></li>
                                <li><a className="dropdown-item" href="#">Sign out</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    );
}