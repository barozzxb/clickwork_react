import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaUserShield, FaSpinner, FaEnvelope, FaLock, FaUser } from 'react-icons/fa';

import { API_ROOT } from '../../config';
import '../../styles/admin.css';

export default function AdminForm({ onClose, onAdminCreated }) {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
        role: 'ADMIN'
    });

    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.username.trim()) {
            newErrors.username = 'Username is required';
        } else if (formData.username.length < 3) {
            newErrors.username = 'Username must be at least 3 characters';
        }

        if (!formData.password.trim()) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            const response = await axios.post(
                // `${API_ROOT}/admin/accounts/admin`,
                `${API_ROOT}/admin/accounts/admin`,
                formData,
                {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                }
            );

            if (response.data.status) {
                toast.success('Admin account created successfully');
                if (onAdminCreated) {
                    onAdminCreated(response.data.body);
                }
                onClose();
            } else {
                toast.error(response.data.message || 'Failed to create admin account');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'An error occurred while creating the admin account');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="admin-modal-content">
            <div className="admin-modal-header">
                <h5 className="admin-title">Create New Admin Account</h5>
                <button type="button" className="btn-close" onClick={onClose}></button>
            </div>

            <div className="admin-modal-body">
                <div className="admin-form-container">
                    <div className="admin-form-icon">
                        <FaUserShield />
                    </div>
                    <p className="admin-subtitle text-center mb-4">
                        Create a new administrator account with full system access
                    </p>

                    <form onSubmit={handleSubmit}>
                        <div className="admin-form-group">
                            <label className="admin-form-label" htmlFor="username">
                                <FaUser className="me-2" />
                                Username
                            </label>
                            <input
                                type="text"
                                className={`admin-form-control ${errors.username ? 'is-invalid' : ''}`}
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="Enter username"
                                required
                            />
                            {errors.username && (
                                <div className="admin-form-error">{errors.username}</div>
                            )}
                        </div>

                        <div className="admin-form-group">
                            <label className="admin-form-label" htmlFor="email">
                                <FaEnvelope className="me-2" />
                                Email
                            </label>
                            <input
                                type="email"
                                className={`admin-form-control ${errors.email ? 'is-invalid' : ''}`}
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter email address"
                                required
                            />
                            {errors.email && (
                                <div className="admin-form-error">{errors.email}</div>
                            )}
                        </div>

                        <div className="admin-form-group">
                            <label className="admin-form-label" htmlFor="password">
                                <FaLock className="me-2" />
                                Password
                            </label>
                            <input
                                type="password"
                                className={`admin-form-control ${errors.password ? 'is-invalid' : ''}`}
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter password"
                                required
                            />
                            {errors.password && (
                                <div className="admin-form-error">{errors.password}</div>
                            )}
                            <div className="admin-form-help">
                                Password must be at least 6 characters long
                            </div>
                        </div>

                        <div className="admin-form-group">
                            <label className="admin-form-label">
                                <FaUserShield className="me-2" />
                                Role
                            </label>
                            <div className="admin-form-control bg-light">
                                ADMIN
                                <div className="admin-form-help mt-1">
                                    This account will have full administrative privileges
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            <div className="admin-modal-footer">
                <button
                    type="button"
                    className="admin-btn admin-btn-secondary"
                    onClick={onClose}
                    disabled={isLoading}
                >
                    Cancel
                </button>
                <button
                    type="button"
                    className="admin-btn"
                    onClick={handleSubmit}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <FaSpinner className="admin-spinner" />
                            Creating...
                        </>
                    ) : (
                        <>
                            <FaUserShield />
                            Create Admin Account
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}