import React from "react";
import { Link } from "react-router-dom";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";

const JobList = ({ jobs, onEdit, onToggle }) => {
  return (
    <table className="table table-responsive table-hover">
      <thead>
        <tr>
          <th>#</th>
          <th>Tên công việc</th>
          <th>Ngày tạo</th>
          <th>Ứng tuyển</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        {jobs.map((job, index) => (
          <tr key={job.id}>
            <td>{index + 1}</td>
            <td>{job.name}</td>
            <td>{new Date(job.createdat).toLocaleDateString()}</td>
            <td>{job.jobApplications?.length || 0}</td>
            <td>
              <button
                onClick={() => onEdit(job)}
                className="btn btn-sm btn-warning me-2"
              >
                <i className="fa fa-edit" title="Chỉnh sửa" />
              </button>
              <button
                onClick={() => onToggle(job.id)}
                className="btn btn-sm btn-secondary me-2"
              >
                <i className="fa fa-lock" title="Khóa/Mở" />
              </button>
              <Link
                to={`/employer/view-detail-job/${job.id}`}
                className="btn btn-sm btn-info"
              >
                <RemoveRedEyeIcon />
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default JobList;
