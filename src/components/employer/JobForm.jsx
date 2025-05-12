import React, { useState, useEffect } from "react";
import api from "../../services/api"; // wrapper đã có Bearer token

const JobForm = ({ selectedJob, onSuccess }) => {
  const [form, setForm] = useState({
    name: "",
    salary: "",
    description: "",
    field: "",
    quantity: 1,
  });

  useEffect(() => {
    if (selectedJob) setForm(selectedJob);
    else
      setForm({
        name: "",
        salary: "",
        description: "",
        field: "",
        quantity: 1,
      });
  }, [selectedJob]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = localStorage.getItem("email");

    const jobPayload = {
      email,
      job: form,
    };

    try {
      if (selectedJob) {
        await api.put(`/employer/job/edit/${selectedJob.id}`, form);
      } else {
        await api.post(`/employer/job/add`, jobPayload);
      }
      onSuccess();
      document.getElementById("closeModalBtn").click();
    } catch (err) {
      console.error(
        "Lỗi khi gửi công việc:",
        err?.response?.data || err.message
      );
      alert(
        "Thao tác thất bại. Vui lòng kiểm tra dữ liệu hoặc quyền truy cập."
      );
    }
  };

  return (
    <div className="modal fade" id="addJob" tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h4 className="modal-title">
              {selectedJob ? "Chỉnh sửa" : "Thêm"} công việc
            </h4>
            <button
              className="btn-close"
              data-bs-dismiss="modal"
              id="closeModalBtn"
            ></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit} className="form-control">
              <label>Tên công việc</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="form-control"
                required
              />
              <label>Lĩnh vực</label>
              <input
                name="field"
                value={form.field}
                onChange={handleChange}
                className="form-control"
              />
              <label>Mức lương</label>
              <input
                name="salary"
                value={form.salary}
                onChange={handleChange}
                className="form-control"
              />
              <label>Mô tả</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                className="form-control"
              />
              <label>Số lượng</label>
              <input
                name="quantity"
                type="number"
                value={form.quantity}
                onChange={handleChange}
                className="form-control"
              />
              <div className="text-end mt-3">
                <button type="submit" className="btn btn-success">
                  {selectedJob ? "Cập nhật" : "Tạo mới"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobForm;
