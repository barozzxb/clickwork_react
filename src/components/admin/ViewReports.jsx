"use client"

import { useState, useEffect } from "react"
import UserStatisticsChart from "./UserStatisticsChart"
import JobCategoryChart from "./JobCategoryChart"
import JobStatisticsChart from "./JobStatisticsChart"
import ApplicationStatisticsChart from "./ApplicationStatisticsChart"
import ViolationStatisticsChart from "./ViolationStatisticsChart"
import axios from "axios"
import moment from "moment"

export default function ViewReports() {
    const [activeTab, setActiveTab] = useState("users")
    const [timePeriod, setTimePeriod] = useState("year")
    const [reportData, setReportData] = useState({
        jobStats: {
            totalJobs: 0,
            activeJobs: 0,
            inactiveJobs: 0,
            jobsByType: [],
        },
        applicationStats: {
            totalApplications: 0,
            applicationsByStatus: [],
            applicationsByMonth: [],
        },
        userStats: {
            totalUsers: 0,
            usersByRole: [],
            usersByStatus: [],
            registrationsByMonth: [],
        },
        jobCategories: [],
        violationStats: {
            totalViolations: 0,
            violationsByStatus: [],
            violationsByMonth: [],
        },
    })
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchReportData = async () => {
            try {
                setLoading(true)
                const storedToken = localStorage.getItem("token")

                if (!storedToken) {
                    setError("Authentication token not found. Please log in again.")
                    setLoading(false)
                    return
                }

                const response = await axios.get("http://localhost:9000/api/v1/admin/reports", {
                    headers: {
                        Authorization: `Bearer ${storedToken}`,
                    },
                })

                setReportData(response.data)
                setError(null)
            } catch (err) {
                console.error("Error fetching report data:", err)
                if (err.response && err.response.status === 401) {
                    setError("Session expired. Please log in again.")
                } else {
                    setError("Failed to load report data. Please try again later.")
                }
            } finally {
                setLoading(false)
            }
        }

        fetchReportData()
    }, [timePeriod]) // Refetch when time period changes

    // Helper function to sort data by date
    const sortDataByDate = (data) => {
        return [...data].sort((a, b) => {
            const dateA = moment(a.name, "YYYY-MM")
            const dateB = moment(b.name, "YYYY-MM")
            return dateA.diff(dateB)
        })
    }

    // Format and sort month names in registration data
    const formattedRegistrationData = (() => {
        // First sort the data
        const sortedData = sortDataByDate(reportData.userStats.registrationsByMonth)

        // Then format the month names
        return sortedData.map((item) => {
            const [year, month] = item.name.split("-")
            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
            return {
                name: `${monthNames[Number.parseInt(month) - 1]} ${year}`,
                count: item.count,
                originalDate: item.name, // Keep original date for sorting reference if needed
            }
        })
    })()

    // Format job categories data for pie chart
    const jobCategoriesData =
        reportData.jobCategories.length > 0
            ? reportData.jobCategories.map((category) => ({
                name: category.name,
                value: category.count,
            }))
            : [{ name: "No Data", value: 100 }]

    // Format and sort application data
    const applicationData = (() => {
        if (reportData.applicationStats.applicationsByMonth.length === 0) return []

        // First sort the data
        const sortedData = sortDataByDate(reportData.applicationStats.applicationsByMonth)

        // Then format the month names
        return sortedData.map((item) => {
            const [year, month] = item.name.split("-")
            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
            return {
                name: `${monthNames[Number.parseInt(month) - 1]} ${year}`,
                count: item.count,
                originalDate: item.name, // Keep original date for sorting reference if needed
            }
        })
    })()

    // Format and sort job listings data
    const jobListingData = (() => {
        if (reportData.jobStats.jobsByType.length === 0) return []

        // First sort the data
        const sortedData = sortDataByDate(reportData.jobStats.jobsByType)

        // Then format the month names
        return sortedData.map((item) => {
            const [year, month] = item.name.split("-")
            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
            return {
                name: `${monthNames[Number.parseInt(month) - 1]} ${year}`,
                count: item.count,
                originalDate: item.name, // Keep original date for sorting reference if needed
            }
        })
    })()

    // Format and sort violations data
    const violationsData = (() => {
        // First sort the data
        const sortedData = sortDataByDate(reportData.violationStats.violationsByMonth)

        // Then format the month names
        return sortedData.map((item) => {
            const [year, month] = item.name.split("-")
            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
            return {
                name: `${monthNames[Number.parseInt(month) - 1]} ${year}`,
                count: item.count,
                originalDate: item.name, // Keep original date for sorting reference if needed
            }
        })
    })()

    // Format user role data
    const userRoleData = reportData.userStats.usersByRole.map((item) => ({
        name: item.name,
        value: parseFloat(((item.count / reportData.userStats.totalUsers) * 100).toFixed(1)),
    }))
    //console.log(userRoleData);


    // Format user status data
    const userStatusData = reportData.userStats.usersByStatus.map((item) => ({
        name: item.name,
        value: ((item.count / reportData.userStats.totalUsers) * 100).toFixed(1),
    }))

    // Render stat cards
    const renderStatCards = () => {
        switch (activeTab) {
            case "users":
                return (
                    <div className="row mb-4">
                        <div className="col-md-4 mb-3">
                            <div className="card h-100 border-0 shadow-sm">
                                <div className="card-body">
                                    <h6 className="card-title text-muted mb-1">Total Users</h6>
                                    <h2 className="mb-0 fw-bold">{reportData.userStats.totalUsers}</h2>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-8 mb-3">
                            <div className="card h-100 border-0 shadow-sm">
                                <div className="card-body">
                                    <h6 className="card-title text-muted mb-3">User Distribution</h6>
                                    <div style={{ height: "200px" }}>
                                        <JobCategoryChart height={210} showLegend={true} data={userRoleData} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            case "jobs":
                return (
                    <div className="row mb-4">
                        <div className="col-md-4 mb-3">
                            <div className="card h-100 border-0 shadow-sm">
                                <div className="card-body">
                                    <h6 className="card-title text-muted mb-1">Total Jobs</h6>
                                    <h2 className="mb-0 fw-bold">{reportData.jobStats.totalJobs}</h2>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4 mb-3">
                            <div className="card h-100 border-0 shadow-sm">
                                <div className="card-body">
                                    <h6 className="card-title text-muted mb-1">Active Jobs</h6>
                                    <h2 className="mb-0 fw-bold text-success">{reportData.jobStats.activeJobs}</h2>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4 mb-3">
                            <div className="card h-100 border-0 shadow-sm">
                                <div className="card-body">
                                    <h6 className="card-title text-muted mb-1">Inactive Jobs</h6>
                                    <h2 className="mb-0 fw-bold text-secondary">{reportData.jobStats.inactiveJobs}</h2>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            case "applications":
                return (
                    <div className="row mb-4">
                        <div className="col-md-4 mb-3">
                            <div className="card h-100 border-0 shadow-sm">
                                <div className="card-body">
                                    <h6 className="card-title text-muted mb-1">Total Applications</h6>
                                    <h2 className="mb-0 fw-bold">{reportData.applicationStats.totalApplications}</h2>
                                </div>
                            </div>
                        </div>
                        {reportData.applicationStats.applicationsByStatus.length > 0 && (
                            <div className="col-md-8 mb-3">
                                <div className="card h-100 border-0 shadow-sm">
                                    <div className="card-body">
                                        <h6 className="card-title text-muted mb-3">Application Status</h6>
                                        <div className="d-flex justify-content-around">
                                            {reportData.applicationStats.applicationsByStatus.map((status, index) => (
                                                <div key={index} className="text-center">
                                                    <h5 className="mb-0">{status.count}</h5>
                                                    <small className="text-muted">{status.name}</small>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )
            case "violations":
                return (
                    <div className="row mb-4">
                        <div className="col-md-4 mb-3">
                            <div className="card h-100 border-0 shadow-sm">
                                <div className="card-body">
                                    <h6 className="card-title text-muted mb-1">Total Violations</h6>
                                    <h2 className="mb-0 fw-bold text-danger">{reportData.violationStats.totalViolations}</h2>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-8 mb-3">
                            <div className="card h-100 border-0 shadow-sm">
                                <div className="card-body">
                                    <h6 className="card-title text-muted mb-3">Violations by Status</h6>
                                    <div className="d-flex justify-content-around">
                                        {reportData.violationStats.violationsByStatus.map((status, index) => (
                                            <div key={index} className="text-center">
                                                <h5 className="mb-0">{status.count}</h5>
                                                <small className="text-muted">{status.name}</small>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            default:
                return null
        }
    }

    // Render appropriate chart based on active tab
    const renderChart = () => {
        if (loading) {
            return (
                <div className="text-center p-5">
                    <div className="spinner-border" role="status"></div>
                </div>
            )
        }

        if (error) {
            return <div className="alert alert-danger">{error}</div>
        }

        switch (activeTab) {
            case "users":
                return <UserStatisticsChart chartType="bar" height={350} data={formattedRegistrationData} />
            case "jobs":
                return (
                    <JobStatisticsChart
                        height={350}
                        data={jobListingData.length > 0 ? jobListingData : [{ name: "No data available", count: 0 }]}
                    />
                )
            case "applications":
                return (
                    <ApplicationStatisticsChart
                        height={350}
                        data={applicationData.length > 0 ? applicationData : [{ name: "No data available", count: 0 }]}
                    />
                )
            case "categories":
                return <JobCategoryChart height={300} showLegend={true} data={jobCategoriesData} />
            case "violations":
                return (
                    <ViolationStatisticsChart
                        height={250}
                        data={violationsData}
                        showStatusDistribution={true}
                        statusData={reportData.violationStats.violationsByStatus}
                    />
                )
            default:
                return null
        }
    }

    return (
        <div className="container-fluid p-0">
            <div className="card shadow-sm mb-4">
                <div className="card-header bg-white py-3">
                    <div className="row align-items-center">
                        <div className="col-md-8 mb-3 mb-md-0">
                            <h4 className="card-title fw-bold mb-1">Analytics Reports</h4>
                            <p className="text-muted small">Platform performance and statistics</p>
                        </div>
                        {/* <div className="col-md-4">
              <div className="mb-3">
                <label htmlFor="time-period" className="form-label">Time Period</label>
                <select
                  className="form-select"
                  id="time-period"
                  value={timePeriod}
                  onChange={(e) => setTimePeriod(e.target.value)}
                >
                  <option value="month">Last 30 days</option>
                  <option value="quarter">Last 90 days</option>
                  <option value="year">Last 12 months</option>
                </select>
              </div>
            </div> */}
                    </div>
                </div>
                <div className="card-body">
                    <ul className="nav nav-tabs mb-4">
                        <li className="nav-item">
                            <button
                                className={`nav-link ${activeTab === "users" ? "active" : ""}`}
                                onClick={() => setActiveTab("users")}
                            >
                                <i className="bi bi-people me-2"></i>User Stats
                            </button>
                        </li>
                        <li className="nav-item">
                            <button
                                className={`nav-link ${activeTab === "jobs" ? "active" : ""}`}
                                onClick={() => setActiveTab("jobs")}
                            >
                                <i className="bi bi-briefcase me-2"></i>Job Listings
                            </button>
                        </li>
                        <li className="nav-item">
                            <button
                                className={`nav-link ${activeTab === "applications" ? "active" : ""}`}
                                onClick={() => setActiveTab("applications")}
                            >
                                <i className="bi bi-file-earmark-text me-2"></i>Applications
                            </button>
                        </li>
                        <li className="nav-item">
                            <button
                                className={`nav-link ${activeTab === "categories" ? "active" : ""}`}
                                onClick={() => setActiveTab("categories")}
                            >
                                <i className="bi bi-pie-chart me-2"></i>Categories
                            </button>
                        </li>
                        <li className="nav-item">
                            <button
                                className={`nav-link ${activeTab === "violations" ? "active" : ""}`}
                                onClick={() => setActiveTab("violations")}
                            >
                                <i className="bi bi-shield-exclamation me-2"></i>Violations
                            </button>
                        </li>
                    </ul>

                    {renderStatCards()}

                    <div className="chart-container bg-light p-4 rounded" style={{ position: "relative" }}>
                        {renderChart()}
                    </div>
                </div>
            </div>
        </div>
    )
}
