import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import EmployerNavbar from '../../components/employer/EmployerNavbar';
import { FaArrowLeft, FaSave } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';

const API_PREFIX = 'http://localhost:9000/api';

const JobForm = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // Nếu có id => edit mode
    const isEditMode = !!id;

    const [formData, setFormData] = useState({
        name: '',
        jobtype: '',
        salary: '',
        address: '', // Thêm trường address
        tags: '',
        description: '',
        requiredskill: '',
        benefit: '',
        field: '',
        quantity: 1
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [initialLoading, setInitialLoading] = useState(isEditMode);

    // Enum EJobType mapping - đảm bảo khớp với backend
    const jobTypes = [
        { value: 'FULLTIME', label: 'Toàn thời gian' },
        { value: 'PARTTIME', label: 'Bán thời gian' },
        { value: 'ONLINE', label: 'Trực tuyến' },
        { value: 'FLEXIBLE', label: 'Linh hoạt' },
        { value: 'INTERNSHIP', label: 'Thực tập' }
    ];

    useEffect(() => {
        if (isEditMode) {
            fetchJobDetails();
        }
    }, [id]);

    // Sử dụng API common để lấy chi tiết công việc theo ID
    const fetchJobDetails = async () => {
        setInitialLoading(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Vui lòng đăng nhập lại');
                setInitialLoading(false);
                return;
            }

            // Sử dụng API common để lấy chi tiết job theo ID
            const response = await axios.get(
                `${API_PREFIX}/jobs/${id}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            console.log("Fetched job details:", response.data);

            if (response.data.status) {
                const jobData = response.data.body;
                setFormData({
                    name: jobData.name || '',
                    jobtype: jobData.jobtype || '',
                    salary: jobData.salary || '',
                    address: jobData.address || '',
                    tags: Array.isArray(jobData.tags) ? jobData.tags.join(', ') : (jobData.tags || ''),
                    description: jobData.description || '',
                    requiredskill: jobData.requiredskill || '',
                    benefit: jobData.benefit || '',
                    field: jobData.field || '',
                    quantity: jobData.quantity || 1
                });
                setError('');
            } else {
                setError('Không thể tải thông tin công việc: ' + response.data.message);
            }
        } catch (err) {
            console.error('Error fetching job details:', err);
            if (err.response) {
                setError(`Lỗi ${err.response.status}: ${err.response.data.message || 'Không thể tải thông tin công việc'}`);
            } else {
                setError('Lỗi khi tải thông tin công việc');
            }
        } finally {
            setInitialLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Vui lòng đăng nhập lại - không tìm thấy token');
                setLoading(false);
                return;
            }

            const jobData = {
                ...formData,
                tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
            };

            let response;
            if (isEditMode) {
                // Cập nhật công việc hiện có
                response = await axios.put(
                    `${API_PREFIX}/employer/job/edit/${id}`,
                    jobData,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );
            } else {
                // Tạo công việc mới
                response = await axios.post(
                    `${API_PREFIX}/employer/job/add`,
                    { job: jobData },
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );
            }

            console.log("Form submit response:", response.data);

            if (response.data.status) {
                toast.success(isEditMode ? 'Cập nhật công việc thành công' : 'Tạo công việc mới thành công');
                navigate('/employer');
            } else {
                setError(response.data.message || 'Có lỗi xảy ra');
                toast.error(response.data.message || 'Có lỗi xảy ra');
            }
        } catch (err) {
            console.error('Error submitting form:', err);
            if (err.response) {
                setError(err.response.data.message || 'Có lỗi xảy ra khi lưu công việc');
                toast.error(err.response.data.message || 'Có lỗi xảy ra khi lưu công việc');
            } else {
                setError('Có lỗi xảy ra khi lưu công việc');
                toast.error('Có lỗi xảy ra khi lưu công việc');
            }
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

    if (initialLoading) {
        return (
            <>
                <EmployerNavbar />
                <div className="container" style={{ marginTop: '80px', padding: '20px' }}>
                    <div className="text-center my-5">
                        <div className="spinner-border" role="status">
                            <span className="visually-hidden">Đang tải...</span>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <EmployerNavbar />
            <div className="container" style={{ marginTop: '80px', padding: '20px' }}>
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div className="d-flex align-items-center">
                        <button
                            className="btn btn-outline-secondary me-3"
                            onClick={() => navigate('/employer')}
                        >
                            <FaArrowLeft /> Quay lại
                        </button>
                        <h2 className="mb-0">{isEditMode ? 'Chỉnh sửa công việc' : 'Thêm công việc mới'}</h2>
                    </div>
                </div>

                {error && <div className="alert alert-danger mb-4">{error}</div>}

                <div className="card">
                    <div className="card-body">
                        <form onSubmit={handleSubmit}>
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <label className="form-label">Tên công việc *</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label">Loại công việc *</label>
                                    <select
                                        className="form-select"
                                        name="jobtype"
                                        value={formData.jobtype}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Chọn loại công việc</option>
                                        {jobTypes.map(type => (
                                            <option key={type.value} value={type.value}>
                                                {type.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label">Mức lương *</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="salary"
                                        value={formData.salary}
                                        onChange={handleChange}
                                        placeholder="VD: 15-20 triệu"
                                        required
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label">Số lượng cần tuyển *</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        name="quantity"
                                        value={formData.quantity}
                                        onChange={handleChange}
                                        min="1"
                                        required
                                    />
                                </div>
                                <div className="col-12">
                                    <label className="form-label">Địa chỉ làm việc</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        placeholder="Địa chỉ nơi làm việc"
                                    />
                                    <small className="text-muted">Nếu để trống, địa chỉ của công ty sẽ được sử dụng</small>
                                </div>
                                <div className="col-12">
                                    <label className="form-label">Tags (phân cách bằng dấu phẩy)</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="tags"
                                        value={formData.tags}
                                        onChange={handleChange}
                                        placeholder="VD: Java, Spring Boot, React"
                                    />
                                </div>
                                <div className="col-12">
                                    <label className="form-label">Mô tả công việc *</label>
                                    <textarea
                                        className="form-control"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        rows="4"
                                        required
                                    ></textarea>
                                </div>
                                <div className="col-12">
                                    <label className="form-label">Kỹ năng yêu cầu *</label>
                                    <textarea
                                        className="form-control"
                                        name="requiredskill"
                                        value={formData.requiredskill}
                                        onChange={handleChange}
                                        rows="3"
                                        required
                                    ></textarea>
                                </div>
                                <div className="col-12">
                                    <label className="form-label">Quyền lợi *</label>
                                    <textarea
                                        className="form-control"
                                        name="benefit"
                                        value={formData.benefit}
                                        onChange={handleChange}
                                        rows="3"
                                        required
                                    ></textarea>
                                </div>
                                <div className="col-12">
                                    <label className="form-label">Lĩnh vực *</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="field"
                                        value={formData.field}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="col-12">
                                    <div className="d-flex gap-2 justify-content-end">
                                        <button
                                            type="button"
                                            className="btn btn-secondary"
                                            onClick={() => navigate('/employer')}
                                            disabled={loading}
                                        >
                                            Hủy
                                        </button>
                                        <button
                                            type="submit"
                                            className="btn btn-primary"
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                    Đang xử lý...
                                                </>
                                            ) : (
                                                <>
                                                    <FaSave className="me-2" />
                                                    {isEditMode ? 'Lưu thay đổi' : 'Tạo công việc'}
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default JobForm;