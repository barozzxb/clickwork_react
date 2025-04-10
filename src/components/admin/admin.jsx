import React from 'react';
import { Link } from 'react-router-dom';

const Admin = () => {
    return (
        <main className="d-flex container justify-content-center align-items-center">
            <div className="col-md-6 bg-white login">
                <p className="h3 text-center">Admin Page</p>
                <div className="d-flex justify-content-center p-3">
                    <Link to="/admin/users" className="btn-action">Quản lý người dùng</Link>
                </div>
                <div className="d-flex justify-content-center p-3">
                    <Link to="/admin/products" className="btn-action">Quản lý sản phẩm</Link>
                </div>
            </div>
        </main>
    );
};

export default Admin;