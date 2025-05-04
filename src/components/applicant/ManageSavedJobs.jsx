import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import DehazeIcon from '@mui/icons-material/Dehaze';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import MoreVertTwoToneIcon from '@mui/icons-material/MoreVertTwoTone';
import { red, green, orange } from '@mui/material/colors';

const localhost = 'http://localhost:9000/api';

const ManageSavedJobs = () => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    // Fetch saved jobs from backend API
    const fetchSavedJobs = async () => {
      try {
        const response = await fetch(`${localhost}/saved-jobs?applicantUsername=baochau`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setJobs(data);
      } catch (error) {
        console.error("Fetch error:", error);
        alert("Không thể tải công việc đã lưu. Vui lòng thử lại sau.");
      }
    };
    fetchSavedJobs();
  }, []);

  const handleDelete = async (jobId) => {
    const confirmDelete = window.confirm('Bạn có muốn xóa công việc này?');
    if (confirmDelete) {
      try {
        const response = await fetch(`${localhost}/saved-jobs/delete?applicantUsername=baochau&jobId=${jobId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setJobs(jobs.filter((job) => job.jobId !== jobId));
          alert('Cập nhật thành công');
        } else {
          alert('Không thể xóa công việc. Vui lòng thử lại sau.');
        }
      } catch (error) {
        console.error("Delete error:", error);
        alert('Có lỗi xảy ra khi xóa công việc. Vui lòng thử lại.');
      }
    }
  };

  return (
    <div className="container">
      <h2 className="text-center my-4">Quản lý công việc đã lưu</h2>

      <div className="row">
        {jobs.map((job) => (
          <div className="col-md-4 mb-4" key={job.jobId}>
            <div className="card shadow-sm position-relative h-100">
              <div className="card-body">
                <p className="text-muted fst-italic">Lưu cách đây: {job.savedDate}</p>
                <h5 className="card-title">{job.title}</h5>
                <p className="card-text"><strong>{job.company}</strong></p>
                <p className="card-text d-flex align-items-center">
                  <LocationOnIcon sx={{ color: red[400] }} /> {job.location}
                </p>
                <p className="card-text d-flex align-items-center">
                  <DehazeIcon sx={{ color: green[400] }} /> {job.field}
                </p>
                <p className="card-text d-flex align-items-center">
                  <EqualizerIcon color="primary" /> {job.type}
                </p>
                <p className="card-text d-flex align-items-center">
                  <SupervisorAccountIcon sx={{ color: orange[400] }} /> {job.countApplicant} ứng viên
                </p>

                <Link to={`/view-detail-job/${job.jobId}`} className="btn btn-primary mb-2">
                  Xem chi tiết
                </Link>

                <span className="badge bg-success mb-2">Đang hoạt động</span>

                <div
                  className="position-absolute top-0 end-0 p-2"
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleDelete(job.jobId)}
                >
                  <MoreVertTwoToneIcon />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageSavedJobs;
