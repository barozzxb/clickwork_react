import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AtSignIcon, SendIcon, UsersIcon } from 'lucide-react';
import '../styles/admin-dashboard.css';

const emailFormSchema = z.object({
    to: z.string().email("Invalid email address"),
    subject: z.string().min(3, "Subject must be at least 3 characters long"),
    body: z.string().min(10, "Message must be at least 10 characters long"),
});

const bulkEmailFormSchema = z.object({
    group: z.string().min(1, "Please select a user group"),
    subject: z.string().min(3, "Subject must be at least 3 characters long"),
    body: z.string().min(10, "Message must be at least 10 characters long"),
});

export default function SendEmail() {
    const [emailType, setEmailType] = useState("single");
    const queryClient = useQueryClient();

    const emailForm = useForm({
        resolver: zodResolver(emailFormSchema),
        defaultValues: { to: "", subject: "", body: "" },
    });

    const bulkEmailForm = useForm({
        resolver: zodResolver(bulkEmailFormSchema),
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

    return (
        <div className="grid">
            <div className="card">
                <div className="card-header">
                    <h2 className="card-title">Send Email</h2>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Send emails to users of the job platform</p>
                </div>
                <div className="card-content">
                    <div className="tabs-list">
                        <button
                            className={`tab-trigger ${emailType === "single" ? "tab-trigger-active" : ""}`}
                            onClick={() => setEmailType("single")}
                        >
                            <AtSignIcon className="h-4 w-4" /> Single Email
                        </button>
                        <button
                            className={`tab-trigger ${emailType === "bulk" ? "tab-trigger-active" : ""}`}
                            onClick={() => setEmailType("bulk")}
                        >
                            <UsersIcon className="h-4 w-4" /> Bulk Email
                        </button>
                    </div>
                    {emailType === "single" && (
                        <form onSubmit={emailForm.handleSubmit(sendEmailMutation.mutate)} className="grid gap-4">
                            <div>
                                <label>Recipient Email</label>
                                <input className="input" {...emailForm.register("to")} placeholder="user@example.com" />
                                {emailForm.formState.errors.to && <p className="text-sm text-red-500">{emailForm.formState.errors.to.message}</p>}
                            </div>
                            <div>
                                <label>Subject</label>
                                <input className="input" {...emailForm.register("subject")} placeholder="Email subject..." />
                                {emailForm.formState.errors.subject && <p className="text-sm text-red-500">{emailForm.formState.errors.subject.message}</p>}
                            </div>
                            <div>
                                <label>Message</label>
                                <textarea className="input" {...emailForm.register("body")} placeholder="Write your message here..." style={{ minHeight: '200px' }} />
                                {emailForm.formState.errors.body && <p className="text-sm text-red-500">{emailForm.formState.errors.body.message}</p>}
                            </div>
                            <button type="submit" className="button" disabled={sendEmailMutation.isPending}>
                                {sendEmailMutation.isPending ? 'Sending...' : 'Send Email'}
                            </button>
                        </form>
                    )}
                    {emailType === "bulk" && (
                        <form onSubmit={bulkEmailForm.handleSubmit(sendBulkEmailMutation.mutate)} className="grid gap-4">
                            <div>
                                <label>User Group</label>
                                <select className="input" {...bulkEmailForm.register("group")}>
                                    <option value="">Select user group</option>
                                    <option value="all">All Users</option>
                                    <option value="jobseekers">Job Seekers</option>
                                    <option value="employers">Employers</option>
                                    <option value="admins">Administrators</option>
                                    <option value="inactive">Inactive Users</option>
                                </select>
                                {bulkEmailForm.formState.errors.group && <p className="text-sm text-red-500">{bulkEmailForm.formState.errors.group.message}</p>}
                            </div>
                            <div>
                                <label>Subject</label>
                                <input className="input" {...bulkEmailForm.register("subject")} placeholder="Email subject..." />
                                {bulkEmailForm.formState.errors.subject && <p className="text-sm text-red-500">{bulkEmailForm.formState.errors.subject.message}</p>}
                            </div>
                            <div>
                                <label>Message</label>
                                <textarea className="input" {...bulkEmailForm.register("body")} placeholder="Write your message here..." style={{ minHeight: '200px' }} />
                                {bulkEmailForm.formState.errors.body && <p className="text-sm text-red-500">{bulkEmailForm.formState.errors.body.message}</p>}
                            </div>
                            <button type="submit" className="button" disabled={sendBulkEmailMutation.isPending}>
                                {sendBulkEmailMutation.isPending ? 'Sending...' : 'Send Bulk Email'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
