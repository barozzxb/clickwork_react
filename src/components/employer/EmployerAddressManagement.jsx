import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaEdit, FaTrash, FaArrowLeft } from "react-icons/fa";
import axios from "axios";
import { Link } from "react-router-dom";

import EmployerNavbar from "./EmployerNavbar";

const API_PREFIX = "http://localhost:9000/api";

const EmployerAddressManagement = () => {
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [formData, setFormData] = useState({
    nation: "Việt Nam",
    province: "",
    district: "",
    village: "",
    detail: "",
  });

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
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
        setAddresses(response.data.addresses || []);
      } else {
        setError("Không thể tải danh sách địa chỉ");
      }
    } catch (error) {
      setError("Có lỗi xảy ra khi tải danh sách địa chỉ");
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

  const handleEdit = (address) => {
    setEditingAddress(address);
    setFormData({
      nation: address.nation || "Việt Nam",
      province: address.province || "",
      district: address.district || "",
      village: address.village || "",
      detail: address.detail || "",
    });
    setShowAddForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa địa chỉ này?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_PREFIX}/employer/profile/address/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Refresh addresses
      fetchAddresses();
    } catch (error) {
      setError("Có lỗi xảy ra khi xóa địa chỉ");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      if (editingAddress) {
        // Update existing address
        await axios.put(
          `${API_PREFIX}/employer/profile/address/${editingAddress.id}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        // Add new address
        await axios.post(`${API_PREFIX}/employer/profile/address`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      // Reset form
      setFormData({
        nation: "Việt Nam",
        province: "",
        district: "",
        village: "",
        detail: "",
      });
      setShowAddForm(false);
      setEditingAddress(null);

      // Refresh addresses
      fetchAddresses();
    } catch (error) {
      setError("Có lỗi xảy ra khi lưu địa chỉ");
    } finally {
      setLoading(false);
    }
  };

  if (loading && addresses.length === 0) {
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
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="d-flex align-items-center">
            <button
              className="btn btn-outline-secondary me-3"
              onClick={() => navigate("/employer/profile")}
            >
              <FaArrowLeft /> Quay lại
            </button>
            <h2 className="mb-0" style={{ fontSize: "2rem", color: "#595959" }}>
              QUẢN LÝ ĐỊA CHỈ
            </h2>
          </div>
          {!showAddForm && (
            <button
              className="btn btn-action"
              onClick={() => setShowAddForm(true)}
            >
              <FaPlus className="me-2" /> Thêm
            </button>
          )}
        </div>

        {error && <div className="alert alert-danger mb-4">{error}</div>}

        <div className="row">
          <div className="col-md-8">
            <div className="card mb-4">
              <div className="card-header d-flex justify-content-between align-items-center">
                <strong className="mb-0 ">THÔNG TIN CƠ BẢN</strong>
                {!showAddForm && (
                  <button
                    className="btn btn-sm btn-profile-edit"
                    onClick={() => setShowAddForm(true)}
                  >
                    <FaPlus className="me-1 " /> Thêm địa chỉ mới
                  </button>
                )}
              </div>
              <div className="card-body mt-2 ms-3 me-3">
                {!showAddForm ? (
                  <>
                    {addresses.length > 0 ? (
                      addresses.map((address) => (
                        <div key={address.id} className="mb-3">
                          <div className="d-flex justify-content-between">
                            <strong>
                              {address.nation} - {address.province} -{" "}
                              {address.district} - {address.village}
                            </strong>
                            <div>
                              <button
                                className="btn btn-sm me-2"
                                style={{
                                  backgroundColor: "#ffcc00",
                                  color: "#000",
                                }}
                                onClick={() => handleEdit(address)}
                              >
                                <FaEdit
                                  style={{
                                    fontSize: "12px",
                                    marginBottom: "4px",
                                    marginLeft: "2px",
                                  }}
                                />
                              </button>
                              <button
                                className="btn btn-sm"
                                style={{
                                  backgroundColor: "#ff3300",
                                  color: "#fff",
                                }}
                                onClick={() => handleDelete(address.id)}
                              >
                                <FaTrash
                                  style={{
                                    fontSize: "12px",
                                    marginBottom: "4px",
                                  }}
                                />
                              </button>
                            </div>
                          </div>
                          <p className="mb-0">{address.detail}</p>
                        </div>
                      ))
                    ) : (
                      <div className="text-center text-muted">
                        Không có địa chỉ nào
                      </div>
                    )}
                  </>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Quốc gia</label>
                        <input
                          type="text"
                          className="form-control"
                          name="nation"
                          value={formData.nation}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Tỉnh/Thành</label>
                        <input
                          type="text"
                          className="form-control"
                          name="province"
                          value={formData.province}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Quận/Huyện</label>
                        <input
                          type="text"
                          className="form-control"
                          name="district"
                          value={formData.district}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Xã/Phường</label>
                        <input
                          type="text"
                          className="form-control"
                          name="village"
                          value={formData.village}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-12 mb-3">
                        <label className="form-label">Chi tiết</label>
                        <textarea
                          className="form-control"
                          name="detail"
                          value={formData.detail}
                          onChange={handleChange}
                          rows="3"
                        ></textarea>
                      </div>

                      <div className="col-12 text-end">
                        <button
                          type="button"
                          className="btn btn-secondary me-2"
                          onClick={() => setShowAddForm(false)}
                          disabled={loading}
                        >
                          Hủy
                        </button>
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
                              Đang lưu...
                            </>
                          ) : (
                            <>
                              <FaPlus className="me-2" />
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
                    className="btn-basic mb-3"
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

export default EmployerAddressManagement;
