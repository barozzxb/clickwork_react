import React from 'react';
import { Link } from 'react-router-dom';
import '../assets/css/styles.css';
import '../assets/css/bootstrap.min.css';
import '../assets/css/bootstrap.css';
import '../assets/css/bootstrap-grid.min.css';



const NavBar = () => {
    return (
        <nav class="navbar navbar-expand-lg bg-body-tertiary fixed-top">
        <div class="container-fluid">
            <a class="navbar-brand" href="#"><span class="logo-title">C</span>lick<span
                    class="logo-title">W</span>ork</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false"
                aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse" id="navbarSupportedContent">

                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                    <li class="nav-item">
                        <a class="nav-link active" href="#">Trang chủ</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#">Tất cả việc làm</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#">Trang dành cho Nhà tuyển dụng</a>
                    </li>
                </ul>

                <div class="ms-auto">
                    <ul class="navbar-nav d-flex">
                        <li class="nav-item">
                            <a class="nav-link" href="/html/login.html">Đăng nhập</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="/html/register.html">Đăng ký</a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        </nav>
    );
};

export default NavBar;