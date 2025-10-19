import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import useOtp from '../../hook/otpHook.jsx';

import { API_ROOT } from '../../config.js';

const host = API_ROOT;

const ForgotPassword = () => {
    const [email, setEmail] = useState('');

    const navigate = useNavigate();
    const { timeLeft, loading, sendCode, verifyCode } = useOtp('/login');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (email) {
            const response = axios.post(`${host}/forgot-password`, { 
                email 
            }, { 
                headers:{
                 "Content-Type": "application/json",
                }
            });
            
            if (response.data.status === false) {
                toast.error('Email không chưa được đăng ký. Vui lòng kiểm tra lại!');
            }
            
            sendCode(email);

        } else {

        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <h2 className="text-center mb-4">Forgot Password</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                className="form-control"
                            />
                        </div>
                        <button type="submit" className="btn btn-primary w-100">
                            Submit
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
