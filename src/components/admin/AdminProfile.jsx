import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import axios from 'axios';

import { API_ROOT, BACK_END_HOST } from '../../config';

const AdminProfile = () => {
    const queryClient = useQueryClient();
    const [activeTab, setActiveTab] = useState('profile');
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [avatarFile, setAvatarFile] = useState(null);

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

    // Fetch admin profile data
    const { data: profileData, isLoading, error } = useQuery({
        queryKey: ['adminProfile'],
        queryFn: async () => {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_ROOT}/admin/profile`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        }
    });

    // Fetch addresses
    const { data: addressesData, isLoading: isLoadingAddresses } = useQuery({
        queryKey: ['adminAddresses'],
        queryFn: async () => {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_ROOT}/admin/profile/addresses`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        }
    });

    // Update profile mutation
    const updateProfileMutation = useMutation({
        mutationFn: async () => {
            const token = localStorage.getItem('token');
            const formData = new FormData();
            formData.append('fullname', profileForm.fullname);
            formData.append('phonenum', profileForm.phonenum);
            if (avatarFile) {
                formData.append('avatar', avatarFile);
            }

            return axios.put(`${API_ROOT}/admin/profile/update`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['adminProfile']);
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
            return axios.put(`${API_ROOT}/admin/profile/change-password`, {
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
            return axios.post(`${API_ROOT}/admin/profile/address`, addressForm, {
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
            toast.error(`Failed to add address: ${error.response?.data?.message || error.message}`);
        }
    });

    // Update address mutation
    const updateAddressMutation = useMutation({
        mutationFn: async () => {
            const token = localStorage.getItem('token');
            return axios.put(`${API_ROOT}/admin/profile/address/${editAddressForm.id}`, {
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
            toast.error(`Failed to update address: ${error.response?.data?.message || error.message}`);
        }
    });

    // Delete address mutation
    const deleteAddressMutation = useMutation({
        mutationFn: async (addressId) => {
            const token = localStorage.getItem('token');
            return axios.delete(`${API_ROOT}/admin/profile/address/${addressId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['adminAddresses']);
            toast.success('Address deleted successfully');
        },
        onError: (error) => {
            toast.error(`Failed to delete address: ${error.response?.data?.message || error.message}`);
        }
    });

    // Initialize form with profile data when loaded
    useEffect(() => {
        if (profileData?.data) {
            setProfileForm({
                fullname: profileData.data.fullname || '',
                phonenum: profileData.data.phonenum || ''
            });

            // Set avatar preview with proper URL handling
            if (profileData.data.avatar) {
                // Check if the avatar is a full URL or just a path
                const avatarUrl = profileData.data.avatar.startsWith('http')
                    ? profileData.data.avatar
                    : `${BACK_END_HOST}${profileData.data.avatar}`;
                setAvatarPreview(avatarUrl);
            }
        }
    }, [profileData]);

    // Handle avatar file change
    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];
            if (!validTypes.includes(file.type)) {
                toast.error('Please select a valid image file (JPEG, PNG, GIF)');
                return;
            }

            // Validate file size (2MB max)
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
            nation: address.nation,
            province: address.province,
            district: address.district,
            village: address.village,
            detail: address.detail
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
        return <div className="container mt-5"><div className="text-center">Loading profile...</div></div>;
    }

    if (error) {
        return <div className="container mt-5"><div className="alert alert-danger">Error loading profile: {error.message}</div></div>;
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
                                                src={avatarPreview || '/assets/default-avatar.png'}
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
                                                    e.target.src = 'https://via.placeholder.com/150?text=No+Image';
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="avatar" className="btn btn-outline-primary">
                                            Change Avatar
                                        </label>
                                        <input
                                            type="file"
                                            id="avatar"
                                            accept="image/*"
                                            style={{ display: 'none' }}
                                            onChange={handleAvatarChange}
                                        />
                                    </div>
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
                                            value={profileData?.data?.username || ''}
                                            disabled
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="email" className="form-label">Email</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            id="email"
                                            value={profileData?.data?.email || ''}
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
                                            placeholder="Enter your phone number"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={updateProfileMutation.isLoading}
                                    >
                                        {updateProfileMutation.isLoading ? 'Saving...' : 'Save Changes'}
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
                                    pattern="^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$"
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
                                {changePasswordMutation.isLoading ? 'Changing Password...' : 'Change Password'}
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
                            <div className="card mb-4">
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
                                            />
                                        </div>
                                        <div className="d-flex gap-2">
                                            <button
                                                type="submit"
                                                className="btn btn-primary"
                                                disabled={updateAddressMutation.isLoading}
                                            >
                                                {updateAddressMutation.isLoading ? 'Updating...' : 'Update Address'}
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
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="btn btn-success"
                                        disabled={addAddressMutation.isLoading}
                                    >
                                        {addAddressMutation.isLoading ? 'Adding...' : 'Add Address'}
                                    </button>
                                </form>
                            </div>
                        </div>

                        {/* Addresses List */}
                        <h5 className="card-title">Your Addresses</h5>
                        {isLoadingAddresses ? (
                            <div className="text-center">Loading addresses...</div>
                        ) : addressesData?.data?.length ? (
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
                                        {addressesData.data.map((address) => (
                                            <tr key={address.id}>
                                                <td>{address.nation}</td>
                                                <td>{address.province}</td>
                                                <td>{address.district}</td>
                                                <td>{address.village}</td>
                                                <td>{address.detail}</td>
                                                <td>
                                                    <div className="d-flex gap-2">
                                                        <button
                                                            className="btn btn-sm btn-primary"
                                                            onClick={() => handleEditAddress(address)}
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            className="btn btn-sm btn-danger"
                                                            onClick={() => handleDeleteAddress(address.id)}
                                                            disabled={deleteAddressMutation.isLoading}
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="alert alert-info">No addresses found. Add one using the form above.</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminProfile;