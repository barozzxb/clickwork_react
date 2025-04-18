import React from 'react';
import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';


const Register = () => {

    const localhost = 'http://localhost:9000';

    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [redirectTo, setRedirectTo] = useState(null);

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('APPLICANT'); // Mặc định là ứng viên
    const [acceptTerm, setAcceptTerm] = useState(false);

    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
    
        if (!acceptTerm) {
            setMessage("You must accept the terms and conditions.");
            setLoading(false);
            return;
        }
    
        if (password !== confirmPassword) {
            setMessage("Passwords do not match.");
            setLoading(false);
            return;
        }
    
        try {
            const response = await axios.post(`${localhost}/api/auth/register`, {
                username,
                password,
                email,
                role
            }, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
    
            const responseMessage = response.data.message;
            setMessage(responseMessage);
    
            const status = response.data.status;
            if (status === true) {
                localStorage.setItem('email', email);
                navigate('/verify');
            }
        } catch (error) {
            if (error.response?.data?.message) {
                setMessage(error.response.data.message);
            } else {
                setMessage('Registration failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };
    


    return (
        <main className="d-flex container justify-content-center align-items-center">     
                <div className="col-md-6 bg-white login">
                    <p className="h3 text-center">Đăng ký tài khoản</p>
                    {message && <p className="text-center text-danger">{message}</p>}
                    <form className="form-control login"  onSubmit={handleRegister}>
                        
                        <div className="input-group d-flex align-items-center">
                            <label htmlFor="username">
                                <i className="fa fa-user">&emsp;</i>
                            </label>
                            <input className="form-control input" 
                                type="username" 
                                placeholder="Nhập username" 
                                id="username" 
                                name="username" 
                                value={username} 
                                onChange={(e) => setUsername(e.target.value)} 
                                required/>
                        </div>

                        <div className="input-group d-flex align-items-center">
                            <label htmlFor="email">
                                <i className="fa fa-envelope">&emsp;</i>
                            </label>
                            <input className="form-control input" 
                            type="email" placeholder="Nhập email" 
                            id="email" name="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required/>
                        </div>

                        <div className="input-group d-flex align-items-center">
                            <label htmlFor="role">
                                <i className="fa fa-user-tag">&emsp;</i>
                            </label>
                            <div className="form-control d-flex align-items-center">
                                <div className="form-check me-3">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        id="applicant"
                                        name="role"
                                        value="APPLICANT"
                                        checked={role === 'APPLICANT'}
                                        onChange={(e) => setRole(e.target.value)}
                                        required
                                    />
                                    <label className="form-check-label" htmlFor="applicant">
                                        Ứng viên
                                    </label>
                                </div>
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        id="employer"
                                        name="role"
                                        value="EMPLOYER"
                                        checked={role === 'EMPLOYER'}
                                        onChange={(e) => setRole(e.target.value)}
                                        required
                                    />
                                    <label className="form-check-label" htmlFor="employer">
                                        Nhà tuyển dụng
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="input-group d-flex align-items-center">
                            <label htmlFor="password"><i className="fa fa-lock">&emsp;</i></label>
                            <input
                                className="form-control input"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Nhập password"
                                id="password"
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button 
                                type="button" 
                                className="btn border-0" 
                                onClick={() => setShowPassword(!showPassword)}>
                                <i className={showPassword ? "fa fa-eye-slash" : "fa fa-eye"}></i>
                            </button>
                        </div>

                        <div className="input-group d-flex align-items-center">
                            <label htmlFor="confirm-password"><i className="fa fa-lock">&emsp;</i></label>
                            <input
                                className="form-control input"
                                type={showConfirmPassword ? 'text' : 'password'}
                                placeholder="Nhập lại password"
                                id="confirm_password"
                                name="confirm_password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                            <button 
                                type="button" 
                                className="btn border-0" 
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                <i className={showConfirmPassword ? "fa fa-eye-slash" : "fa fa-eye"}></i>
                            </button>
                        </div>

                        
                        <div className="d-flex align-items-center">
                            <input className="" type="checkbox" id="acceptrule" name="acceptterm"
                            checked={acceptTerm}
                            onChange={(e) => setAcceptTerm(e.target.checked)}/>
                            <label htmlFor="acceptterm">&emsp;Tôi đã đọc và đồng ý với <button type="button" className="btn btn-link" data-bs-toggle="modal" data-bs-target="#webterm">Điều khoản sử dụng
                            </button>
                            </label>
                        </div>

                        <div className="d-flex justify-content-center p-3">
                            <input type="submit" className="btn-action" value="Đăng ký" disabled={!acceptTerm} />
                        </div>
                        
                        <div className="d-flex justify-content-center align-items-center">
                            <p className="other">Đã có tài khoản? <Link to="/login" className="emphasis">Đăng nhập ngay</Link></p>
                        </div>

                    </form>
                </div>


                <div className="modal fade" id="webterm">
                    <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                
                        <div className="modal-header">
                        <h4 className="modal-title">Điều khoản sử dụng dịch vụ</h4>
                        <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                
                        <div className="modal-body">
                        Modal body..
                        </div>
                
                        <div className="modal-footer">
                        <button type="button" className="btn btn-danger" data-bs-dismiss="modal">Đóng</button>
                        </div>
                
                    </div>
                    </div>
                </div>
            </main>
    );
}
export default Register;
