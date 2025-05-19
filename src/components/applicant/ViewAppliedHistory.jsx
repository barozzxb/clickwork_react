import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import BusinessIcon from '@mui/icons-material/Business';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import OverlayLoading from '../effects/Loading';
import { API_ROOT } from '../../config.js';
import './ViewAppliedHistory.css';

const ViewAppliedHistory = () => {
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Vui lòng đăng nhập để xem lịch sử ứng tuyển.');
          setLoading(false);
          return;
        }

        const decoded = jwtDecode(token);
        const username = decoded.sub;

        const response = await axios.get(`${API_ROOT}/applications/history/${username}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        console.log('Dữ liệu ứng tuyển:', response.data);

        setAppliedJobs(response.data.body);
        setError(null);
      } catch (err) {
        console.error('Lỗi khi lấy lịch sử ứng tuyển:', err);
        if (err.response && err.response.status === 403) {
          setError('Bạn không có quyền xem lịch sử ứng tuyển. Vui lòng đăng nhập lại.');
        } else {
          setError('Không thể tải lịch sử ứng tuyển. Vui lòng thử lại sau.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAppliedJobs();
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Đã chấp nhận':
        return <CheckCircleIcon className="status-icon" style={{ color: 'var(--status-accepted)' }} />;
      case 'Đã bị từ chối':
        return <CancelIcon className="status-icon" style={{ color: 'var(--status-rejected)' }} />;
      case 'Đang chờ':
        return <AccessTimeIcon className="status-icon" style={{ color: 'var(--status-pending)' }} />;
      default:
        return null;
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Đã chấp nhận':
        return 'status-accepted';
      case 'Đã bị từ chối':
        return 'status-rejected';
      case 'Đang chờ':
        return 'status-pending';
      default:
        return '';
    }
  };

  return (
    <div className="applied-history-container">
      <div className="history-header">
        <h2>Lịch sử ứng tuyển</h2>
      </div>

      {loading && <OverlayLoading />}

      {error && (
        <div className="alert alert-danger">
          <p>{error}</p>
          <button className="btn btn-primary mt-2" onClick={() => window.location.reload()}>
            Thử lại
          </button>
          {error.includes('đăng nhập') && (
            <Link to="/login" className="btn btn-secondary mt-2 ms-2">Đăng nhập</Link>
          )}
        </div>
      )}

      {!loading && !error && appliedJobs.length === 0 && (
        <div className="alert alert-info">
          <p>Bạn chưa ứng tuyển công việc nào.</p>
          <Link to="/jobs" className="btn btn-primary mt-2">Tìm kiếm công việc</Link>
        </div>
      )}

      {!loading && !error && appliedJobs.length > 0 && (
        <div className="history-grid">
          {appliedJobs.map((job) => (
            <div className="history-card" key={job.id}>
              <div className="card-content">
                <div className="applied-date">
                  <CalendarTodayIcon fontSize="small" />
                  {new Date(job.appliedAt).toLocaleDateString('vi-VN', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>

                <h3 className="job-title">{job.jobName}</h3>

                <div className="company-name">
                  <BusinessIcon fontSize="small" style={{ marginRight: '0.5rem' }} />
                  {job.companyName}
                </div>

                <div className={`status-badge ${getStatusClass(job.status)}`}>
                  {getStatusIcon(job.status)}
                  <span>{job.status}</span>
                </div>

                <Link to={`/jobs/${job.jobId}`} className="view-details-btn">
                  Xem chi tiết
                  <ArrowForwardIcon fontSize="small" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewAppliedHistory;
