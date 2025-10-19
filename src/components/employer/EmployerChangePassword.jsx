import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaKey } from "react-icons/fa";
import axios from "axios";
import EmployerNavbar from "./EmployerNavbar";

import { API_ROOT } from "../../config";

const API_PREFIX = API_ROOT;

const EmployerChangePassword = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.currentPassword) {
      setError("Vui lòng nhập mật khẩu hiện tại");
      return false;
    }
    if (!formData.newPassword) {
      setError("Vui lòng nhập mật khẩu mới");
      return false;
    }
    if (formData.newPassword.length < 6) {
      setError("Mật khẩu mới phải có ít nhất 6 ký tự");
      return false;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      setError("Mật khẩu mới và xác nhận mật khẩu không khớp");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await axios.post(
        `${API_PREFIX}/auth/change-password`,
        {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        setSuccess("Mật khẩu đã được thay đổi thành công");
        // Reset form
        setFormData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        setError("Không thể thay đổi mật khẩu");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      if (error.response && error.response.status === 401) {
        setError("Mật khẩu hiện tại không chính xác");
      } else {
        setError("Có lỗi xảy ra khi thay đổi mật khẩu");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <EmployerNavbar />
      <div className="container" style={{ marginTop: "80px", padding: "20px" }}>
        <div className="d-flex align-items-center mb-4">
          <button
            className="btn btn-outline-secondary me-3"
            onClick={() => navigate("/employer/profile")}
          >
            <FaArrowLeft /> Quay lại
          </button>
          <h2 className="mb-0" style={{ fontSize: "2rem", color: "#595959" }}>
            ĐỔI MẬT KHẨU
          </h2>
        </div>

        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card">
              <div className="card-body">
                {error && (
                  <div className="alert alert-danger mb-4">{error}</div>
                )}
                {success && (
                  <div className="alert alert-success mb-4">{success}</div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-3 mt-2 ms-3 me-3">
                    <strong className="form-label ">Mật khẩu hiện tại</strong>
                    <input
                      type="password"
                      className="form-control"
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3 mt-2 ms-3 me-3">
                    <strong className="form-label">Mật khẩu mới</strong>
                    <input
                      type="password"
                      className="form-control"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      required
                      minLength="6"
                    />
                    <small className="text-muted">
                      Mật khẩu phải có ít nhất 8 ký tự
                    </small>
                  </div>
                  <div className="mb-3  mt-2 ms-3 me-3">
                    <strong className="form-label">
                      Xác nhận mật khẩu mới
                    </strong>
                    <input
                      type="password"
                      className="form-control"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="d-grid  mt-2 ms-3 me-3 mb-3">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          Đang xử lý...
                        </>
                      ) : (
                        <>
                          <FaKey
                            className="me-2"
                            style={{ fontSize: "12px", marginBottom: "4px" }}
                          />
                          Cập nhật mật khẩu
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EmployerChangePassword;
