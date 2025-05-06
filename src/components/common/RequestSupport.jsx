import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { jwtDecode } from 'jwt-decode';

const localhost = 'http://localhost:9000/api';

const RequestSupport = () => {
    const [method, setMethod] = useState('form');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [actorUsername, setActorUsername] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token'); // Lấy token từ localStorage (sau khi đăng nhập)
        if (token) {
            try {  
                const decoded = jwtDecode(token);
                setActorUsername(decoded.sub || decoded.username); // Tùy vào payload token
            } catch (err) {
                console.error('Lỗi giải mã token:', err);
            }
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title || !content) {
            setMessage('Vui lòng điền đầy đủ tiêu đề và nội dung!');
            return;
        }

        const token = localStorage.getItem('token'); // Lấy token để gửi trong Authorization Header

        try {
            const response = await fetch(`${localhost}/support/request?actorUsername=${actorUsername}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // GỬI TOKEN NẾU BACKEND YÊU CẦU
                },
                body: JSON.stringify({ title, content }),
            });

            if (response.ok) {
                const responseData = await response.json();
                setMessage(responseData.message);
                setTitle('');
                setContent('');
            } else {
                setMessage('Gửi yêu cầu thất bại!');
            }
        } catch (error) {
            setMessage('Có lỗi xảy ra!');
            console.error('Error:', error);
        }
    };

    return (
        <div className="container mt-4">
            <h3>Yêu cầu hỗ trợ</h3>

            <div className="mb-3">
                <label className="form-label">Chọn phương thức:</label>
                <select
                    className="form-select"
                    value={method}
                    onChange={(e) => setMethod(e.target.value)}
                >
                    <option value="form">Gửi biểu mẫu hỗ trợ</option>
                </select>
            </div>

            {method === 'form' && (
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Tiêu đề</label>
                        <input
                            type="text"
                            className="form-control"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Nội dung</label>
                        <textarea
                            className="form-control"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            rows="4"
                            required
                        ></textarea>
                    </div>
                    <button type="submit" className="btn btn-primary">Gửi yêu cầu</button>
                </form>
            )}

            {message && <div className="mt-3 alert alert-info">{message}</div>}
        </div>
    );
};

export default RequestSupport;
