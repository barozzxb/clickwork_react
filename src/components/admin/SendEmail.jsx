import { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { toast } from 'react-toastify';
import EmailSelector from './EmailSelector';
import './SendEmail.css';

import { API_ROOT } from '../../config';

export default function SendEmail() {
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
        <div className="container-fluid p-0">
            <div className="card shadow-sm">
                <div className="card-header bg-white py-3">
                    <h2 className="card-title h5 fw-bold mb-1">Send Email</h2>
                    <p className="text-muted small mb-0">Send emails to users of the job platform</p>
                </div>

                <div className="card-body">
                    <ul className="nav nav-tabs mb-4">
                        <li className="nav-item">
                            <button
                                className={`nav-link ${emailType === 'single' ? 'active' : ''}`}
                                onClick={() => setEmailType('single')}
                            >
                                <i className="bi bi-envelope me-2"></i> Single Email
                            </button>
                        </li>
                        <li className="nav-item">
                            <button
                                className={`nav-link ${emailType === 'bulk' ? 'active' : ''}`}
                                onClick={() => setEmailType('bulk')}
                            >
                                <i className="bi bi-people me-2"></i> Bulk Email
                            </button>
                        </li>
                    </ul>

                    <form onSubmit={handleSubmit(onSubmit)} className="needs-validation">
                        {emailType === 'single' && (
                            <div className="mb-3">
                                <label htmlFor="recipient" className="form-label">Recipient Email</label>
                                <div className="input-group">
                                    <span className="input-group-text">
                                        <i className="bi bi-envelope"></i>
                                    </span>
                                    <input
                                        type="text"
                                        className={`form-control ${errors.to ? 'is-invalid' : ''}`}
                                        id="recipient"
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
                                        className="btn btn-primary"
                                        onClick={() => setShowEmailSelector(true)}
                                    >
                                        <i className="bi bi-search"></i>
                                    </button>
                                    {errors.to && (
                                        <div className="invalid-feedback">{errors.to.message}</div>
                                    )}
                                </div>
                                {selectedEmails.length > 0 && (
                                    <div className="selected-emails mt-2">
                                        <div className="d-flex flex-wrap gap-1">
                                            {selectedEmails.map(email => (
                                                <div key={email.email} className="badge bg-primary d-flex align-items-center">
                                                    <span>{email.email}</span>
                                                    <button
                                                        type="button"
                                                        className="btn-close btn-close-white ms-2"
                                                        onClick={() => {
                                                            const newSelection = selectedEmails.filter(e => e.email !== email.email);
                                                            handleEmailSelection(newSelection);
                                                        }}
                                                    ></button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {emailType === 'bulk' && (
                            <div className="mb-3">
                                <label htmlFor="userGroup" className="form-label">User Group</label>
                                <div className="input-group">
                                    <span className="input-group-text">
                                        <i className="bi bi-people"></i>
                                    </span>
                                    <select
                                        className={`form-select ${errors.group ? 'is-invalid' : ''}`}
                                        id="userGroup"
                                        {...register('group', { required: 'User group is required' })}
                                    >
                                        <option value="">Select user group</option>
                                        <option value="all">All Users</option>
                                        <option value="jobseekers">Job Seekers</option>
                                        <option value="employers">Employers</option>
                                        <option value="admins">Administrators</option>
                                        <option value="inactive">Inactive Users</option>
                                    </select>
                                    {errors.group && (
                                        <div className="invalid-feedback">{errors.group.message}</div>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="mb-3">
                            <label htmlFor="subject" className="form-label">Subject</label>
                            <input
                                type="text"
                                className={`form-control ${errors.subject ? 'is-invalid' : ''}`}
                                id="subject"
                                placeholder="Email subject..."
                                {...register('subject', { required: 'Subject is required' })}
                            />
                            {errors.subject && (
                                <div className="invalid-feedback">{errors.subject.message}</div>
                            )}
                        </div>

                        <div className="mb-4">
                            <label htmlFor="message" className="form-label">Message</label>
                            <textarea
                                className={`form-control ${errors.body ? 'is-invalid' : ''}`}
                                id="message"
                                rows="8"
                                placeholder="Write your message here..."
                                {...register('body', { required: 'Message is required' })}
                            ></textarea>
                            {errors.body && (
                                <div className="invalid-feedback">{errors.body.message}</div>
                            )}
                        </div>

                        <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={isSending}
                            >
                                {isSending ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <i className="bi bi-send me-2"></i>
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