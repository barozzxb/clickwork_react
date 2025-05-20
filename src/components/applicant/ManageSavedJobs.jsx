import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { Link } from 'react-router-dom';
import OverlayLoading from '../effects/Loading';
import { API_ROOT } from '../../config.js';
import './ManageSavedJobs.css';

const ManageSavedJobs = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSavedJobs = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Vui lòng đăng nhập để xem công việc đã lưu.');
        setLoading(false);
        return;
      }

      const response = await axios.get(`${API_ROOT}/saved-jobs`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log('Dữ liệu trả về:', response.data);

      const data = Array.isArray(response.data.body) ? response.data.body : [];
      setSavedJobs(data);
      setError(null);
    } catch (err) {
      console.error('Lỗi khi lấy danh sách công việc đã lưu:', err);
      setError('Không thể tải danh sách công việc đã lưu. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const handleRemoveSavedJob = async (jobId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Vui lòng đăng nhập để xóa công việc.');
        return;
      }

      await axios.delete(`${API_ROOT}/saved-jobs/delete`, {
        params: { jobId },
        headers: { Authorization: `Bearer ${token}` }
      });

      setSavedJobs(prev => prev.filter(job => job.job?.id !== jobId));
      alert('Đã xóa công việc khỏi danh sách đã lưu!');
    } catch (err) {
      console.error('Lỗi khi xóa công việc đã lưu:', err);
      alert('Không thể xóa công việc. Vui lòng thử lại.');
    }
  };

  return (
    <div className="saved-jobs-container">
      <div className="saved-jobs-header">
        <h2>Công việc đã lưu</h2>
        <p className="text-muted">Quản lý danh sách công việc bạn quan tâm</p>
      </div>

      {loading && <OverlayLoading />}

      {error && (
        <div className="alert alert-danger fade-in">
          <i className="fas fa-exclamation-circle me-2"></i>
          <p>{error}</p>
          <button className="btn btn-primary mt-2" onClick={fetchSavedJobs}>
            <i className="fas fa-sync-alt me-2"></i>Thử lại
          </button>
        </div>
      )}

      {!loading && !error && savedJobs.length === 0 && (
        <div className="empty-state fade-in">
          <i className="fas fa-bookmark empty-icon"></i>
          <p>Bạn chưa lưu công việc nào</p>
          <Link to="/jobs" className="btn btn-primary mt-3">
            <i className="fas fa-search me-2"></i>Tìm kiếm công việc
          </Link>
        </div>
      )}

      {!loading && !error && savedJobs.length > 0 && (
        <div className="row g-4">
          {savedJobs.map((savedJob) => (
            <div key={savedJob.id || savedJob.jobId} className="col-md-6 col-lg-4">
              <div className="job-card">
                <div className="job-card-body">
                  <div className="save-date">
                    <i className="far fa-calendar-alt me-2"></i>
                    {savedJob.savedDate ? new Date(savedJob.savedDate).toLocaleDateString() : "x ngày trước"}
                  </div>
                  
                  <h5 className="job-title">
                    <Link to={`/jobs/${savedJob.jobId}`}>
                      {savedJob.title || "Chưa có tên"}
                    </Link>
                  </h5>

                  <div className="job-info">
                    <div className="info-item">
                      <i className="fas fa-map-marker-alt"></i>
                      <span>{savedJob.location || "Không xác định"}</span>
                    </div>
                    <div className="info-item">
                      <i className="fas fa-briefcase"></i>
                      <span>{savedJob.field || "Không xác định"}</span>
                    </div>
                    <div className="info-item">
                      <i className="fas fa-clock"></i>
                      <span>{savedJob.type || "Không xác định"}</span>
                    </div>
                    <div className="info-item">
                      <i className="fas fa-money-bill-wave"></i>
                      <span>{savedJob.salary || "Thỏa thuận"}</span>
                    </div>
                  </div>

                  <div className="tags-container">
                    {(savedJob.tags || []).map((tag, index) => (
                      <span key={`${savedJob.id}-tag-${index}`} className="tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="job-card-footer">
                  <Link to={`/jobs/${savedJob.jobId}`} className="btn btn-primary">
                    <i className="fas fa-info-circle me-2"></i>Chi tiết
                  </Link>
                  <button
                    className="btn btn-outline-danger"
                    onClick={() => handleRemoveSavedJob(savedJob.jobId)}
                  >
                    <i className="fas fa-trash-alt me-2"></i>Xóa
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageSavedJobs;