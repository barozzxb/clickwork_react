import React from 'react'

const ViewDetailJob = () => {
  return (
    <div>
        <>
  <main className="bg-white">
    <div className="manage-container bg-white">
      <p className="h2">Quản lý công việc</p>
      <hr />
      <div className="d-flex justify-content-center align-items-center">
        <button
          className="btn btn-action"
          data-bs-toggle="modal"
          data-bs-target="#addJob"
        >
          <i className="fa fa-plus"> </i>Thêm công việc mới
        </button>
      </div>
      <hr />
      <table className="table table-responsive table-hover">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Tên công việc</th>
            <th scope="col">Ngày tạo</th>
            <th scope="col">Số lượng ứng tuyển</th>
            <th scope="col">Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">1</th>
            <td>Job 1</td>
            <td>22/2/2022</td>
            <td>22</td>
            <td>
              <a href="#">
                <i
                  className="fa fa-edit"
                  data-bs-toggle="tooltip"
                  title="Chỉnh sửa"
                />
              </a>
              <a href="#">
                <i
                  className="fa fa-lock"
                  data-bs-toggle="tooltip"
                  title="Khóa"
                />
              </a>
            </td>
          </tr>
          <tr>
            <th scope="row">1</th>
            <td>Job 1</td>
            <td>22/2/2022</td>
            <td>22</td>
            <td>
              <a href="#">
                <i
                  className="fa fa-edit"
                  data-bs-toggle="tooltip"
                  title="Chỉnh sửa"
                />
              </a>
              <a href="#">
                <i
                  className="fa fa-lock"
                  data-bs-toggle="tooltip"
                  title="Khóa"
                />
              </a>
            </td>
          </tr>
          <tr>
            <th scope="row">1</th>
            <td>Job 1</td>
            <td>22/2/2022</td>
            <td>22</td>
            <td>
              <a href="#">
                <i
                  className="fa fa-edit"
                  data-bs-toggle="tooltip"
                  title="Chỉnh sửa"
                />
              </a>
              <a href="#">
                <i
                  className="fa fa-lock"
                  data-bs-toggle="tooltip"
                  title="Khóa"
                />
              </a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div className="modal fade" id="addJob">
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          {/* Modal Header */}
          <div className="modal-header">
            <h4 className="modal-title">Thêm công việc mới</h4>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
            />
          </div>
          {/* Modal body */}
          <div className="modal-body">
            <form action="#" className="form-control info" id="jobForm">
              <div className="input-group d-flex align-items-center">
                <label htmlFor="job-title">Tên công việc</label>
                <input
                  className="form-control input"
                  type="text"
                  placeholder="Tên công việc..."
                  id="job-title"
                  name="job-title"
                />
              </div>
              <div className="input-group d-flex align-items-center">
                <label htmlFor="job-type">Loại công việc</label>
                {/* <input class="form-control input" type="text" placeholder="Loại công việc..." id="job-type" name="job-type"> */}
              </div>
              <div className="input-group d-flex align-items-center">
                <label htmlFor="jobname">Lĩnh vực</label>
                {/* <input class="form-control input" type="text" placeholder="Tên công việc..." id="jobname" name="jobname"> */}
              </div>
              <div className="input-group d-flex align-items-center">
                <label htmlFor="location">Địa điểm làm việc</label>
                <input
                  className="form-control input"
                  type="text"
                  placeholder="Địa điểm làm việc..."
                  id="location"
                  name="location"
                />
              </div>
              <div className="input-group d-flex align-items-center">
                <label htmlFor="salary">Mức lương</label>
                <input
                  className="form-control input"
                  type="text"
                  placeholder="Mức lương..."
                  id="salary"
                  name="salary"
                />
              </div>
              <div className="input-group d-flex align-items-center">
                <label htmlFor="jobPhoto">Tên công việc</label>
                <input
                  className="form-control input"
                  type="file"
                  placeholder="Tên công việc..."
                  id="jobPhoto"
                  name="jobPhoto"
                />
              </div>
              <div className="input-group d-flex flex-column">
                <label htmlFor="job-info">Mô tả công việc</label>
                <div>
                  <div className="row" id="editor-1" />
                  <input type="hidden" name="job-info" id="job-info" />
                </div>
              </div>
              <div className="input-group d-flex flex-column">
                <label htmlFor="job-required">Yêu cầu kỹ năng</label>
                <div>
                  <div className="row" id="editor-2" />
                  <input type="hidden" name="job-required" id="job-required" />
                </div>
              </div>
              <div className="input-group d-flex flex-column">
                <label htmlFor="job-benefit">Lợi ích</label>
                <div>
                  <div className="row" id="editor-3" />
                  <input type="hidden" name="job-benefit" id="job-benefit" />
                </div>
              </div>
              <div className="text-center">
                <input
                  type="reset"
                  className="btn-action danger"
                  defaultValue="Hủy"
                  data-bs-dismiss="modal"
                />
                <input
                  type="submit"
                  className="btn-action"
                  defaultValue="Tạo"
                />
              </div>
            </form>
          </div>
          {/* Modal footer */}
          {/* <div class="modal-footer">
            <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Close</button>
          </div> */}
        </div>
      </div>
    </div>
    {/*  */}
    <div className="modal row mt-4" id="job-content">
      <div className="col detail">
        <p className="h2 title">Tên công việc</p>
        <p className="text-secondary italic">x day ago</p>
        <p className="card-text location">
          <i className="fa fa-location-dot"> </i>Địa điểm làm việc
        </p>
        <p className="card-text job-field">
          <i className="fa fa-bars"> </i>Lĩnh vực
        </p>
        <p className="card-text job-type">
          <i className="fa fa-suitcase"> </i>Loại công việc
        </p>
        <p className="card-text salary">
          <i className="fa fa-sack-dollar"> </i>Mức lươngz
        </p>
        <div className="card-text d-flex tag">
          <p className="tags">tag 1</p>
          <p className="tags">tag 2</p>
          <p className="tags">tag 3</p>
        </div>
        <hr />
        <div id="jobPhoto" className="carousel slide carousel-fade mb-5">
          <div className="carousel-inner">
            <div className="carousel-item active">
              <img src="/images/1.png" className="d-block w-100" alt="" />
            </div>
            <div className="carousel-item">
              <img src="/images/2.png" className="d-block w-100" alt="" />
            </div>
            <div className="carousel-item">
              <img src="/images/3.png" className="d-block w-100" alt="" />
            </div>
          </div>
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#jobPhoto"
            data-bs-slide="prev"
          >
            <span className="carousel-control-prev-icon" aria-hidden="true" />
            <span className="visually-hidden">Previous</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#jobPhoto"
            data-bs-slide="next"
          >
            <span className="carousel-control-next-icon" aria-hidden="true" />
            <span className="visually-hidden">Next</span>
          </button>
        </div>
        <hr />
        <div className="col job-info">
          <p className="heading">Mô tả công việc</p>
          <p className="content">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </p>
        </div>
        <hr />
        <div className="col job-info">
          <p className="heading">Yêu cầu kỹ năng</p>
          <p className="content">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </p>
        </div>
        <hr />
        <div className="col job-info">
          <p className="heading">Lợi ích khi làm việc</p>
          <p className="content">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </p>
        </div>
        <hr />
        <div className="col job-info">
          <p className="heading">Về công ty</p>
          <div className="col-md-8 mx-auto d-flex flex-column card ">
            <div className="container d-flex justify-content-center">
              <img className="avatar-small" src="../images/user-default.png" />
            </div>
            <div className="company-info d-flex flex-column text-center">
              <p>Tên công ty</p>
              <p>Lĩnh vực</p>
              <p>Ngày thành lập</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
  <nav className="navbar navbar-expand-lg bg-body-tertiary fixed-top">
    <div className="container-fluid">
      <a className="navbar-brand" href="#">
        <span className="logo-title">C</span>lick
        <span className="logo-title">W</span>ork
      </a>
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon" />
      </button>
      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
          <li className="nav-item">
            <a className="nav-link active" href="#">
              Trang chủ
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">
              Tất cả việc làm
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">
              Trang dành cho Nhà tuyển dụng
            </a>
          </li>
        </ul>
        <div className="ms-auto">
          <ul className="navbar-nav d-flex">
            <li className="nav-item">
              <a className="nav-link" href="/html/login.html">
                Đăng nhập
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/html/register.html">
                Đăng ký
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </nav>
  <main className="bg-white">
    <div className="manage-container bg-white">
      <p className="h2">Quản lý công việc</p>
      <hr />
      <div className="d-flex justify-content-center align-items-center">
        <button
          className="btn btn-action"
          data-bs-toggle="modal"
          data-bs-target="#addJob"
        >
          <i className="fa fa-plus"> </i>Thêm công việc mới
        </button>
      </div>
      <hr />
      <table className="table table-responsive table-hover">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Tên công việc</th>
            <th scope="col">Ngày tạo</th>
            <th scope="col">Số lượng ứng tuyển</th>
            <th scope="col">Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">1</th>
            <td>Job 1</td>
            <td>22/2/2022</td>
            <td>22</td>
            <td>
              <a href="#">
                <i
                  className="fa fa-edit"
                  data-bs-toggle="tooltip"
                  title="Chỉnh sửa"
                />
              </a>
              <a href="#">
                <i
                  className="fa fa-lock"
                  data-bs-toggle="tooltip"
                  title="Khóa"
                />
              </a>
            </td>
          </tr>
          <tr>
            <th scope="row">1</th>
            <td>Job 1</td>
            <td>22/2/2022</td>
            <td>22</td>
            <td>
              <a href="#">
                <i
                  className="fa fa-edit"
                  data-bs-toggle="tooltip"
                  title="Chỉnh sửa"
                />
              </a>
              <a href="#">
                <i
                  className="fa fa-lock"
                  data-bs-toggle="tooltip"
                  title="Khóa"
                />
              </a>
            </td>
          </tr>
          <tr>
            <th scope="row">1</th>
            <td>Job 1</td>
            <td>22/2/2022</td>
            <td>22</td>
            <td>
              <a href="#">
                <i
                  className="fa fa-edit"
                  data-bs-toggle="tooltip"
                  title="Chỉnh sửa"
                />
              </a>
              <a href="#">
                <i
                  className="fa fa-lock"
                  data-bs-toggle="tooltip"
                  title="Khóa"
                />
              </a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div className="modal fade" id="addJob">
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          {/* Modal Header */}
          <div className="modal-header">
            <h4 className="modal-title">Thêm công việc mới</h4>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
            />
          </div>
          {/* Modal body */}
          <div className="modal-body">
            <form action="#" className="form-control info" id="jobForm">
              <div className="input-group d-flex align-items-center">
                <label htmlFor="job-title">Tên công việc</label>
                <input
                  className="form-control input"
                  type="text"
                  placeholder="Tên công việc..."
                  id="job-title"
                  name="job-title"
                />
              </div>
              <div className="input-group d-flex align-items-center">
                <label htmlFor="job-type">Loại công việc</label>
                {/* <input class="form-control input" type="text" placeholder="Loại công việc..." id="job-type" name="job-type"> */}
              </div>
              <div className="input-group d-flex align-items-center">
                <label htmlFor="jobname">Lĩnh vực</label>
                {/* <input class="form-control input" type="text" placeholder="Tên công việc..." id="jobname" name="jobname"> */}
              </div>
              <div className="input-group d-flex align-items-center">
                <label htmlFor="location">Địa điểm làm việc</label>
                <input
                  className="form-control input"
                  type="text"
                  placeholder="Địa điểm làm việc..."
                  id="location"
                  name="location"
                />
              </div>
              <div className="input-group d-flex align-items-center">
                <label htmlFor="salary">Mức lương</label>
                <input
                  className="form-control input"
                  type="text"
                  placeholder="Mức lương..."
                  id="salary"
                  name="salary"
                />
              </div>
              <div className="input-group d-flex align-items-center">
                <label htmlFor="jobPhoto">Tên công việc</label>
                <input
                  className="form-control input"
                  type="file"
                  placeholder="Tên công việc..."
                  id="jobPhoto"
                  name="jobPhoto"
                />
              </div>
              <div className="input-group d-flex flex-column">
                <label htmlFor="job-info">Mô tả công việc</label>
                <div>
                  <div className="row" id="editor-1" />
                  <input type="hidden" name="job-info" id="job-info" />
                </div>
              </div>
              <div className="input-group d-flex flex-column">
                <label htmlFor="job-required">Yêu cầu kỹ năng</label>
                <div>
                  <div className="row" id="editor-2" />
                  <input type="hidden" name="job-required" id="job-required" />
                </div>
              </div>
              <div className="input-group d-flex flex-column">
                <label htmlFor="job-benefit">Lợi ích</label>
                <div>
                  <div className="row" id="editor-3" />
                  <input type="hidden" name="job-benefit" id="job-benefit" />
                </div>
              </div>
              <div className="text-center">
                <input
                  type="reset"
                  className="btn-action danger"
                  defaultValue="Hủy"
                  data-bs-dismiss="modal"
                />
                <input
                  type="submit"
                  className="btn-action"
                  defaultValue="Tạo"
                />
              </div>
            </form>
          </div>
          {/* Modal footer */}
          {/* <div class="modal-footer">
            <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Close</button>
          </div> */}
        </div>
      </div>
    </div>
    {/*  */}
    <div className="modal row mt-4" id="job-content">
      <div className="col detail">
        <p className="h2 title">Tên công việc</p>
        <p className="text-secondary italic">x day ago</p>
        <p className="card-text location">
          <i className="fa fa-location-dot"> </i>Địa điểm làm việc
        </p>
        <p className="card-text job-field">
          <i className="fa fa-bars"> </i>Lĩnh vực
        </p>
        <p className="card-text job-type">
          <i className="fa fa-suitcase"> </i>Loại công việc
        </p>
        <p className="card-text salary">
          <i className="fa fa-sack-dollar"> </i>Mức lươngz
        </p>
        <div className="card-text d-flex tag">
          <p className="tags">tag 1</p>
          <p className="tags">tag 2</p>
          <p className="tags">tag 3</p>
        </div>
        <hr />
        <div id="jobPhoto" className="carousel slide carousel-fade mb-5">
          <div className="carousel-inner">
            <div className="carousel-item active">
              <img src="/images/1.png" className="d-block w-100" alt="" />
            </div>
            <div className="carousel-item">
              <img src="/images/2.png" className="d-block w-100" alt="" />
            </div>
            <div className="carousel-item">
              <img src="/images/3.png" className="d-block w-100" alt="" />
            </div>
          </div>
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#jobPhoto"
            data-bs-slide="prev"
          >
            <span className="carousel-control-prev-icon" aria-hidden="true" />
            <span className="visually-hidden">Previous</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#jobPhoto"
            data-bs-slide="next"
          >
            <span className="carousel-control-next-icon" aria-hidden="true" />
            <span className="visually-hidden">Next</span>
          </button>
        </div>
        <hr />
        <div className="col job-info">
          <p className="heading">Mô tả công việc</p>
          <p className="content">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </p>
        </div>
        <hr />
        <div className="col job-info">
          <p className="heading">Yêu cầu kỹ năng</p>
          <p className="content">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </p>
        </div>
        <hr />
        <div className="col job-info">
          <p className="heading">Lợi ích khi làm việc</p>
          <p className="content">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </p>
        </div>
        <hr />
        <div className="col job-info">
          <p className="heading">Về công ty</p>
          <div className="col-md-8 mx-auto d-flex flex-column card ">
            <div className="container d-flex justify-content-center">
              <img className="avatar-small" src="../images/user-default.png" />
            </div>
            <div className="company-info d-flex flex-column text-center">
              <p>Tên công ty</p>
              <p>Lĩnh vực</p>
              <p>Ngày thành lập</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</>

    </div>
  )
}

export default ViewDetailJob