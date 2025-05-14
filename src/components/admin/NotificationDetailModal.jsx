"use client"
import moment from "moment"
import "../../styles/admin-shared.css"
import "../../styles/admin-notifications.css"

const NotificationDetailModal = ({ notification, onClose }) => {
    if (!notification) return null

    // Get notification icon based on type
    const getNotificationIcon = (type) => {
        switch (type) {
            case "INFORM":
                return "bi bi-info-circle"
            case "SYSTEM":
                return "bi bi-gear"
            case "RESPONSE":
                return "bi bi-reply"
            default:
                return "bi bi-bell"
        }
    }

    // Get notification color based on type
    const getNotificationColor = (type) => {
        switch (type) {
            case "INFORM":
                return "info"
            case "SYSTEM":
                return "primary"
            case "RESPONSE":
                return "success"
            default:
                return "secondary"
        }
    }

    return (
        <div className="notification-detail-modal">
            <div className="notification-detail-content">
                <div className="notification-detail-header">
                    <h5 className="notification-detail-title">
                        <i className={`${getNotificationIcon(notification.type)} text-${getNotificationColor(notification.type)}`}></i>
                        Notification Details
                    </h5>
                    <button type="button" className="notification-detail-close" onClick={onClose}>
                        <i className="bi bi-x-lg"></i>
                    </button>
                </div>
                <div className="notification-detail-body">
                    <div className="notification-detail-info">
                        <h4 className="notification-detail-title">{notification.title}</h4>
                        <div className="notification-time">
                            {moment(notification.sendAt).format("MMMM D, YYYY [at] h:mm A")}
                        </div>
                    </div>
                    <div className="notification-detail-message">{notification.content}</div>
                    <div className="notification-detail-meta">
                        <span className={`admin-badge admin-badge-${getNotificationColor(notification.type)}`}>
                            {notification.type}
                        </span>
                        <span className={`admin-badge ${notification.read ? "admin-badge-success" : "admin-badge-danger"}`}>
                            {notification.read ? "Read" : "Unread"}
                        </span>
                    </div>
                </div>
                <div className="notification-detail-footer">
                    <button type="button" className="admin-btn admin-btn-secondary" onClick={onClose}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    )
}

export default NotificationDetailModal
