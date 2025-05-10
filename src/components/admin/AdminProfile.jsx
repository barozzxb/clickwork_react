"use client"

import { useState, useEffect, useRef } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "react-toastify"
import axios from "axios"

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
            <div className="container mt-5">
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading profile...</span>
                    </div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="container mt-5">
                <div className="alert alert-danger">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    Error loading profile: {error.message}
                </div>
            </div>
        )
    }

    return (
        <div className="container mt-4 mb-5">
            <h2 className="mb-4">Admin Profile</h2>

            <ul className="nav nav-tabs mb-4">
                <li className="nav-item">
                    <button
                        className={`nav-link ${activeTab === "profile" ? "active" : ""}`}
                        onClick={() => setActiveTab("profile")}
                    >
                        <i className="bi bi-person me-2"></i>Profile
                    </button>
                </li>
                <li className="nav-item">
                    <button
                        className={`nav-link ${activeTab === "security" ? "active" : ""}`}
                        onClick={() => setActiveTab("security")}
                    >
                        <i className="bi bi-shield-lock me-2"></i>Security
                    </button>
                </li>
                <li className="nav-item">
                    <button
                        className={`nav-link ${activeTab === "addresses" ? "active" : ""}`}
                        onClick={() => setActiveTab("addresses")}
                    >
                        <i className="bi bi-geo-alt me-2"></i>Manage Addresses
                    </button>
                </li>
            </ul>

            {/* Profile Tab */}
            {activeTab === "profile" && (
                <div className="card">
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-3 text-center">
                                <div className="mb-3">
                                    <div className="avatar-container mb-3">
                                        <div className="position-relative" style={{ width: "150px", height: "150px", margin: "0 auto" }}>
                                            <img
                                                src={avatarPreview || "/assets/no-image.png"}
                                                alt="Profile Avatar"
                                                className="rounded-circle img-thumbnail"
                                                style={{
                                                    width: "150px",
                                                    height: "150px",
                                                    objectFit: "cover",
                                                    border: "1px solid #dee2e6",
                                                }}
                                                onError={(e) => {
                                                    e.target.onerror = null
                                                    e.target.src = "/assets/no-image.png"
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="avatar" className="btn btn-outline-primary">
                                            <i className="bi bi-camera me-1"></i> Change Avatar
                                        </label>
                                        <input
                                            type="file"
                                            id="avatar"
                                            accept="image/jpeg,image/png,image/gif,image/jpg"
                                            style={{ display: "none" }}
                                            onChange={handleAvatarChange}
                                        />
                                    </div>
                                    {avatarFile && (
                                        <div className="text-muted small">
                                            <i className="bi bi-info-circle me-1"></i>
                                            New image selected. Click "Save Changes" to update.
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="col-md-9">
                                <form onSubmit={handleProfileSubmit}>
                                    <div className="mb-3">
                                        <label htmlFor="username" className="form-label">
                                            Username
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="username"
                                            value={profileData?.body?.username || ""}
                                            disabled
                                        />
                                        <div className="form-text text-muted">Username cannot be changed</div>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="email" className="form-label">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            id="email"
                                            value={profileData?.body?.email || ""}
                                            disabled
                                        />
                                        <div className="form-text text-muted">Email address cannot be changed</div>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="fullname" className="form-label">
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="fullname"
                                            name="fullname"
                                            value={profileForm.fullname}
                                            onChange={handleProfileChange}
                                            placeholder="Enter your full name"
                                            required
                                            maxLength="255"
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="phonenum" className="form-label">
                                            Phone Number
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="phonenum"
                                            name="phonenum"
                                            value={profileForm.phonenum}
                                            onChange={handleProfileChange}
                                            placeholder="Enter your phone number (10-15 digits)"
                                            pattern="\d{10,15}"
                                            title="Phone number must be 10-15 digits"
                                        />
                                    </div>
                                    <button type="submit" className="btn btn-primary" disabled={updateProfileMutation.isLoading}>
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
                <div className="card">
                    <div className="card-body">
                        <h4 className="card-title">Change Password</h4>
                        <form onSubmit={handlePasswordSubmit}>
                            <div className="mb-3">
                                <label htmlFor="currentPassword" className="form-label">
                                    Current Password
                                </label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="currentPassword"
                                    name="currentPassword"
                                    value={passwordForm.currentPassword}
                                    onChange={handlePasswordChange}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="newPassword" className="form-label">
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="newPassword"
                                    name="newPassword"
                                    value={passwordForm.newPassword}
                                    onChange={handlePasswordChange}
                                    required
                                    pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$"
                                    title="Password must be at least 8 characters with at least one letter and one number"
                                />
                                <div className="form-text">
                                    Password must be at least 8 characters with at least one letter and one number
                                </div>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="confirmPassword" className="form-label">
                                    Confirm New Password
                                </label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={passwordForm.confirmPassword}
                                    onChange={handlePasswordChange}
                                    required
                                />
                            </div>
                            <button type="submit" className="btn btn-primary" disabled={changePasswordMutation.isLoading}>
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
                <div className="card">
                    <div className="card-body">
                        <h4 className="card-title mb-4">Manage Addresses</h4>

                        {/* Address Details View */}
                        {showAddressDetails && (
                            <div className="card mb-4 bg-light" ref={addressDetailsRef}>
                                <div className="card-header d-flex justify-content-between align-items-center">
                                    <h5 className="card-title mb-0">Address Details</h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={handleCloseAddressDetails}
                                        aria-label="Close"
                                    ></button>
                                </div>
                                <div className="card-body">
                                    <div className="row mb-3">
                                        <div className="col-md-6">
                                            <p className="mb-1">
                                                <strong>Nation:</strong> {showAddressDetails.nation}
                                            </p>
                                            <p className="mb-1">
                                                <strong>Province:</strong> {showAddressDetails.province}
                                            </p>
                                            <p className="mb-1">
                                                <strong>District:</strong> {showAddressDetails.district}
                                            </p>
                                        </div>
                                        <div className="col-md-6">
                                            <p className="mb-1">
                                                <strong>Village:</strong> {showAddressDetails.village}
                                            </p>
                                            <p className="mb-1">
                                                <strong>Detail:</strong> {showAddressDetails.detail}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="d-flex gap-2">
                                        <button
                                            type="button"
                                            className="btn btn-primary"
                                            onClick={() => handleEditAddress(showAddressDetails)}
                                        >
                                            <i className="bi bi-pencil-square me-1"></i> Edit Address
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-danger"
                                            onClick={() => handleDeleteAddress(showAddressDetails.id)}
                                            disabled={deleteAddressMutation.isLoading}
                                        >
                                            <i className="bi bi-trash me-1"></i> Delete Address
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Edit Address Form */}
                        {editAddressForm.id && (
                            <div className="card mb-4 bg-light" ref={editFormRef}>
                                <div className="card-header d-flex justify-content-between align-items-center">
                                    <h5 className="card-title mb-0">Edit Address</h5>
                                    <button type="button" className="btn-close" onClick={handleCancelEdit} aria-label="Close"></button>
                                </div>
                                <div className="card-body">
                                    <form onSubmit={handleUpdateAddressSubmit}>
                                        <div className="row">
                                            <div className="col-md-6 mb-3">
                                                <label htmlFor="editNation" className="form-label">
                                                    Nation
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="editNation"
                                                    name="nation"
                                                    value={editAddressForm.nation}
                                                    onChange={handleEditAddressChange}
                                                    required
                                                    maxLength="255"
                                                    placeholder="Enter nation"
                                                />
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label htmlFor="editProvince" className="form-label">
                                                    Province
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="editProvince"
                                                    name="province"
                                                    value={editAddressForm.province}
                                                    onChange={handleEditAddressChange}
                                                    required
                                                    maxLength="255"
                                                    placeholder="Enter province"
                                                />
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6 mb-3">
                                                <label htmlFor="editDistrict" className="form-label">
                                                    District
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="editDistrict"
                                                    name="district"
                                                    value={editAddressForm.district}
                                                    onChange={handleEditAddressChange}
                                                    required
                                                    maxLength="255"
                                                    placeholder="Enter district"
                                                />
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label htmlFor="editVillage" className="form-label">
                                                    Village
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="editVillage"
                                                    name="village"
                                                    value={editAddressForm.village}
                                                    onChange={handleEditAddressChange}
                                                    required
                                                    maxLength="255"
                                                    placeholder="Enter village"
                                                />
                                            </div>
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="editDetail" className="form-label">
                                                Detail
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="editDetail"
                                                name="detail"
                                                value={editAddressForm.detail}
                                                onChange={handleEditAddressChange}
                                                required
                                                maxLength="255"
                                                placeholder="Enter address details"
                                            />
                                        </div>
                                        <div className="d-flex gap-2">
                                            <button type="submit" className="btn btn-primary" disabled={updateAddressMutation.isLoading}>
                                                {updateAddressMutation.isLoading ? (
                                                    <>
                                                        <span
                                                            className="spinner-border spinner-border-sm me-2"
                                                            role="status"
                                                            aria-hidden="true"
                                                        ></span>
                                                        Updating...
                                                    </>
                                                ) : (
                                                    <>
                                                        <i className="bi bi-check-circle me-2"></i>
                                                        Update Address
                                                    </>
                                                )}
                                            </button>
                                            <button type="button" className="btn btn-secondary" onClick={handleCancelEdit}>
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}

                        {/* Addresses List */}
                        <div className="card mb-4">
                            <div className="card-header bg-light">
                                <h5 className="card-title mb-0">Your Addresses</h5>
                            </div>
                            <div className="card-body">
                                {isLoadingAddresses ? (
                                    <div className="d-flex justify-content-center my-3">
                                        <div className="spinner-border text-primary" role="status">
                                            <span className="visually-hidden">Loading addresses...</span>
                                        </div>
                                    </div>
                                ) : addressesData?.body?.length > 0 ? (
                                    <div className="table-responsive">
                                        <table className="table table-hover">
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
                                                                    className="btn btn-sm btn-info"
                                                                    onClick={() => handleViewAddressDetails(address)}
                                                                >
                                                                    <i className="bi bi-eye"></i> View
                                                                </button>
                                                                <button className="btn btn-sm btn-primary" onClick={() => handleEditAddress(address)}>
                                                                    <i className="bi bi-pencil-square"></i> Edit
                                                                </button>
                                                                <button
                                                                    className="btn btn-sm btn-danger"
                                                                    onClick={() => handleDeleteAddress(address.id)}
                                                                    disabled={deleteAddressMutation.isLoading}
                                                                >
                                                                    <i className="bi bi-trash"></i> Delete
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="alert alert-info">
                                        <i className="bi bi-info-circle me-2"></i>
                                        No addresses found. Add one using the form below.
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Add New Address Form */}
                        <div className="card">
                            <div className="card-header bg-light">
                                <h5 className="card-title mb-0">Add New Address</h5>
                            </div>
                            <div className="card-body">
                                <form onSubmit={handleAddAddressSubmit}>
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label htmlFor="nation" className="form-label">
                                                Nation
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="nation"
                                                name="nation"
                                                value={addressForm.nation}
                                                onChange={handleAddressChange}
                                                required
                                                maxLength="255"
                                                placeholder="Enter nation"
                                            />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label htmlFor="province" className="form-label">
                                                Province
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="province"
                                                name="province"
                                                value={addressForm.province}
                                                onChange={handleAddressChange}
                                                required
                                                maxLength="255"
                                                placeholder="Enter province"
                                            />
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label htmlFor="district" className="form-label">
                                                District
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="district"
                                                name="district"
                                                value={addressForm.district}
                                                onChange={handleAddressChange}
                                                required
                                                maxLength="255"
                                                placeholder="Enter district"
                                            />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label htmlFor="village" className="form-label">
                                                Village
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="village"
                                                name="village"
                                                value={addressForm.village}
                                                onChange={handleAddressChange}
                                                required
                                                maxLength="255"
                                                placeholder="Enter village"
                                            />
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="detail" className="form-label">
                                            Detail
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="detail"
                                            name="detail"
                                            value={addressForm.detail}
                                            onChange={handleAddressChange}
                                            required
                                            maxLength="255"
                                            placeholder="Enter address details"
                                        />
                                    </div>
                                    <button type="submit" className="btn btn-success" disabled={addAddressMutation.isLoading}>
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
