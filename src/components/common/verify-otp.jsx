import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import axios from 'axios';

const VerifyOTP = () => {

    const localhost = 'http://localhost:9000';

    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [message, setMessage] = useState('');
    const [time, setTime] = useState(0);
    const [loading, setLoading] = useState(false);
    const [redirectTo, setRedirectTo] = useState(null);

    useEffect(() => {
        let timer;
        if (time > 0) {
            timer = setTimeout(() => {
                setTime(time - 1);
            }, 1000);
        }
        return () => clearTimeout(timer);
    }, [time]);

    const handleResendOTP = async () => {
        const gotEmail = localStorage.getItem('email');
        try {
            const response = await axios.post(localhost + '/api/send', {
                email: gotEmail
            }, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            const { status } = response.data.status;
            if (status === true) {
                setMessage('Mã OTP đã được gửi lại.');
                setTime(60); // bắt đầu đếm ngược lại
            } else {
                setMessage('Không thể gửi lại mã OTP. Vui lòng thử lại sau.');
            }
        } catch (err) {
            setMessage('Lỗi khi gửi lại mã OTP.');
        }
    };
    

    const handleVerify = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const gotEmail = localStorage.getItem('email');
            const response = await axios.post(localhost + '/api/verify', {
                email: gotEmail,
                otp
            }, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            const { message: responseMessage } = response.data.body || {};
            setMessage(responseMessage);

            const { status } = response.data.status;
            if (status === true) {
                setRedirectTo('/login');
                localStorage.removeItem('email'); // Xóa email sau khi xác thực thành công
            }
        } catch (error) {
            setMessage('Xác thực OTP thất bại. Vui lòng kiểm tra lại mã OTP.');
        } finally {
            setLoading(false);
        }
    }

    if (redirectTo){
        return <Navigate to={redirectTo} />;
    }

    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="col-md-4 card p-4">
                <h2 className="text-center mb-4">Xác thực OTP</h2>
                <form className='text-center' onSubmit={handleVerify}>
                    <div className="mb-3">
                        <label htmlFor="otp" className="form-label m-3">Nhập mã OTP đã gửi đến email của bạn:</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            id="otp" 
                            placeholder="Nhập mã OTP" 
                            value={otp} 
                            onChange={(e) => setOtp(e.target.value)} 
                            required 
                        />
                    </div>
                    <button type="submit" className="btn-action" disabled={loading}>
                        {loading ? 'Đang xác thực...' : 'Xác thực'}
                    </button>
                </form>
                <p className="mt-3 text-center">
                    Chưa nhận được mã? 
                    {time > 0 ? (
                        <span> Gửi lại mã sau {time} giây</span>
                    ) : (
                        <button 
                            onClick={handleResendOTP} 
                            className="btn btn-link p-0 ms-2" 
                            style={{ textDecoration: 'underline' }}
                        >
                            Gửi lại mã
                        </button>
                    )}
                </p>

            </div>
        </div>
    );

}

export default VerifyOTP;
