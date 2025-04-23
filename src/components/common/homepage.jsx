import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import OverlayLoading from '../effects/Loading';

const Homepage = () => {

    const [loading, setLoading] = useState(false);
    const host = 'http://localhost:9000/api';
    const [jobs, setJobs] = useState([]);

    useEffect(() => {
        const loadJobs = async () => {
            setLoading(true);
            try {
                const response = await axios.get(host + '/jobs', {
                   
                });
                setJobs(response.data.body);
            } catch (err) {
                console.error("Lỗi fetch jobs", err);
            } finally {
                setLoading(false);
            }
        };

        loadJobs();

    }, []);


    return (
        <main className="container">

             {loading && <OverlayLoading />}

            <div id="carouselExample" className="carousel slide" data-bs-ride="carousel">
                <div className="carousel-inner">
                    <div className="carousel-item active">
                        <img src="/images/1.png" className="d-block w-100" alt="Banner 1"/>
                    </div>
                    <div className="carousel-item">
                        <img src="/images/2.png" className="d-block w-100" alt="Banner 2"/>
                    </div>
                    <div class="carousel-item">
                        <img src="/images/3.png" className="d-block w-100" alt="Banner 3"/>
                    </div>
                </div>
                <button className="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
                    <span className="carousel-control-prev-icon"></span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
                    <span className="carousel-control-next-icon"></span>
                </button>
            </div>

            <div className="d-flex justify-content-center align-items-center search-bar">
                <form className="d-flex w-100">
                    <input className="form-control search-input" type="search" placeholder="Tìm kiếm việc làm..."/>
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
                        <div className="card p-3">
                            <div className="card-body">
                                <p className="text-secondary italic">{job.created_at}</p>
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
                
                <div class="col-md-4">
                    <div class="card p-3">
                        <div class="card-body">
                            <p class="text-secondary italic">x days ago</p>
                            <h5 className="card-title"><Link to="#" className="job-title">Công việc 1</Link></h5>
                            <p className="card-text location"><i className="fa fa-location-dot">&emsp;</i>Địa điểm làm việc</p>
                            <p className="card-text job-field"><i className="fa fa-bars">&emsp;</i>Lĩnh vực</p>
                            <p className="card-text job-type"><i className="fa fa-suitcase">&emsp;</i>Loại công việc</p>
                        </div>

                    </div>
                </div>

            </div>

        </main>
    );
}

export default Homepage;