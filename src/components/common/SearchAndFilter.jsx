import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col, Card } from 'react-bootstrap';
import OverlayLoading from '../effects/Loading.jsx';
import { Link } from 'react-router-dom';
import { API_ROOT } from '../../config.js';

const EJobTypes = ['FULLTIME', 'PARTTIME', 'INTERNSHIP', 'ONLINE', 'FLEXIBLE'];
const PAGE_SIZE = 6;

const Search = () => {
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

    const keyword = useParams();


    useEffect(() => {
        // Chỉ fetch khi keyword tồn tại
        if (!keyword) return;

        const loadData = async () => {
            setLoading(true);
            try {
                // 2. Gọi đúng URL với keyword là string
                const response = await axios.post(
                    `${API_ROOT}/search/query`, keyword
                );
                setJobs(response.data.body.jobs || []);
                setEmployers(response.data.body.employers || []);
            } catch (err) {
                console.error("Lỗi fetch jobs", err);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [keyword]);  // Chạy lại khi path param thay đổi


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

    if (loading || !jobs || !employers) {
        return <OverlayLoading />;
    }

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

                {/* Main content: Companies and Jobs */}
                <Col md={9}>
                    {/* Company Section */}
                    <section className="mb-5">
                        <h3 className="mb-4">🏢 Danh sách công ty</h3>
                        <Row xs={1} md={2} lg={3} className="g-4">
                            {employers.length === 0 ? (
                                <Col>
                                    <Card className="text-center p-3 shadow-sm">
                                        <Card.Body>
                                            <Card.Title>Không có công ty nào</Card.Title>
                                            <Card.Text>Vui lòng thử lại với bộ lọc khác.</Card.Text>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ) : (
                                employers.map((emp) => (
                                    <Col key={emp.id}>
                                        <Card className="p-3 shadow-sm h-100">
                                            <Card.Body>
                                                <Card.Title>
                                                    {emp.name || emp.email}
                                                </Card.Title>
                                                <Card.Text>
                                                    <i className="fa fa-envelope me-2 text-info"></i>
                                                    {emp.email}
                                                </Card.Text>
                                                <Card.Text>
                                                    <i className="fa fa-phone me-2 text-success"></i>
                                                    {emp.phone || 'Chưa cập nhật'}
                                                </Card.Text>
                                                <Card.Text>
                                                    <i className="fa fa-location-dot me-2 text-primary"></i>
                                                    {emp.address || 'Chưa cập nhật'}
                                                </Card.Text>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                ))
                            )}
                        </Row>
                    </section>

                    {/* Job Section */}
                    <section>
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
                    </section>
                </Col>
            </Row>
        </div>
    );
};

export default Search;
