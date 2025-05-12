import "../../styles/admin-shared.css"
import "../../styles/admin-footer.css"

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="admin-footer">
            <div className="admin-footer-container">
                <p className="admin-footer-text">&copy; {currentYear} Job Platform Admin Dashboard</p>
                <p className="admin-footer-version">Version 1.0.0</p>
            </div>
        </footer>
    );
}