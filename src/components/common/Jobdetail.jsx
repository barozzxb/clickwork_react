import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import OverlayLoading from '../effects/Loading.jsx';
import { jwtDecode } from 'jwt-decode';
import { API_ROOT, BACK_END_HOST } from '../../config.js';
import { formatFullDate } from '../../functions/dayformatter.js';
import { Link } from 'react-router-dom';

import './css/jobdetail.css';

const JobDetail = () => {
    const { id } = useParams(); // id sẽ là '123'
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSaved, setIsSaved] = useState(false);
    const [isApplied, setIsApplied] = useState(false); // Trạng thái đã ứng tuyển

    useEffect(() => {
        const fetchJobAndCheckStatus = async () => {
            setLoading(true);
            try {
                // Lấy chi tiết công việc
                const jobRes = await axios.get(`${API_ROOT}/jobs/${id}`);
                setJob(jobRes.data.body);

                // Kiểm tra trạng thái công việc đã lưu và đã ứng tuyển
                const token = localStorage.getItem('token');
                if (token) {
                    // Kiểm tra trạng thái đã lưu
                    const savedRes = await axios.get(`${API_ROOT}/saved-jobs/check`, {
                        params: { jobId: id },
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setIsSaved(savedRes.data.status === false); // status=false nghĩa là đã lưu

                    // Kiểm tra trạng thái đã ứng tuyển
                    const appliedRes = await axios.get(`${API_ROOT}/applications/check`, {
                        params: { jobId: id },
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setIsApplied(appliedRes.data.status === false); // status=false nghĩa là đã ứng tuyển
                }
            } catch (err) {
                console.error('Lỗi khi fetch job detail hoặc kiểm tra trạng thái:', err);
                if (err.response && err.response.status === 403) {
                    alert('Bạn không có quyền truy cập. Vui lòng đăng nhập lại.');
                }
            } finally {
                setLoading(false);
            }
        };
        fetchJobAndCheckStatus();
    }, [id]);

    const handleSaveJob = async () => {
        const token = localStorage.getItem('token');
        if (!token) return alert('Vui lòng đăng nhập để lưu công việc.');

        const decoded = jwtDecode(token);
        const username = decoded.sub;

        try {
            const response = await axios.post(
                `${API_ROOT}/saved-jobs/save`,
                { username, id },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.status === false) {
                alert(response.data.message); // "Công việc đã được lưu"
            } else {
                setIsSaved(true);
                alert(response.data.message); // "Lưu công việc thành công"
            }
        } catch (err) {
            console.error('Lỗi khi lưu công việc:', err);
            if (err.response && err.response.status === 403) {
                alert('Bạn không có quyền lưu công việc. Vui lòng đăng nhập lại.');
            } else {
                alert('Không thể lưu công việc. Vui lòng thử lại.');
            }
        }
    };

    const handleApplyJob = async () => {
        const token = localStorage.getItem('token');
        if (!token) return alert('Vui lòng đăng nhập để ứng tuyển.');

        try {
            const decoded = jwtDecode(token);
            const username = decoded.sub;
            console.log('Sending apply request:', { username, id });

            const response = await axios.post(
                `${API_ROOT}/applications/apply`,
                { username, id },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            console.log('Apply response:', response.data);

            if (response.data.status === false) {
                alert(response.data.message);
            } else {
                setIsApplied(true);
                alert(response.data.message);
            }
        } catch (err) {
            console.error('Lỗi khi ứng tuyển:', err);
            if (err.response && err.response.status === 403) {
                alert('Bạn không có quyền ứng tuyển. Vui lòng đăng nhập lại.');
            } else {
                alert('Không thể ứng tuyển: ' + (err.response?.data?.message || 'Lỗi mạng. Vui lòng kiểm tra backend.'));
            }
        }
    };

    if (loading || !job) {
        return <OverlayLoading />;
    }

    return (
        <main className="container">
            {loading && <OverlayLoading />}

            {/* Search Bar */}
            <div className="d-flex justify-content-center align-items-center search-bar">
                <form className="d-flex w-100">
                    <input className="form-control search-input" type="search" placeholder="Tìm kiếm việc làm..." />
                    <button className="btn btn-success search-btn" type="submit">Tìm kiếm</button>
                </form>
            </div>

            {/* Chi tiết công việc */}
            <div className="row mt-4">
                <div className="col detail">
                    <p className="h2 title">{job?.name || 'Tên công việc'}</p>
                    <p className="text-secondary italic">{formatFullDate(job.createdat)}</p>
                    <p className="card-text location">
                        <i className="fa fa-location-dot" />&emsp;{job?.location || 'Địa điểm làm việc'}
                    </p>
                    <p className="card-text job-field">
                        <i className="fa fa-bars" />&emsp;{job?.field || 'Lĩnh vực'}
                    </p>
                    <p className="card-text job-type">
                        <i className="fa fa-suitcase" />&emsp;{job?.jobtype || 'Loại công việc'}
                    </p>
                    <p className="card-text salary">
                        <i className="fa fa-sack-dollar" />&emsp;{job?.salary || 'Mức lương'}
                    </p>

                    <div className="card-text d-flex tag flex-wrap gap-2">
                        {(job?.tags || ['tag 1', 'tag 2', 'tag 3']).map((tag, index) => (
                            <p key={index} className="tags">{tag}</p>
                        ))}
                    </div>

                    <hr />
                    <div className="d-flex justify-content-around align-items-center">
                        <button
                            className={`btn btn-action ${isApplied ? 'btn-success' : 'btn-primary'}`}
                            onClick={handleApplyJob}
                            disabled={isApplied}
                        >
                            {isApplied ? 'Đã ứng tuyển' : 'Ứng tuyển ngay'}
                        </button>
                        <button
                            className={`btn ${isSaved ? 'btn-success' : 'btn-secondary'}`}
                            onClick={handleSaveJob}
                            disabled={isSaved}
                        >
                            {isSaved ? 'Đã lưu' : 'Lưu công việc'}
                        </button>
                    </div>
                    <hr />

                    {/* Mô tả */}
                    <div className="col job-info">
                        <p className="heading">Mô tả công việc</p>
                        <p className="content">{job?.description || 'Chưa có mô tả công việc.'}</p>
                    </div>

                    <hr />

                    {/* Kỹ năng */}
                    <div className="col job-info">
                        <p className="heading">Yêu cầu kỹ năng</p>
                        <p className="content">{job?.requiredskill || 'Chưa có thông tin kỹ năng.'}</p>
                    </div>

                    <hr />

                    {/* Lợi ích */}
                    <div className="col job-info">
                        <p className="heading">Lợi ích khi làm việc</p>
                        <p className="content">{job?.benefit || 'Chưa có thông tin lợi ích.'}</p>
                    </div>

                    <hr />

                    {/* Công ty */}
                    <div className="col job-info">
                        <p className="heading">Về công ty</p>
                        <div className="col-md-4 mx-auto d-flex flex-column card">
                            <div className="d-flex justify-content-center">
                                <img
                                    className="avatar-small"
                                    src={`${BACK_END_HOST}${job.employer.logo}` || '../images/user-default.png'}
                                    alt="Company Avatar"
                                />
                            </div>
                            <div className="company-info d-flex flex-column text-center">
                                <Link to={`/company-detail/${job.employer.username}`}><p>{job?.employer.fullname || 'Chưa cập nhật tên'}</p></Link>
                                <p>{job?.employer?.field || 'Lĩnh vực'}</p>
                                <p>{job?.employer?.datefounded || 'Ngày thành lập'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Gợi ý công việc */}
            <div className="row mt-4">
                <p className="h2">Công việc tương tự</p>
                {(job?.relatedJobs || [1, 2, 3]).map((item, idx) => (
                    <div key={idx} className="col-md-4">
                        <div className="card p-3">
                            <div className="card-body">
                                <p className="h4">{item?.name || 'Công việc'}</p>
                                <p className="card-text">{item?.salary || 'Mức lương'}</p>
                                <p className="card-text">{item?.location || 'Địa điểm'}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
};

export default JobDetail;

