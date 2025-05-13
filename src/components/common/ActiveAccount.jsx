import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';

const ActiveAccount = () => {
    const navigate = useNavigate();

    const [email, setEmail] = React.useState('');

    const handleVerify = () => {
        localStorage.setItem('email', email);
        navigate('/verify');
    };

    return (
        <div className="container d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
            <div className="card p-4 text-center shadow-sm">
                <h2 className="mb-3 text-danger">Tài khoản của bạn chưa được kích hoạt</h2>
                <p className="mb-4">Vui lòng xác thực email để kích hoạt tài khoản và sử dụng đầy đủ các chức năng của hệ thống.</p>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        placeholder="Nhập email của bạn"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <Button variant="primary" onClick={handleVerify}>
                    Xác thực email ngay
                </Button>
            </div>
        </div>
    );
};

export default ActiveAccount;
