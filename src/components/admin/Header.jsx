"use client"

import { useState, useEffect, useRef } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import moment from "moment"
import { toast } from "react-toastify"
import NotificationDetailModal from "./NotificationDetailModal"
import "../../styles/admin-shared.css"
import "../../styles/admin-header.css"
import { API_ROOT, BACK_END_HOST } from '../../config';

const AdminHeader = () => {
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const [showNotifications, setShowNotifications] = useState(false)
    const [showProfileMenu, setShowProfileMenu] = useState(false)
    const [selectedNotification, setSelectedNotification] = useState(null)
    const notificationRef = useRef(null)
    const profileRef = useRef(null)

    // Fetch admin profile
    const { data: profileData } = useQuery({
        queryKey: ["adminProfile"],
        queryFn: async () => {
            const token = localStorage.getItem("token")
            const response = await axios.get(`${API_ROOT}/admin/profile`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            return response.data
        },
    })

    // Fetch notifications
    const { data: notificationsData, isLoading: isLoadingNotifications } = useQuery({
        queryKey: ["adminNotifications"],
        queryFn: async () => {
            const token = localStorage.getItem("token")
            const response = await axios.get(`${API_ROOT}/admin/profile/notifications`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            return response.data
        },
        refetchInterval: 30000, // Refetch every 30 seconds
    })

    // Fetch unread notification count
    const { data: unreadCountData } = useQuery({
        queryKey: ["unreadNotificationCount"],
        queryFn: async () => {
            const token = localStorage.getItem("token")
            const response = await axios.get(`${API_ROOT}/admin/profile/notifications/unread-count`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            return response.data
        },
        refetchInterval: 15000, // Refetch every 15 seconds
    })

    // Mark notification as read mutation
    const markAsReadMutation = useMutation({
        mutationFn: async (notificationId) => {
            const token = localStorage.getItem("token")
            return axios.put(
                `${API_ROOT}/admin/profile/notifications/${notificationId}/mark-read`,
                {},
                {
                    headers: { Authorization: `Bearer ${token}` },
                },
            )
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["adminNotifications"])
            queryClient.invalidateQueries(["unreadNotificationCount"])
        },
        onError: (error) => {
            toast.error(`Failed to mark notification as read: ${error.response?.data?.message || error.message}`)
        },
    })

    // Mark all notifications as read mutation
    const markAllAsReadMutation = useMutation({
        mutationFn: async () => {
            const token = localStorage.getItem("token")
            return axios.put(
                `${API_ROOT}/admin/profile/notifications/mark-all-read`,
                {},
                {
                    headers: { Authorization: `Bearer ${token}` },
                },
            )
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["adminNotifications"])
            queryClient.invalidateQueries(["unreadNotificationCount"])
            toast.success("All notifications marked as read")
        },
        onError: (error) => {
            toast.error(`Failed to mark all notifications as read: ${error.response?.data?.message || error.message}`)
        },
    })

    // Handle notification click
    const handleNotificationClick = (notification) => {
        setSelectedNotification(notification)
        setShowNotifications(false)
        if (!notification.read) {
            markAsReadMutation.mutate(notification.id)
        }
    }

    // Handle mark all as read
    const handleMarkAllAsRead = () => {
        markAllAsReadMutation.mutate()
    }

    // Close notification detail modal
    const handleCloseModal = () => {
        setSelectedNotification(null)
    }

    // View all notifications
    const handleViewAllNotifications = () => {
        setShowNotifications(false)
        navigate("/admin/notifications")
    }

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setShowNotifications(false)
            }
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setShowProfileMenu(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    // Format avatar URL
    const formatAvatarUrl = (avatarPath) => {
        if (!avatarPath) return "/assets/no-image.png"
        return avatarPath.startsWith("http")
            ? avatarPath
            : `${BACK_END_HOST}${avatarPath.startsWith("/") ? "" : "/"}${avatarPath}`
    }

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
        <header className="admin-header">
            <div className="admin-header-container">
                <Link className="admin-header-brand" to="/admin/dashboard">
                    <img src="/logo512.png" alt="ClickWork" />
                </Link>

                <div className="admin-header-actions">
                    {/* Notification Bell */}
                    <div className="notification-menu" ref={notificationRef}>
                        <button
                            className="notification-btn"
                            onClick={() => setShowNotifications(!showNotifications)}
                            aria-expanded={showNotifications}
                        >
                            <i className="bi bi-bell fs-5"></i>
                            {unreadCountData?.body > 0 && (
                                <span className="notification-badge">
                                    {unreadCountData.body > 99 ? "99+" : unreadCountData.body}
                                </span>
                            )}
                        </button>

                        {showNotifications && (
                            <div className="notification-dropdown">
                                <div className="notification-header">
                                    <h6 className="mb-0">Notifications</h6>
                                    {unreadCountData?.body > 0 && (
                                        <button
                                            className="admin-btn admin-btn-text"
                                            onClick={handleMarkAllAsRead}
                                            disabled={markAllAsReadMutation.isLoading}
                                        >
                                            Mark all as read
                                        </button>
                                    )}
                                </div>

                                {isLoadingNotifications ? (
                                    <div className="text-center p-3">
                                        <div className="spinner-border spinner-border-sm admin-spinner" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    </div>
                                ) : notificationsData?.body?.length > 0 ? (
                                    <div className="notification-list">
                                        {notificationsData.body.slice(0, 5).map((notification) => (
                                            <div
                                                key={notification.id}
                                                className={`notification-item ${!notification.read ? "unread" : ""}`}
                                                onClick={() => handleNotificationClick(notification)}
                                            >
                                                <div className={`notification-icon text-${getNotificationColor(notification.type)}`}>
                                                    <i className={getNotificationIcon(notification.type)}></i>
                                                </div>
                                                <div className="notification-content">
                                                    <div className="notification-title">{notification.title}</div>
                                                    <div className="notification-text">
                                                        {notification.content.length > 50
                                                            ? `${notification.content.substring(0, 50)}...`
                                                            : notification.content}
                                                    </div>
                                                    <div className="notification-time">{moment(notification.sendAt).fromNow()}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center p-4">
                                        <i className="bi bi-inbox fs-4 d-block mb-2 text-muted"></i>
                                        <p className="text-muted mb-0">No notifications</p>
                                    </div>
                                )}

                                <div className="notification-footer">
                                    <button className="admin-btn admin-btn-text w-100" onClick={handleViewAllNotifications}>
                                        View all notifications
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Profile Menu */}
                    <div className="profile-menu" ref={profileRef}>
                        <button
                            className="profile-btn"
                            onClick={() => setShowProfileMenu(!showProfileMenu)}
                            aria-expanded={showProfileMenu}
                        >
                            <img
                                src={profileData?.body?.avatar ? formatAvatarUrl(profileData.body.avatar) : "/assets/no-image.png"}
                                alt="Profile"
                                className="profile-avatar"
                                onError={(e) => {
                                    e.target.onerror = null
                                    e.target.src = "/assets/no-image.png"
                                }}
                            />
                            <div className="profile-info">
                                <div className="profile-name">{profileData?.body?.fullname || "Admin"}</div>
                                <div className="profile-username">{profileData?.body?.username || ""}</div>
                            </div>
                        </button>

                        {showProfileMenu && (
                            <div className="profile-dropdown">
                                <div className="profile-dropdown-header">
                                    <div className="profile-name">{profileData?.body?.fullname || "Admin"}</div>
                                    <div className="profile-username">{profileData?.body?.email || ""}</div>
                                </div>
                                <Link to="/admin/profile" className="profile-dropdown-item">
                                    <i className="bi bi-person"></i> Profile
                                </Link>
                                <button
                                    className="profile-dropdown-item danger"
                                    onClick={() => {
                                        localStorage.removeItem("token")
                                        window.location.href = "/login"
                                    }}
                                >
                                    <i className="bi bi-box-arrow-right"></i> Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Notification Detail Modal */}
            {selectedNotification && (
                <NotificationDetailModal notification={selectedNotification} onClose={handleCloseModal} />
            )}
        </header>
    )
}

export default AdminHeader
