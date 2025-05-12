import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import OverlayLoading from '../effects/Loading.jsx';

import { API_ROOT } from '../../config';
import { BACK_END_HOST } from '../../config';
import { toast } from 'react-toastify';


const ApplicantProfile = () => {
  const token = localStorage.getItem('token');

  const [id, setId] = useState(null);
  const [applicant, setApplicant] = useState(null);
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [phonenum, setPhonenum] = useState('');
  const [avatar, setAvatar] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [interested, setInterested] = useState('');

  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const [lockedFields, setLockedFields] = useState(true);

  const [cvList, setCvList] = useState([]);

  const [loading, setLoading] = useState(true);

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedCV, setSelectedCV] = useState(null);
  const [cvName, setCVName] = useState('');

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [cvToDelete, setCvToDelete] = useState(null);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_ROOT}/applicant/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = res.data.body;
      setApplicant(data);
      setId(data.id);
      setFullname(data.fullname || '');
      setEmail(data.email || '');
      setPhonenum(data.phonenum || '');
      setAvatar(data.avatar || '');
      setDob(data.dob || '');
      setGender(data.gender || '');
      setInterested(data.interested || '');
    } catch (err) {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const fetchCVList = async () => {
    setLoading(true);
    try {
      const cvres = await axios.get(`${API_ROOT}/applicant/manage-cvs`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCvList(cvres.data.body || []);
    } catch (err) {
      console.error('Lỗi khi lấy danh sách CV:', err);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchProfile();
    fetchCVList();
    setLoading(false);
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `${API_ROOT}/applicant/profile/update`,
        { id, fullname, email, phonenum, dob, gender: gender || null, interested },
        { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
      );
      console.log('Cập nhật thành công:', res.data);
      toast.success('Cập nhật thông tin thành công!');
      setLockedFields(true);
    } catch (err) {
      console.error('Lỗi khi cập nhật profile:', err);
    }
  };

  const openAvatarModal = () => {
    setPreviewFile(null);
    setSelectedFile(null);
    setShowAvatarModal(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreviewFile(reader.result);
    reader.readAsDataURL(file);
  };

  const handleAvatarUpload = async () => {
    if (!selectedFile) return;
    const formData = new FormData();
    formData.append('avatarFile', selectedFile);
    try {
      const res = await axios.post(
        `${API_ROOT}/applicant/profile/update/avatar`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` } }
      );
      const newAvatar = res.data.body;
      setAvatar(newAvatar);
      setApplicant((prev) => ({ ...prev, avatar: newAvatar }));
      setShowAvatarModal(false);

      toast.success('Cập nhật ảnh đại diện thành công!');
    } catch (err) {
      console.error('Upload lỗi:', err);
    }
  };

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [oldPassword, setOldPassword] = useState('');

  const handleResetPassword = async (e) => {

    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('Mật khẩu mới không khớp!');
      return;
    }
    try {
      const res = await axios.post(
        `${API_ROOT}/applicant/profile/change-password`,
        { username: null, oldPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('Đổi mật khẩu thành công:', res.data);
      toast.success('Đổi mật khẩu thành công!');
    } catch (err) {
      console.error('Lỗi khi đổi mật khẩu:', err);
      toast.error('Đổi mật khẩu thất bại!');
    }
  };


  const handleDeleteAccount = async (e) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa tài khoản này không?')) {
      try {
        const res = await axios.delete(`${API_ROOT}/applicant/profile/delete`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('Xóa tài khoản thành công:', res.data);
      } catch (err) {
        console.error('Lỗi khi xóa tài khoản:', err);
      }
    }
  };

  const handleUploadCV = async (e) => {
    e.preventDefault();

    if (!selectedCV || !cvName) {
      alert("Vui lòng chọn file và nhập tên CV");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedCV);
    formData.append("name", cvName);

    try {
      const response = await axios.post(`${API_ROOT}/applicant/manage-cvs/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success(response.data.message);
      setShowUploadModal(false);
      setSelectedCV(null);
      setCVName('');
      fetchCVList();
    } catch (error) {
      console.error("Lỗi khi upload CV:", error);
      toast.error("Có lỗi xảy ra khi tải lên CV");
    }
  };


  const handleDeleteCV = async () => {
    try {
      const res = await axios.delete(`${API_ROOT}/applicant/manage-cvs/delete/${cvToDelete}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success(res.data.message);
      setShowConfirmModal(false);
      setCvToDelete(null);

      // Gọi lại API để cập nhật danh sách CV sau khi xóa
      fetchCVList();
    } catch (err) {
      toast.error("Xóa CV thất bại");
      setShowConfirmModal(false);
      setCvToDelete(null);
    }
  };


  if (!applicant || cvList === null) {
    return <OverlayLoading />;
  }

  return (
    <main className="container py-5">
      {/* Tabs Navigation */}
      <ul className="nav nav-tabs mb-4" id="profileTab" role="tablist">
        {[
          { id: 'info', label: 'Thông tin' },
          { id: 'reset', label: 'Đổi mật khẩu' },
          { id: 'delete', label: 'Xóa tài khoản' },
          { id: 'cv', label: 'Quản lý CV' },
        ].map((tab, idx) => (
          <li className="nav-item" role="presentation" key={tab.id}>
            <button
              className={`nav-link ${idx === 0 ? 'active' : ''}`}
              id={`${tab.id}-tab`}
              data-bs-toggle="tab"
              data-bs-target={`#${tab.id}`}
              type="button"
              role="tab"
              aria-controls={tab.id}
              aria-selected={idx === 0}
            >
              {tab.label}
            </button>
          </li>
        ))}
      </ul>

      {/* Tabs Content */}
      <div className="tab-content" id="profileTabContent">
        {/* 1. Thông tin cá nhân */}
        <div
          className="tab-pane fade show active"
          id="info"
          role="tabpanel"
          aria-labelledby="info-tab"
        >
          <div className="card shadow-sm mb-4 p-5">
            <div className="card-body">
              <div className="row gx-4">
                <div className="d-flex flex-column align-items-center col-md-4 text-center border-end">
                  {avatar ? (
                    <img
                      src={`${BACK_END_HOST}${avatar}`}
                      alt="Avatar"
                      className="rounded-circle mb-3"
                      style={{ width: 150, height: 150, objectFit: 'cover' }}
                    />
                  ) : (
                    <div
                      className="d-inline-flex align-items-center justify-content-center mb-3"
                      style={{
                        width: 150,
                        height: 150,
                        border: '2px dashed #dee2e6',
                        borderRadius: '50%',
                      }}
                    >
                      <span className="text-muted">Chưa có hình</span>
                    </div>
                  )}
                  <button
                    type="button"
                    className="btn-action btn-outline-primary"
                    onClick={openAvatarModal}
                  >
                    Chỉnh sửa ảnh
                  </button>
                </div>

                <div className="col-md-8">
                  <h5 className="card-title mb-4">Thông tin cá nhân</h5>
                  <form onSubmit={handleUpdateProfile}>
                    <div className="row g-3">
                      <div className="col-sm-6">
                        <label htmlFor="fullname" className="form-label">
                          Họ tên
                        </label>
                        <input
                          type="text"
                          id="fullname"
                          className="form-control"
                          value={fullname}
                          onChange={e => setFullname(e.target.value)}
                          required
                          {...lockedFields ? { readOnly: true } : {}}
                        />
                      </div>
                      <div className="col-sm-6">
                        <label htmlFor="email" className="form-label">
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          className="form-control"
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          required
                          {...lockedFields ? { readOnly: true } : {}}
                        />
                      </div>
                      <div className="col-sm-6">
                        <label htmlFor="phonenum" className="form-label">
                          Số điện thoại
                        </label>
                        <input
                          type="text"
                          id="phonenum"
                          className="form-control"
                          value={phonenum}
                          onChange={e => setPhonenum(e.target.value)}
                          {...lockedFields ? { readOnly: true } : {}}
                        />
                      </div>
                      <div className="col-sm-6">
                        <label htmlFor="dob" className="form-label">
                          Ngày sinh
                        </label>
                        <input
                          type="date"
                          id="dob"
                          className="form-control"
                          value={dob}
                          onChange={e => setDob(e.target.value)}
                          {...lockedFields ? { readOnly: true } : {}}
                        />
                      </div>
                      <div className="col-sm-6">
                        <label htmlFor="gender" className="form-label">
                          Giới tính
                        </label>
                        <select
                          id="gender"
                          className="form-select"
                          value={gender}
                          onChange={e => setGender(e.target.value)}
                          {...lockedFields ? { disabled: true } : {}}
                        >
                          <option value="">Chọn giới tính</option>
                          <option value="MALE">Nam</option>
                          <option value="FEMALE">Nữ</option>
                          <option value="OTHER">Khác</option>
                        </select>
                      </div>
                      <div className="col-sm-6">
                        <label htmlFor="interested" className="form-label">
                          Lĩnh vực quan tâm
                        </label>
                        <input
                          type="text"
                          id="interested"
                          className="form-control"
                          value={interested}
                          onChange={e => setInterested(e.target.value)}
                          {...lockedFields ? { readOnly: true } : {}}
                        />
                      </div>
                    </div>
                    {lockedFields ? (
                      <button
                        type="button"
                        className="btn-action btn-secondary mt-4 w-100"
                        onClick={() => setLockedFields(false)}>
                        Chỉnh sửa thông tin
                      </button>
                    ) : ""}
                    <button type="submit" className="btn-action btn-primary mt-4 w-100">
                      Lưu thông tin
                    </button>

                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Đổi mật khẩu */}
        <div
          className="tab-pane fade"
          id="reset"
          role="tabpanel"
          aria-labelledby="reset-tab"
        >
          <div className="card shadow-sm mb-4 p-5">
            <div className="card-body">
              <h5 className="card-title mb-4">Đổi mật khẩu</h5>
              <form onSubmit={handleResetPassword}>
                <div className="mb-3">
                  <label htmlFor="oldPassword" className="form-label">
                    Mật khẩu cũ
                  </label>
                  <input
                    type="password"
                    id="oldPassword"
                    className="form-control"
                    placeholder="Nhập mật khẩu cũ"
                    onChange={e => setOldPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="newPassword" className="form-label">
                    Mật khẩu mới
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    className="form-control"
                    placeholder="Nhập mật khẩu mới"
                    onChange={e => setNewPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="confirmPassword" className="form-label">
                    Xác nhận mật khẩu
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    className="form-control"
                    placeholder="Nhập lại mật khẩu mới"
                    onChange={e => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn-action btn-success w-100">
                  Đặt lại mật khẩu
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* 3. Xóa tài khoản */}
        <div
          className="tab-pane fade"
          id="delete"
          role="tabpanel"
          aria-labelledby="delete-tab"
        >
          <div className="card shadow-sm mb-4 p-5">
            <div className="card-body text-center">
              <h5 className="card-title mb-3">Xóa tài khoản</h5>
              <p className="text-muted mb-4">
                Hành động này không thể hoàn tác. Tất cả dữ liệu sẽ bị xóa vĩnh viễn.
              </p>
              <button
                type="button"
                className="btn-action btn-danger"
                onClick={handleDeleteAccount}
              >
                Xóa tài khoản
              </button>
            </div>
          </div>
        </div>

        {/* 4. Quản lý CV */}
        <div
          className="tab-pane fade"
          id="cv"
          role="tabpanel"
          aria-labelledby="cv-tab"
        >
          <div className="card shadow-sm mb-4 p-5">
            <div className="card-body">
              <h5 className="card-title mb-3">Quản lý CV</h5>
              <p className="text-muted mb-4">
                Tải lên hoặc chỉnh sửa CV của bạn để luôn sẵn sàng ứng tuyển.
              </p>

              <div className="mb-3">
                {!Array.isArray(cvList) || cvList.length === 0 ? (
                  <p className="text-muted">Chưa có CV nào được tải lên.</p>
                ) : (
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th scope="col">Tên CV</th>
                        <th scope="col">File</th>
                        <th scope="col">Hành động</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cvList.map((cv, index) => (
                        <tr key={index}>
                          <td>{cv.name}</td>
                          <td>{cv.file}</td>
                          <td>
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() => window.open(`${BACK_END_HOST}${cv.file}`, '_blank')}
                            >
                              Xem
                            </button>


                            <button className="btn btn-danger btn-sm ms-2" onClick={() => {
                              setCvToDelete(cv.id); // lưu ID để xóa
                              setShowConfirmModal(true); // mở modal
                            }}>Xóa</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              <div className="d-grid gap-2 d-md-flex">
                <button
                  type="button"
                  className="btn-action btn-info me-md-2"
                  onClick={() => setShowUploadModal(true)}
                >
                  Tải lên CV
                </button>
                <button
                  type="button"
                  className="btn-action btn-outline-info"
                >
                  Chỉnh sửa CV
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        show={showConfirmModal}
        onHide={() => setShowConfirmModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận xóa</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Bạn có chắc chắn muốn xóa CV tài khoản này không?
        </Modal.Body>
        <Modal.Footer>
          <button
            className="btn btn-secondary"
            onClick={() => setShowConfirmModal(false)}
          >
            Hủy
          </button>
          <button
            className="btn btn-danger"
            onClick={handleDeleteCV}
          >
            Xóa
          </button>
        </Modal.Footer>
      </Modal>


      <Modal
        show={showUploadModal}
        onHide={() => setShowUploadModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Tải lên CV (PDF)</Modal.Title>
        </Modal.Header>
        <form onSubmit={handleUploadCV}>
          <Modal.Body>
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setSelectedCV(e.target.files[0])}
              className="form-control mt-2"
            />
            <label htmlFor="cvName" className="form-label mt-2">
              Tên CV
            </label>
            <input
              type="text"
              value={cvName}
              onChange={(e) => setCVName(e.target.value)}
              className="form-control mt-2"
              placeholder="Tên CV"
              id="cvName"
            />
          </Modal.Body>
          <Modal.Footer>
            <button type="submit" className="btn btn-primary w-100">
              Tải lên
            </button>
          </Modal.Footer>
        </form>

      </Modal>

      {/* Avatar Modal (unchanged) */}
      <Modal
        show={showAvatarModal}
        onHide={() => setShowAvatarModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Thay đổi ảnh đại diện</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          {previewFile ? (
            <img
              src={previewFile}
              alt="Preview"
              className="rounded-circle mb-3"
              style={{ width: 150, height: 150, objectFit: 'cover' }}
            />
          ) : (
            <div
              className="d-inline-flex align-items-center justify-content-center mb-3"
              style={{
                width: 150,
                height: 150,
                border: '2px dashed #dee2e6',
                borderRadius: '50%',
              }}
            >
              <span className="text-muted">Chưa có hình</span>
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="form-control mb-3"
          />
          <button
            className="btn btn-primary w-100"
            onClick={handleAvatarUpload}
            disabled={!selectedFile}
          >
            Upload
          </button>
        </Modal.Body>
      </Modal>
    </main>


  );
};

export default ApplicantProfile;
