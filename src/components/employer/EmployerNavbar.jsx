import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import {
  FaHeadset,
  FaFlag,
  FaBell,
  FaUser,
  FaCog,
  FaBriefcase,
} from "react-icons/fa";
import axios from "axios";

const EmployerNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [profileImage, setProfileImage] = useState(""); // NEW
  const [loading, setLoading] = useState(false);
  const menuRef = useRef(null);
  const notificationRef = useRef(null);

  useEffect(() => {
    fetchNotifications();
    fetchProfile();
    const interval = setInterval(fetchNotifications, 120000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef, notificationRef]);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const response = await axios.get(
        "http://localhost:9000/api/employer/profile/notifications",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.data.status) {
        setNotifications(response.data.body || []);
        const unread = response.data.body.filter((notif) => !notif.read).length;
        setUnreadCount(unread);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const response = await axios.get(
        "http://localhost:9000/api/employer/profile",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.data.status) {
        const avatar = response.data.body?.avatar;
        setProfileImage(avatar); // relative path like /uploads/avatar/user_default.png
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      await axios.patch(
        `http://localhost:9000/api/employer/profile/notifications/${id}/read`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setNotifications(
        notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm("Bạn có chắc chắn muốn đăng xuất?")) {
      localStorage.removeItem("token");
      localStorage.removeItem("userEmail");
      navigate("/login");
    }
  };

  const avatarUrl = profileImage
    ? `http://localhost:9000${profileImage}`
    : "https://img.freepik.com/free-vector/user-circles-set_78370-4704.jpg?semt=ais_hybrid&w=740";

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary fixed-top">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          <span className="logo-title">C</span>lick
          <span className="logo-title">W</span>ork
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/employer">
                Quản lý công việc
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/employer/profile">
                Hồ sơ
              </Link>
            </li>
          </ul>

          <div className="ms-auto">
            <ul className="navbar-nav d-flex align-items-center">
              <li
                className="nav-item me-3 position-relative"
                ref={notificationRef}
              >
                <div
                  className="nav-link"
                  style={{ cursor: "pointer" }}
                  onClick={() => setShowNotifications(!showNotifications)}
                >
                  <FaBell size={20} />
                  {unreadCount > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </div>

                {showNotifications && (
                  <div
                    className="position-absolute end-0 mt-2 py-2 bg-white rounded shadow-sm"
                    style={{
                      width: "350px",
                      maxHeight: "400px",
                      overflowY: "auto",
                      zIndex: 1000,
                    }}
                  >
                    <div className="d-flex justify-content-between align-items-center px-3 py-2 border-bottom">
                      <h6 className="m-0">Thông báo</h6>
                      <Link
                        to="/employer/notifications"
                        className="text-primary"
                        onClick={() => setShowNotifications(false)}
                      >
                        Xem tất cả
                      </Link>
                    </div>

                    {notifications.length === 0 ? (
                      <div className="p-3 text-center text-muted">
                        Không có thông báo nào
                      </div>
                    ) : (
                      notifications.slice(0, 5).map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-3 border-bottom ${
                            !notification.read ? "bg-light" : ""
                          }`}
                          onClick={() => handleMarkAsRead(notification.id)}
                          style={{ cursor: "pointer" }}
                        >
                          <div className="d-flex justify-content-between">
                            <strong>{notification.title}</strong>
                            <small className="text-muted">
                              {new Date(
                                notification.createdAt
                              ).toLocaleDateString()}
                            </small>
                          </div>
                          <p className="mb-0 text-truncate">
                            {notification.content}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </li>

              {/* Profile Menu */}
              <li className="position-relative" ref={menuRef}>
                <div
                  className="profile_img"
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  style={{ cursor: "pointer" }}
                >
                  <img
                    src={avatarUrl}
                    alt="avatar"
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                  <KeyboardArrowDownIcon
                    sx={{ color: "#00d600", cursor: "pointer" }}
                  />
                </div>

                {showProfileMenu && (
                  <div
                    className="position-absolute end-0 mt-2 py-2 bg-white rounded shadow-sm"
                    style={{ width: "220px", zIndex: 1000 }}
                  >
                    <Link
                      to="/employer"
                      className="dropdown-item py-2 px-3"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      <FaBriefcase className="me-2" /> Quản lý công việc
                    </Link>
                    <Link
                      to="/employer/profile"
                      className="dropdown-item py-2 px-3"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      <FaUser className="me-2" /> Hồ sơ công ty
                    </Link>
                    <Link
                      to="/employer/profile/password"
                      className="dropdown-item py-2 px-3"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      <FaCog className="me-2" /> Đổi mật khẩu
                    </Link>
                    <Link
                      to="/employer/support"
                      className="dropdown-item py-2 px-3"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      <FaHeadset className="me-2" /> Yêu cầu hỗ trợ
                    </Link>
                    <Link
                      to="/employer/report"
                      className="dropdown-item py-2 px-3"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      <FaFlag className="me-2" /> Báo cáo người dùng
                    </Link>
                    <div className="dropdown-divider"></div>
                    <button
                      className="dropdown-item py-2 px-3 text-danger"
                      onClick={handleLogout}
                    >
                      Đăng xuất
                    </button>
                  </div>
                )}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default EmployerNavbar;
