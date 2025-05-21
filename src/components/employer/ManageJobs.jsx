import React, { useEffect, useState } from "react";
import JobList from "./JobList";
import JobForm from "./JobForm";
import api from "../../services/api"; // ✅ import API wrapper có Bearer token

const ManageJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const employerEmail = localStorage.getItem("email");

  useEffect(() => {
    if (!employerEmail) return;
    api
      .get(`/employer/job/by-employer?email=${employerEmail}`)
      .then((res) => setJobs(res.data.data))
      .catch((err) => console.error("Error fetching jobs:", err));
  }, [refresh, employerEmail]);

  const handleEdit = (job) => setSelectedJob(job);

  const handleToggle = (id) => {
    api
      .patch(`/employer/job/${id}/toggle`)
      .then(() => setRefresh(!refresh))
      .catch((err) => console.error("Error toggling job:", err));
  };

  return (
    <main className="bg-white">
      <div className="manage-container bg-white">
        <p className="h2">Quản lý công việc</p>
        <hr />
        <div className="d-flex justify-content-center align-items-center">
          <button
            className="btn btn-action"
            data-bs-toggle="modal"
            data-bs-target="#addJob"
            onClick={() => setSelectedJob(null)}
          >
            <i className="fa fa-plus"> </i>Thêm công việc mới
          </button>
        </div>
        <hr />
        <JobList jobs={jobs} onEdit={handleEdit} onToggle={handleToggle} />
        <JobForm
          selectedJob={selectedJob}
          onSuccess={() => setRefresh(!refresh)}
        />
      </div>
    </main>
  );
};

export default ManageJobs;
