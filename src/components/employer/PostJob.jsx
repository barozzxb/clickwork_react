import React, { useState } from 'react';
import ReactQuill from 'react-quill';
const PostJob = () => {
    const [job, setJob] = useState({
        title: '',
        company: '',
        location: '',
        description: '',
        requirements: '',
        benefits: ''
    });

    const handleChange = (e) => {
        setJob({ ...job, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Thông tin công việc:", job);
        alert("Công việc đã được đăng!");
    };

    return (
        <div className="container mt-5">
            <h2>Đăng Tuyển Công Việc</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Tiêu đề công việc</label>
                    <input type="text" className="form-control" name="title" value={job.title} onChange={handleChange} required />
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
                    <input type="text" className="form-control" name="title" value={job.title} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Ngày làm việc</label>
                    <select
                        className="form-select mb-2"
                        name="weekday"
                        value={job.weekday}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Bắt đầu từ </option>
                        <option value="Thứ Hai">Thứ Hai</option>
                        <option value="Thứ Ba">Thứ Ba</option>
                        <option value="Thứ Tư">Thứ Tư</option>
                        <option value="Thứ Năm">Thứ Năm</option>
                        <option value="Thứ Sáu">Thứ Sáu</option>
                        <option value="Thứ Bảy">Thứ Bảy</option>
                        <option value="Chủ Nhật">Chủ Nhật</option>
                    </select>
                    <select
                        className="form-select"
                        name="endWeekday"
                        value={job.endWeekday}
                        onChange={handleChange}
                        required
                    >
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
                    <input
                        type="time"
                        className="form-control mb-2"
                        name="startTime"
                        value={job.startTime}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="time"
                        className="form-control"
                        name="endTime"
                        value={job.endTime}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Mô tả công việc</label>
                    <textarea className="form-control" name="description" value={job.description} onChange={handleChange} required></textarea>
                </div>
                <div className="mb-3">
                    <label className="form-label">Yêu cầu ứng viên</label>
                    <textarea className="form-control" name="description" value={job.requirements} onChange={handleChange} required></textarea>
                </div>
                <div className="mb-3">
                    <label className="form-label">Quyền lợi</label>
                    <textarea className="form-control" name="description" value={job.benefits} onChange={handleChange} required></textarea>
                </div>
                {/* tag */}
                <button type="submit" className="btn-action">Đăng tuyển</button>
            </form>
        </div>
    );
};

export default PostJob;
