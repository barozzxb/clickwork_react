import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const VerifyOTP = () => {

    const localhost = 'http://localhost:9000';

    const [email, setEmail] = useState('');
    const [inputOtp, setInputOtp] = useState('');
    const [message, setMessage] = useState('');
    const [time, setTime] = useState(0);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const e = localStorage.getItem('email');
        if (!e) return navigate('/register');
        setEmail(e);
      }, []);

    useEffect(() => {
      if (email) resend();
    }, [email]);

    useEffect(() => {
        if (time <= 0) return;
        const t = setTimeout(() => setTime(t => t - 1), 1000);
        return () => clearTimeout(t);
    }, [time]);

    const resend = async () => {
        setLoading(true);
        try {
          const { status, message } = (await axios.post(localhost + '/api/auth/sendotp', { email })).data;
          setMessage(message);
          if (status) setTime(60);
        } catch (error) {
          console.error(error);
          setMessage('Không thể gửi OTP. Thử lại sau.');
        } finally {
          setLoading(false);
        }
      };
    

      const verify = async e => {
        e.preventDefault();
        setLoading(true);
        try {
          const { status, message } = (await axios.post(localhost + '/api/auth/verifyotp', { email, inputOtp })).data;
          setMessage(message);
          if (status) {
            localStorage.removeItem('email');
            navigate('/login');
          }
        } catch (error) {
          console.error(error);
          setMessage('Xác thực thất bại.');
        } finally {
          setLoading(false);
        }
      };
    

    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="col-md-4 card p-4">
                <h2 className="text-center mb-4">Xác thực OTP</h2>
                <form className='text-center' onSubmit={verify}>
                    <div className="mb-3">
                        <label htmlFor="otp" className="form-label m-3">Nhập mã OTP đã gửi đến email của bạn:</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            id="otp" 
                            placeholder="Nhập mã OTP" 
                            value={inputOtp} 
                            onChange={(e) => setInputOtp(e.target.value)} 
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
                            onClick={resend} 
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
