import React, { useState, useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { jwtDecode } from 'jwt-decode';
import './RequestSupport.css';
import OverlayLoading from '../effects/Loading';
import { API_ROOT } from '../../config.js';

const RequestSupport = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('info');
  const [loading, setLoading] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const formRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const roles = decoded.roles || decoded.authorities || [];
        // Chỉ cho phép ROLE_APPLICANT hoặc ROLE_EMPLOYER
        if (roles.includes('ROLE_APPLICANT') || roles.includes('ROLE_EMPLOYER')) {
          setIsAuthorized(true);
        } else {
          setMessage('Bạn không có quyền gửi yêu cầu hỗ trợ.');
          setMessageType('error');
        }
      } catch (err) {
        console.error('Lỗi giải mã token:', err);
        setMessage('Không thể xác thực. Vui lòng đăng nhập lại.');
        setMessageType('error');
      }
    } else {
      setMessage('Vui lòng đăng nhập để gửi yêu cầu hỗ trợ.');
      setMessageType('error');
    }
  }, []);

  useEffect(() => {
    if (message && formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [message]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthorized) return;

    if (!title || !content) {
      setMessage('Vui lòng điền đầy đủ tiêu đề và nội dung.');
      setMessageType('error');
      return;
    }

    if (content.length > 255) {
      setMessage('Nội dung không được vượt quá 255 ký tự.');
      setMessageType('error');
      return;
    }

    setLoading(true);
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`${API_ROOT}/support/request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content }),
      });

      const responseData = await response.json();

      if (response.ok) {
        setMessage(responseData.message || 'Yêu cầu hỗ trợ đã được gửi thành công!');
        setMessageType('success');
        setTitle('');
        setContent('');
      } else {
        if (response.status === 403) {
          setMessage('Bạn không có quyền gửi yêu cầu. Vui lòng đăng nhập lại.');
        } else if (response.status === 400) {
          setMessage(responseData.message || 'Dữ liệu không hợp lệ.');
        } else {
setMessage(responseData.message || 'Gửi yêu cầu thất bại.');
        }
        setMessageType('error');
      }
    } catch (error) {
      console.error('Lỗi khi gửi yêu cầu:', error);
      setMessage('Lỗi mạng. Vui lòng thử lại sau.');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setTitle('');
    setContent('');
    setMessage('');
    setMessageType('info');
  };

  return (
    <div className="support-container" ref={formRef}>
      {loading && <OverlayLoading />}
      {message && (
        <div className={`alert ${messageType === 'error' ? 'alert-danger' : 'alert-success'}`}>
          {message}
        </div>
      )}

      <div className="support-header">
        <h3>Yêu Cầu Hỗ Trợ</h3>
        <p className="support-subtitle">Hãy để chúng tôi giúp bạn giải quyết vấn đề</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group mb-3">
          <label className="form-label">Tiêu đề yêu cầu</label>
          <input
            type="text"
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Nhập tiêu đề ngắn gọn về vấn đề của bạn"
            disabled={!isAuthorized || loading}
            maxLength="255"
            required
          />
        </div>
        <div className="form-group mb-3">
          <label className="form-label">Chi tiết yêu cầu</label>
          <textarea
            className="form-control"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows="6"
            placeholder="Mô tả chi tiết vấn đề (tối đa 255 ký tự)"
            disabled={!isAuthorized || loading}
            maxLength="255"
            required
          ></textarea>
          <small className="form-text text-muted">
            {content.length}/255 ký tự
          </small>
        </div>
        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-primary" disabled={!isAuthorized || loading}>
            Gửi yêu cầu hỗ trợ
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleReset}
            disabled={!isAuthorized || loading}
          >
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
};

export default RequestSupport;