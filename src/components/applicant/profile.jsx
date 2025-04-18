import axios from 'axios';
import React, { useEffect, useState } from 'react';

const ApplicantProfile = () => {
  const token = localStorage.getItem('token'); // JWT token đã lưu sau khi login

  const [applicant, setApplicant] = useState(null); // State để lưu trữ profile

  const [fullname, setFullname] = useState(''); // State để lưu trữ fullname
  const [email, setEmail] = useState(''); // State để lưu trữ email
  const [phonenum, setPhonenum] = useState(''); // State để lưu trữ phonenum
  const [avatar, setAvatar] = useState(''); // State để lưu trữ avatar
  const [dob, setDob] = useState(''); // State để lưu trữ dob
  const [gender, setGender] = useState('')
  const [interested, setInterested] = useState(''); // State để lưu trữ interested

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('http://localhost:9000/api/applicant/profile', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setApplicant(res.data.body); // Dữ liệu profile
        const data = res.data.body;
        setFullname(data.fullname || '');
        setEmail(data.email || '');
        setPhonenum(data.phonenum || '');
        setAvatar(data.avatar || '');
        setDob(data.dob || '');
        setGender(data.gender || '');
        setInterested(data.interested || '');
        console.log(res.data.body); // Dữ liệu profile
      } catch (err) {
        console.error('Lỗi khi lấy profile:', err);
      }
    };

    fetchProfile();
  }, []); // Chỉ chạy 1 lần khi component mount

  const handleUpdateProfile = async (e) => {
    e.preventDefault(); // Ngăn chặn reload trang khi submit form

    // const formData = new FormData(e.target); // Lấy dữ liệu từ form
    // const data = Object.fromEntries(formData.entries()); // Chuyển đổi thành object

    try {
      const res = await axios.put('http://localhost:9000/api/applicant/profile/update',
        
        {
          fullname,
          email,
          phonenum,
          avatar,
          dob,
          gender,
          interested
        }
        , {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log('Cập nhật thành công:', res.data); // Thông báo thành công
    } catch (err) {
      console.error('Lỗi khi cập nhật profile:', err); // Thông báo lỗi
    }
  }

  return (
    <main className="d-flex container justify-content-center align-items-center">
        
        <div className="account-container row bg-white">

            <div className="col-md-4 col-sm-12 sidebar">
                <ul className="nav flex-column nav-pills">
                    <li className="nav-item">
                        <a className="nav-link active" data-bs-toggle="pill" href="#info">Thông tin cá nhân</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" data-bs-toggle="pill" href="#cv">Quản lý CV</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" data-bs-toggle="pill" href="#password">Thay đổi mật khẩu</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link danger" data-bs-toggle="pill" href="#delete">Yêu cầu xóa tài khoản</a>
                    </li>
                </ul>
            </div>
            

                <div className="col-md-8 col-sm-12">
                    <div className="tab-content">
                        <div id="info" className="tab-pane fade show active">
                            <h3>Thông tin cá nhân</h3>
                            <form className="d-flex flex-column" onSubmit={handleUpdateProfile}>
                              <label htmlFor="fullname">Họ và tên:</label>
                              <input
                                type="text"
                                id="fullname"
                                name="fullname"
                                value={fullname}
                                onChange={(e) => setFullname(e.target.value)}
                                className="form-control"
                              />

                              <label htmlFor="email">Email:</label>
                              <input
                                type="email"
                                id="email"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="form-control"
                              />

                              <label htmlFor="phonenum">Số điện thoại:</label>
                              <input
                                type="text"
                                id="phonenum"
                                name="phonenum"
                                value={phonenum}
                                onChange={(e) => setPhonenum(e.target.value)}
                                className="form-control"
                              />

                              <label htmlFor="avatar">Ảnh đại diện:</label>
                              <input
                                type="text"
                                id="avatar"
                                name="avatar"
                                value={avatar}
                                onChange={(e) => setAvatar(e.target.value)}
                                className="form-control"
                              />

                              <label htmlFor="dob">Ngày sinh:</label>
                              <input
                                type="date"
                                id="dob"
                                name="dob"
                                value={dob}
                                onChange={(e) => setDob(e.target.value)}
                                className="form-control"
                              />

                              <label htmlFor="gender">Giới tính:</label>
                              <div className="d-flex justify-content-around">
                                <div>
                                  <input
                                    type="radio"
                                    id="male"
                                    name="gender"
                                    value="MALE"
                                    checked={gender === 'MALE'}
                                    onChange={(e) => setGender(e.target.value)}
                                  />
                                  <label htmlFor="male">Nam</label>
                                </div>
                                <div>
                                  <input
                                    type="radio"
                                    id="female"
                                    name="gender"
                                    value="FEMALE"
                                    checked={gender === 'FEMALE'}
                                    onChange={(e) => setGender(e.target.value)}
                                  />
                                  <label htmlFor="female">Nữ</label>
                                </div>
                                <div>
                                  <input
                                    type="radio"
                                    id="other"
                                    name="gender"
                                    value="OTHER"
                                    checked={gender === 'OTHER'}
                                    onChange={(e) => setGender(e.target.value)}
                                  />
                                  <label htmlFor="other">Khác</label>
                                </div>
                              </div>
                              <label htmlFor="interested">Sở thích:</label>
                              <input
                                type="text"
                                id="interested"
                                name="interested"
                                value={interested}
                                onChange={(e) => setInterested(e.target.value)}
                                className="form-control"
                              />

                              <button type="submit" className="btn btn-primary mt-3">Lưu thông tin</button>
                            </form>
                        </div>
                        <div id="cv" className="tab-pane fade">
                            <h3>Quản lý CV</h3>
                            <p>Danh sách CV:</p>
                            <ul>
                                {applicant?.cvs?.map((cv, index) => (
                                    <li key={index}>{cv.name || 'CV không có tên'}</li>
                                )) || <p>Chưa có CV nào.</p>}
                            </ul>
                        </div>
                        <div id="password" className="tab-pane fade">
                            <h3>Thay đổi mật khẩu</h3>
                            <p>Đổi mật khẩu mới.</p>
                        </div>
                        <div id="delete" className="tab-pane fade">
                            <h3 className="text-danger">Yêu cầu xóa tài khoản</h3>
                            <p>Nếu bạn muốn xóa tài khoản, hãy gửi yêu cầu.</p>
                        </div>
                    </div>
                </div>
        </div>
        
    </main>
  );
};

export default ApplicantProfile;