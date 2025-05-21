import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaSave, FaPen, FaPlus, FaTrash } from "react-icons/fa";
import axios from "axios";
import EmployerNavbar from "./EmployerNavbar";
import {BACK_END_HOST} from "../../config";
const API_PREFIX = "http://localhost:9000/api";

const EmployerProfile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    fullname: "",
    phonenum: "",
    avatar: "",
    website: "",
    taxnumber: "",
    field: "",
    workingdays: "",
    companysize: "",
    sociallink: "",
    overview: "",
  });

  useEffect(() => {
    fetchEmployerProfile();
  }, []);

  const fetchEmployerProfile = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await axios.get(`${API_PREFIX}/employer/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data) {
        const profileData = response.data;
        setProfile(profileData);
        setAddresses(profileData.addresses || []);
        setFormData({
          fullname: profileData.fullname || "",
          phonenum: profileData.phonenum || "",
          avatar: profileData.avatar || "",
          website: profileData.website || "",
          taxnumber: profileData.taxnumber || "",
          field: profileData.field || "",
          workingdays: profileData.workingdays || "",
          companysize: profileData.companysize || "",
          sociallink: profileData.sociallink || "",
          overview: profileData.overview || "",
        });
      } else {
        setError("Không thể tải thông tin hồ sơ");
      }
    } catch (error) {
      console.error(error);
      setError("Có lỗi xảy ra khi tải dữ liệu profile");
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${API_PREFIX}/employer/profile`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        // Refresh profile data
        await fetchEmployerProfile();
        setEditMode(false);
      } else {
        setError("Không thể cập nhật hồ sơ");
      }
    } catch (error) {
      console.error(error);
      setError("Có lỗi xảy ra khi cập nhật hồ sơ");
    } finally {
      setSaving(false);
    }
  };

  if (loading && !profile) {
    return (
      <>
        <EmployerNavbar />
        <div
          className="container"
          style={{ marginTop: "80px", padding: "20px" }}
        >
          <div className="text-center my-5">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Đang tải...</span>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <EmployerNavbar />
      <div className="container" style={{ marginTop: "80px", padding: "20px" }}>
        <h2 className="mb-4" style={{ fontSize: "2rem", color: "#595959" }}>
          HỒ SƠ DOANH NGHIỆP
        </h2>

        {error && <div className="alert alert-danger mb-4">{error}</div>}

        <div className="row">
          <div className="col-md-8">
            <div className="card mb-4">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="mb-0">THÔNG TIN CƠ BẢN</h5>
                {!editMode && (
                  <button
                    className="btn btn-sm btn-profile-edit"
                    onClick={() => setEditMode(true)}
                  >
                    <FaPen
                      className="me-1"
                      style={{ fontSize: "12px", marginBottom: "4px" }}
                    />{" "}
                    Chỉnh sửa
                  </button>
                )}
              </div>
              <div className="card-body">
                {!editMode ? (
                  <>
                    {profile && (
                      <div className="row">
                        <div className="col-md-4 text-center mb-4">
                          <div
                            className="avatar-container"
                            style={{ margin: "27px auto 20px auto" }}
                          >
                            <img
                              src={
                                `${BACK_END_HOST}${profile.avatar}`
                              }
                              alt="Company Logo"
                              className="img-fluid rounded-circle mb-3"
                              style={{
                                width: "150px",
                                height: "150px",
                                objectFit: "cover",
                              }}
                            />
                          </div>
                          <strong>{profile.fullname}</strong>
                          <p className="text-muted">{profile.field}</p>
                        </div>

                        <div className="col-md-8">
                          <div className="row mb-3 mt-3">
                            <div className="col-md-6">
                              <p>
                                <strong>Email:</strong> {profile.email}
                              </p>
                              <p>
                                <strong>Số điện thoại:</strong>{" "}
                                {profile.phonenum}
                              </p>
                              <p>
                                <strong>Website:</strong> {profile.website}
                              </p>
                              <p>
                                <strong>Mã số thuế:</strong> {profile.taxnumber}
                              </p>
                            </div>
                            <div className="col-md-6">
                              <p>
                                <strong>Ngày làm việc:</strong>{" "}
                                {profile.workingdays}
                              </p>
                              <p>
                                <strong>Quy mô công ty:</strong>{" "}
                                {profile.companysize}
                              </p>
                              <p>
                                <strong>Mạng xã hội:</strong>{" "}
                                {profile.sociallink}
                              </p>
                            </div>
                          </div>

                          <h6>Giới thiệu</h6>
                          <p>{profile.overview}</p>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Tên doanh nghiệp</label>
                        <input
                          type="text"
                          className="form-control"
                          name="fullname"
                          value={formData.fullname}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Số điện thoại</label>
                        <input
                          type="text"
                          className="form-control"
                          name="phonenum"
                          value={formData.phonenum}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">URL Ảnh đại diện</label>
                        <input
                          type="text"
                          className="form-control"
                          name="avatar"
                          value={formData.avatar}
                          onChange={handleChange}
                          placeholder="https://example.com/image.jpg"
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Website</label>
                        <input
                          type="text"
                          className="form-control"
                          name="website"
                          value={formData.website}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Mã số thuế</label>
                        <input
                          type="text"
                          className="form-control"
                          name="taxnumber"
                          value={formData.taxnumber}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Lĩnh vực</label>
                        <input
                          type="text"
                          className="form-control"
                          name="field"
                          value={formData.field}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Ngày làm việc</label>
                        <input
                          type="text"
                          className="form-control"
                          name="workingdays"
                          value={formData.workingdays}
                          onChange={handleChange}
                          placeholder="Ví dụ: Thứ 2 - Thứ 6"
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Quy mô công ty</label>
                        <input
                          type="text"
                          className="form-control"
                          name="companysize"
                          value={formData.companysize}
                          onChange={handleChange}
                          placeholder="Ví dụ: 50-100 nhân viên"
                        />
                      </div>
                      <div className="col-md-12 mb-3">
                        <label className="form-label">Mạng xã hội</label>
                        <input
                          type="text"
                          className="form-control"
                          name="sociallink"
                          value={formData.sociallink}
                          onChange={handleChange}
                          placeholder="Ví dụ: https://facebook.com/company"
                        />
                      </div>
                      <div className="col-12 mb-3">
                        <label className="form-label">Giới thiệu</label>
                        <textarea
                          className="form-control"
                          name="overview"
                          value={formData.overview}
                          onChange={handleChange}
                          rows="5"
                        ></textarea>
                      </div>

                      <div className="col-12 text-end">
                        <button
                          type="button"
                          className="btn btn-secondary me-2"
                          onClick={() => setEditMode(false)}
                          disabled={saving}
                        >
                          Hủy
                        </button>
                        <button
                          type="submit"
                          className="btn btn-primary"
                          disabled={saving}
                        >
                          {saving ? (
                            <>
                              <span
                                className="spinner-border spinner-border-sm me-2"
                                role="status"
                                aria-hidden="true"
                              ></span>
                              Đang lưu...
                            </>
                          ) : (
                            <>
                              <FaSave className="me-2" />
                              Lưu thay đổi
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card mb-4">
              <div className="card-header">
                <h5 className="mb-0">QUẢN LÝ THÔNG TIN</h5>
              </div>
              <div className="card-body">
                <div className="d-grid">
                  <Link
                    to="/employer/profile/password"
                    className="btn-basic mb-3 mt-2"
                  >
                    Đổi mật khẩu
                  </Link>
                  <Link
                    to="/employer/profile/addresses"
                    className="btn-basic mb-2"
                  >
                    Quản lý địa chỉ ({addresses.length})
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EmployerProfile;
