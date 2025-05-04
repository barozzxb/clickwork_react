import React from 'react';
import { Link } from 'react-router-dom';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { colors } from '@mui/material';

const NavBar = () => {
    return (
        <nav className="navbar navbar-expand-lg bg-body-tertiary fixed-top">
        <div className="container-fluid">
            <Link className="navbar-brand" to="/"><span className="logo-title">C</span>lick<span
                                className="logo-title">W</span>ork</Link>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false"
                aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarSupportedContent">

                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                    <li className="nav-item">
                        <Link className="nav-link active" to="/">Trang chủ</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/employer/manage-job">Quản lý công việc</Link>
                    </li>
                </ul>

                <div className="ms-auto">
                    <ul className="navbar-nav d-flex">
                        <li className="nav-item">
                            <Link className="nav-link btn-action" to="/employer/post-job">Đăng tuyển</Link>
                        </li>
                        <a href="" className='profile_img'>
                            <img src="https://kynguyenlamdep.com/wp-content/uploads/2022/08/meme-meo-like.jpg" alt="" />
                            <KeyboardArrowDownIcon sx={{ color: "#00d600",  cursor: "pointer" }}/>
                        </a>
                    </ul>
                </div>

                
            </div>
        </div>
        </nav>
    );
};

export default NavBar;