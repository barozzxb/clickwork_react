import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { green, red, yellow } from '@mui/material/colors';

const localhost = 'http://localhost:9000/api';

const ViewAppliedHistory = () => {
  const [appliedJobs, setAppliedJobs] = useState([]);

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      try {
        const response = await fetch(`${localhost}/jobapplications/baochau`); // thay "baochau" bằng username thật nếu cần
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setAppliedJobs(data);
      } catch (error) {
        console.error('Lỗi khi lấy lịch sử ứng tuyển:', error);
        alert('Không thể tải lịch sử ứng tuyển. Vui lòng thử lại sau.');
      }
    };

    fetchAppliedJobs();
  }, []);

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
                  {job.status === 'Đang chờ' && (
                    <>
                      <AccessTimeIcon sx={{ color: yellow[400] }} />
                      <span className="text-warning ms-2">{job.status}</span>
                    </>
                  )}
                  {job.status === 'Đã từ chối' && (
                    <>
                      <CancelIcon sx={{ color: red[400] }} />
                      <span className="text-danger ms-2">{job.status}</span>
                    </>
                  )}
                  {job.status === 'Đã chấp nhận' && (
                    <>
                      <CheckCircleIcon sx={{ color: green[400] }} />
                      <span className="text-success ms-2">{job.status}</span>
                    </>
                  )}
                </p>

                <Link to={`/view-detail-job/${job.jobId}`} className="btn btn-primary mb-2">
                  Xem chi tiết
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewAppliedHistory;
