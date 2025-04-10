import React from 'react';
import { Link } from 'react-router-dom';

const Homepage = () => {
    return (
        <main class="container">
            <div id="carouselExample" class="carousel slide" data-bs-ride="carousel">
                <div class="carousel-inner">
                    <div class="carousel-item active">
                        <img src="/images/1.png" class="d-block w-100" alt="Banner 1"/>
                    </div>
                    <div class="carousel-item">
                        <img src="/images/2.png" class="d-block w-100" alt="Banner 2"/>
                    </div>
                    <div class="carousel-item">
                        <img src="/images/3.png" class="d-block w-100" alt="Banner 3"/>
                    </div>
                </div>
                <button class="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
                    <span class="carousel-control-prev-icon"></span>
                </button>
                <button class="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
                    <span class="carousel-control-next-icon"></span>
                </button>
            </div>

            <div class="d-flex justify-content-center align-items-center search-bar">
                <form class="d-flex w-100">
                    <input class="form-control search-input" type="search" placeholder="Tìm kiếm việc làm..."/>
                    <button class="btn btn-success search-btn" type="submit">Tìm kiếm</button>
                </form>
            </div>

            <div class="row mt-4">
                <p class="h2">Được đề xuất cho bạn</p>
                <div class="col-md-4">
                    <div class="card p-3">
                        <div class="card-body">
                            <p class="text-secondary italic">x days ago</p>
                            <h5 class="card-title"><a href="#" class="job-title">Công việc 1</a></h5>
                            <p class="card-text location"><i class="fa fa-location-dot">&emsp;</i>Địa điểm làm việc</p>
                            <p class="card-text job-field"><i class="fa fa-bars">&emsp;</i>Lĩnh vực</p>
                            <p class="card-text job-type"><i class="fa fa-suitcase">&emsp;</i>Loại công việc</p>
                        </div>

                    </div>
                </div>

                <div class="col-md-4">
                    <div class="card p-3">
                        <div class="card-body">
                            <p class="text-secondary italic">x days ago</p>
                            <h5 class="card-title"><a href="#" class="job-title">Công việc 1</a></h5>
                            <p class="card-text location"><i class="fa fa-location-dot">&emsp;</i>Địa điểm làm việc</p>
                            <p class="card-text job-field"><i class="fa fa-bars">&emsp;</i>Lĩnh vực</p>
                            <p class="card-text job-type"><i class="fa fa-suitcase">&emsp;</i>Loại công việc</p>
                        </div>

                    </div>
                </div>

                <div class="col-md-4">
                    <div class="card p-3">
                        <div class="card-body">
                            <p class="text-secondary italic">x days ago</p>
                            <h5 class="card-title"><a href="#" class="job-title">Công việc 1</a></h5>
                            <p class="card-text location"><i class="fa fa-location-dot">&emsp;</i>Địa điểm làm việc</p>
                            <p class="card-text job-field"><i class="fa fa-bars">&emsp;</i>Lĩnh vực</p>
                            <p class="card-text job-type"><i class="fa fa-suitcase">&emsp;</i>Loại công việc</p>
                        </div>

                    </div>
                </div>

                <div class="col-md-4">
                    <div class="card p-3">
                        <div class="card-body">
                            <p class="text-secondary italic">x days ago</p>
                            <h5 class="card-title"><a href="#" class="job-title">Công việc 1</a></h5>
                            <p class="card-text location"><i class="fa fa-location-dot">&emsp;</i>Địa điểm làm việc</p>
                            <p class="card-text job-field"><i class="fa fa-bars">&emsp;</i>Lĩnh vực</p>
                            <p class="card-text job-type"><i class="fa fa-suitcase">&emsp;</i>Loại công việc</p>
                        </div>

                    </div>
                </div>
            </div>

            <div class="row mt-4">
                <p class="h2">Mới nhất</p>
                <div class="col-md-4">
                    <div class="card p-3">
                        <div class="card-body">
                            <p class="text-secondary italic">x days ago</p>
                            <h5 class="card-title"><a href="#" class="job-title">Công việc 1</a></h5>
                            <p class="card-text location"><i class="fa fa-location-dot">&emsp;</i>Địa điểm làm việc</p>
                            <p class="card-text job-field"><i class="fa fa-bars">&emsp;</i>Lĩnh vực</p>
                            <p class="card-text job-type"><i class="fa fa-suitcase">&emsp;</i>Loại công việc</p>
                        </div>

                    </div>
                </div>

                <div class="col-md-4">
                    <div class="card p-3">
                        <div class="card-body">
                            <p class="text-secondary italic">x days ago</p>
                            <h5 class="card-title"><a href="#" class="job-title">Công việc 1</a></h5>
                            <p class="card-text location"><i class="fa fa-location-dot">&emsp;</i>Địa điểm làm việc</p>
                            <p class="card-text job-field"><i class="fa fa-bars">&emsp;</i>Lĩnh vực</p>
                            <p class="card-text job-type"><i class="fa fa-suitcase">&emsp;</i>Loại công việc</p>
                        </div>

                    </div>
                </div>

                <div class="col-md-4">
                    <div class="card p-3">
                        <div class="card-body">
                            <p class="text-secondary italic">x days ago</p>
                            <h5 class="card-title"><a href="#" class="job-title">Công việc 1</a></h5>
                            <p class="card-text location"><i class="fa fa-location-dot">&emsp;</i>Địa điểm làm việc</p>
                            <p class="card-text job-field"><i class="fa fa-bars">&emsp;</i>Lĩnh vực</p>
                            <p class="card-text job-type"><i class="fa fa-suitcase">&emsp;</i>Loại công việc</p>
                        </div>

                    </div>
                </div>
            </div>

        </main>
    );
}

export default Homepage;