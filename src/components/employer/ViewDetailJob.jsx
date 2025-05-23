import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ViewDetailJob = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`/employer/job/${id}`)
      .then((res) => setJob(res.data.data))
      .catch((err) => {
        console.error("Không thể lấy thông tin công việc", err);
        navigate("/404"); // Chuyển hướng nếu không tìm thấy job
      });
  }, [id, navigate]);

  if (!job) return <div>Đang tải thông tin công việc...</div>;

  return (
    <div className="container mt-4">
      <h2>Chi tiết công việc</h2>
      <hr />
      <div className="mb-3">
        <strong>Tên công việc:</strong> {job.name}
      </div>
      <div className="mb-3">
        <strong>Lĩnh vực:</strong> {job.field}
      </div>
      <div className="mb-3">
        <strong>Mức lương:</strong> {job.salary}
      </div>
      <div className="mb-3">
        <strong>Ngày tạo:</strong>{" "}
        {new Date(job.createdat).toLocaleDateString()}
      </div>
      <div className="mb-3">
        <strong>Số lượng tuyển:</strong> {job.quantity}
      </div>
      <div className="mb-3">
        <strong>Trạng thái:</strong>{" "}
        <span className={job.active ? "text-success" : "text-danger"}>
          {job.active ? "Đang mở" : "Đã khóa"}
        </span>
      </div>
      <hr />
      <div className="mb-3">
        <strong>Mô tả công việc:</strong>
        <p>{job.description}</p>
      </div>
      <div className="mb-3">
        <strong>Yêu cầu kỹ năng:</strong>
        <p>{job.requiredskill}</p>
      </div>
      <div className="mb-3">
        <strong>Lợi ích:</strong>
        <p>{job.benefit}</p>
      </div>
    </div>
  );
};

export default ViewDetailJob;
