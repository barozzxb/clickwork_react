export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer bg-white py-4 mt-auto border-top">
            <div className="container-fluid">
                <div className="row align-items-center">
                    <div className="col-md-6 text-center text-md-start">
                        <p className="mb-0 text-muted">&copy; {currentYear} Job Platform Admin Dashboard</p>
                    </div>
                    <div className="col-md-6 text-center text-md-end">
                        <p className="mb-0 text-muted">
                            <small>Version 1.0.0</small>
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}