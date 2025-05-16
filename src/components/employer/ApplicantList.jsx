import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaFilter,
  FaSearch,
  FaUser,
  FaCalendarAlt,
  FaEnvelope,
} from "react-icons/fa";
import axios from "axios";
import "./styles/employer.css";

const ApplicantList = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    skill: "",
    status: "",
    dateRange: "all",
  });

  useEffect(() => {
    fetchApplicants();
    // eslint-disable-next-line
  }, [jobId, filters]);

  const fetchApplicants = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      let params = [];
      if (filters.skill)
        params.push(`skill=${encodeURIComponent(filters.skill)}`);
      if (filters.status)
        params.push(`status=${encodeURIComponent(filters.status)}`);
      // Xử lý dateRange nếu cần
      const query = params.length ? `?${params.join("&")}` : "";
      const response = await axios.get(
        `http://localhost:9000/api/employer/applicants/by-job/${jobId}${query}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.status) {
        setApplicants(response.data.body || []);
      }
    } catch (err) {
      setApplicants([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "ACCEPTED":
        return "status-accepted accepted";
      case "REJECTED":
        return "status-rejected rejected";
      default:
        return "status-pending pending";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "ACCEPTED":
        return "Đã được chấp nhận";
      case "REJECTED":
        return "Đã bị từ chối";
      default:
        return "Đang chờ";
    }
  };

  return (
    <div className="container" style={{ marginTop: "80px", padding: "20px" }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center">
          <button
            onClick={() => navigate("/employer/jobs")}
            className="btn btn-outline-secondary me-3"
          >
            <FaArrowLeft /> Quay lại
          </button>

          <h2
            className="mb-0 text-center"
            style={{ fontSize: "2rem", color: "#595959" }}
          >
            DANH SÁCH ỨNG VIÊN
          </h2>
        </div>
      </div>
      <div className="card" style={{ fontWeight: "600" }}>
        {/* Filters */}
        <div className="custom-card mb-4 fade-in ms-3 mt-3">
          <div className="custom-card-header mb-1">
            <strong
              className="mb-1"
              style={{ fontSize: "16px", fontWeight: "bold" }}
            >
              <FaFilter
                style={{
                  fontSize: "15px",
                  marginTop: "-4px",
                  color: "#006600",
                }}
              />{" "}
              BỘ LỌC
            </strong>
          </div>
          <div className="custom-card-body">
            <div className="row g-3">
              <div className="col-md-4 d-flex" style={{ alignItems: "center" }}>
                <label
                  className="form-label mt-2"
                  style={{ whiteSpace: "nowrap", marginRight: "15px" }}
                >
                  Kỹ năng
                </label>
                <div
                  className="input-group shadow-sm"
                  style={{
                    borderRadius: "4px",
                    border: "solid 0.5px #e6e6e6",
                  }}
                >
                  <span className="">
                    <FaSearch
                      style={{
                        fontSize: "15px",
                        color: "#595959",
                        marginLeft: "5px",
                      }}
                    />
                  </span>
                  <input
                    style={{
                      border: "none",
                      color: "#000",
                      backgroundColor: "#fff",
                      margin: "2px",
                    }}
                    type="text"
                    className="form-control-custom"
                    placeholder="Tìm theo kỹ năng"
                    value={filters.skill}
                    onChange={(e) =>
                      setFilters({ ...filters, skill: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="col-md-4 d-flex" style={{ alignItems: "center" }}>
                <label
                  className="form-label mt-2"
                  style={{ whiteSpace: "nowrap", marginRight: "15px" }}
                >
                  Trạng thái
                </label>
                <select
                  style={{
                    borderRadius: "4px",
                    border: "solid 0.5px #e6e6e6",
                    padding: "4px",
                    width: "90%",
                  }}
                  className="form-control-custom shadow-sm"
                  value={filters.status}
                  onChange={(e) =>
                    setFilters({ ...filters, status: e.target.value })
                  }
                >
                  <option value="">Tất cả</option>
                  <option value="PENDING">Đang chờ</option>
                  <option value="ACCEPTED">Đã được chấp nhận</option>
                  <option value="REJECTED">Đã bị từ chối</option>
                </select>
              </div>
              <div className="col-md-4">
                <label
                  className="form-label mt-2"
                  style={{ whiteSpace: "nowrap", marginRight: "15px" }}
                >
                  Thời gian
                </label>
                <select
                  style={{
                    borderRadius: "4px",
                    border: "solid 0.5px #e6e6e6",
                    padding: "4px",
                    width: "50%",
                  }}
                  className="form-control-custom"
                  value={filters.dateRange}
                  onChange={(e) =>
                    setFilters({ ...filters, dateRange: e.target.value })
                  }
                >
                  <option value="all">Tất cả</option>
                  <option value="today">Hôm nay</option>
                  <option value="week">Tuần này</option>
                  <option value="month">Tháng này</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Applicants List */}
        {loading ? (
          <div className="text-center my-5">
            <div className="spinner-border loading-spinner" role="status">
              <span className="visually-hidden">Đang tải...</span>
            </div>
          </div>
        ) : applicants.length === 0 ? (
          <div className="alert-custom warning text-center">
            <p className="mb-0">Không có ứng viên</p>
          </div>
        ) : (
          <div className="grid-container fade-in row" style={{ margin: "5px" }}>
            {applicants.map((app) => (
              <div
                key={app.id}
                className="custom-card h-100 col-md-6"
                style={{ padding: "0" }}
              >
                <div className=" card custom-card-body mb-4 mt-4 ms-3 me-3 d-flex flex-column justify-content-between h-100">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div className="d-flex align-items-center ms-3 mt-3">
                      <FaUser
                        className="text-primary-custom me-2"
                        style={{ color: "#009900" }}
                      />
                      <strong
                        className="title-medium"
                        style={{
                          fontSize: "1.2rem",
                          fontWeight: "bold",
                          paddingTop: "5px",
                        }}
                      >
                        {app.applicant?.fullname}
                      </strong>
                    </div>
                    <div
                      className={getStatusBadgeClass(app.status)}
                      style={{
                        marginRight: "15px",
                        marginTop: "15px",
                      }}
                    >
                      {getStatusText(app.status)}
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="d-flex align-items-center mb-2 ms-3">
                      <FaEnvelope
                        className="text-primary-custom me-2"
                        style={{ color: "#006699" }}
                      />
                      <span>{app.applicant?.email}</span>
                    </div>
                    <div className="d-flex align-items-center ms-3">
                      <FaCalendarAlt
                        className="text-primary-custom me-2"
                        style={{ color: "#cc0000" }}
                      />
                      <span>
                        Ngày ứng tuyển:{" "}
                        {app.appliedAt
                          ? new Date(app.appliedAt).toLocaleDateString()
                          : ""}
                      </span>
                    </div>
                  </div>
                  <div className="d-flex justify-content-end p-3 pt-0">
                    <button
                      onClick={() =>
                        navigate(`/employer/jobs/${jobId}/applicants/${app.id}`)
                      }
                      className="btn-action"
                      style={{ width: "20%", padding: "5px" }}
                    >
                      Xem chi tiết
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicantList;
