// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import {toast} from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const VerifyOTP = () => {

//     const localhost = 'http://localhost:9000';

//     const [email, setEmail] = useState('');
//     const [inputOtp, setInputOtp] = useState('');
//     const [time, setTime] = useState(0);
//     const [loading, setLoading] = useState(false);

//     const navigate = useNavigate();

//     useEffect(() => {
//         const e = localStorage.getItem('email');
//         if (!e) return navigate('/register');
//         setEmail(e);
//       }, []);

//     useEffect(() => {
//       if (email) resend();
//     }, [email]);

//     useEffect(() => {
//         if (time <= 0) return;
//         const t = setTimeout(() => setTime(t => t - 1), 1000);
//         return () => clearTimeout(t);
//     }, [time]);

//     const resend = async () => {
//         setLoading(true);
//         try {
//           const { status, message } = (await axios.post(localhost + '/api/auth/sendotp', { email })).data;
//           toast.success(message);
//           if (status) setTime(60);
//         } catch (error) {
//           console.error(error);
//           toast('Không thể gửi OTP. Thử lại sau.');
//         } finally {
//           setLoading(false);
//         }
//       };


//       const verify = async e => {
//         e.preventDefault();
//         setLoading(true);
//         try {
//           const { status, message } = (await axios.post(localhost + '/api/auth/verifyotp', { email, inputOtp })).data;
//           toast(message);
//           if (status) {
//             localStorage.removeItem('email');
//             navigate('/login');
//           }
//           else{
//             toast.error(message);
//           }
//         } catch (error) {
//           console.error(error);
//           toast('Xác thực thất bại.');
//         } finally {
//           setLoading(false);
//         }
//       };
// return (
//   <div className="d-flex justify-content-center align-items-center vh-100">
//     <div className="col-md-4 card p-4">
//       <h2 className="text-center mb-4">Xác thực OTP</h2>
//       <form className='text-center' onSubmit={verify}>
//         <div className="mb-3">
//           <label htmlFor="otp" className="form-label m-3">Nhập mã OTP đã gửi đến email của bạn:</label>
//           <input
//             type="text"
//             className="form-control"
//             id="otp"
//             placeholder="Nhập mã OTP"
//             value={inputOtp}
//             onChange={(e) => setInputOtp(e.target.value)}
//             required
//           />
//         </div>
//         <button type="submit" className="btn-action" disabled={loading}>
//           {loading ? 'Đang xác thực...' : 'Xác thực'}
//         </button>
//       </form>
//       <p className="mt-3 text-center">
//         Chưa nhận được mã?
//         {time > 0 ? (
//           <span> Gửi lại mã sau {time} giây</span>
//         ) : (
//           <button
//             onClick={resend}
//             className="btn btn-link p-0 ms-2"
//             style={{ textDecoration: 'underline' }}
//           >
//             Gửi lại mã
//           </button>
//         )}
//       </p>

//     </div>
//   </div>
// );

// }


import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useOtp from '../../hook/otpHook.jsx';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function VerifyOTP() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();
  const { timeLeft, loading, sendCode, verifyCode } = useOtp('/login');

  // Lấy email hoặc chuyển về /register
  useEffect(() => {
    const e = localStorage.getItem('email');
    if (!e) return navigate('/register');
    setEmail(e);
  }, [navigate]);

  // Gửi OTP ngay khi có email
  useEffect(() => {
    if (email) sendCode(email);
  }, [email]);

  const handleSubmit = (e) => {
    e.preventDefault();
    verifyCode(email, otp);
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="col-md-4 card p-4">
        <h2 className="text-center mb-4">Xác thực OTP</h2>
        <form className="text-center" onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="otp" className="form-label">
              Nhập mã OTP đã gửi đến email của bạn:
            </label>
            <input
              id="otp"
              type="text"
              className="form-control"
              placeholder="Nhập mã OTP"
              value={otp}
              onChange={e => setOtp(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn-action w-100" disabled={loading}>
            {loading ? 'Đang xác thực...' : 'Xác thực'}
          </button>
        </form>
        <p className="mt-3 text-center">
          Chưa nhận được mã?
          {timeLeft > 0 ? (
            <span> Gửi lại sau {timeLeft} giây</span>
          ) : (
            <button onClick={() => sendCode(email)} className="btn btn-link p-0 ms-2">
              Gửi lại mã
            </button>
          )}
        </p>
        <div className="text-center">
          <Link to="/register">Quay lại đăng ký</Link>
        </div>
      </div>
    </div>
  );
}
