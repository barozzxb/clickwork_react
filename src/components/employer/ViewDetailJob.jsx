import { MenuItem } from '@mui/material';
import React, { useState } from 'react'
import MoreVertTwoToneIcon from '@mui/icons-material/MoreVertTwoTone';
import Menu from '@mui/material/Menu';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { green, orange, red, yellow } from '@mui/material/colors';
import DehazeIcon from '@mui/icons-material/Dehaze';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';

const ViewDetailJob = () => {
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
    { id: 1, title: "Công việc 1", company: "Công ty A", location:"Vị trí 1", field:"Lĩnh vực", type:"Loại công việc", countApplicant:"5" }
  ];

  return (
    <div className='container'>
      <div className='fs-2 text-center mb-3'>Chi tiết công việc</div>
      <div className="row mt-4">
        {jobs.map((job, index) => (
          <div className="col-md-12" key={job.id}>
            <div className="card-job">
              <div className="card-body">
                <p class="text-secondary italic">x days ago</p>
                <h5 className="card-title">{job.title}</h5>
                <p className="card-text location">{job.company}</p>
                <p className="card-text location"> <LocationOnIcon sx={{color: red[400]}}/> {job.location}</p>
                <p className="card-text job-field"><DehazeIcon sx={{color: green[400]}}/> {job.field}</p>
                <p className="card-text job-type"><EqualizerIcon color='primary'/> {job.type}</p>
                <p className="card-text job-type"><SupervisorAccountIcon sx={{color: orange[400]}}/> {job.countApplicant}</p>
                <a href="/employer/view-detail-job" className="btn-action">Xem hồ sơ ứng tuyển</a>
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
        <MenuItem onClick={handleHideJob}>Chỉnh sửa công việc</MenuItem>
        <MenuItem onClick={handleHideJob}>Ẩn công việc</MenuItem>
        <MenuItem onClick={handleDeleteJob}>Xóa công việc</MenuItem>
      </Menu>

    </div>
  );
};

export default ViewDetailJob