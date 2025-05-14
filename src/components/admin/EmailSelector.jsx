import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaSearch, FaUsers, FaTimes, FaCheck } from 'react-icons/fa';

import { API_ROOT } from '../../config';

export default function EmailSelector({ onSelect, onClose, multiple = false }) {
    const [search, setSearch] = useState('');
    const [selectedRole, setSelectedRole] = useState('all');
    const [selectedEmails, setSelectedEmails] = useState([]);
    const [emails, setEmails] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch emails based on role and search term
    useEffect(() => {
        const fetchEmails = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const searchParam = search ? `&search=${encodeURIComponent(search)}` : '';
                const response = await axios.get(`${API_ROOT}/admin/accounts/emails?group=${selectedRole}${searchParam}`, {
                    // const response = await axios.get(`http://localhost:9000/api/admin/accounts/emails?group=${selectedRole}${searchParam}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                });

                if (!response.data.status) {
                    throw new Error(response.data.message || 'Failed to fetch emails');
                }

                setEmails(response.data.body);
            } catch (error) {
                const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch emails';
                setError(errorMessage);
                toast.error(errorMessage);
            } finally {
                setIsLoading(false);
            }
        };

        fetchEmails();
    }, [selectedRole, search]);

    const toggleEmailSelection = (email) => {
        if (!multiple) {
            // Single selection mode
            onSelect([email]);
            onClose();
            return;
        }

        // Multiple selection mode
        setSelectedEmails(prevSelected => {
            const isAlreadySelected = prevSelected.some(e => e.email === email.email);

            if (isAlreadySelected) {
                return prevSelected.filter(e => e.email !== email.email);
            } else {
                return [...prevSelected, email];
            }
        });
    };

    const confirmSelection = () => {
        onSelect(selectedEmails);
        onClose();
    };

    const isEmailSelected = (email) => {
        return selectedEmails.some(e => e.email === email.email);
    };

    return (
        <div className="email-selector-overlay">
            <div className="email-selector-modal">
                <div className="email-selector-header">
                    <h4>Select Email{multiple ? 's' : ''}</h4>
                    <button className="admin-btn admin-btn-icon" onClick={onClose}>
                        <FaTimes />
                    </button>
                </div>

                <div className="email-selector-filters">
                    <div className="admin-search mb-3">
                        <FaSearch className="admin-search-icon" />
                        <input
                            type="text"
                            className="admin-form-control admin-search-input"
                            placeholder="Search by email or name..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="btn-group w-100">
                        <button
                            className={`admin-nav-link ${selectedRole === 'all' ? 'active' : ''}`}
                            onClick={() => setSelectedRole('all')}
                        >
                            <FaUsers className="me-2" />
                            All
                        </button>
                        <button
                            className={`admin-nav-link ${selectedRole === 'jobseekers' ? 'active' : ''}`}
                            onClick={() => setSelectedRole('jobseekers')}
                        >
                            Job Seekers
                        </button>
                        <button
                            className={`admin-nav-link ${selectedRole === 'employers' ? 'active' : ''}`}
                            onClick={() => setSelectedRole('employers')}
                        >
                            Employers
                        </button>
                        <button
                            className={`admin-nav-link ${selectedRole === 'admins' ? 'active' : ''}`}
                            onClick={() => setSelectedRole('admins')}
                        >
                            Admins
                        </button>
                        <button
                            className={`admin-nav-link ${selectedRole === 'inactive' ? 'active' : ''}`}
                            onClick={() => setSelectedRole('inactive')}
                        >
                            Inactive
                        </button>
                    </div>
                </div>

                <div className="email-selector-list">
                    {isLoading && (
                        <div className="text-center p-4">
                            <div className="spinner-border" role="status" />
                            <p className="mt-2 admin-subtitle">Loading emails...</p>
                        </div>
                    )}

                    {error && (
                        <div className="alert alert-danger m-3">
                            <FaTimes className="me-2" />
                            {error}
                        </div>
                    )}

                    {!isLoading && !error && emails?.length === 0 && (
                        <div className="text-center p-4">
                            <FaSearch className="text-muted mb-2" size={24} />
                            <p className="admin-subtitle">No emails found</p>
                        </div>
                    )}

                    {!isLoading && !error && emails?.length > 0 && (
                        <div className="list-group list-group-flush">
                            {emails.map((item) => (
                                <button
                                    key={item.email}
                                    className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center ${isEmailSelected(item) ? 'active' : ''
                                        }`}
                                    onClick={() => toggleEmailSelection(item)}
                                >
                                    <div>
                                        <div className="fw-medium">{item.email}</div>
                                        <small className="text-muted">
                                            {item.fullname || 'Unknown'} - {item.role}
                                        </small>
                                    </div>
                                    {isEmailSelected(item) && (
                                        <FaCheck className="text-success" />
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {multiple && (
                    <div className="email-selector-footer">
                        <div>
                            <small className="admin-subtitle">
                                Selected: {selectedEmails.length} email(s)
                            </small>
                        </div>
                        <div className="d-flex gap-2">
                            <button
                                className="admin-btn admin-btn-secondary"
                                onClick={onClose}
                            >
                                Cancel
                            </button>
                            <button
                                className="admin-btn"
                                onClick={confirmSelection}
                                disabled={selectedEmails.length === 0}
                            >
                                Confirm Selection
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}