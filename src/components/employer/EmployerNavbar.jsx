import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Menu, MenuItem } from "@mui/material";

const EmployerNavbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleLogout = () => {
    handleClose();
  };

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary fixed-top">
      <div className="container-fluid">
        <NavLink className="navbar-brand" to="/">
          <span className="logo-title">C</span>lick
          <span className="logo-title">W</span>ork
        </NavLink>

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
              <NavLink
                to="/"
                className={({ isActive }) =>
                  "nav-link" + (isActive ? " active" : "")
                }
              >
                Trang chủ
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/employer/manage-job"
                className={({ isActive }) =>
                  "nav-link" + (isActive ? " active" : "")
                }
              >
                Quản lý công việc
              </NavLink>
            </li>
          </ul>

          <div className="ms-auto">
            <ul className="navbar-nav d-flex align-items-center">
              <li className="nav-item">
                <NavLink
                  to="/employer/post-job"
                  className="nav-link btn-action"
                >
                  Đăng tuyển
                </NavLink>
              </li>
              <li
                className="nav-item profile_img"
                onClick={handleClick}
                style={{ cursor: "pointer" }}
              >
                <img
                  src="https://kynguyenlamdep.com/wp-content/uploads/2022/08/meme-meo-like.jpg"
                  alt="avatar"
                  style={{ width: 32, height: 32, borderRadius: "50%" }}
                />
                <KeyboardArrowDownIcon sx={{ color: "#00d600" }} />
              </li>
            </ul>
          </div>
        </div>
      </div>

      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem onClick={handleClose}>Hồ sơ công ty</MenuItem>
        <MenuItem onClick={handleLogout}>Đăng xuất</MenuItem>
      </Menu>
    </nav>
  );
};

export default EmployerNavbar;
