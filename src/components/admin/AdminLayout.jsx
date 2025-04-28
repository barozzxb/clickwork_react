import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import '../styles/admin-dashboard.css';

export default function AdminLayout() {
    // Thêm Bootstrap CSS và JS qua CDN
    useEffect(() => {
        // Thêm Bootstrap CSS
        const bootstrapCSS = document.createElement('link');
        bootstrapCSS.rel = 'stylesheet';
        bootstrapCSS.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css';
        bootstrapCSS.integrity = 'sha384-9ndCyUaIbzAi2FUVXJi0CjmCapSmO7SnpJef0486qhLnuZ2cdeRhO02iuK6FUUVM';
        bootstrapCSS.crossOrigin = 'anonymous';
        document.head.appendChild(bootstrapCSS);

        // Thêm Bootstrap Icons
        const bootstrapIcons = document.createElement('link');
        bootstrapIcons.rel = 'stylesheet';
        bootstrapIcons.href = 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css';
        document.head.appendChild(bootstrapIcons);

        // Thêm Bootstrap JS
        const bootstrapJS = document.createElement('script');
        bootstrapJS.src = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js';
        bootstrapJS.integrity = 'sha384-geWF76RCwLtnZ8qwWowPQNguL3RmwHVBC9FhGdlKrxdiJJigb/j/68SIy3Te4Bkz';
        bootstrapJS.crossOrigin = 'anonymous';
        document.body.appendChild(bootstrapJS);

        return () => {
            // Xóa các elements khi component unmount
            document.head.removeChild(bootstrapCSS);
            document.head.removeChild(bootstrapIcons);
            document.body.removeChild(bootstrapJS);
        };
    }, []);

    return (
        <div className="admin-layout">
            <div className="container-fluid">
                <div className="row">
                    {/* Sidebar */}
                    <div className="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse">
                        <Sidebar />
                    </div>

                    {/* Main content */}
                    <div className="col-md-9 col-lg-10 ms-sm-auto px-md-4 main-content">
                        <Header />
                        <main className="content-area py-3">
                            <Outlet />
                        </main>
                        <Footer />
                    </div>
                </div>
            </div>
        </div>
    );
}