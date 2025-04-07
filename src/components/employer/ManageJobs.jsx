import React, { useState } from 'react';
import MoreVertTwoToneIcon from '@mui/icons-material/MoreVertTwoTone';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

const ManageJobs = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  
  const handleClick = (event, jobIndex) => {
    setAnchorEl(event.currentTarget);
    setSelectedJob(jobIndex);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedJob(null);
  };

  const handleHideJob = () => {
    console.log(`Ẩn công việc ${selectedJob}`);
    handleClose();
  };

  const handleDeleteJob = () => {
    console.log(`Xóa công việc ${selectedJob}`);
    handleClose();
  };

  const jobs = [
    { id: 1, title: "Công việc 1", company: "Công ty A" },
    { id: 2, title: "Công việc 2", company: "Công ty B" },
    { id: 3, title: "Công việc 3", company: "Công ty C" },
  ];

  return (
    <div className='container'>
      <div className='fs-2 text-center mb-3'>Quản lý công việc</div>
      <div className="row">
        {jobs.map((job, index) => (
          <div className="col-md-6" key={job.id}>
            <div className="card-job">
              <div className="card-body">
                <h5 className="card-title">{job.title}</h5>
                <p className="card-text">{job.company}</p>
                <a href="#" className="btn-action">Xem chi tiết</a>
                <span className="btn-active">Đang hoạt động</span>
                <div 
                  className='menu-job'
                  onClick={(e) => handleClick(e, job.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <MoreVertTwoToneIcon />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={handleHideJob}>Ẩn công việc</MenuItem>
        <MenuItem onClick={handleDeleteJob}>Xóa công việc</MenuItem>
      </Menu>

    </div>
  );
};

export default ManageJobs;