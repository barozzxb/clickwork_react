import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import '../styles/admin-dashboard.css';

export default function SendEmail() {
    const [emailType, setEmailType] = useState("single");
    const queryClient = useQueryClient();

    const emailForm = useForm({
        defaultValues: { to: "", subject: "", body: "" },
    });

    const bulkEmailForm = useForm({
        defaultValues: { group: "", subject: "", body: "" },
    });

    const sendEmailMutation = useMutation({
        mutationFn: async (data) => await fetch('/api/admin/send-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }).then(res => res.json()),
        onSuccess: () => {
            alert("Email Sent: Your email has been sent successfully");
            queryClient.invalidateQueries({ queryKey: ['/api/admin/emails'] });
            emailForm.reset();
        },
        onError: (error) => {
            alert(`Error: Failed to send email: ${error.message}`);
        },
    });

    const sendBulkEmailMutation = useMutation({
        mutationFn: async (data) => await fetch('/api/admin/send-bulk-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }).then(res => res.json()),
        onSuccess: () => {
            alert("Bulk Email Sent: Your emails have been queued for delivery");
            queryClient.invalidateQueries({ queryKey: ['/api/admin/emails'] });
            bulkEmailForm.reset();
        },
        onError: (error) => {
            alert(`Error: Failed to send bulk email: ${error.message}`);
        },
    });

    const onSingleEmailSubmit = (data) => {
        sendEmailMutation.mutate(data);
    };

    const onBulkEmailSubmit = (data) => {
        sendBulkEmailMutation.mutate(data);
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
                                className={`nav-link ${emailType === "single" ? "active" : ""}`}
                                onClick={() => setEmailType("single")}
                            >
                                <i className="bi bi-envelope me-2"></i> Single Email
                            </button>
                        </li>
                        <li className="nav-item">
                            <button
                                className={`nav-link ${emailType === "bulk" ? "active" : ""}`}
                                onClick={() => setEmailType("bulk")}
                            >
                                <i className="bi bi-people me-2"></i> Bulk Email
                            </button>
                        </li>
                    </ul>

                    {emailType === "single" && (
                        <form onSubmit={emailForm.handleSubmit(onSingleEmailSubmit)} className="needs-validation">
                            <div className="mb-3">
                                <label htmlFor="recipient" className="form-label">Recipient Email</label>
                                <div className="input-group">
                                    <span className="input-group-text">
                                        <i className="bi bi-envelope"></i>
                                    </span>
                                    <input
                                        type="email"
                                        className={`form-control ${emailForm.formState.errors.to ? 'is-invalid' : ''}`}
                                        id="recipient"
                                        placeholder="user@example.com"
                                        {...emailForm.register("to", { required: "Email address is required" })}
                                    />
                                    {emailForm.formState.errors.to && (
                                        <div className="invalid-feedback">{emailForm.formState.errors.to.message}</div>
                                    )}
                                </div>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="subject" className="form-label">Subject</label>
                                <input
                                    type="text"
                                    className={`form-control ${emailForm.formState.errors.subject ? 'is-invalid' : ''}`}
                                    id="subject"
                                    placeholder="Email subject..."
                                    {...emailForm.register("subject", { required: "Subject is required" })}
                                />
                                {emailForm.formState.errors.subject && (
                                    <div className="invalid-feedback">{emailForm.formState.errors.subject.message}</div>
                                )}
                            </div>

                            <div className="mb-4">
                                <label htmlFor="message" className="form-label">Message</label>
                                <textarea
                                    className={`form-control ${emailForm.formState.errors.body ? 'is-invalid' : ''}`}
                                    id="message"
                                    rows="8"
                                    placeholder="Write your message here..."
                                    {...emailForm.register("body", { required: "Message is required" })}
                                ></textarea>
                                {emailForm.formState.errors.body && (
                                    <div className="invalid-feedback">{emailForm.formState.errors.body.message}</div>
                                )}
                            </div>

                            <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={sendEmailMutation.isPending}
                                >
                                    {sendEmailMutation.isPending ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            <i className="bi bi-send me-2"></i>
                                            Send Email
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    )}

                    {emailType === "bulk" && (
                        <form onSubmit={bulkEmailForm.handleSubmit(onBulkEmailSubmit)} className="needs-validation">
                            <div className="mb-3">
                                <label htmlFor="userGroup" className="form-label">User Group</label>
                                <div className="input-group">
                                    <span className="input-group-text">
                                        <i className="bi bi-people"></i>
                                    </span>
                                    <select
                                        className={`form-select ${bulkEmailForm.formState.errors.group ? 'is-invalid' : ''}`}
                                        id="userGroup"
                                        {...bulkEmailForm.register("group", { required: "User group is required" })}
                                    >
                                        <option value="">Select user group</option>
                                        <option value="all">All Users</option>
                                        <option value="jobseekers">Job Seekers</option>
                                        <option value="employers">Employers</option>
                                        <option value="admins">Administrators</option>
                                        <option value="inactive">Inactive Users</option>
                                    </select>
                                    {bulkEmailForm.formState.errors.group && (
                                        <div className="invalid-feedback">{bulkEmailForm.formState.errors.group.message}</div>
                                    )}
                                </div>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="bulkSubject" className="form-label">Subject</label>
                                <input
                                    type="text"
                                    className={`form-control ${bulkEmailForm.formState.errors.subject ? 'is-invalid' : ''}`}
                                    id="bulkSubject"
                                    placeholder="Email subject..."
                                    {...bulkEmailForm.register("subject", { required: "Subject is required" })}
                                />
                                {bulkEmailForm.formState.errors.subject && (
                                    <div className="invalid-feedback">{bulkEmailForm.formState.errors.subject.message}</div>
                                )}
                            </div>

                            <div className="mb-4">
                                <label htmlFor="bulkMessage" className="form-label">Message</label>
                                <textarea
                                    className={`form-control ${bulkEmailForm.formState.errors.body ? 'is-invalid' : ''}`}
                                    id="bulkMessage"
                                    rows="8"
                                    placeholder="Write your message here..."
                                    {...bulkEmailForm.register("body", { required: "Message is required" })}
                                ></textarea>
                                {bulkEmailForm.formState.errors.body && (
                                    <div className="invalid-feedback">{bulkEmailForm.formState.errors.body.message}</div>
                                )}
                            </div>

                            <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={sendBulkEmailMutation.isPending}
                                >
                                    {sendBulkEmailMutation.isPending ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            <i className="bi bi-send-check me-2"></i>
                                            Send Bulk Email
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}