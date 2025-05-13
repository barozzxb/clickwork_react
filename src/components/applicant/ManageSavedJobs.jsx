import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { Link } from 'react-router-dom';
import OverlayLoading from '../effects/Loading';
import { API_ROOT } from '../../config.js';

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

      const data = Array.isArray(response.data) ? response.data : [];
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
    <div className="container mt-4">
      <h2 className="mb-4">Công việc đã lưu</h2>

      {loading && <OverlayLoading />}

      {error && (
        <div className="alert alert-danger">
          <p>{error}</p>
          <button className="btn btn-primary mt-2" onClick={fetchSavedJobs}>Thử lại</button>
        </div>
      )}

      {!loading && !error && savedJobs.length === 0 && (
        <div className="alert alert-info">
          <p>Bạn chưa lưu công việc nào.</p>
          <Link to="/jobs" className="btn btn-primary mt-2">Tìm kiếm công việc</Link>
        </div>
      )}

      {!loading && !error && savedJobs.length > 0 && (
        <div className="row">
          {savedJobs.map((savedJob) => {
            const job = savedJob.job || {};

            return (
              <div key={job.id || savedJob.id} className="col-md-4 mb-4">
                <div className="card h-100">
                  <div className="card-body">
<p className="text-secondary italic">{job.postedAgo || "x ngày trước"}</p>
                    <h5 className="card-title">
                      <Link to={`/jobs/${job.id}`} className="job-title">{job.name || "Chưa có tên"}</Link>
                    </h5>
                    <p className="card-text location"><i className="fa fa-location-dot"></i> {job.location || "Không xác định"}</p>
                    <p className="card-text job-field"><i className="fa fa-bars"></i> {job.field || "Không xác định"}</p>
                    <p className="card-text job-type"><i className="fa fa-suitcase"></i> {job.type || "Không xác định"}</p>
                    <p className="card-text salary"><i className="fa fa-sack-dollar"></i> {job.salary || "Thỏa thuận"}</p>

                    <div className="card-text d-flex tag flex-wrap gap-2">
                      {(job.tags || []).map((tag, index) => (
                        <p key={`${job.id}-tag-${index}`} className="tags">{tag}</p>
                      ))}
                    </div>
                  </div>
                  <div className="card-footer bg-white border-top-0">
                    <div className="d-flex justify-content-between">
                      <Link to={`/jobs/${job.id}`} className="btn btn-primary">Xem chi tiết</Link>
                      <button
                        className="btn btn-outline-danger"
                        onClick={() => handleRemoveSavedJob(job.id)}
                      >
                        <i className="fa fa-trash"></i> Xóa
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ManageSavedJobs;