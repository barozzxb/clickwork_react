import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Row, Col, Card } from 'react-bootstrap';
import OverlayLoading from '../effects/Loading.jsx';
import { Link } from 'react-router-dom';
import { API_ROOT } from '../../config.js';

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
                setJobs(jobRes.data.body || []);
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
                <Col md={3}>
                    <Card className="p-3 shadow-sm mb-4">
                        <h5 className="mb-3 text-primary">🔎 Bộ lọc công việc</h5>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Label>Từ khóa tên</Form.Label>
                                <Form.Control
                                    name="name"
                                    value={filters.name}
                                    onChange={handleChange}
                                    placeholder="Nhập từ khóa..."
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Ngày đăng từ</Form.Label>
                                <Form.Control
                                    type="date"
                                    name="dateFrom"
                                    value={filters.dateFrom}
                                    onChange={handleChange}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Đến</Form.Label>
                                <Form.Control
                                    type="date"
                                    name="dateTo"
                                    value={filters.dateTo}
                                    onChange={handleChange}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Mức lương (VNĐ)</Form.Label>
                                <Row>
                                    <Col>
                                        <Form.Control
                                            name="salaryMin"
                                            type="number"
                                            value={filters.salaryMin}
                                            placeholder="Min"
                                            onChange={handleChange}
                                        />
                                    </Col>
                                    <Col>
                                        <Form.Control
                                            name="salaryMax"
                                            type="number"
                                            value={filters.salaryMax}
                                            placeholder="Max"
                                            onChange={handleChange}
                                        />
                                    </Col>
                                </Row>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Company</Form.Label>
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

                            <Form.Group className="mb-3">
                                <Form.Label>Loại công việc</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="jobType"
                                    value={filters.jobType}
                                    onChange={handleChange}
                                >
                                    <option value="">Tất cả</option>
                                    {EJobTypes.map(t => (
                                        <option key={t} value={t}>{t}</option>
                                    ))}
                                </Form.Control>
                            </Form.Group>

                            <Button variant="primary" type="submit" className="w-100">
                                Lọc công việc
                            </Button>
                        </Form>
                    </Card>
                </Col>

                {/* Danh sách jobs */}
                <Col md={9}>
                    <h3 className="mb-4">🗂️ Danh sách công việc</h3>
                    <Row xs={1} md={2} lg={3} className="g-4">
                        {jobs.length === 0 ? (
                            <Col>
                                <Card className="text-center p-3 shadow-sm">
                                    <Card.Body>
                                        <Card.Title>Không có công việc nào phù hợp</Card.Title>
                                        <Card.Text>Vui lòng thử lại với bộ lọc khác.</Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ) : (
                            jobs.map((job) => (
                                <Col key={job.id}>
                                    <Card className="p-3 shadow-sm h-100">
                                        <Card.Body>
                                            <p className="text-muted mb-1">{job.created_at}</p>
                                            <Card.Title>
                                                <Link to={`/jobs/${job.id}`} className="text-decoration-none text-dark fw-bold">
                                                    {job.name}
                                                </Link>
                                            </Card.Title>
                                            <Card.Text><i className="fa fa-location-dot me-2 text-primary"></i>{job.address}</Card.Text>
                                            <Card.Text><i className="fa fa-bars me-2 text-info"></i>{job.field}</Card.Text>
                                            <Card.Text><i className="fa fa-suitcase me-2 text-success"></i>{job.jobtype}</Card.Text>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))
                        )}
                    </Row>
                </Col>
            </Row>
        </div>
    );
};

export default JobList;
