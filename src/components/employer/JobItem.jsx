import React from "react";
import axios from "axios";

const JobItem = ({ job, fetchJobs, setEditJob }) => {
  const handleToggle = () => {
    axios
      .patch(`/employer/job/${job.id}/toggle`)
      .then(() => fetchJobs())
      .catch((err) => console.error(err));
  };

  return (
    <div className="border p-3 mb-3 rounded shadow-sm">
      <h5>
        {job.name}{" "}
        <span className={`badge ${job.active ? "bg-success" : "bg-secondary"}`}>
          {job.active ? "Đang mở" : "Đã khóa"}
        </span>
      </h5>
      <p>
        <strong>Lương:</strong> {job.salary}
      </p>
      <p>
        <strong>Loại công việc:</strong> {job.jobtype}
      </p>
      <p>
        <strong>Ngày tạo:</strong> {new Date(job.createdat).toLocaleString()}
      </p>
      <button className="btn btn-warning me-2" onClick={() => setEditJob(job)}>
        Sửa
      </button>
      <button className="btn btn-outline-dark" onClick={handleToggle}>
        {job.active ? "Khóa" : "Mở lại"}
      </button>
    </div>
  );
};

export default JobItem;
