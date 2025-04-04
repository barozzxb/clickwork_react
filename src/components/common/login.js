import React from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
    return (
        <main className="d-flex container justify-content-center align-items-center">
        
        <div className="col-md-6 bg-white login">
            <p className="h3 text-center">Đăng nhập</p>
            <form className="form-control login" action="#">
                <div className="input-group d-flex align-items-center">
                    <label htmlFor="email"><i className="fa fa-user">&emsp;</i></label>
                    <input className="form-control input" type="text" placeholder="Nhập email" id="email" name="email" required/>
                </div>

                <div className="input-group d-flex align-items-center">
                    <label htmlFor="password"><i className="fa fa-lock">&emsp;</i></label>
                    <input className="form-control input" type="password" placeholder="Nhập password" id="password" name="password" required/>
                    <button type="button" className="btn border-0" id="togglePassword">
                        <i className="fa fa-eye"></i>
                    </button>
                </div>
                <div className="d-flex justify-content-end align-items-center">
                    <label htmlFor="forgot">&emsp;<Link to="" className="emphasis">Quên mật khẩu?</Link></label>
                </div>
                <div className="d-flex align-items-center">
                    <input className="" type="checkbox" id="remember" name="remember"/>
                    <label htmlFor="remember">&emsp;Ghi nhớ đăng nhập</label>
                </div>

                <div className="d-flex justify-content-center p-3">
                    <input type="submit" className="btn-action" value="Đăng nhập"/>
                </div>
                
                <div className="d-flex justify-content-center align-items-center">
                    <p className="other">Chưa có tài khoản? <a href="/html/register.html" className="emphasis">Đăng ký ngay</a></p>
                </div>

            </form>
        </div>


    </main>
    );
}

export default Login;