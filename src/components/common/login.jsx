import React, {useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';



const localhost = 'http://localhost:9000/api';

const Login = () => {

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decoded = jwtDecode(token);
            const role = decoded.role;
        }
      }, []);
      

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [remember, setRemember] = useState(false);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();
    
    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post(localhost + '/auth/login', {
                username,
                password,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (response.data.status === true) {

                const {token, message: responseMessage } = response.data.body || {};
                if (token) {
                    localStorage.setItem('token', token);
                }
    
                setMessage(responseMessage || 'Đăng nhập thành công.');
                
                const decoded = jwtDecode(token);
                const role = decoded.role;

                if (role) {
    
                    console.log(`Đăng nhập thành công với vai trò: ${role}`);
                    

                    if (role === 'ADMIN') {
                        navigate('/admin/dashboard');
                    } else if (role === 'APPLICANT') {
                        navigate('/employee');
                    } else {
                        navigate('/employer');
                    }
                } else {
                    setMessage('Không thể xác định vai trò người dùng.');
                }
            }

        } catch (error) {
            setMessage('Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
        } finally {
            setLoading(false);
        }
    };

    // Điều hướng nếu cần
    // if (redirectTo) {
    //     return <Navigate to={redirectTo} />;
    // }

    return (
        <main className="d-flex container justify-content-center align-items-center">
            <div className="col-md-6 bg-white login">
                <p className="h3 text-center">Đăng nhập</p>
                {message && <p className="text-center text-danger">{message}</p>}
                <form className="form-control login" onSubmit={handleLogin}>
                    <div className="input-group d-flex align-items-center">
                        <label htmlFor="email"><i className="fa fa-user">&emsp;</i></label>
                        <input
                            className="form-control input"
                            type="text"
                            placeholder="Nhập userid"
                            id="email"
                            name="email"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
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
                            id="togglePassword"
                            onClick={() => setShowPassword(!showPassword)}>
                            <i className={showPassword ? "fa fa-eye-slash" : "fa fa-eye"}></i>
                        </button>
                    </div>

                    <div className="d-flex justify-content-end align-items-center">
                        <label htmlFor="forgot">&emsp;<Link to="" className="emphasis">Quên mật khẩu?</Link></label>
                    </div>

                    <div className="d-flex align-items-center">
                        <input
                            type="checkbox"
                            id="remember"
                            name="remember"
                            checked={remember}
                            onChange={(e) => setRemember(e.target.checked)}
                        />
                        <label htmlFor="remember">&emsp;Ghi nhớ đăng nhập</label>
                    </div>

                    <div className="d-flex justify-content-center p-3">
                        <input type="submit" className="btn-action" value={loading ? "Đang đăng nhập..." : "Đăng nhập"} disabled={loading} />
                    </div>

                    <div className="d-flex justify-content-center align-items-center">
                        <p className="other">Chưa có tài khoản? <Link to="/register" className="emphasis">Đăng ký ngay</Link></p>
                    </div>
                </form>
            </div>
        </main>
    );
};

export default Login;