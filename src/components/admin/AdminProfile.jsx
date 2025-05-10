import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import axios from 'axios';

const AdminProfile = () => {
    const queryClient = useQueryClient();
    const [activeTab, setActiveTab] = useState('profile');
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [avatarFile, setAvatarFile] = useState(null);
    const baseUrl = 'http://localhost:9000';
    const editFormRef = useRef(null);

    // Profile form state
    const [profileForm, setProfileForm] = useState({
        fullname: '',
        phonenum: ''
    });

    // Password form state
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    // Address form state
    const [addressForm, setAddressForm] = useState({
        nation: '',
        province: '',
        district: '',
        village: '',
        detail: ''
    });

    // Edit address form state
    const [editAddressForm, setEditAddressForm] = useState({
        id: null,
        nation: '',
        province: '',
        district: '',
        village: '',
        detail: ''
    });

    // Helper function to format avatar URL
    const formatAvatarUrl = (avatarPath) => {
        if (!avatarPath) return '/assets/no-image.png';
        return avatarPath.startsWith('http') ? avatarPath : `${baseUrl}${avatarPath.startsWith('/') ? '' : '/'}${avatarPath}`;
    };

    // Fetch admin profile data
    const { data: profileData, isLoading, error } = useQuery({
        queryKey: ['adminProfile'],
        queryFn: async () => {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('No authentication token found');
            const response = await axios.get(`${baseUrl}/api/admin/profile`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log('Profile data fetched:', response.data);
            return response.data;
        }
    });

    // Fetch addresses
    const { data: addressesData, isLoading: isLoadingAddresses, refetch: refetchAddresses } = useQuery({
        queryKey: ['adminAddresses'],
        queryFn: async () => {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('No authentication token found');
            const response = await axios.get(`${baseUrl}/api/admin/profile/addresses`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log('Addresses fetched:', response.data);
            return response.data;
        }
    });

    // Initialize form with profile data when loaded
    useEffect(() => {
        if (profileData?.success && profileData?.data) {
            console.log('Setting profile form with:', profileData.data);
            setProfileForm({
                fullname: profileData.data.fullname || '',
                phonenum: profileData.data.phonenum || ''
            });
            if (profileData.data.avatar) {
                setAvatarPreview(formatAvatarUrl(profileData.data.avatar));
            }
        }
    }, [profileData]);

    // Effect to refetch addresses when tab changes and scroll to edit form
    useEffect(() => {
        if (activeTab === 'addresses') {
            refetchAddresses();
        }
        if (editAddressForm.id && editFormRef.current) {
            editFormRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [activeTab, editAddressForm.id, refetchAddresses]);

    // Update profile mutation
    const updateProfileMutation = useMutation({
        mutationFn: async () => {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('No authentication token found');
            if (!profileForm.fullname || profileForm.fullname.trim() === '') {
                throw new Error('Full name is required');
            }
            if (profileForm.fullname.length > 255) {
                throw new Error('Full name cannot exceed 255 characters');
            }
            if (profileForm.phonenum && !/^\d{10,15}$/.test(profileForm.phonenum)) {
                throw new Error('Phone number must be 10-15 digits');
            }

            const formData = new FormData();
            formData.append('fullname', profileForm.fullname);
            if (profileForm.phonenum) formData.append('phonenum', profileForm.phonenum);
            if (avatarFile) formData.append('avatar', avatarFile);

            return axios.put(`${baseUrl}/api/admin/profile/update`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
        },
        onSuccess: (response) => {
            queryClient.invalidateQueries(['adminProfile']);
            setProfileForm({
                fullname: response.data.body.fullname,
                phonenum: response.data.body.phonenum || ''
            });
            if (response?.data?.body?.avatar) {
                setAvatarPreview(formatAvatarUrl(response.data.body.avatar));
            }
            setAvatarFile(null);
            toast.success('Profile updated successfully');
        },
        onError: (error) => {
            toast.error(`Failed to update profile: ${error.response?.data?.message || error.message}`);
        }
    });

    // Change password mutation
    const changePasswordMutation = useMutation({
        mutationFn: async () => {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('No authentication token found');
            if (!passwordForm.currentPassword) {
                throw new Error('Current password is required');
            }
            if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(passwordForm.newPassword)) {
                throw new Error('New password must be at least 8 characters with at least one letter and one number');
            }

            return axios.put(`${baseUrl}/api/admin/profile/change-password`, {
                currentPassword: passwordForm.currentPassword,
                newPassword: passwordForm.newPassword
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
        },
        onSuccess: () => {
            toast.success('Password changed successfully');
            setPasswordForm({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        },
        onError: (error) => {
            toast.error(`Failed to change password: ${error.response?.data?.message || error.message}`);
        }
    });

    // Add address mutation
    const addAddressMutation = useMutation({
        mutationFn: async () => {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('No authentication token found');
            for (const [key, value] of Object.entries(addressForm)) {
                if (!value || value.trim() === '') {
                    throw new Error(`${key.charAt(0).toUpperCase() + key.slice(1)} is required`);
                }
                if (value.length > 255) {
                    throw new Error(`${key.charAt(0).toUpperCase() + key.slice(1)} cannot exceed 255 characters`);
                }
            }
            console.log('Adding address with data:', addressForm);
            return axios.post(`${baseUrl}/api/admin/profile/address`, addressForm, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['adminAddresses']);
            toast.success('Address added successfully');
            setAddressForm({
                nation: '',
                province: '',
                district: '',
                village: '',
                detail: ''
            });
        },
        onError: (error) => {
            console.error('Error adding address:', error);
            toast.error(`Failed to add address: ${error.response?.data?.message || error.message}`);
        }
    });

    // Update address mutation
    const updateAddressMutation = useMutation({
        mutationFn: async () => {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('No authentication token found');
            for (const [key, value] of Object.entries(editAddressForm)) {
                if (key === 'id') continue;
                if (!value || value.trim() === '') {
                    throw new Error(`${key.charAt(0).toUpperCase() + key.slice(1)} is required`);
                }
                if (value.length > 255) {
                    throw new Error(`${key.charAt(0).toUpperCase() + key.slice(1)} cannot exceed 255 characters`);
                }
            }
            console.log('Updating address with data:', editAddressForm);
            return axios.put(`${baseUrl}/api/admin/profile/address/${editAddressForm.id}`, {
                nation: editAddressForm.nation,
                province: editAddressForm.province,
                district: editAddressForm.district,
                village: editAddressForm.village,
                detail: editAddressForm.detail
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['adminAddresses']);
            toast.success('Address updated successfully');
            setEditAddressForm({
                id: null,
                nation: '',
                province: '',
                district: '',
                village: '',
                detail: ''
            });
        },
        onError: (error) => {
            console.error('Error updating address:', error);
            toast.error(`Failed to update address: ${error.response?.data?.message || error.message}`);
        }
    });

    // Delete address mutation
    const deleteAddressMutation = useMutation({
        mutationFn: async (addressId) => {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('No authentication token found');
            console.log('Deleting address with ID:', addressId);
            return axios.delete(`${baseUrl}/api/admin/profile/address/${addressId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['adminAddresses']);
            toast.success('Address deleted successfully');
        },
        onError: (error) => {
            console.error('Error deleting address:', error);
            toast.error(`Failed to delete address: ${error.response?.data?.message || error.message}`);
        }
    });

    // Handle avatar file change
    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];
            if (!validTypes.includes(file.type)) {
                toast.error('Please select a valid image file (JPEG, PNG, GIF, JPG)');
                return;
            }
            if (file.size > 2 * 1024 * 1024) {
                toast.error('Image size should be less than 2MB');
                return;
            }
            setAvatarFile(file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    // Handle profile form change
    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setProfileForm(prev => ({ ...prev, [name]: value }));
    };

    // Handle password form change
    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordForm(prev => ({ ...prev, [name]: value }));
    };

    // Handle address form change
    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setAddressForm(prev => ({ ...prev, [name]: value }));
    };

    // Handle edit address form change
    const handleEditAddressChange = (e) => {
        const { name, value } = e.target;
        setEditAddressForm(prev => ({ ...prev, [name]: value }));
    };

    // Handle profile update submission
    const handleProfileSubmit = (e) => {
        e.preventDefault();
        updateProfileMutation.mutate();
    };

    // Handle password change submission
    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            toast.error('New passwords do not match');
            return;
        }
        changePasswordMutation.mutate();
    };

    // Handle add address submission
    const handleAddAddressSubmit = (e) => {
        e.preventDefault();
        addAddressMutation.mutate();
    };

    // Handle update address submission
    const handleUpdateAddressSubmit = (e) => {
        e.preventDefault();
        updateAddressMutation.mutate();
    };

    // Handle address deletion
    const handleDeleteAddress = (addressId) => {
        if (window.confirm('Are you sure you want to delete this address?')) {
            deleteAddressMutation.mutate(addressId);
        }
    };

    // Handle edit address
    const handleEditAddress = (address) => {
        setEditAddressForm({
            id: address.id,
            nation: address.nation || '',
            province: address.province || '',
            district: address.district || '',
            village: address.village || '',
            detail: address.detail || ''
        });
    };

    // Cancel edit address
    const handleCancelEdit = () => {
        setEditAddressForm({
            id: null,
            nation: '',
            province: '',
            district: '',
            village: '',
            detail: ''
        });
    };

    if (isLoading) {
        return (
            <div className="container mt-5">
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading profile...</span>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mt-5">
                <div className="alert alert-danger">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    Error loading profile: {error.message}
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-4 mb-5">
            <h2 className="mb-4">Admin Profile</h2>

            <ul className="nav nav-tabs mb-4">
                <li className="nav-item">
                    <button
                        className={`nav-link ${activeTab === 'profile' ? 'active' : ''}`}
                        onClick={() => setActiveTab('profile')}
                    >
                        Profile
                    </button>
                </li>
                <li className="nav-item">
                    <button
                        className={`nav-link ${activeTab === 'security' ? 'active' : ''}`}
                        onClick={() => setActiveTab('security')}
                    >
                        Security
                    </button>
                </li>
                <li className="nav-item">
                    <button
                        className={`nav-link ${activeTab === 'addresses' ? 'active' : ''}`}
                        onClick={() => setActiveTab('addresses')}
                    >
                        Addresses
                    </button>
                </li>
            </ul>

            {/* Profile Tab */}
            {activeTab === 'profile' && (
                <div className="card">
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-3 text-center">
                                <div className="mb-3">
                                    <div className="avatar-container mb-3">
                                        <div className="position-relative" style={{ width: '150px', height: '150px', margin: '0 auto' }}>
                                            <img
                                                src={avatarPreview || '/assets/no-image.png'}
                                                alt="Profile Avatar"
                                                className="rounded-circle img-thumbnail"
                                                style={{
                                                    width: '150px',
                                                    height: '150px',
                                                    objectFit: 'cover',
                                                    border: '1px solid #dee2e6'
                                                }}
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = '/assets/no-image.png';
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
                                            style={{ display: 'none' }}
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
                                        <label htmlFor="username" className="form-label">Username</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="username"
                                            value={profileData?.body?.username || ''}
                                            disabled
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="email" className="form-label">Email</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            id="email"
                                            value={profileData?.body?.email || ''}
                                            disabled
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="fullname" className="form-label">Full Name</label>
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
                                        <label htmlFor="phonenum" className="form-label">Phone Number</label>
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
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={updateProfileMutation.isLoading}
                                    >
                                        {updateProfileMutation.isLoading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Saving...
                                            </>
                                        ) : (
                                            'Save Changes'
                                        )}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
                <div className="card">
                    <div className="card-body">
                        <h4 className="card-title">Change Password</h4>
                        <form onSubmit={handlePasswordSubmit}>
                            <div className="mb-3">
                                <label htmlFor="currentPassword" className="form-label">Current Password</label>
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
                                <label htmlFor="newPassword" className="form-label">New Password</label>
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
                                <div className="form-text">Password must be at least 8 characters with at least one letter and one number</div>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="confirmPassword" className="form-label">Confirm New Password</label>
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
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={changePasswordMutation.isLoading}
                            >
                                {changePasswordMutation.isLoading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        Changing Password...
                                    </>
                                ) : (
                                    'Change Password'
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Addresses Tab */}
            {activeTab === 'addresses' && (
                <div className="card">
                    <div className="card-body">
                        <h4 className="card-title mb-4">Manage Addresses</h4>

                        {/* Edit Address Form */}
                        {editAddressForm.id && (
                            <div className="card mb-4 bg-light" ref={editFormRef}>
                                <div className="card-body">
                                    <h5 className="card-title">Edit Address</h5>
                                    <form onSubmit={handleUpdateAddressSubmit}>
                                        <div className="row">
                                            <div className="col-md-6 mb-3">
                                                <label htmlFor="editNation" className="form-label">Nation</label>
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
                                                <label htmlFor="editProvince" className="form-label">Province</label>
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
                                                <label htmlFor="editDistrict" className="form-label">District</label>
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
                                                <label htmlFor="editVillage" className="form-label">Village</label>
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
                                            <label htmlFor="editDetail" className="form-label">Detail</label>
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
                                            <button
                                                type="submit"
                                                className="btn btn-primary"
                                                disabled={updateAddressMutation.isLoading}
                                            >
                                                {updateAddressMutation.isLoading ? (
                                                    <>
                                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                        Updating...
                                                    </>
                                                ) : (
                                                    'Update Address'
                                                )}
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-secondary"
                                                onClick={handleCancelEdit}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}

                        {/* Add New Address Form */}
                        <div className="card mb-4">
                            <div className="card-body">
                                <h5 className="card-title">Add New Address</h5>
                                <form onSubmit={handleAddAddressSubmit}>
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label htmlFor="nation" className="form-label">Nation</label>
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
                                            <label htmlFor="province" className="form-label">Province</label>
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
                                            <label htmlFor="district" className="form-label">District</label>
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
                                            <label htmlFor="village" className="form-label">Village</label>
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
                                        <label htmlFor="detail" className="form-label">Detail</label>
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
                                    <button
                                        type="submit"
                                        className="btn btn-success"
                                        disabled={addAddressMutation.isLoading}
                                    >
                                        {addAddressMutation.isLoading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Adding...
                                            </>
                                        ) : (
                                            'Add Address'
                                        )}
                                    </button>
                                </form>
                            </div>
                        </div>

                        {/* Addresses List */}
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Your Addresses</h5>
                                {isLoadingAddresses ? (
                                    <div className="d-flex justify-content-center my-3">
                                        <div className="spinner-border text-primary" role="status">
                                            <span className="visually-hidden">Loading addresses...</span>
                                        </div>
                                    </div>
                                ) : addressesData?.success && addressesData?.body?.length > 0 ? (
                                    <div className="table-responsive">
                                        <table className="table table-hover">
                                            <thead>
                                                <tr>
                                                    <th>Nation</th>
                                                    <th>Province</th>
                                                    <th>District</th>
                                                    <th>Village</th>
                                                    <th>Detail</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {addressesData.body.map((address) => (
                                                    <tr key={address.id}>
                                                        <td>{address.nation || 'N/A'}</td>
                                                        <td>{address.province || 'N/A'}</td>
                                                        <td>{address.district || 'N/A'}</td>
                                                        <td>{address.village || 'N/A'}</td>
                                                        <td>{address.detail || 'N/A'}</td>
                                                        <td>
                                                            <div className="d-flex gap-2">
                                                                <button
                                                                    className="btn btn-sm btn-primary"
                                                                    onClick={() => handleEditAddress(address)}
                                                                >
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
                                        No addresses found. Add one using the form above.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminProfile;