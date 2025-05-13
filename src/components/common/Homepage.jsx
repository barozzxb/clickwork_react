import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import OverlayLoading from '../effects/Loading.jsx';
import { jwtDecode } from 'jwt-decode';

import { API_ROOT } from '../../config.js';
import {formatRelativeTime} from '../../functions/dayformatter.js';

import './css/homepage.css';

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

    const [keyword, setKeyword] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        if (keyword.trim() === '') {
            return;
        }

        navigate(`/search/${keyword}`);

    };

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
        <main className="container">

             {loading && <OverlayLoading />}


            <div className="hero">
                <div className="carousel slide" id="heroCarousel" data-bs-ride="carousel">


                <div id="carouselExample" className="carousel slide" data-bs-ride="carousel">
                    <div className="carousel-inner">
                        <div className="carousel-item active">
                            <img src="/assets/banner1.jpg" className="d-block w-100" alt="Banner 1"/>
                        </div>
                        <div className="carousel-item">
                            <img src="/assets/banner2.jpg" className="d-block w-100" alt="Banner 2"/>
                        </div>
                        {/* <div class="carousel-item">
                            <img src="/images/3.png" className="d-block w-100" alt="Banner 3"/>
                        </div> */}
                    </div>
                    <button className="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
                        <span className="carousel-control-prev-icon"></span>
                    </button>
                    <button className="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
                        <span className="carousel-control-next-icon"></span>
                    </button>
                </div>



                </div>
                <div className="hero-overlay mt-5">
                    <h1 className="hero-title">Tìm việc vừa ý – Ứng tuyển ngay!</h1>
                    <p className="hero-subtitle">Hàng ngàn công việc từ các công ty hàng đầu</p>
                </div>
            </div>


            <div className="d-flex justify-content-center align-items-center search-bar">
                <form className="d-flex w-100" onSubmit={handleSearch}>
                    <input className="form-control search-input" type="search" placeholder="Tìm kiếm việc làm..."
                    value={keyword}
                    onChange={e => setKeyword(e.target.value)}
                    />
                    <button className="btn btn-success search-btn" type="submit">Tìm kiếm</button>
                </form>
            </div>

            <div className="row mt-4">

                <p className="h2">Được đề xuất cho bạn</p>

                {jobs.length === 0 ? (
                    <div className="col-md-4">
                        <div className="card p-3">
                            <div className="card-body">
                                <h5 className="card-title">Không có công việc nào được đề xuất</h5>
                            </div>
                        </div>
                    </div>
                ) : (
                    jobs.map((job) => (
                        <div className="col-md-4" key={job.id}>
                            <div className="card p-3 job-card">
                                <div className="card-body">
                                    <p className="text-secondary italic">{formatRelativeTime(job.createdat)}</p>
                                    <h5 className="card-title"><Link to={`/jobs/${job.id}`} className="job-title">{job.name}</Link></h5>
                                    <p className="card-text location"><i className="fa fa-location-dot">&emsp;</i>{job.address}</p>
                                    <p className="card-text job-field"><i className="fa fa-bars">&emsp;</i>{job.field}</p>
                                    <p className="card-text job-type"><i className="fa fa-suitcase">&emsp;</i>{job.jobtype}</p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div class="row mt-4">
                <p className="h2">Mới nhất</p>

                {newJobs.length === 0 ? (
                    <div className="col-md-4">
                        <div className="card p-3">
                            <div className="card-body">
                                <h5 className="card-title">Không có công việc nào được đề xuất</h5>
                            </div>
                        </div>
                    </div>
                ) : (
                    newJobs.map((job) => (
                        <div className="col-md-4" key={job.id}>
                            <div className="card p-3 job-card">
                                <div className="card-body">
                                    <p className="text-secondary italic">{formatRelativeTime(job.createdat)}</p>
                                    <h5 className="card-title"><Link to={`/jobs/${job.id}`} className="job-title">{job.name}</Link></h5>
                                    <p className="card-text location"><i className="fa fa-location-dot">&emsp;</i>{job.address}</p>
                                    <p className="card-text job-field"><i className="fa fa-bars">&emsp;</i>{job.field}</p>
                                    <p className="card-text job-type"><i className="fa fa-suitcase">&emsp;</i>{job.jobtype}</p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

        </main>
    );
}

export default Homepage;