import React from 'react';

const Register = () => {
    return (
        <main class="d-flex container justify-content-center align-items-center">     
                <div class="col-md-6 bg-white login">
                    <p class="h3 text-center">Đăng ký tài khoản</p>
                    <form class="form-control login" action="#">
                        <div class="input-group d-flex align-items-center">
                            <label for="email"><i class="fa fa-user">&emsp;</i></label>
                            <input class="form-control input" type="email" placeholder="Nhập email" id="email" name="email" required/>
                        </div>

                        <div class="input-group d-flex align-items-center">
                            <label for="password"><i class="fa fa-lock">&emsp;</i></label>
                            <input class="form-control input" type="password" placeholder="Nhập password" id="password" name="password"required/>
                            <button type="button" class="btn border-0" id="togglePassword">
                                <i class="fa fa-eye"></i>
                            </button>
                        </div>

                        <div class="input-group d-flex align-items-center">
                            <label for="confirm-password"><i class="fa fa-lock">&emsp;</i></label>
                            <input class="form-control input" type="password" placeholder="Nhập lại password" id="confirm-password" name="confirm-password" required/>
                            <button type="button" class="btn border-0" id="togglePassword">
                                <i class="fa fa-eye"></i>
                            </button>
                        </div>

                        
                        <div class="d-flex align-items-center">
                            <input class="" type="checkbox" id="acceptrule" name="acceptterm"/>
                            <label for="acceptterm">&emsp;Tôi đã đọc và đồng ý với <button type="button" class="btn btn-link" data-bs-toggle="modal" data-bs-target="#webterm">Điều khoản sử dụng
                            </button>
                            </label>
                        </div>

                        <div class="d-flex justify-content-center p-3">
                            <input type="submit" class="btn-action" value="Đăng ký"/>
                        </div>
                        
                        <div class="d-flex justify-content-center align-items-center">
                            <p class="other">Đã có tài khoản? <a href="/html/login.html" class="emphasis">Đăng nhập ngay</a></p>
                        </div>

                    </form>
                </div>


                <div class="modal fade" id="webterm">
                    <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                
                        <div class="modal-header">
                        <h4 class="modal-title">Điều khoản sử dụng dịch vụ</h4>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                
                        <div class="modal-body">
                        Modal body..
                        </div>
                
                        <div class="modal-footer">
                        <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Đóng</button>
                        </div>
                
                    </div>
                    </div>
                </div>
            </main>
    );
}
export default Register;
