import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';
import Form from 'react-bootstrap/Form';

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

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('http://localhost:9000/api/applicant/profile', {
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
        console.error('Lỗi khi lấy profile:', err);
      }
    };
    fetchProfile();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        'http://localhost:9000/api/applicant/profile/update',
        { id, fullname, email, phonenum, dob, gender: gender || null, interested },
        { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
      );
      console.log('Cập nhật thành công:', res.data);
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
        'http://localhost:9000/api/applicant/profile/update/avatar',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` } }
      );
      const newAvatar = res.data.body;
      setAvatar(newAvatar);
      setApplicant((prev) => ({ ...prev, avatar: newAvatar }));
      setShowAvatarModal(false);
    } catch (err) {
      console.error('Upload lỗi:', err);
    }
  };

  return (
    <main className="container py-5">
      <div className="row bg-white p-4 rounded shadow gap-4 align-items-start">
        {/* Sidebar ảnh đại diện */}
        <div className="col-md-4 border-end">
          <div className="d-flex flex-column align-items-center">
            {avatar ? (
              <Image
                src={`http://localhost:9000${avatar}`}
                roundedCircle
                fluid
                style={{ width: 150, height: 150, objectFit: 'cover' }}
                className="mb-3"
              />
            ) : (
              <div style={{
                width: 150,
                height: 150,
                border: '2px dashed #dee2e6',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem'
              }}>
                <span>Chưa có hình</span>
              </div>
            )}
            <Button variant="outline-primary" onClick={openAvatarModal}>
              Chỉnh sửa ảnh đại diện
            </Button>
          </div>
        </div>


        {/* Form thông tin */}
        <div className="col-md-7">
          <h4 className="mb-4">Thông tin cá nhân</h4>
          <Form onSubmit={handleUpdateProfile}>
            <Form.Group controlId="formFullname" className="mb-3">
              <Form.Label>Họ tên</Form.Label>
              <Form.Control type="text" value={fullname} onChange={(e) => setFullname(e.target.value)} />
            </Form.Group>

            <Form.Group controlId="formEmail" className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </Form.Group>

            <Form.Group controlId="formPhone" className="mb-3">
              <Form.Label>Số điện thoại</Form.Label>
              <Form.Control type="text" value={phonenum} onChange={(e) => setPhonenum(e.target.value)} />
            </Form.Group>

            <Form.Group controlId="formDob" className="mb-3">
              <Form.Label>Ngày sinh</Form.Label>
              <Form.Control type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
            </Form.Group>

            <Form.Group controlId="formGender" className="mb-3">
              <Form.Label>Giới tính</Form.Label>
              <Form.Select value={gender} onChange={(e) => setGender(e.target.value)}>
                <option value="">Chọn giới tính</option>
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
              </Form.Select>
            </Form.Group>

            <Form.Group controlId="formInterested" className="mb-3">
              <Form.Label>Lĩnh vực quan tâm</Form.Label>
              <Form.Control type="text" value={interested} onChange={(e) => setInterested(e.target.value)} />
            </Form.Group>

            <Button type="submit" className="mt-3 btn btn-primary w-100">
              Lưu thông tin
            </Button>
          </Form>
        </div>
      </div>

      {/* Modal chỉnh sửa avatar */}
      <Modal show={showAvatarModal} onHide={() => setShowAvatarModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Thay đổi ảnh đại diện</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex flex-column align-items-center">
            {previewFile ? (
              <Image
                src={previewFile}
                roundedCircle
                fluid
                style={{ width: 150, height: 150, objectFit: 'cover' }}
                className="mb-3"
              />
            ) : (
              <div className="mb-3" style={{
                width: 150,
                height: 150,
                border: '2px dashed #dee2e6',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span>Chưa có hình</span>
              </div>
            )}
            <input type="file" accept="image/*" onChange={handleFileChange} className="form-control mb-2" />
            <Button variant="primary" onClick={handleAvatarUpload} disabled={!selectedFile}>
              Upload
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </main>

  );
};

export default ApplicantProfile;
