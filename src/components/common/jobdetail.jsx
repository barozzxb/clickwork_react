const JobDetail = ({ job }) => {

    

    return (
        <main className="container">
            {/* Search Bar */}
            <div className="d-flex justify-content-center align-items-center search-bar">
                <form className="d-flex w-100">
                    <input className="form-control search-input" type="search" placeholder="Tìm kiếm việc làm..." />
                    <button className="btn btn-success search-btn" type="submit">Tìm kiếm</button>
                </form>
            </div>

            {/* Chi tiết công việc */}
            <div className="row mt-4">
                <div className="col detail">
                    <p className="h2 title">{job?.title || "Tên công việc"}</p>
                    <p className="text-secondary italic">{job?.postedAgo || "x ngày trước"}</p>
                    <p className="card-text location"><i className="fa fa-location-dot" />&emsp;{job?.location || "Địa điểm làm việc"}</p>
                    <p className="card-text job-field"><i className="fa fa-bars" />&emsp;{job?.field || "Lĩnh vực"}</p>
                    <p className="card-text job-type"><i className="fa fa-suitcase" />&emsp;{job?.type || "Loại công việc"}</p>
                    <p className="card-text salary"><i className="fa fa-sack-dollar" />&emsp;{job?.salary || "Mức lương"}</p>

                    <div className="card-text d-flex tag flex-wrap gap-2">
                        {(job?.tags || ["tag 1", "tag 2", "tag 3"]).map((tag, index) => (
                            <p key={index} className="tags">{tag}</p>
                        ))}
                    </div>

                    <hr />

                    {/* Carousel ảnh */}
                    <div id="jobPhoto" className="carousel slide carousel-fade mb-5">
                        <div className="carousel-inner">
                            {(job?.images || ["/images/1.png", "/images/2.png", "/images/3.png"]).map((img, index) => (
                                <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                                    <img src={img} className="d-block w-100" alt={`job-img-${index}`} />
                                </div>
                            ))}
                        </div>
                        <button className="carousel-control-prev" type="button" data-bs-target="#jobPhoto" data-bs-slide="prev">
                            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Previous</span>
                        </button>
                        <button className="carousel-control-next" type="button" data-bs-target="#jobPhoto" data-bs-slide="next">
                            <span className="carousel-control-next-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Next</span>
                        </button>
                    </div>

                    <hr />

                    {/* Mô tả */}
                    <div className="col job-info">
                        <p className="heading">Mô tả công việc</p>
                        <p className="content">{job?.description || "Chưa có mô tả công việc."}</p>
                    </div>

                    <hr />

                    {/* Kỹ năng */}
                    <div className="col job-info">
                        <p className="heading">Yêu cầu kỹ năng</p>
                        <p className="content">{job?.requirements || "Chưa có thông tin kỹ năng."}</p>
                    </div>

                    <hr />

                    {/* Lợi ích */}
                    <div className="col job-info">
                        <p className="heading">Lợi ích khi làm việc</p>
                        <p className="content">{job?.benefits || "Chưa có thông tin lợi ích."}</p>
                    </div>

                    <hr />

                    {/* Công ty */}
                    <div className="col job-info">
                        <p className="heading">Về công ty</p>
                        <div className="col-md-8 mx-auto d-flex flex-column card">
                            <div className="container d-flex justify-content-center">
                                <img className="avatar-small" src={job?.company?.avatar || "../images/user-default.png"} alt="Company Avatar" />
                            </div>
                            <div className="company-info d-flex flex-column text-center">
                                <p>{job?.company?.name || "Tên công ty"}</p>
                                <p>{job?.company?.field || "Lĩnh vực"}</p>
                                <p>{job?.company?.founded || "Ngày thành lập"}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Gợi ý công việc */}
            <div className="row mt-4">
                <p className="h2">Công việc tương tự</p>
                {(job?.relatedJobs || [1, 2, 3]).map((item, idx) => (
                    <div key={idx} className="col-md-4">
                        <div className="card p-3">
                            <div className="card-body">
                                <p className="text-secondary italic">x days ago</p>
                                <h5 className="card-title">
                                    <a href="#" className="job-title">Công việc {item}</a>
                                </h5>
                                <p className="card-text location"><i className="fa fa-location-dot" />&emsp;Địa điểm làm việc</p>
                                <p className="card-text job-field"><i className="fa fa-bars" />&emsp;Lĩnh vực</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
};

export default JobDetail;
