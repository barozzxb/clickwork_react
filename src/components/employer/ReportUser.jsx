import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaExclamationTriangle } from "react-icons/fa";

import { API_ROOT } from '../../config';

const ReportUser = () => {
  const { username } = useParams();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    reportedUsername: username || "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Vui lòng đăng nhập lại");
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_ROOT}/api/report`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.status) {
        setSuccess("Báo cáo đã được gửi thành công!");
        // Không reset username nếu được truyền từ params
        setFormData((prev) => ({
          title: "",
          content: "",
          reportedUsername: username || "",
        }));
      } else {
        setError(data.message || "Không thể gửi báo cáo");
      }
    } catch (err) {
      console.error("Error submitting report:", err);
      setError("Đã xảy ra lỗi khi gửi báo cáo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ marginTop: "80px", padding: "20px" }}>
      <div className="card">
        <div className="card-header bg-warning text-dark d-flex justify-content-between align-items-center">
          <strong
            className="mb-0"
            style={{ color: "#000", fontSize: "1.2rem" }}
          >
            <FaExclamationTriangle
              style={{ fontSize: "15px", marginBottom: "3px" }}
              className="me-2"
            />
            Báo cáo người dùng
          </strong>
          <button
            className="btn btn-sm btn-light"
            onClick={() => navigate(-1)}
            title="Quay lại"
          >
            <FaArrowLeft /> Quay lại
          </button>
        </div>
        <div className="card-body">
          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3 mt-3 ms-3 me-3">
              <strong htmlFor="reportedUsername" className="form-label">
                Tên người dùng bị báo cáo
              </strong>
              <input
                type="text"
                className="form-control"
                id="reportedUsername"
                name="reportedUsername"
                value={formData.reportedUsername}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3 mt-3 ms-3 me-3">
              <strong htmlFor="title" className="form-label">
                Tiêu đề báo cáo
              </strong>
              <input
                type="text"
                className="form-control"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3 mt-3 ms-3 me-3">
              <strong htmlFor="content" className="form-label">
                Nội dung báo cáo chi tiết
              </strong>
              <textarea
                className="form-control"
                id="content"
                name="content"
                rows="5"
                value={formData.content}
                onChange={handleChange}
                required
              />
            </div>

            <div className="d-flex justify-content-end">
              <button
                type="submit"
                className="btn btn-yellow mb-2 me-3 ms-auto"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Đang gửi...
                  </>
                ) : (
                  "Gửi báo cáo"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReportUser;
