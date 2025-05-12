"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import moment from "moment"
import { toast } from "react-toastify"
import NotificationDetailModal from "./NotificationDetailModal"
import "../../styles/admin-shared.css"
import "../../styles/admin-notifications.css"

const AdminNotificationsPage = () => {
    const queryClient = useQueryClient()
    const [selectedNotification, setSelectedNotification] = useState(null)
    const [filterType, setFilterType] = useState("all")
    const [searchTerm, setSearchTerm] = useState("")
    const baseUrl = "http://localhost:9000"

    // Fetch notifications
    const { data: notificationsData, isLoading } = useQuery({
        queryKey: ["adminNotifications"],
        queryFn: async () => {
            const token = localStorage.getItem("token")
            const response = await axios.get(`${baseUrl}/api/admin/profile/notifications`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            return response.data
        },
        refetchInterval: 30000, // Refetch every 30 seconds
    })

    // Mark notification as read mutation
    const markAsReadMutation = useMutation({
        mutationFn: async (notificationId) => {
            const token = localStorage.getItem("token")
            return axios.put(
                `${baseUrl}/api/admin/profile/notifications/${notificationId}/mark-read`,
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
                `${baseUrl}/api/admin/profile/notifications/mark-all-read`,
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

    // Filter notifications
    const filteredNotifications =
        notificationsData?.body?.filter((notification) => {
            // Filter by type
            if (filterType !== "all" && notification.type !== filterType) {
                return false
            }

            // Filter by search term
            if (
                searchTerm &&
                !notification.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
                !notification.content.toLowerCase().includes(searchTerm.toLowerCase())
            ) {
                return false
            }

            return true
        }) || []

    // Count unread notifications
    const unreadCount = notificationsData?.body?.filter((notification) => !notification.read).length || 0

    return (
        <div className="container py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="admin-page-title">Notifications</h2>
                {unreadCount > 0 && (
                    <button
                        className="admin-btn admin-btn-primary"
                        onClick={handleMarkAllAsRead}
                        disabled={markAllAsReadMutation.isLoading}
                    >
                        <i className="bi bi-check-all"></i>
                        Mark All as Read
                    </button>
                )}
            </div>

            {/* Filters */}
            <div className="admin-card mb-4">
                <div className="admin-card-body">
                    <div className="row g-3">
                        <div className="col-md-6">
                            <div className="input-group">
                                <span className="input-group-text">
                                    <i className="bi bi-search"></i>
                                </span>
                                <input
                                    type="text"
                                    className="admin-form-control"
                                    placeholder="Search notifications..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <select
                                className="admin-form-control"
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                            >
                                <option value="all">All Types</option>
                                <option value="INFORM">Information</option>
                                <option value="SYSTEM">System</option>
                                <option value="RESPONSE">Response</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Notifications List */}
            <div className="admin-card">
                <div className="admin-card-body p-0">
                    {isLoading ? (
                        <div className="text-center p-5">
                            <div className="spinner-border admin-spinner" role="status">
                                <span className="visually-hidden">Loading notifications...</span>
                            </div>
                        </div>
                    ) : filteredNotifications.length > 0 ? (
                        <div className="notification-list">
                            {filteredNotifications.map((notification) => (
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
                                            {notification.content.length > 100
                                                ? `${notification.content.substring(0, 100)}...`
                                                : notification.content}
                                        </div>
                                        <div className="notification-time">{moment(notification.sendAt).fromNow()}</div>
                                    </div>
                                    <div className="notification-badges">
                                        <span className={`admin-badge admin-badge-${getNotificationColor(notification.type)}`}>
                                            {notification.type}
                                        </span>
                                        {!notification.read && (
                                            <span className="admin-badge admin-badge-danger">NEW</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center p-5">
                            <i className="bi bi-inbox fs-1 text-muted mb-3 d-block"></i>
                            <h5 className="text-muted">No notifications found</h5>
                            {(searchTerm || filterType !== "all") && (
                                <p className="text-muted mb-0">Try adjusting your filters</p>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Notification Detail Modal */}
            {selectedNotification && (
                <NotificationDetailModal notification={selectedNotification} onClose={handleCloseModal} />
            )}
        </div>
    )
}

export default AdminNotificationsPage
