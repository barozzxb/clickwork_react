// src/hooks/useOtp.js
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { activeAccount, sendOtp as apiSendOtp, verifyOtp as apiVerifyOtp } from '../services/AppService';

export default function useOtp(onSuccessPath) {
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const username = localStorage.getItem('username');
  const accstatus = localStorage.getItem('status');

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) return;
    const t = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft]);

  // Gửi OTP
  const sendCode = async (email) => {
    setLoading(true);
    try {
      const { status, message } = await apiSendOtp(email);
      if (status) {
        toast.success(message);
        setTimeLeft(60);
      } else {
        toast.error(message);
      }
    } catch (err) {
      console.error('sendOtp error', err);
      toast.error('Không thể gửi OTP. Thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  // Xác thực OTP
  const verifyCode = async (email, otp) => {
    setLoading(true);
    if (otp.length < 6 || otp.length > 6 || isNaN(otp) || otp.includes(' ')) {
      toast.error('Mã OTP không hợp lệ. Vui lòng nhập lại.');
      setLoading(false);
      return;
    }
    try {
      const { status, message } = await apiVerifyOtp(email, otp);
      if (status) {
        toast.success(message);
        localStorage.removeItem('email');
        if (username && accstatus === 'INACTIVE') {
          try {
            const response = await activeAccount(username);
            if (response.status === true) {
              toast.success(response.message);
            } else {
              toast.error(response.message);
            }
          } catch (err) {
            console.error('activeAccount error', err);
            toast.error('Kích hoạt tài khoản thất bại.');
          }
        }
        navigate(onSuccessPath);
      } else {
        toast.error(message);
      }
    } catch (err) {
      console.error('verifyOtp error', err);
      toast.error('Xác thực thất bại.');
    } finally {
      setLoading(false);
    }
  };

  return { timeLeft, loading, sendCode, verifyCode };
}
