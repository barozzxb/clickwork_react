"use client"

import { useState, useEffect, useRef } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "react-toastify"
import axios from "axios"
import '../../styles/admin-profile.css'

const AdminProfile = () => {
    const queryClient = useQueryClient()
    const [activeTab, setActiveTab] = useState("profile")
    const [avatarPreview, setAvatarPreview] = useState(null)
    const [avatarFile, setAvatarFile] = useState(null)
    const [initialProfileData, setInitialProfileData] = useState(null)
    const [showAddressDetails, setShowAddressDetails] = useState(null)
    const baseUrl = "http://localhost:9000"
    const editFormRef = useRef(null)
    const addressDetailsRef = useRef(null)

    // Profile form state
    const [profileForm, setProfileForm] = useState({
        fullname: "",
        phonenum: "",
    })

    // Password form state
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    })

    // Address form state
    const [addressForm, setAddressForm] = useState({
        nation: "",
        province: "",
        district: "",
        village: "",
        detail: "",
    })

    // Edit address form state
    const [editAddressForm, setEditAddressForm] = useState({
        id: null,
        nation: "",
        province: "",
        district: "",
        village: "",
        detail: "",
    })

    // Helper function to format avatar URL
    const formatAvatarUrl = (avatarPath) => {
        if (!avatarPath) return "/assets/no-image.png"
        return avatarPath.startsWith("http")
            ? avatarPath
            : `${baseUrl}${avatarPath.startsWith("/") ? "" : "/"}${avatarPath}`
    }

    // Fetch admin profile data
    const {
        data: profileData,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["adminProfile"],
        queryFn: async () => {
            const token = localStorage.getItem("token")
            const response = await axios.get("http://localhost:9000/api/admin/profile", {
                headers: { Authorization: `Bearer ${token}` },
            })
            console.log("Profile data fetched:", response.data)
            return response.data
        },
    })

    // Fetch addresses
    const {
        data: addressesData,
        isLoading: isLoadingAddresses,
        refetch: refetchAddresses,
    } = useQuery({
        queryKey: ["adminAddresses"],
        queryFn: async () => {
            const token = localStorage.getItem("token")
            const response = await axios.get("http://localhost:9000/api/admin/profile/addresses", {
                headers: { Authorization: `Bearer ${token}` },
            })
            console.log("Addresses fetched:", response.data)
            return response.data
        },
    })

    // Initialize form with profile data when loaded
    useEffect(() => {
        if (profileData?.body) {
            const data = profileData.body
            setProfileForm({
                fullname: data.fullname || "",
                phonenum: data.phonenum || "",
            })

            // Store initial data for comparison
            setInitialProfileData({
                fullname: data.fullname || "",
                phonenum: data.phonenum || "",
            })

            if (data.avatar) {
                setAvatarPreview(formatAvatarUrl(data.avatar))
            }
        }
    }, [profileData])

    // Effect to refetch addresses when tab changes and scroll to edit form or address details
    useEffect(() => {
        if (activeTab === "addresses") {
            refetchAddresses()
        }

        if (editAddressForm.id && editFormRef.current) {
            editFormRef.current.scrollIntoView({ behavior: "smooth", block: "start" })
        }

        if (showAddressDetails && addressDetailsRef.current) {
            addressDetailsRef.current.scrollIntoView({ behavior: "smooth", block: "start" })
        }
    }, [activeTab, editAddressForm.id, showAddressDetails, refetchAddresses])

    // Check if profile has been changed
    const hasProfileChanged = () => {
        if (!initialProfileData) return false

        return (
            profileForm.fullname !== initialProfileData.fullname ||
            profileForm.phonenum !== initialProfileData.phonenum ||
            avatarFile !== null
        )
    }

    // Update profile mutation
    const updateProfileMutation = useMutation({
        mutationFn: async () => {
            const token = localStorage.getItem("token")
            if (!token) throw new Error("No authentication token found")

            if (!profileForm.fullname || profileForm.fullname.trim() === "") {
                throw new Error("Full name is required")
            }

            if (profileForm.fullname.length > 255) {
                throw new Error("Full name cannot exceed 255 characters")
            }

            if (profileForm.phonenum && !/^\d{10,15}$/.test(profileForm.phonenum)) {
                throw new Error("Phone number must be 10-15 digits")
            }

            // Check if anything has changed
            if (!hasProfileChanged()) {
                throw new Error("No changes detected")
            }

            const formData = new FormData()
            formData.append("fullname", profileForm.fullname)
            if (profileForm.phonenum) formData.append("phonenum", profileForm.phonenum)

            // Only append avatar if a new file was selected
            if (avatarFile) {
                formData.append("avatar", avatarFile)
            }

            // Log the form data for debugging
            console.log("Form data being sent:", {
                fullname: profileForm.fullname,
                phonenum: profileForm.phonenum,
                hasAvatar: avatarFile !== null,
            })

            try {
                // Log the form data for debugging
                for (const pair of formData.entries()) {
                    console.log(pair[0] + ": " + pair[1])
                }

                const response = await axios.put("http://localhost:9000/api/admin/profile/update", formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                    // Add timeout to prevent hanging requests
                    timeout: 30000,
                })
                return response
            } catch (error) {
                console.error("Error details:", error.response || error)
                throw error
            }
        },
        onSuccess: (response) => {
            queryClient.invalidateQueries(["adminProfile"])

            // Update initial data
            setInitialProfileData({
                fullname: response.data.body.fullname,
                phonenum: response.data.body.phonenum || "",
            })

            setProfileForm({
                fullname: response.data.body.fullname,
                phonenum: response.data.body.phonenum || "",
            })

            if (response?.data?.body?.avatar) {
                setAvatarPreview(formatAvatarUrl(response.data.body.avatar))
            }

            setAvatarFile(null)
            toast.success("Profile updated successfully")
        },
        onError: (error) => {
            if (error.message === "No changes detected") {
                toast.info("No changes to save")
            } else {
                console.error("Update profile error:", error)
                toast.error(`Failed to update profile: ${error.response?.data?.message || error.message}`)
            }
        },
    })

    // Change password mutation
    const changePasswordMutation = useMutation({
        mutationFn: async () => {
            const token = localStorage.getItem("token")
            if (!token) throw new Error("No authentication token found")

            const response = await axios.put(
                "http://localhost:9000/api/admin/profile/change-password",
                {
                    currentPassword: passwordForm.currentPassword,
                    newPassword: passwordForm.newPassword,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                },
            )
            return response.data
        },
        onSuccess: () => {
            toast.success("Password changed successfully")
            setPasswordForm({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            })
        },
        onError: (error) => {
            toast.error(`Failed to change password: ${error.response?.data?.message || error.message}`)
        },
    })

    // Add address mutation
    const addAddressMutation = useMutation({
        mutationFn: async () => {
            const token = localStorage.getItem("token")
            if (!token) throw new Error("No authentication token found")

            const response = await axios.post("http://localhost:9000/api/admin/profile/address", addressForm, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            })
            return response.data
        },
        onSuccess: () => {
            toast.success("Address added successfully")
            setAddressForm({
                nation: "",
                province: "",
                district: "",
                village: "",
                detail: "",
            })
            queryClient.invalidateQueries(["adminAddresses"])
        },
        onError: (error) => {
            toast.error(`Failed to add address: ${error.response?.data?.message || error.message}`)
        },
    })

    // Update address mutation
    const updateAddressMutation = useMutation({
        mutationFn: async () => {
            const token = localStorage.getItem("token")
            if (!token) throw new Error("No authentication token found")

            const response = await axios.put(
                `http://localhost:9000/api/admin/profile/address/${editAddressForm.id}`,
                editAddressForm,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                },
            )
            return response.data
        },
        onSuccess: () => {
            toast.success("Address updated successfully")
            setEditAddressForm({
                id: null,
                nation: "",
                province: "",
                district: "",
                village: "",
                detail: "",
            })
            queryClient.invalidateQueries(["adminAddresses"])
        },
        onError: (error) => {
            toast.error(`Failed to update address: ${error.response?.data?.message || error.message}`)
        },
    })

    // Delete address mutation
    const deleteAddressMutation = useMutation({
        mutationFn: async (addressId) => {
            const token = localStorage.getItem("token")
            if (!token) throw new Error("No authentication token found")

            const response = await axios.delete(`http://localhost:9000/api/admin/profile/address/${addressId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            return response.data
        },
        onSuccess: () => {
            toast.success("Address deleted successfully")
            queryClient.invalidateQueries(["adminAddresses"])
        },
        onError: (error) => {
            toast.error(`Failed to delete address: ${error.response?.data?.message || error.message}`)
        },
    })

    // Handle avatar file change
    const handleAvatarChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            const validTypes = ["image/jpeg", "image/png", "image/gif", "image/jpg"]
            if (!validTypes.includes(file.type)) {
                toast.error("Please select a valid image file (JPEG, PNG, GIF, JPG)")
                return
            }

            if (file.size > 2 * 1024 * 1024) {
                toast.error("Image size should be less than 2MB")
                return
            }

            console.log("Selected file:", {
                name: file.name,
                type: file.type,
                size: file.size,
            })

            setAvatarFile(file)

            // Create a URL for the file preview
            const fileUrl = URL.createObjectURL(file)
            setAvatarPreview(fileUrl)

            // Indicate that changes have been made
            toast.info("New avatar selected. Click 'Save Changes' to update.")
        }
    }

    // Handle profile form change
    const handleProfileChange = (e) => {
        const { name, value } = e.target
        setProfileForm((prev) => ({ ...prev, [name]: value }))
    }

    // Handle password form change
    const handlePasswordChange = (e) => {
        const { name, value } = e.target
        setPasswordForm((prev) => ({ ...prev, [name]: value }))
    }

    // Handle address form change
    const handleAddressChange = (e) => {
        const { name, value } = e.target
        setAddressForm((prev) => ({ ...prev, [name]: value }))
    }

    // Handle edit address form change
    const handleEditAddressChange = (e) => {
        const { name, value } = e.target
        setEditAddressForm((prev) => ({ ...prev, [name]: value }))
    }

    // Handle profile update submission
    const handleProfileSubmit = (e) => {
        e.preventDefault()
        updateProfileMutation.mutate()
    }

    // Handle password change submission
    const handlePasswordSubmit = (e) => {
        e.preventDefault()
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            toast.error("New passwords do not match")
            return
        }
        changePasswordMutation.mutate()
    }

    // Handle add address submission
    const handleAddAddressSubmit = (e) => {
        e.preventDefault()
        addAddressMutation.mutate()
    }

    // Handle update address submission
    const handleUpdateAddressSubmit = (e) => {
        e.preventDefault()
        updateAddressMutation.mutate()
    }

    // Handle address deletion
    const handleDeleteAddress = (addressId) => {
        if (window.confirm("Are you sure you want to delete this address?")) {
            deleteAddressMutation.mutate(addressId)
        }
    }

    // Handle view address details
    const handleViewAddressDetails = (address) => {
        setShowAddressDetails(address)
        setEditAddressForm({
            id: null,
            nation: "",
            province: "",
            district: "",
            village: "",
            detail: "",
        })
    }

    // Handle edit address
    const handleEditAddress = (address) => {
        setEditAddressForm({
            id: address.id,
            nation: address.nation || "",
            province: address.province || "",
            district: address.district || "",
            village: address.village || "",
            detail: address.detail || "",
        })
        setShowAddressDetails(null)
    }

    // Cancel edit address
    const handleCancelEdit = () => {
        setEditAddressForm({
            id: null,
            nation: "",
            province: "",
            district: "",
            village: "",
            detail: "",
        })
    }

    // Close address details
    const handleCloseAddressDetails = () => {
        setShowAddressDetails(null)
    }

    if (isLoading) {
        return (
            <div className="admin-profile">
                <div className="text-center">
                    <div className="spinner-border admin-spinner" role="status">
                        <span className="visually-hidden">Loading profile...</span>
                    </div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="admin-profile">
                <div className="admin-alert admin-alert-danger">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    Error loading profile: {error.message}
                </div>
            </div>
        )
    }

    return (
        <div className="admin-profile">
            <h2 className="admin-profile-title">Admin Profile</h2>

            <ul className="nav admin-tabs">
                {[
                    { id: 'profile', icon: 'bi-person', label: 'Profile' },
                    { id: 'security', icon: 'bi-shield-lock', label: 'Security' },
                    { id: 'addresses', icon: 'bi-geo-alt', label: 'Manage Addresses' }
                ].map(tab => (
                    <li className="nav-item" key={tab.id}>
                        <button
                            className={`admin-tab ${activeTab === tab.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            <i className={`${tab.icon} me-2`}></i>{tab.label}
                        </button>
                    </li>
                ))}
            </ul>

            {/* Profile Tab */}
            {activeTab === "profile" && (
                <div className="profile-card">
                    <div className="card-body p-4">
                        <div className="row">
                            <div className="col-md-3 text-center">
                                <div className="avatar-container mb-3">
                                    <img
                                        src={avatarPreview || "/assets/no-image.png"}
                                        alt="Profile Avatar"
                                        className="avatar-image"
                                        onError={(e) => {
                                            e.target.onerror = null
                                            e.target.src = "/assets/no-image.png"
                                        }}
                                    />
                                </div>
                                <label className="avatar-upload-btn d-block cursor-pointer">
                                    <i className="bi bi-camera me-1"></i> Change Avatar
                                    <input
                                        type="file"
                                        id="avatar"
                                        accept="image/jpeg,image/png,image/gif,image/jpg"
                                        style={{ display: "none" }}
                                        onChange={handleAvatarChange}
                                    />
                                </label>
                                {avatarFile && (
                                    <div className="text-muted small mt-2">
                                        <i className="bi bi-info-circle me-1"></i>
                                        New image selected. Click "Save Changes" to update.
                                    </div>
                                )}
                            </div>
                            <div className="col-md-9">
                                <form onSubmit={handleProfileSubmit}>
                                    <div className="admin-form-group">
                                        <label className="admin-form-label">Username</label>
                                        <input
                                            type="text"
                                            className="admin-form-control"
                                            value={profileData?.body?.username || ""}
                                            disabled
                                        />
                                        <div className="form-text text-muted">Username cannot be changed</div>
                                    </div>
                                    <div className="admin-form-group">
                                        <label className="admin-form-label">Email</label>
                                        <input
                                            type="email"
                                            className="admin-form-control"
                                            value={profileData?.body?.email || ""}
                                            disabled
                                        />
                                        <div className="form-text text-muted">Email address cannot be changed</div>
                                    </div>
                                    <div className="admin-form-group">
                                        <label className="admin-form-label">Full Name</label>
                                        <input
                                            type="text"
                                            className="admin-form-control"
                                            name="fullname"
                                            value={profileForm.fullname}
                                            onChange={handleProfileChange}
                                            placeholder="Enter your full name"
                                            required
                                            maxLength="255"
                                        />
                                    </div>
                                    <div className="admin-form-group">
                                        <label className="admin-form-label">Phone Number</label>
                                        <input
                                            type="text"
                                            className="admin-form-control"
                                            name="phonenum"
                                            value={profileForm.phonenum}
                                            onChange={handleProfileChange}
                                            placeholder="Enter your phone number (10-15 digits)"
                                            pattern="\d{10,15}"
                                            title="Phone number must be 10-15 digits"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="admin-btn admin-btn-primary"
                                        disabled={updateProfileMutation.isLoading || !hasProfileChanged()}
                                    >
                                        {updateProfileMutation.isLoading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                <i className="bi bi-check-circle me-2"></i>
                                                Save Changes
                                            </>
                                        )}
                                    </button>
                                    {!hasProfileChanged() && (
                                        <div className="form-text text-muted mt-2">
                                            <i className="bi bi-info-circle me-1"></i>
                                            Make changes to your profile information and click "Save Changes" to update.
                                        </div>
                                    )}
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Security Tab */}
            {activeTab === "security" && (
                <div className="profile-card">
                    <div className="card-body p-4">
                        <h4 className="admin-profile-title mb-4">Change Password</h4>
                        <form onSubmit={handlePasswordSubmit}>
                            <div className="admin-form-group">
                                <label className="admin-form-label">Current Password</label>
                                <input
                                    type="password"
                                    className="admin-form-control"
                                    name="currentPassword"
                                    value={passwordForm.currentPassword}
                                    onChange={handlePasswordChange}
                                    required
                                />
                            </div>
                            <div className="admin-form-group">
                                <label className="admin-form-label">New Password</label>
                                <input
                                    type="password"
                                    className="admin-form-control"
                                    name="newPassword"
                                    value={passwordForm.newPassword}
                                    onChange={handlePasswordChange}
                                    required
                                    pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$"
                                    title="Password must be at least 8 characters with at least one letter and one number"
                                />
                                <div className="form-text text-muted">
                                    Password must be at least 8 characters with at least one letter and one number
                                </div>
                            </div>
                            <div className="admin-form-group">
                                <label className="admin-form-label">Confirm New Password</label>
                                <input
                                    type="password"
                                    className="admin-form-control"
                                    name="confirmPassword"
                                    value={passwordForm.confirmPassword}
                                    onChange={handlePasswordChange}
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="admin-btn admin-btn-primary"
                                disabled={changePasswordMutation.isLoading}
                            >
                                {changePasswordMutation.isLoading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        Changing Password...
                                    </>
                                ) : (
                                    <>
                                        <i className="bi bi-shield-check me-2"></i>
                                        Change Password
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Addresses Tab */}
            {activeTab === "addresses" && (
                <div className="profile-card">
                    <div className="card-body p-4">
                        <h4 className="admin-profile-title mb-4">Manage Addresses</h4>

                        {/* Address Details View */}
                        {showAddressDetails && (
                            <div className="address-card" ref={addressDetailsRef}>
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h5 className="mb-0">Address Details</h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={handleCloseAddressDetails}
                                        aria-label="Close"
                                    ></button>
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <p className="mb-2">
                                            <strong>Nation:</strong> {showAddressDetails.nation}
                                        </p>
                                        <p className="mb-2">
                                            <strong>Province:</strong> {showAddressDetails.province}
                                        </p>
                                        <p className="mb-2">
                                            <strong>District:</strong> {showAddressDetails.district}
                                        </p>
                                    </div>
                                    <div className="col-md-6">
                                        <p className="mb-2">
                                            <strong>Village:</strong> {showAddressDetails.village}
                                        </p>
                                        <p className="mb-2">
                                            <strong>Detail:</strong> {showAddressDetails.detail}
                                        </p>
                                    </div>
                                </div>
                                <div className="address-actions">
                                    <button
                                        type="button"
                                        className="admin-btn admin-btn-primary"
                                        onClick={() => handleEditAddress(showAddressDetails)}
                                    >
                                        <i className="bi bi-pencil-square me-1"></i> Edit
                                    </button>
                                    <button
                                        type="button"
                                        className="admin-btn admin-btn-danger"
                                        onClick={() => handleDeleteAddress(showAddressDetails.id)}
                                        disabled={deleteAddressMutation.isLoading}
                                    >
                                        <i className="bi bi-trash me-1"></i> Delete
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Edit Address Form */}
                        {editAddressForm.id && (
                            <div className="address-card" ref={editFormRef}>
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h5 className="mb-0">Edit Address</h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={handleCancelEdit}
                                        aria-label="Close"
                                    ></button>
                                </div>
                                <form onSubmit={handleUpdateAddressSubmit}>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="admin-form-group">
                                                <label className="admin-form-label">Nation</label>
                                                <input
                                                    type="text"
                                                    className="admin-form-control"
                                                    name="nation"
                                                    value={editAddressForm.nation}
                                                    onChange={handleEditAddressChange}
                                                    required
                                                    maxLength="255"
                                                    placeholder="Enter nation"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="admin-form-group">
                                                <label className="admin-form-label">Province</label>
                                                <input
                                                    type="text"
                                                    className="admin-form-control"
                                                    name="province"
                                                    value={editAddressForm.province}
                                                    onChange={handleEditAddressChange}
                                                    required
                                                    maxLength="255"
                                                    placeholder="Enter province"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="admin-form-group">
                                                <label className="admin-form-label">District</label>
                                                <input
                                                    type="text"
                                                    className="admin-form-control"
                                                    name="district"
                                                    value={editAddressForm.district}
                                                    onChange={handleEditAddressChange}
                                                    required
                                                    maxLength="255"
                                                    placeholder="Enter district"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="admin-form-group">
                                                <label className="admin-form-label">Village</label>
                                                <input
                                                    type="text"
                                                    className="admin-form-control"
                                                    name="village"
                                                    value={editAddressForm.village}
                                                    onChange={handleEditAddressChange}
                                                    required
                                                    maxLength="255"
                                                    placeholder="Enter village"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="admin-form-group">
                                        <label className="admin-form-label">Detail</label>
                                        <input
                                            type="text"
                                            className="admin-form-control"
                                            name="detail"
                                            value={editAddressForm.detail}
                                            onChange={handleEditAddressChange}
                                            required
                                            maxLength="255"
                                            placeholder="Enter address details"
                                        />
                                    </div>
                                    <div className="address-actions">
                                        <button
                                            type="submit"
                                            className="admin-btn admin-btn-primary"
                                            disabled={updateAddressMutation.isLoading}
                                        >
                                            {updateAddressMutation.isLoading ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                    Updating...
                                                </>
                                            ) : (
                                                <>
                                                    <i className="bi bi-check-circle me-2"></i>
                                                    Update Address
                                                </>
                                            )}
                                        </button>
                                        <button
                                            type="button"
                                            className="admin-btn admin-btn-secondary"
                                            onClick={handleCancelEdit}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* Addresses List */}
                        <div className="profile-card mb-4">
                            <div className="card-header bg-light p-3">
                                <h5 className="mb-0">Your Addresses</h5>
                            </div>
                            <div className="card-body p-0">
                                {isLoadingAddresses ? (
                                    <div className="text-center p-4">
                                        <div className="spinner-border admin-spinner" role="status">
                                            <span className="visually-hidden">Loading addresses...</span>
                                        </div>
                                    </div>
                                ) : addressesData?.body?.length > 0 ? (
                                    <div className="table-responsive">
                                        <table className="admin-table">
                                            <thead>
                                                <tr>
                                                    <th>Nation</th>
                                                    <th>Province</th>
                                                    <th>District</th>
                                                    <th>Village</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {addressesData.body.map((address) => (
                                                    <tr key={address.id}>
                                                        <td>{address.nation || "N/A"}</td>
                                                        <td>{address.province || "N/A"}</td>
                                                        <td>{address.district || "N/A"}</td>
                                                        <td>{address.village || "N/A"}</td>
                                                        <td>
                                                            <div className="d-flex gap-2">
                                                                <button
                                                                    className="admin-btn admin-btn-secondary btn-sm"
                                                                    onClick={() => handleViewAddressDetails(address)}
                                                                >
                                                                    <i className="bi bi-eye"></i>
                                                                </button>
                                                                <button
                                                                    className="admin-btn admin-btn-primary btn-sm"
                                                                    onClick={() => handleEditAddress(address)}
                                                                >
                                                                    <i className="bi bi-pencil-square"></i>
                                                                </button>
                                                                <button
                                                                    className="admin-btn admin-btn-danger btn-sm"
                                                                    onClick={() => handleDeleteAddress(address.id)}
                                                                    disabled={deleteAddressMutation.isLoading}
                                                                >
                                                                    <i className="bi bi-trash"></i>
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="admin-alert admin-alert-info m-3">
                                        <i className="bi bi-info-circle me-2"></i>
                                        No addresses found. Add one using the form below.
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Add New Address Form */}
                        <div className="profile-card">
                            <div className="card-header bg-light p-3">
                                <h5 className="mb-0">Add New Address</h5>
                            </div>
                            <div className="card-body p-4">
                                <form onSubmit={handleAddAddressSubmit}>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="admin-form-group">
                                                <label className="admin-form-label">Nation</label>
                                                <input
                                                    type="text"
                                                    className="admin-form-control"
                                                    name="nation"
                                                    value={addressForm.nation}
                                                    onChange={handleAddressChange}
                                                    required
                                                    maxLength="255"
                                                    placeholder="Enter nation"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="admin-form-group">
                                                <label className="admin-form-label">Province</label>
                                                <input
                                                    type="text"
                                                    className="admin-form-control"
                                                    name="province"
                                                    value={addressForm.province}
                                                    onChange={handleAddressChange}
                                                    required
                                                    maxLength="255"
                                                    placeholder="Enter province"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="admin-form-group">
                                                <label className="admin-form-label">District</label>
                                                <input
                                                    type="text"
                                                    className="admin-form-control"
                                                    name="district"
                                                    value={addressForm.district}
                                                    onChange={handleAddressChange}
                                                    required
                                                    maxLength="255"
                                                    placeholder="Enter district"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="admin-form-group">
                                                <label className="admin-form-label">Village</label>
                                                <input
                                                    type="text"
                                                    className="admin-form-control"
                                                    name="village"
                                                    value={addressForm.village}
                                                    onChange={handleAddressChange}
                                                    required
                                                    maxLength="255"
                                                    placeholder="Enter village"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="admin-form-group">
                                        <label className="admin-form-label">Detail</label>
                                        <input
                                            type="text"
                                            className="admin-form-control"
                                            name="detail"
                                            value={addressForm.detail}
                                            onChange={handleAddressChange}
                                            required
                                            maxLength="255"
                                            placeholder="Enter address details"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="admin-btn admin-btn-primary"
                                        disabled={addAddressMutation.isLoading}
                                    >
                                        {addAddressMutation.isLoading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Adding...
                                            </>
                                        ) : (
                                            <>
                                                <i className="bi bi-plus-circle me-2"></i>
                                                Add Address
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AdminProfile
