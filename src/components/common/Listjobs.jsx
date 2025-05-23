import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Row, Col, Card } from 'react-bootstrap';
import OverlayLoading from '../effects/Loading.jsx';
import { Link } from 'react-router-dom';
import { API_ROOT } from '../../config.js';
import { formatRelativeTime } from '../../functions/dayformatter';

const EJobTypes = ['FULLTIME', 'PARTTIME', 'INTERNSHIP', 'ONLINE', 'FLEXIBLE'];

const JobList = () => {
    const [filters, setFilters] = useState({
        name: '',
        dateFrom: '',
        dateTo: '',
        salaryMin: '',
        salaryMax: '',
        tags: [],
        employerId: '',
        jobType: '',
    });
    const [jobs, setJobs] = useState([]);
    const [employers, setEmployers] = useState([]);
    const [allTags, setAllTags] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const [jobRes, empRes] = await Promise.all([
                    axios.get(`${API_ROOT}/jobs`),
                    axios.get(`${API_ROOT}/jobs/get-employers`)
                ]);
                setJobs(jobRes.data.body.content || []);
                setEmployers(empRes.data.body || []);
            } catch (err) {
                console.error("Lỗi fetch jobs", err);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const handleSubmit = async e => {
        e.preventDefault(); // Prevent form submission from reloading the page
        setLoading(true);
        try {
            const response = await axios.post(`${API_ROOT}/jobs/filter`, filters);
            setJobs(response.data.body || []);  // Cập nhật lại danh sách công việc sau khi lọc
        } catch (err) {
            console.error("Lỗi fetch jobs with filter", err);
        } finally {
            setLoading(false);
        }
    };


    const handleChange = e => {
        const { name, value, type, selectedOptions } = e.target;
        if (type === 'select-multiple') {
            const vals = Array.from(selectedOptions).map(o => o.value);
            setFilters(f => ({ ...f, [name]: vals }));
        } else {
            setFilters(f => ({ ...f, [name]: value }));
        }
    };

    return (
        <div className="container py-4">
            {loading && <OverlayLoading />}
            <Row>
                {/* Sidebar lọc */}
                <Card className="p-3 shadow-sm mb-4">
  <h5 className="mb-3 text-primary">🔎 Bộ lọc công việc</h5>
  <Form onSubmit={handleSubmit}>
    <Row className="gy-2 gx-3 align-items-end">
      <Col md={3}>
        <Form.Group>
          <Form.Label className="fw-semibold small">Từ khóa</Form.Label>
          <Form.Control
            name="name"
            value={filters.name}
            onChange={handleChange}
            placeholder="Tên công việc..."
          />
        </Form.Group>
      </Col>

      <Col md={2}>
        <Form.Group>
          <Form.Label className="fw-semibold small">Ngày từ</Form.Label>
          <Form.Control
            type="date"
            name="dateFrom"
            value={filters.dateFrom}
            onChange={handleChange}
          />
        </Form.Group>
      </Col>

      <Col md={2}>
        <Form.Group>
          <Form.Label className="fw-semibold small">Đến</Form.Label>
          <Form.Control
            type="date"
            name="dateTo"
            value={filters.dateTo}
            onChange={handleChange}
          />
        </Form.Group>
      </Col>

      <Col md={2}>
        <Form.Group>
          <Form.Label className="fw-semibold small">Lương từ</Form.Label>
          <Form.Control
            type="number"
            name="salaryMin"
            value={filters.salaryMin}
            placeholder="Min"
            onChange={handleChange}
          />
        </Form.Group>
      </Col>

      <Col md={2}>
        <Form.Group>
          <Form.Label className="fw-semibold small">Đến</Form.Label>
          <Form.Control
            type="number"
            name="salaryMax"
            value={filters.salaryMax}
            placeholder="Max"
            onChange={handleChange}
          />
        </Form.Group>
      </Col>

      <Col md={3}>
        <Form.Group>
          <Form.Label className="fw-semibold small">Công ty</Form.Label>
          <Form.Control
            as="select"
            name="employerId"
            value={filters.employerId}
            onChange={handleChange}
          >
            <option value="">Tất cả</option>
            {employers.map(emp => (
              <option key={emp.id} value={emp.id}>
                {emp.name || emp.email}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
      </Col>

      <Col md={2}>
        <Form.Group>
          <Form.Label className="fw-semibold small">Loại việc</Form.Label>
          <Form.Control
            as="select"
            name="jobType"
            value={filters.jobType}
            onChange={handleChange}
          >
            <option value="">Tất cả</option>
            {EJobTypes.map(t => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
      </Col>

      <Col md="auto">
        <Button variant="primary" type="submit" className="mt-1">
          Lọc
        </Button>
      </Col>
    </Row>
  </Form>
</Card>


                {/* Danh sách jobs */}
                <section className="jobs-section">
                    <div className="section-header">
                        <h2 className="section-title">Tất cả việc làm</h2>
                    </div>

                    <div className="jobs-grid">
                        {jobs.length === 0 ? (
                            <div className="empty-state">
                                <i className="fa fa-briefcase empty-icon"></i>
                                <p>Không có công việc nào được đề xuất</p>
                                <button className="update-profile-btn">Cập nhật hồ sơ</button>
                            </div>
                        ) : (
                            jobs.map((job) => (
                                <div className="job-card" key={job.id}>
                                    <div className="job-card-header">
                                        <div className="job-time">{formatRelativeTime(job.createdat)}</div>
                                    </div>

                                    <h3 className="job-title">
                                        <Link to={`/jobs/${job.id}`}>{job.name}</Link>
                                    </h3>

                                    <div className="job-details">
                                        <div className="job-detail">
                                            <i className="fa fa-location-dot"></i>
                                            <span>{job.address}</span>
                                        </div>
                                        <div className="job-detail">
                                            <i className="fa fa-bars"></i>
                                            <span>{job.field}</span>
                                        </div>
                                        <div className="job-detail">
                                            <i className="fa fa-suitcase"></i>
                                            <span>{job.jobtype}</span>
                                        </div>
                                    </div>

                                    <div className="job-card-footer">
                                        <button className="apply-btn">Ứng tuyển ngay</button>
                                        <button className="save-job-btn">
                                            <i className="fa fa-bookmark"></i>
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </section>

            </Row>
        </div>
    );
};

export default JobList;
