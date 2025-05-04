import React, {useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const NavBar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    let username = null;
    const token = localStorage.getItem('token');
    if (token){
        username = jwtDecode(token).sub;
    }

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken = jwtDecode(token);
            const currentTime = Date.now() / 1000; // Convert to seconds
            if (decodedToken.exp < currentTime) {
                localStorage.removeItem('token');
                navigate('/login');
            }
        }
    } ,[navigate]);


    return (
        <nav className="navbar navbar-expand-lg bg-body-tertiary fixed-top">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">
                    <span className="logo-title">C</span>lick
                    <span className="logo-title">W</span>ork
                </Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                    data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                    aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link className="nav-link active" to="/">Trang chủ</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/jobs">Tất cả việc làm</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/employer">Trang dành cho Nhà tuyển dụng</Link>
                        </li>
                    </ul>

                    <div className="ms-auto">
                        <ul className="navbar-nav d-flex">
                            {username === null ? (
                                <>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/login">Đăng nhập</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/register">Đăng ký</Link>
                                    </li>
                                </>
                            ) : (
                                <>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/applicant/profile">
                                            Xin chào, {username}
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <button className="btn nav-link" onClick={handleLogout}>
                                            Đăng xuất
                                        </button>
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;
