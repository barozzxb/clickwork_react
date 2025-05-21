import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import OverlayLoading from '../effects/Loading.jsx';
import { jwtDecode } from 'jwt-decode';

import Search from './Search.jsx';

import { API_ROOT } from '../../config.js';
import { formatRelativeTime } from '../../functions/dayformatter.js';

import './css/homepage.css';
import './css/job.css';

// import banner1 from '../assets/banner1.jpg';
// import banner2 from '../assets/banner2.jpg';

const Homepage = () => {
    const [loading, setLoading] = useState(false);
    const [jobs, setJobs] = useState([]);
    const [newJobs, setNewJobs] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            handleLoading(token);
        }
    }, [navigate]);

    useEffect(() => {
        const loadJobs = async () => {
            setLoading(true);
            try {
                const jobresponse = await axios.get(`${API_ROOT}/jobs`, {
                    // API call for recommended jobs
                });

                const jobList = jobresponse.data.body.content || [];
                const firstSixJobs = jobList.slice(0, 6);
                setJobs(firstSixJobs);

                const response = await axios.get(`${API_ROOT}/jobs/newjobs`, {
                    // API call for new jobs
                });
                setNewJobs(response.data.body || []);

            } catch (err) {
                console.error("Lỗi fetch jobs", err);
            } finally {
                setLoading(false);
            }
        };

        loadJobs();
    }, []);

    const handleLoading = (token) => {
        if (token) {
            const decoded = jwtDecode(token);
            const role = decoded.role;

            if (role) {
                if (role === 'ADMIN') {
                    navigate('/admin/dashboard');
                } else if (role === 'APPLICANT') {
                    navigate('/applicant');
                } else {
                    navigate('/employer');
                }
            }
        }
    }

    const JobCard = ({ job }) => (
        <div className="col-md-10 mb-4">
            <div className="card h-100">
                <div className="card-body">
                    <p className="text-secondary italic">{formatRelativeTime(job.createdat)}</p>
                    <h5 className="card-title">
                        <Link to={`/jobs/${job.id}`} className="job-title">{job.name}</Link>
                    </h5>
                    <p className="card-text location">
                        <i className="fa fa-location-dot"></i>
                        {job.address}
                    </p>
                    <p className="card-text job-field">
                        <i className="fa fa-bars"></i>
                        {job.field}
                    </p>
                    <p className="card-text job-type">
                        <i className="fa fa-suitcase"></i>
                        {job.jobtype}
                    </p>
                </div>
            </div>
        </div>
    );

    if (loading || !jobs || !newJobs) {
        return (
            <div className="container">
                <OverlayLoading />
            </div>
        );
    }

    return (
        <main className="job-portal-container">
            {loading && <OverlayLoading />}

            {/* Modern Hero Section */}
            <section className="hero-section">
                <div className="hero-content">
                    <h1 className="hero-title">Tìm việc vừa ý – Ứng tuyển ngay!</h1>
                    <p className="hero-subtitle">Khám phá hàng ngàn cơ hội nghề nghiệp từ các công ty hàng đầu</p>

                    {/* Search form integrated directly in hero */}
                    {/* <div className="search-container">
                        <form className="search-form" onSubmit={handleSearch}>
                            <div className="search-input-container">
                                <i className="fa fa-search search-icon"></i>
                                <input
                                    type="search"
                                    className="search-input"
                                    placeholder="Tìm kiếm theo chức danh, kỹ năng hoặc công ty..."
                                    value={keyword}
                                    onChange={e => setKeyword(e.target.value)}
                                />
                            </div>
                            <button className="search-button" type="submit">Tìm kiếm</button>
                        </form>
                    </div> */}
                    <Search />

                    {/* Quick category filters */}
                    <div className="quick-filters">
                        <span className="filter-chip">Công nghệ thông tin</span>
                        <span className="filter-chip">Marketing</span>
                        <span className="filter-chip">Kế toán</span>
                        <span className="filter-chip">Kỹ thuật</span>
                        <span className="filter-chip">Remote</span>
                    </div>
                </div>
            </section>

            {/* Jobs recommended for you */}
            <section className="jobs-section">
                <div className="section-header">
                    <h2 className="section-title">Được đề xuất cho bạn</h2>
                    <a href="#" className="view-all">Xem tất cả <i className="fa fa-arrow-right"></i></a>
                </div>

                <div className="jobs-grid">
                    {jobs.length === 0 ? (
                        <div className="empty-state">
                            <i className="fa fa-briefcase empty-icon"></i>
                            <p>Không có công việc nào được đề xuất</p>
                            <button className="update-profile-btn">Cập nhật hồ sơ</button>
                        </div>
                    ) : (
                        jobs.map((job) => (
                            <div className="job-card" key={job.id}>
                                <div className="job-card-header">
                                    <div className="job-time">{formatRelativeTime(job.createdat)}</div>
                                </div>

                                <h3 className="job-title">
                                    <Link to={`/jobs/${job.id}`}>{job.name}</Link>
                                </h3>

                                <div className="job-details">
                                    <div className="job-detail">
                                        <i className="fa fa-location-dot"></i>
                                        <span>{job.address}</span>
                                    </div>
                                    <div className="job-detail">
                                        <i className="fa fa-bars"></i>
                                        <span>{job.field}</span>
                                    </div>
                                    <div className="job-detail">
                                        <i className="fa fa-suitcase"></i>
                                        <span>{job.jobtype}</span>
                                    </div>
                                </div>

                                <div className="job-card-footer">
                                    <button className="apply-btn">Ứng tuyển ngay</button>
                                    <button className="save-job-btn">
                                        <i className="fa fa-bookmark"></i>
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </section>

            {/* Latest jobs */}
            <section className="jobs-section">
                <div className="section-header">
                    <h2 className="section-title">Mới nhất</h2>
                    <a href="#" className="view-all">Xem tất cả <i className="fa fa-arrow-right"></i></a>
                </div>

                <div className="jobs-grid">
                    {newJobs.length === 0 ? (
                        <div className="empty-state">
                            <i className="fa fa-clock empty-icon"></i>
                            <p>Chưa có công việc mới</p>
                        </div>
                    ) : (
                        newJobs.map((job) => (
                            <div className="job-card" key={job.id}>
                                <div className="job-card-header">
                                    <div className="job-time">
                                        <span className="new-badge">Mới</span>
                                        {formatRelativeTime(job.createdat)}
                                    </div>
                                </div>

                                <h3 className="job-title">
                                    <Link to={`/jobs/${job.id}`}>{job.name}</Link>
                                </h3>

                                <div className="job-details">
                                    <div className="job-detail">
                                        <i className="fa fa-location-dot"></i>
                                        <span>{job.address}</span>
                                    </div>
                                    <div className="job-detail">
                                        <i className="fa fa-bars"></i>
                                        <span>{job.field}</span>
                                    </div>
                                    <div className="job-detail">
                                        <i className="fa fa-suitcase"></i>
                                        <span>{job.jobtype}</span>
                                    </div>
                                </div>

                                <div className="job-card-footer">
                                    <button className="apply-btn">Ứng tuyển ngay</button>
                                    <button className="save-job-btn">
                                        <i className="fa fa-bookmark"></i>
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </section>
        </main>

    );
}

export default Homepage;