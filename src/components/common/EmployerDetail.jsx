import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { API_ROOT, BACK_END_HOST } from '../../config';
import './css/companydetail.css';
import axios from 'axios';

const CompanyDetail = () => {
  const { id } = useParams();
  const [employer, setEmployer] = useState(null);

  useEffect(() => {
    const fetchEmployerData = async () => {
      try {
        const response = await axios.get(`${API_ROOT}/employer-detail/${id}`);
        if (response.status === 200 && response.data.status) {
          setEmployer(response.data.body);
        } else {
          throw new Error('Lỗi khi lấy dữ liệu nhà tuyển dụng.');
        }
      } catch (error) {
        console.error('Error fetching employer data:', error);
      }
    };

    fetchEmployerData();
  }, [id]);

  if (!employer) {
    return <p className="loading">Đang tải thông tin nhà tuyển dụng...</p>;
  }

  return (
    <div className="company-container">
      <div className="company-card">
        <div className="company-header">
          {employer.logo && (
            <div className="company-logo-wrapper">
              <img
                src={`${BACK_END_HOST}${employer.logo}`}
                alt="Logo công ty"
                className="company-logo"
              />
            </div>
          )}
          <h2 className="company-title">{employer.fullname}</h2>
          <p className="company-username">@{employer.username}</p>
        </div>


        <div className="company-section">
          <h3>Thông tin liên hệ</h3>
          <p><strong>Email:</strong> {employer.email || 'Chưa cập nhật'}</p>
          <p><strong>Số điện thoại:</strong> {employer.phone || 'Chưa cập nhật'}</p>
          <p><strong>Website:</strong> {employer.website ? (
            <a href={employer.website} target="_blank" rel="noopener noreferrer">
              {employer.website}
            </a>
          ) : 'Chưa cập nhật'}</p>
        </div>

        <div className="company-section">
          <h3>Địa chỉ chính</h3>
          {employer.mainAddress ? (
            <p>{employer.mainAddress}</p>
          ) : (
            <p>Chưa có địa chỉ chính.</p>
          )}
        </div>

        <div className="company-section">
          <h3>Các địa chỉ khác</h3>
          {employer.addresses && employer.addresses.length > 0 ? (
            <ul>
              {employer.addresses.map((addr, index) => (
                <li key={index}>{addr}</li>
              ))}
            </ul>
          ) : (
            <p>Không có địa chỉ khác.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyDetail;
