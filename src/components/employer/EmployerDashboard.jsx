import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import EmployerNavbar from "../../components/employer/EmployerNavbar";
import "./styles/employer.css";
import {
  FaPlus,
  FaEdit,
  FaLock,
  FaLockOpen,
  FaUserFriends,
  FaBriefcase,
  FaMapMarkerAlt,
  FaTag,
  FaCalendarAlt,
  FaDollarSign,
  FaCar,
} from "react-icons/fa";
import axios from "axios";
import "./styles/employer.css";

const EmployerDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [debug, setDebug] = useState(null);
  const [jobTypeFilters, setJobTypeFilters] = useState({
    ALL: true,
    FULLTIME: false,
    PARTTIME: false,
    INTERNSHIP: false,
    FREELANCE: false,
    FLEXIBLE: false,
  });
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    fetchJobs();
  }, []); // Gọi khi component mount

  // Thêm để debug
  useEffect(() => {
    console.log("Current jobs state:", jobs);
  }, [jobs]);

  const fetchJobs = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Vui lòng đăng nhập lại - không tìm thấy token");
        setLoading(false);
        return;
      }

      console.log("Fetching jobs with token:", token);

      // GỌI API KHÔNG CẦN EMAIL PARAMETER
      const response = await axios.get(
        `http://localhost:9000/api/employer/job/by-employer`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("API response:", response.data);

      if (response.data.status) {
        // Sử dụng status thay vì success theo API
        if (Array.isArray(response.data.body)) {
          console.log("Setting jobs:", response.data.body);
          setJobs(response.data.body);
          setError("");
          setDebug(null);
        } else {
          console.error("Response body is not an array:", response.data.body);
          setJobs([]);
          setError("Dữ liệu không đúng định dạng");
          setDebug(response.data);
        }
      } else {
        console.error("API error:", response.data.message);
        setError(`Không thể tải danh sách công việc: ${response.data.message}`);
        setDebug(response.data);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
      let errorMessage = "Có lỗi xảy ra khi tải dữ liệu";

      if (error.response) {
        console.error("Response error data:", error.response.data);
        errorMessage = `Lỗi ${error.response.status}: ${
          error.response.data.message || error.message
        }`;
        setDebug({
          status: error.response.status,
          message: error.response.data.message,
          data: error.response.data,
        });
      } else if (error.request) {
        console.error("Request was made but no response:", error.request);
        errorMessage = "Không nhận được phản hồi từ máy chủ";
        setDebug({
          message: "No response received",
          request: "Request sent but no response",
        });
      } else {
        console.error("Error message:", error.message);
        errorMessage = `Lỗi: ${error.message}`;
        setDebug({
          message: error.message,
        });
      }

      setError(errorMessage);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (jobId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Vui lòng đăng nhập lại");
        return;
      }

      setLoading(true);
      const response = await axios.patch(
        `http://localhost:9000/api/employer/job/${jobId}/toggle`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Toggle response:", response.data);

      if (response.data.status) {
        // Sử dụng status thay vì success theo API
        // Update job status locally without refetching
        setJobs((prevJobs) =>
          prevJobs.map((job) =>
            job.id === jobId ? { ...job, active: !job.active } : job
          )
        );
      } else {
        setError(`Không thể cập nhật trạng thái: ${response.data.message}`);
      }
    } catch (error) {
      console.error("Error toggling status:", error);
      setError("Không thể cập nhật trạng thái công việc");
    } finally {
      setLoading(false);
    }
  };

  // Filter jobs based on selected filters
  const filteredJobs = jobs.filter((job) => {
    // Filter by status
    if (
      statusFilter !== "ALL" &&
      ((statusFilter === "ACTIVE" && !job.active) ||
        (statusFilter === "INACTIVE" && job.active))
    ) {
      return false;
    }

    // Filter by job type
    if (jobTypeFilters.ALL) {
      return true;
    }

    return job.jobtype && jobTypeFilters[job.jobtype];
  });

  const handleJobTypeFilterChange = (jobType) => {
    if (jobType === "ALL") {
      // If ALL is selected, toggle it and update other filters accordingly
      const newAllState = !jobTypeFilters.ALL;
      setJobTypeFilters({
        ALL: newAllState,
        FULLTIME: newAllState ? false : jobTypeFilters.FULLTIME,
        PARTTIME: newAllState ? false : jobTypeFilters.PARTTIME,
        INTERNSHIP: newAllState ? false : jobTypeFilters.INTERNSHIP,
        FREELANCE: newAllState ? false : jobTypeFilters.FREELANCE,
        FLEXIBLE: newAllState ? false : jobTypeFilters.FLEXIBLE,
      });
    } else {
      // If a specific job type is selected
      setJobTypeFilters((prev) => {
        const newFilters = { ...prev, [jobType]: !prev[jobType] };

        // Check if all specific filters are false, then ALL should be true
        const allSpecificFiltersOff =
          !newFilters.FULLTIME &&
          !newFilters.PARTTIME &&
          !newFilters.INTERNSHIP &&
          !newFilters.FREELANCE &&
          !newFilters.FLEXIBLE;

        // If all specific filters are on, ALL should be true
        const allSpecificFiltersOn =
          newFilters.FULLTIME &&
          newFilters.PARTTIME &&
          newFilters.INTERNSHIP &&
          newFilters.FREELANCE &&
          newFilters.FLEXIBLE;

        newFilters.ALL = allSpecificFiltersOff || allSpecificFiltersOn;

        return newFilters;
      });
    }
  };

  return (
    <>
      <EmployerNavbar />
      <div className="container" style={{ marginTop: "80px", padding: "20px" }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>DANH SÁCH CÔNG VIỆC</h2>
          <Link to="/employer/jobs/new" className="btn btn-action">
            <FaPlus className="me-2" /> Thêm
          </Link>
        </div>

        {error && (
          <div className="alert alert-danger">
            <strong>Lỗi:</strong> {error}
            {debug && (
              <div className="mt-2">
                <details>
                  <summary>Chi tiết lỗi (debug)</summary>
                  <pre>{JSON.stringify(debug, null, 2)}</pre>
                </details>
              </div>
            )}
          </div>
        )}

        {loading && jobs.length === 0 ? (
          <div className="text-center my-5">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Đang tải...</span>
            </div>
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-5">
            <div className="alert alert-info">
              <p>Bạn chưa đăng công việc nào. Hãy thêm công việc mới!</p>
              <Link to="/employer/jobs/new" className="btn btn-primary mt-3">
                <FaPlus className="me-2" /> Thêm công việc mới
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="card mb-3">
              <div className="card-body">
                <h5 className="card-title mb-2 mt-2 ms-2">BỘ LỌC</h5>
                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="mb-2 ms-2">Loại công việc:</div>
                    <div className="d-flex flex-wrap gap-2 ms-2">
                      <button
                        className={`btn btn-sm ${
                          jobTypeFilters.ALL
                            ? "btn-filter-custom"
                            : "btn-inactive-custom"
                        }`}
                        onClick={() => handleJobTypeFilterChange("ALL")}
                      >
                        Tất cả
                      </button>
                      <button
                        className={`btn btn-sm ${
                          jobTypeFilters.FULLTIME
                            ? "btn-filter-custom"
                            : "btn-inactive-custom"
                        }`}
                        onClick={() => handleJobTypeFilterChange("FULLTIME")}
                      >
                        Toàn thời gian
                      </button>
                      <button
                        className={`btn btn-sm ${
                          jobTypeFilters.PARTTIME
                            ? "btn-filter-custom"
                            : "btn-inactive-custom"
                        }`}
                        onClick={() => handleJobTypeFilterChange("PARTTIME")}
                      >
                        Bán thời gian
                      </button>
                      <button
                        className={`btn btn-sm ${
                          jobTypeFilters.INTERNSHIP
                            ? "btn-filter-custom"
                            : "btn-inactive-custom"
                        }`}
                        onClick={() => handleJobTypeFilterChange("INTERNSHIP")}
                      >
                        Thực tập
                      </button>
                      <button
                        className={`btn btn-sm ${
                          jobTypeFilters.FREELANCE
                            ? "btn-filter-custom"
                            : "btn-inactive-custom"
                        }`}
                        onClick={() => handleJobTypeFilterChange("FREELANCE")}
                      >
                        Tự do
                      </button>
                      <button
                        className={`btn btn-sm ${
                          jobTypeFilters.FLEXIBLE
                            ? "btn-filter-custom"
                            : "btn-inactive-custom"
                        }`}
                        onClick={() => handleJobTypeFilterChange("FLEXIBLE")}
                      >
                        Linh hoạt
                      </button>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-2">Trạng thái:</div>
                    <div className="d-flex gap-2">
                      <button
                        className={`btn btn-sm ${
                          statusFilter === "ALL"
                            ? "btn-filter-custom"
                            : "btn-inactive-custom"
                        }`}
                        onClick={() => setStatusFilter("ALL")}
                      >
                        Tất cả
                      </button>
                      <button
                        className={`btn btn-sm ${
                          statusFilter === "ACTIVE"
                            ? "btn-filter-custom"
                            : "btn-inactive-custom"
                        }`}
                        onClick={() => setStatusFilter("ACTIVE")}
                      >
                        Đang hiển thị
                      </button>
                      <button
                        className={`btn btn-sm ${
                          statusFilter === "INACTIVE"
                            ? "btn-filter-custom"
                            : "btn-inactive-custom"
                        }`}
                        onClick={() => setStatusFilter("INACTIVE")}
                      >
                        Đã ẩn
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-3 d-flex justify-content-between align-items-center">
              <p className="mb-0">
                Đã tìm thấy {filteredJobs.length} công việc
              </p>
              {loading && (
                <div
                  className="spinner-border spinner-border-sm text-primary ms-2"
                  role="status"
                ></div>
              )}
            </div>

            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
              {filteredJobs.map((job) => (
                <div key={job.id} className="col">
                  <div
                    className={`card h-100 ${
                      !job.active ? "border-secondary" : ""
                    }`}
                  >
                    <div
                      className={`card-header d-flex justify-content-between align-items-center ${
                        !job.active ? "bg-light text-muted" : ""
                      }`}
                    >
                      <span
                        className={` ${
                          job.active ? "bg-success" : "bg-secondary"
                        }`}
                      >
                        {job.active ? "Đang hiển thị" : "Đã ẩn"}
                      </span>
                      <div>
                        <button
                          className={`btn btn-sm ${
                            job.active ? "btn-lock" : "btn-outline-success"
                          } me-1`}
                          onClick={() => handleToggleStatus(job.id)}
                          title={
                            job.active ? "Ẩn công việc" : "Hiển thị công việc"
                          }
                          disabled={loading}
                        >
                          {job.active ? <FaLock /> : <FaLockOpen />}
                        </button>
                      </div>
                    </div>
                    <div
                      className={`card-body ${
                        !job.active ? "bg-light text-muted" : ""
                      }`}
                    >
                      <h5 className="job-name">{job.name}</h5>
                      <div className="mt-1">
                        <div className="d-flex align-items-center mb-3 ms-2">
                          <FaCar
                            className="me-2"
                            style={{ color: "#33adff" }}
                          />
                          <span>{job.jobtype || "Không xác định"}</span>
                        </div>
                        <div className="d-flex align-items-center mb-3 ms-2">
                          <FaDollarSign className="me-2 text-success" />
                          <span>{job.salary || "Không xác định"}</span>
                        </div>
                        {job.address && (
                          <div className="d-flex align-items-center mb-3 ms-2">
                            <FaMapMarkerAlt className="me-2 text-danger" />
                            <span className="text-truncate">{job.address}</span>
                          </div>
                        )}
                        <div className="d-flex align-items-center mb-3 ms-2">
                          <FaCalendarAlt
                            className="me-2"
                            style={{ color: "#b3b300" }}
                          />
                          <span>
                            {job.createdat
                              ? new Date(job.createdat).toLocaleDateString(
                                  "vi-VN"
                                )
                              : "Không xác định"}
                          </span>
                        </div>
                      </div>

                      <div className="mb-2 ms-2">
                        <div className="mb-3">
                          <strong>Lĩnh vực:</strong>{" "}
                          {job.field || "Không xác định"}
                        </div>
                        <div>
                          <strong>Số lượng:</strong>{" "}
                          {job.quantity ?? "Không xác định"}
                        </div>
                      </div>

                      <div className="mb-2 ms-2 d-flex">
                        <div className="d-flex align-items-center mb-1 me-3">
                          <FaTag className="me-2 text-secondary" />
                          <span>Tags:</span>
                        </div>
                        <div>
                          {Array.isArray(job.tags) && job.tags.length > 0 ? (
                            job.tags.map((tag, index) => (
                              <span
                                key={index}
                                className="badge badge-tag text-dark me-1 mb-1"
                                style={{ marginTop: "6px" }}
                              >
                                #{tag}
                              </span>
                            ))
                          ) : (
                            <span className="text-muted"></span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div
                      className={`card-footer bg-transparent ${
                        !job.active ? "text-muted" : ""
                      }`}
                    >
                      <div className="d-flex justify-content-between">
                        <Link
                          to={`/employer/jobs/${job.id}`}
                          className="btn btn-sm btn-outline-success"
                          style={{ fontWeight: "bold" }}
                        >
                          Chi tiết
                        </Link>
                        <div>
                          <Link
                            to={`/employer/jobs/edit/${job.id}`}
                            className="btn btn-sm btn-outline-danger me-1"
                            style={{ fontWeight: "bold" }}
                          >
                            <FaEdit /> Sửa
                          </Link>
                          <Link
                            to={`/employer/jobs/${job.id}/applicants`}
                            className="btn btn-sm btn-outline-info"
                            style={{ fontWeight: "bold" }}
                          >
                            <FaUserFriends /> Ứng viên
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredJobs.length === 0 && (
              <div className="alert alert-warning text-center my-4">
                Không tìm thấy công việc phù hợp với bộ lọc hiện tại
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default EmployerDashboard;
