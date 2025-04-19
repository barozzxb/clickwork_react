import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import DehazeIcon from '@mui/icons-material/Dehaze';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import MoreVertTwoToneIcon from '@mui/icons-material/MoreVertTwoTone';
import { red, green, orange } from '@mui/material/colors';

const ManageSavedJobs = () => {
  // Mock data for saved jobs
  const [jobs, setJobs] = useState([
    {
      id: 1,
      title: 'Frontend Developer',
      company: 'TechCorp',
      location: 'Hà Nội',
      field: 'IT',
      type: 'Full-time',
      countApplicant: 5,
      savedDate: '2025-04-15',
    },
    {
      id: 2,
      title: 'Backend Engineer',
      company: 'CodeHub',
      location: 'TP.HCM',
      field: 'IT',
      type: 'Part-time',
      countApplicant: 8,
      savedDate: '2025-04-17',
    },
    {
      id: 3,
      title: 'UI/UX Designer',
      company: 'DesignPro',
      location: 'Đà Nẵng',
      field: 'Design',
      type: 'Freelance',
      countApplicant: 3,
      savedDate: '2025-04-18',
    },
  ]);

  // Function to handle job deletion
  const handleDelete = (jobId) => {
    const confirmDelete = window.confirm('Bạn có muốn xóa công việc này?');
    if (confirmDelete) {
      setJobs(jobs.filter(job => job.id !== jobId));
      alert('Cập nhật thành công');
    }
  };

  return (
    <div className="container">
      <h2 className="text-center my-4">Quản lý công việc đã lưu</h2>

      <div className="row">
        {jobs.map((job) => (
          <div className="col-md-4 mb-4" key={job.id}>
            <div className="card shadow-sm position-relative h-100">
              <div className="card-body">
                <p className="text-muted fst-italic">Lưu cách đây: {job.savedDate}</p>
                <h5 className="card-title">{job.title}</h5>
                <p className="card-text">
                  <strong>{job.company}</strong>
                </p>

                <p className="card-text d-flex align-items-center">
                  <LocationOnIcon sx={{ color: red[400] }} />
                  {job.location}
                </p>

                <p className="card-text d-flex align-items-center">
                  <DehazeIcon sx={{ color: green[400] }} />
                  {job.field}
                </p>

                <p className="card-text d-flex align-items-center">
                  <EqualizerIcon color="primary" />
                  {job.type}
                </p>

                <p className="card-text d-flex align-items-center">
                  <SupervisorAccountIcon sx={{ color: orange[400] }} />
                  {job.countApplicant} ứng viên
                </p>

                <Link to={`/view-detail-job/${job.id}`} className="btn btn-primary mb-2">
                  Xem chi tiết
                </Link>

                <span className="badge bg-success mb-2">Đang hoạt động</span>

                <div
                  className="position-absolute top-0 end-0 p-2"
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleDelete(job.id)}
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
