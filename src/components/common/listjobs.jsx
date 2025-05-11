import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Row, Col } from 'react-bootstrap';
import OverlayLoading from '../effects/Loading.jsx';
import { Link } from 'react-router-dom';
import {API_ROOT} from '../../config.js';

const EJobTypes = ['FULLTIME', 'PARTTIME', 'INTERNSHIP', 'ONLINE', 'FLEXIBLE'];


const JobList = () => {
    // state cho filter
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
        const loadJobs = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${API_ROOT}/jobs`, {

                });
                setJobs(response.data.body || []);
            } catch (err) {
                console.error("Lỗi fetch jobs", err);
            } finally {
                setLoading(false);
            }
        };

        loadJobs();

    }, []);

    // load danh sách employer và tags khi mount
    //   useEffect(() => {
    //     axios.get('/api/employers').then(res => setEmployers(res.data));
    //     axios.get('/api/jobs/tags').then(res => setAllTags(res.data));
    //     fetchJobs();
    //   }, []);

    // gọi API lấy jobs với filter
    const fetchJobs = () => {
        try{
            const response = axios.post(`${API_ROOT}/jobs/filter`, { filters })
            setJobs(response.data.body || []);
        } catch (err) {
            console.error("Lỗi fetch jobs with filter", err);
        }  ;
    }

    // xử lý thay đổi input
    const handleChange = e => {
        const { name, value, type, selectedOptions } = e.target;
        if (type === 'select-multiple') {
            const vals = Array.from(selectedOptions).map(o => o.value);
            setFilters(f => ({ ...f, [name]: vals }));
        } else {
            setFilters(f => ({ ...f, [name]: value }));
        }
    };

    // submit form lọc
    const handleSubmit = e => {
        e.preventDefault();
        fetchJobs();
    };

    return (

        <div className="container">

            {loading && <OverlayLoading />}

            <Row>
                {/* Sidebar lọc */}
                <Col md={3}>
                    <div className="mt-4 p-3 border rounded bg-light">
                        <h5>Lọc công việc</h5>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-2">
                                <Form.Label>Từ khóa tên</Form.Label>
                                <Form.Control
                                    name="name"
                                    value={filters.name}
                                    onChange={handleChange}
                                    placeholder="Nhập từ khóa..."
                                />
                            </Form.Group>

                            <Form.Group className="mb-2">
                                <Form.Label>Ngày đăng từ</Form.Label>
                                <Form.Control
                                    type="date"
                                    name="dateFrom"
                                    value={filters.dateFrom}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                            <Form.Group className="mb-2">
                                <Form.Label>Đến</Form.Label>
                                <Form.Control
                                    type="date"
                                    name="dateTo"
                                    value={filters.dateTo}
                                    onChange={handleChange}
                                />
                            </Form.Group>

                            <Form.Group className="mb-2">
                                <Form.Label>Mức lương</Form.Label>
                                <Row>
                                    <Col><Form.Control
                                        name="salaryMin" type="number"
                                        value={filters.salaryMin}
                                        placeholder="Min"
                                        onChange={handleChange}
                                    /></Col>
                                    <Col><Form.Control
                                        name="salaryMax" type="number"
                                        value={filters.salaryMax}
                                        placeholder="Max"
                                        onChange={handleChange}
                                    /></Col>
                                </Row>
                            </Form.Group>

                            <Form.Group className="mb-2">
                                <Form.Label>Tags</Form.Label>
                                <Form.Control
                                    as="select" multiple
                                    name="tags"
                                    value={filters.tags}
                                    onChange={handleChange}
                                >
                                    {allTags.map(tag => (
                                        <option key={tag} value={tag}>{tag}</option>
                                    ))}
                                </Form.Control>
                            </Form.Group>

                            <Form.Group className="mb-2">
                                <Form.Label>Company</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="employerId"
                                    value={filters.employerId}
                                    onChange={handleChange}
                                >
                                    <option value="">Tất cả</option>
                                    {employers.map(emp => (
                                        <option key={emp.id} value={emp.id}>{emp.name}</option>
                                    ))}
                                </Form.Control>
                            </Form.Group>

                            <Form.Group className="mb-2">
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

                            <Button variant="primary" type="submit" className="mt-2 w-100">
                                Lọc
                            </Button>
                        </Form>
                    </div>
                </Col>

                {/* Danh sách jobs */}
                <Col md={9}>
                    <h2 className="mt-4">Danh sách công việc</h2>
                    <Row className="mt-4">
                        {jobs.length === 0 ? (
                            <div className="col-md-4">
                                <div className="card p-3">
                                    <div className="card-body">
                                        <h5 className="card-title">Không có công việc nào được đề xuất</h5>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            jobs.map((job) => (
                                <div className="col-md-4" key={job.id}>
                                    <div className="card p-3">
                                        <div className="card-body">
                                            <p className="text-secondary italic">{job.created_at}</p>
                                            <h5 className="card-title"><Link to={`/jobs/${job.id}`} className="job-title">{job.name}</Link></h5>
                                            <p className="card-text location"><i className="fa fa-location-dot">&emsp;</i>{job.address}</p>
                                            <p className="card-text job-field"><i className="fa fa-bars">&emsp;</i>{job.field}</p>
                                            <p className="card-text job-type"><i className="fa fa-suitcase">&emsp;</i>{job.jobtype}</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </Row>
                </Col>
            </Row>
        </div>
    );
};

export default JobList;
