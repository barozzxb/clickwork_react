import React, { useState } from "react";
import {
  FaArrowLeft,
  FaTimes,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaGlobe,
} from "react-icons/fa";
import axios from "axios";
import "./styles/employer.css";

import {API_ROOT} from "../../config"

const CreateAppointment = ({ applicationId, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    time: "",
    place: "",
    website: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_ROOT}/employer/applicants/${applicationId}/appointment`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.status) {
        onSuccess();
      } else {
        setError("Có lỗi xảy ra khi đặt lịch hẹn");
      }
    } catch (error) {
      setError("Có lỗi xảy ra khi đặt lịch hẹn");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div
      className="card d-flex justify-content-center align-items-center"
      style={{ backgroundColor: "rgba(118, 162, 127, 0.5)", width: "50%" }}
    >
      <div className="" style={{ width: "100%" }}>
        <div className="ms-4 me-3">
          <div className=" d-flex justify-content-between align-items-center">
            <strong
              className="title-medium mb-3 mt-3"
              style={{ fontSize: "1.4rem" }}
            >
              ĐẶT LỊCH HẸN
            </strong>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              aria-label="Close"
              style={{ fontSize: "10px" }}
            ></button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body-custom">
              {error && <div className="alert-custom danger">{error}</div>}

              <div className="mb-4 d-flex">
                <label className="form-label d-flex align-items-center gap-2 me-3">
                  <FaCalendarAlt className="text-primary-custom" />
                  Thời gian
                </label>
                <input
                  type="datetime-local"
                  className="form-control-custom"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                  style={{
                    width: "70%",
                    marginBottom: "4px",
                    border: "1px solid rgb(189, 189, 189)",
                  }}
                />
              </div>

              <div className="mb-4 d-flex">
                <label
                  className="form-label d-flex align-items-center gap-2"
                  style={{
                    marginRight: "19px",
                  }}
                >
                  <FaMapMarkerAlt className="text-primary-custom" />
                  Địa điểm
                </label>
                <input
                  type="text"
                  className="form-control-custom"
                  name="place"
                  value={formData.place}
                  onChange={handleChange}
                  placeholder="Nhập địa điểm cuộc hẹn"
                  required
                  style={{
                    width: "70%",
                    marginBottom: "4px",
                    border: "1px solid rgb(189, 189, 189)",
                  }}
                />
              </div>

              <div className="mb-4 d-flex">
                <label className="form-label d-flex align-items-center gap-2 me-3">
                  <FaGlobe className="text-primary-custom" />
                  Website (nếu có)
                </label>
                <input
                  type="text"
                  className="form-control-custom"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="https://example.com"
                  style={{
                    width: "61.5%",
                    marginBottom: "4px",
                    border: "1px solid rgb(189, 189, 189)",
                  }}
                />
              </div>
            </div>

            <div className="modal-footer-custom d-flex justify-content-between align-items-center">
              <button
                type="button"
                className="btn-cancel"
                onClick={onClose}
                disabled={loading}
              >
                <FaTimes style={{ fontSize: "12px", marginBottom: "2px" }} />{" "}
                Hủy
              </button>
              <button
                type="submit"
                className="btn-action"
                disabled={loading}
                style={{ marginRight: "10px", marginBottom: "10px" }}
              >
                {loading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    <span>Đang xử lý...</span>
                  </>
                ) : (
                  <>
                    <FaCalendarAlt
                      style={{
                        fontSize: "13px",
                        marginBottom: "4px",
                        marginRight: "5px",
                      }}
                    />{" "}
                    Đặt lịch hẹn
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateAppointment;
