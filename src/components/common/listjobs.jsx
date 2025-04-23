import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Card, Row, Col } from 'react-bootstrap';

const EJobTypes = ['FULL_TIME', 'PART_TIME', 'INTERNSHIP', 'CONTRACT'];

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

  // load danh sách employer và tags khi mount
//   useEffect(() => {
//     axios.get('/api/employers').then(res => setEmployers(res.data));
//     axios.get('/api/jobs/tags').then(res => setAllTags(res.data));
//     fetchJobs();
//   }, []);

  // gọi API lấy jobs với filter
  const fetchJobs = () => {
    axios.get('http://localhost:9000/api/jobs', { params: filters })
      .then(res => setJobs(res.data))
      .catch(err => console.error(err));
  };

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
          <Row>
            {jobs.map(job => (
              <Col key={job.id} md={4} className="mb-4">
                <Card>
                  <Card.Body>
                    <Card.Text className="text-secondary">
                      {new Date(job.createdAt).toLocaleDateString()}
                    </Card.Text>
                    <Card.Title>
                      <a href={`/jobs/${job.id}`}>{job.name}</a>
                    </Card.Title>
                    <Card.Text><i className="fa fa-dollar-sign"></i> {job.salary}</Card.Text>
                    <Card.Text><i className="fa fa-tags"></i> {job.tags.join(', ')}</Card.Text>
                    <Card.Text><i className="fa fa-briefcase"></i> {job.jobType}</Card.Text>
                    <Card.Text><i className="fa fa-building"></i> {job.employer.name}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default JobList;
