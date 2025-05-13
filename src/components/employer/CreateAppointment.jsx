import React, { useState } from 'react';
import { FaArrowLeft, FaTimes } from 'react-icons/fa';
import axios from 'axios';

const CreateAppointment = ({ applicationId, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        time: '',
        place: '',
        website: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                `http://localhost:9000/api/employer/applicants/${applicationId}/appointment`,
                formData,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (response.data.status) {
                onSuccess();
            } else {
                setError('Có lỗi xảy ra khi đặt lịch hẹn');
            }
        } catch (error) {
            setError('Có lỗi xảy ra khi đặt lịch hẹn');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Đặt lịch hẹn</h5>
                        <button
                            type="button"
                            className="btn-close"
                            onClick={onClose}
                        ></button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                            <button
                                type="button"
                                className="btn btn-outline-secondary mb-3 d-flex align-items-center"
                                onClick={onClose}
                                disabled={loading}
                            >
                                <FaArrowLeft className="me-2" /> Quay lại thông tin ứng viên
                            </button>

                            {error && (
                                <div className="alert alert-danger">{error}</div>
                            )}
                            <div className="mb-3">
                                <label className="form-label">Thời gian</label>
                                <input
                                    type="datetime-local"
                                    className="form-control"
                                    name="time"
                                    value={formData.time}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Địa điểm</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="place"
                                    value={formData.place}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Website (nếu có)</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="website"
                                    value={formData.website}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={onClose}
                                disabled={loading}
                            >
                                Hủy
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={loading}
                            >
                                {loading ? 'Đang xử lý...' : 'Đặt lịch hẹn'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateAppointment;
