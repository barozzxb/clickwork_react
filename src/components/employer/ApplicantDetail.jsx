import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  FaArrowLeft,
  FaCalendarPlus,
  FaCheck,
  FaTimes,
  FaFlag,
  FaFileAlt,
  FaEnvelope,
  FaPhone,
} from "react-icons/fa";
import axios from "axios";
import CreateAppointment from "./CreateAppointment";
import "./styles/employer.css";

import { API_ROOT } from "../../config";

const ApplicantDetail = () => {
  const { jobId, applicantId } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);

  useEffect(() => {
    fetchApplicantDetails();
    // eslint-disable-next-line
  }, [applicantId]);

  const fetchApplicantDetails = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${API_ROOT}/employer/applicants/${applicantId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.status) {
        setApplication(response.data.body);
      }
    } catch (error) {
      setApplication(null);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (status) => {
    const confirmMessage =
      status === "ACCEPTED"
        ? "Bạn có chắc chắn muốn duyệt ứng viên này?"
        : "Bạn có chắc chắn muốn từ chối ứng viên này?";
    if (window.confirm(confirmMessage)) {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.patch(
          `${API_ROOT}/employer/applicants/${applicantId}/status?status=${status}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.data.status) {
          fetchApplicantDetails();
        }
      } catch (error) {}
    }
  };

  if (loading) {
    return (
      <div className="applicant-detail-container d-flex justify-content-center align-items-center">
        <div className="spinner-border loading-spinner" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </div>
      </div>
    );
  }

  const applicant = application?.applicant;

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "ACCEPTED":
        return "bg-accepted accepted";
      case "REJECTED":
        return "bg-rejected rejected";
      default:
        return "bg-pending pending";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "ACCEPTED":
        return "Đã được chấp nhận";
      case "REJECTED":
        return "Đã bị từ chối";
      default:
        return "Đang chờ...";
    }
  };

  return (
    <div className="container" style={{ marginTop: "80px", padding: "20px" }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center">
          <button
            onClick={() => navigate(`/employer/jobs/${jobId}/applicants`)}
            className="btn btn-outline-secondary me-3"
          >
            <FaArrowLeft /> Quay lại
          </button>
          <h2
            className="mb-0 text-center"
            style={{ fontSize: "2rem", color: "#595959" }}
          >
            THÔNG TIN ỨNG VIÊN
          </h2>
        </div>
      </div>
      <div className="row">
        <div className="col-md-8">
          <div className="applicant-card card mb-4">
            <div className="card-body">
              <strong
                style={{
                  fontSize: "1.5rem",
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "8px",
                }}
              >
                {applicant?.fullname}
              </strong>
              <div className="">
                <p
                  className="applicant-contact"
                  style={{
                    justifyContent: "center",
                    textAlign: "center",
                    marginTop: "8px",
                    marginBottom: "6px",
                    fontWeight: "bold",
                  }}
                >
                  <FaEnvelope
                    style={{ paddingBottom: "2px", marginRight: "10px" }}
                  />
                  {applicant?.email}
                </p>
                <p
                  className="applicant-contact"
                  style={{
                    justifyContent: "center",
                    textAlign: "center",
                    marginTop: "4px",
                    fontWeight: "bold",
                  }}
                >
                  <FaPhone
                    style={{ paddingBottom: "2px", marginRight: "10px" }}
                  />
                  {applicant?.phone}
                </p>
              </div>
              <hr />
              {applicant?.defaultCV && (
                <div>
                  <a
                    href={applicant.defaultCV.file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cv-link"
                  >
                    <FaFileAlt /> Xem CV
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="status-card card mb-4">
            <div className="card-body d-flex flex-column align-items-center text-center">
              <h5 className="status-title mt-3 mb-2">TRẠNG THÁI ỨNG TUYỂN</h5>
              <div className={getStatusBadgeClass(application?.status)}>
                {getStatusText(application?.status)}
              </div>

              {application?.status === "PENDING" && (
                <div className="d-grid gap-2 mt-3 w-100">
                  <button
                    className="btn-action schedule mt-2 mb-2 ms-3 me-3"
                    onClick={() => handleStatusUpdate("ACCEPTED")}
                  >
                    <FaCheck /> Duyệt ứng viên
                  </button>
                  <button
                    className="btn-reject schedule mb-3 ms-3 me-3"
                    onClick={() => handleStatusUpdate("REJECTED")}
                  >
                    <FaTimes /> Từ chối
                  </button>
                </div>
              )}

              {application?.status === "ACCEPTED" && (
                <div className="d-grid mt-3 w-100">
                  <button
                    className="btn-action schedule mt-2 mb-3 ms-3 me-3"
                    onClick={() => setShowAppointmentModal(true)}
                  >
                    <FaCalendarPlus /> Đặt lịch hẹn
                  </button>
                </div>
              )}
            </div>
          </div>
          {applicant && applicant.user && (
            <Link
              to={`/employer/report/${applicant.user.username}`}
              className="report-button"
            >
              <FaFlag /> Báo cáo người dùng
            </Link>
          )}
        </div>
      </div>
      {showAppointmentModal && (
        <CreateAppointment
          applicationId={applicantId}
          onClose={() => setShowAppointmentModal(false)}
          onSuccess={() => {
            setShowAppointmentModal(false);
            fetchApplicantDetails();
          }}
        />
      )}
    </div>
  );
};

export default ApplicantDetail;
