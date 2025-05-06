<<<<<<< Updated upstream
import React, { useState } from 'react';
import ReactQuill from 'react-quill-new';
const PostJob = () => {
    const [job, setJob] = useState({
        title: '',
        company: '',
        location: '',
        description: '',
        requirements: '',
        benefits: ''
    });
=======
    import React, { useState } from 'react';
    import axios from 'axios';
>>>>>>> Stashed changes

    const PostJob = () => {
        const [job, setJob] = useState({
            name: '',
            company: '',
            location: '',
            level: '',
            weekday: '',
            endWeekday: '',
            startTime: '',
            endTime: '',
            description: '',
            requiredskill: '',
            benefit: '',
            salary: '',
            field: '',
            quantity: 1,
            jobtype: 'FULL_TIME',
            isActive: true,
            employer: {
                username: localStorage.getItem('username') || 'employer1'
            }
        });

        const handleChange = (e) => {
            setJob({ ...job, [e.target.name]: e.target.value });
        };

        const [isSubmitting, setIsSubmitting] = useState(false);

        const handleSubmit = async (e) => {
            e.preventDefault();
            setIsSubmitting(true);
            try {
                const response = await axios.post('http://localhost:9000/api/jobs/post-job', job, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                alert("Công việc đã được đăng!");
                console.log("Kết quả trả về:", response.data);
            } catch (error) {
                console.error("Lỗi khi đăng công việc:", error);
                alert("Đăng công việc thất bại!");
            } finally {
                setIsSubmitting(false);
            }
        };

        return (
            <div className="container mt-5">
                <h2>Đăng Tuyển Công Việc</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Tiêu đề công việc</label>
                        <input type="text" className="form-control" name="name" value={job.name} onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Công ty</label>
                        <input type="text" className="form-control" name="company" value={job.company} onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Địa điểm</label>
                        <input type="text" className="form-control" name="location" value={job.location} onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Cấp bậc công việc</label>
                        <input type="text" className="form-control" name="level" value={job.level} onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Ngày làm việc</label>
                        <select className="form-select mb-2" name="weekday" value={job.weekday} onChange={handleChange} required>
                            <option value="">Bắt đầu từ </option>
                            <option value="Thứ Hai">Thứ Hai</option>
                            <option value="Thứ Ba">Thứ Ba</option>
                            <option value="Thứ Tư">Thứ Tư</option>
                            <option value="Thứ Năm">Thứ Năm</option>
                            <option value="Thứ Sáu">Thứ Sáu</option>
                            <option value="Thứ Bảy">Thứ Bảy</option>
                            <option value="Chủ Nhật">Chủ Nhật</option>
                        </select>
                        <select className="form-select" name="endWeekday" value={job.endWeekday} onChange={handleChange} required>
                            <option value="">Chọn ngày kết thúc</option>
                            <option value="Thứ Hai">Thứ Hai</option>
                            <option value="Thứ Ba">Thứ Ba</option>
                            <option value="Thứ Tư">Thứ Tư</option>
                            <option value="Thứ Năm">Thứ Năm</option>
                            <option value="Thứ Sáu">Thứ Sáu</option>
                            <option value="Thứ Bảy">Thứ Bảy</option>
                            <option value="Chủ Nhật">Chủ Nhật</option>
                        </select>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Giờ làm việc</label>
                        <input type="time" className="form-control mb-2" name="startTime" value={job.startTime} onChange={handleChange} required />
                        <input type="time" className="form-control" name="endTime" value={job.endTime} onChange={handleChange} required />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Mô tả công việc</label>
                        <textarea className="form-control" name="description" value={job.description} onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Yêu cầu ứng viên</label>
                        <textarea className="form-control" name="requiredskill" value={job.requiredskill} onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Quyền lợi</label>
                        <textarea className="form-control" name="benefit" value={job.benefit} onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Mức lương</label>
                        <input type="text" className="form-control" name="salary" value={job.salary} onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Ngành nghề</label>
                        <input type="text" className="form-control" name="field" value={job.field} onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Số lượng tuyển</label>
                        <input type="number" className="form-control" name="quantity" value={job.quantity} onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Loại công việc</label>
                        <select className="form-select" name="jobtype" value={job.jobtype} onChange={handleChange}>
                            <option value="FULL_TIME">Full-time</option>
                            <option value="PART_TIME">Part-time</option>
                            <option value="FREELANCE">Freelance</option>
                            <option value="INTERN">Intern</option>
                        </select>
                    </div>
                    <button type="submit" className="btn btn-action" disabled={isSubmitting}>
                        {isSubmitting ? "Đang đăng..." : "Đăng tuyển"}
                    </button>
                </form>
            </div>
        );
    };

    export default PostJob;