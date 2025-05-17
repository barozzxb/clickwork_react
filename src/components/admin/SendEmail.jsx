import { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { toast } from 'react-toastify';
import EmailSelector from './EmailSelector';
import { FaEnvelope, FaUsers, FaSearch, FaPaperPlane } from 'react-icons/fa';
import './SendEmail.css';

import { API_ROOT } from '../../config';

export default function SendEmail() {
    // const API_ROOT = 'http://localhost:9000/api';

    const [emailType, setEmailType] = useState('single');
    const [showEmailSelector, setShowEmailSelector] = useState(false);
    const [selectedEmails, setSelectedEmails] = useState([]);
    const [isSending, setIsSending] = useState(false);

    const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm({
        defaultValues: {
            to: '',
            group: '',
            subject: '',
            body: ''
        },
    });

    const sendEmail = async (payload) => {
        try {
            const response = await axios.post(`${API_ROOT}/admin/accounts/send-email`, payload, {
                // const response = await axios.post('http://localhost:9000/api/admin/accounts/send-email', payload, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (!response.data.status) {
                throw new Error(response.data.message || 'Failed to send email');
            }

            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Failed to send email';
            throw new Error(errorMessage);
        }
    };

    const onSubmit = async (data) => {
        setIsSending(true);
        try {
            if (emailType === 'single') {
                if (selectedEmails.length === 0 && !data.to) {
                    toast.error('Please provide an email address or select recipients');
                    return;
                }

                if (selectedEmails.length > 0) {
                    // Send multiple emails
                    const emailPromises = selectedEmails.map(emailObj => {
                        const singleEmailPayload = {
                            to: emailObj.email,
                            subject: data.subject,
                            body: data.body,
                        };
                        return sendEmail(singleEmailPayload);
                    });

                    await Promise.all(emailPromises);
                    toast.success(`Successfully sent ${selectedEmails.length} email(s)`);
                } else {
                    // Send single email
                    await sendEmail({
                        to: data.to,
                        subject: data.subject,
                        body: data.body,
                    });
                    toast.success('Email sent successfully');
                }
            } else {
                // Bulk email
                if (!data.group) {
                    toast.error('Please select a user group');
                    return;
                }

                await sendEmail({
                    group: data.group,
                    subject: data.subject,
                    body: data.body,
                });
                toast.success('Bulk emails have been queued for delivery');
            }

            reset();
            setSelectedEmails([]);
        } catch (error) {
            toast.error(`Error: ${error.message}`);
        } finally {
            setIsSending(false);
        }
    };

    const handleEmailSelection = (emails) => {
        setSelectedEmails(emails);

        if (emails.length === 1) {
            setValue('to', emails[0].email);
        } else if (emails.length > 1) {
            setValue('to', `Multiple Recipients (${emails.length})`);
        } else {
            setValue('to', '');
        }
    };

    return (
        <div className="admin-container">
            <div className="admin-card">
                <div className="admin-card-header">
                    <h2 className="admin-title">Send Email</h2>
                    <p className="admin-subtitle">Send emails to users of the job platform</p>
                </div>

                <div className="admin-card-body p-4">
                    <div className="nav nav-pills mb-4">
                        <button
                            className={`admin-nav-link me-2 ${emailType === 'single' ? 'active' : ''}`}
                            onClick={() => setEmailType('single')}
                        >
                            <FaEnvelope className="me-2" />
                            Single Email
                        </button>
                        <button
                            className={`admin-nav-link ${emailType === 'bulk' ? 'active' : ''}`}
                            onClick={() => setEmailType('bulk')}
                        >
                            <FaUsers className="me-2" />
                            Bulk Email
                        </button>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="needs-validation">
                        {emailType === 'single' && (
                            <div className="admin-form-group">
                                <label className="admin-form-label">Recipient Email</label>
                                <div className="input-group">
                                    <span className="input-group-text">
                                        <FaEnvelope />
                                    </span>
                                    <input
                                        type="text"
                                        className={`admin-form-control ${errors.to ? 'is-invalid' : ''}`}
                                        placeholder="user@example.com"
                                        readOnly={selectedEmails.length > 0}
                                        {...register('to', {
                                            validate: value => {
                                                if (selectedEmails.length > 0) return true;
                                                if (!value) return 'Email address is required';
                                                const emailRegex = /^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$/;
                                                return emailRegex.test(value) || 'Invalid email format';
                                            },
                                        })}
                                    />
                                    <button
                                        type="button"
                                        className="admin-btn"
                                        onClick={() => setShowEmailSelector(true)}
                                    >
                                        <FaSearch />
                                    </button>
                                </div>
                                {errors.to && (
                                    <div className="admin-form-error">{errors.to.message}</div>
                                )}
                                {selectedEmails.length > 0 && (
                                    <div className="selected-emails">
                                        <div className="d-flex flex-wrap gap-2">
                                            {selectedEmails.map(email => (
                                                <div key={email.email} className="admin-badge admin-badge-primary">
                                                    {email.email}
                                                    <button
                                                        type="button"
                                                        className="btn-close ms-2"
                                                        onClick={() => {
                                                            const newSelection = selectedEmails.filter(e => e.email !== email.email);
                                                            handleEmailSelection(newSelection);
                                                        }}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {emailType === 'bulk' && (
                            <div className="admin-form-group">
                                <label className="admin-form-label">User Group</label>
                                <div className="input-group">
                                    <span className="input-group-text">
                                        <FaUsers />
                                    </span>
                                    <select
                                        className={`admin-form-control ${errors.group ? 'is-invalid' : ''}`}
                                        {...register('group', { required: 'User group is required' })}
                                    >
                                        <option value="">Select user group</option>
                                        <option value="all">All Users</option>
                                        <option value="jobseekers">Job Seekers</option>
                                        <option value="employers">Employers</option>
                                        <option value="admins">Administrators</option>
                                        <option value="inactive">Inactive Users</option>
                                    </select>
                                </div>
                                {errors.group && (
                                    <div className="admin-form-error">{errors.group.message}</div>
                                )}
                            </div>
                        )}

                        <div className="admin-form-group">
                            <label className="admin-form-label">Subject</label>
                            <input
                                type="text"
                                className={`admin-form-control ${errors.subject ? 'is-invalid' : ''}`}
                                placeholder="Email subject..."
                                {...register('subject', { required: 'Subject is required' })}
                            />
                            {errors.subject && (
                                <div className="admin-form-error">{errors.subject.message}</div>
                            )}
                        </div>

                        <div className="admin-form-group">
                            <label className="admin-form-label">Message</label>
                            <textarea
                                className={`admin-form-control ${errors.body ? 'is-invalid' : ''}`}
                                rows="8"
                                placeholder="Write your message here..."
                                {...register('body', { required: 'Message is required' })}
                            />
                            {errors.body && (
                                <div className="admin-form-error">{errors.body.message}</div>
                            )}
                        </div>

                        <div className="d-flex justify-content-end mt-4">
                            <button
                                type="submit"
                                className="admin-btn"
                                disabled={isSending}
                            >
                                {isSending ? (
                                    <>
                                        <div className="spinner-border spinner-border-sm me-2" role="status" />
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <FaPaperPlane className="me-2" />
                                        {emailType === 'single' ? 'Send Email' : 'Send Bulk Email'}
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {showEmailSelector && (
                <EmailSelector
                    onSelect={handleEmailSelection}
                    onClose={() => setShowEmailSelector(false)}
                    multiple={true}
                />
            )}
        </div>
    );
}