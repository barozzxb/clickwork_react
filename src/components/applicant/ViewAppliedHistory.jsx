import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { green, red, yellow } from '@mui/material/colors';

const ViewAppliedHistory = () => {
  // Mock data for applied job history
  const [appliedJobs, setAppliedJobs] = useState([
    {
      id: 1,
      title: 'Frontend Developer',
      company: 'TechCorp',
      appliedDate: '2025-04-10',
      status: 'Đang chờ',
    },
    {
      id: 2,
      title: 'Backend Engineer',
      company: 'CodeHub',
      appliedDate: '2025-04-12',
      status: 'Đã từ chối',
    },
    {
      id: 3,
      title: 'UI/UX Designer',
      company: 'DesignPro',
      appliedDate: '2025-04-15',
      status: 'Đã chấp nhận',
    },
  ]);

  return (
    <div className="container">
      <h2 className="text-center my-4">Lịch sử ứng tuyển</h2>

      <div className="row">
        {appliedJobs.map((job) => (
          <div className="col-md-4 mb-4" key={job.id}>
            <div className="card shadow-sm position-relative h-100">
              <div className="card-body">
                <p className="text-muted fst-italic">Ngày ứng tuyển: {job.appliedDate}</p>
                <h5 className="card-title">{job.title}</h5>
                <p className="card-text">
                  <strong>{job.company}</strong>
                </p>

                <p className="card-text d-flex align-items-center">
                  <AccessTimeIcon sx={{ color: yellow[400] }} />
                  {job.status === 'Đang chờ' && (
                    <span className="text-warning">{job.status}</span>
                  )}
                  {job.status === 'Đã từ chối' && (
                    <span className="text-danger">{job.status}</span>
                  )}
                  {job.status === 'Đã chấp nhận' && (
                    <span className="text-success">{job.status}</span>
                  )}
                </p>

                <Link to={`/view-detail-job/${job.id}`} className="btn btn-primary mb-2">
                  Xem chi tiết
                </Link>

                {/* Optional: Icon to show status */}
                {job.status === 'Đã chấp nhận' && (
                  <CheckCircleIcon sx={{ color: green[400] }} />
                )}
                {job.status === 'Đã từ chối' && (
                  <CancelIcon sx={{ color: red[400] }} />
                )}
                {job.status === 'Đang chờ' && (
                  <AccessTimeIcon sx={{ color: yellow[400] }} />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewAppliedHistory;
