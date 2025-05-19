"use client"

import { useState, useEffect } from "react"
import UserStatisticsChart from "./UserStatisticsChart"
import JobCategoryChart from "./JobCategoryChart"
import JobStatisticsChart from "./JobStatisticsChart"
import ApplicationStatisticsChart from "./ApplicationStatisticsChart"
import ViolationStatisticsChart from "./ViolationStatisticsChart"
import axios from "axios"
import moment from "moment"
import '../../styles/admin-charts.css';

import { API_ROOT } from '../../config';

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

                const response = await axios.get(`${API_ROOT}/admin/reports`, {
                    // const response = await axios.get("http://localhost:9000/api/admin/reports", {
                    headers: {
                        Authorization: `Bearer ${storedToken}`,
                    },
                })

                console.log("Reports API Response:", {
                    jobCategories: response.data.jobCategories,
                    userStats: response.data.userStats,
                    jobStats: response.data.jobStats,
                    applicationStats: response.data.applicationStats,
                    violationStats: response.data.violationStats
                });

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
    const jobCategoriesData = reportData.jobCategories && reportData.jobCategories.length > 0
        ? reportData.jobCategories
        : [{ name: "No Data", value: 100 }]

    console.log("Formatted Job Categories Data:", jobCategoriesData);

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

    // Render stat cards with new styling
    const renderStatCards = () => {
        switch (activeTab) {
            case "users":
                return (
                    <div className="row mb-4">
                        <div className="col-md-4 mb-3">
                            <div className="stat-card">
                                <h6 className="stat-card-title">Total Users</h6>
                                <h2 className="stat-card-value">{reportData.userStats.totalUsers}</h2>
                            </div>
                        </div>
                        <div className="col-md-8 mb-3">
                            <div className="stat-card">
                                <h6 className="stat-card-title">User Distribution</h6>
                                <div style={{ height: "200px" }}>
                                    <JobCategoryChart height={220} showLegend={true} data={userRoleData} />
                                </div>
                            </div>
                        </div>
                    </div>
                )
            case "jobs":
                return (
                    <div className="row mb-4">
                        <div className="col-md-4 mb-3">
                            <div className="stat-card">
                                <h6 className="stat-card-title">Total Jobs</h6>
                                <h2 className="stat-card-value">{reportData.jobStats.totalJobs}</h2>
                            </div>
                        </div>
                        <div className="col-md-4 mb-3">
                            <div className="stat-card">
                                <h6 className="stat-card-title">Active Jobs</h6>
                                <h2 className="stat-card-value" style={{ color: 'var(--chart-success)' }}>
                                    {reportData.jobStats.activeJobs}
                                </h2>
                            </div>
                        </div>
                        <div className="col-md-4 mb-3">
                            <div className="stat-card">
                                <h6 className="stat-card-title">Inactive Jobs</h6>
                                <h2 className="stat-card-value" style={{ color: 'var(--chart-secondary)' }}>
                                    {reportData.jobStats.inactiveJobs}
                                </h2>
                            </div>
                        </div>
                    </div>
                )
            case "applications":
                return (
                    <div className="row mb-4">
                        <div className="col-md-4 mb-3">
                            <div className="stat-card">
                                <h6 className="stat-card-title">Total Applications</h6>
                                <h2 className="stat-card-value">{reportData.applicationStats.totalApplications}</h2>
                            </div>
                        </div>
                        {reportData.applicationStats.applicationsByStatus.length > 0 && (
                            <div className="col-md-8 mb-3">
                                <div className="stat-card">
                                    <h6 className="stat-card-title">Application Status</h6>
                                    <div className="d-flex justify-content-around mt-3">
                                        {reportData.applicationStats.applicationsByStatus.map((status, index) => (
                                            <div key={index} className="text-center">
                                                <h3 className="stat-card-value mb-2">{status.count}</h3>
                                                <span className="text-muted">{status.name}</span>
                                            </div>
                                        ))}
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
                            <div className="stat-card">
                                <h6 className="stat-card-title">Total Violations</h6>
                                <h2 className="stat-card-value" style={{ color: 'var(--chart-danger)' }}>
                                    {reportData.violationStats.totalViolations}
                                </h2>
                            </div>
                        </div>
                        <div className="col-md-8 mb-3">
                            <div className="stat-card">
                                <h6 className="stat-card-title">Violations by Status</h6>
                                <div className="d-flex justify-content-around mt-3">
                                    {reportData.violationStats.violationsByStatus.map((status, index) => (
                                        <div key={index} className="text-center">
                                            <h3 className="stat-card-value mb-2">{status.count}</h3>
                                            <span className="text-muted">{status.name}</span>
                                        </div>
                                    ))}
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
                    <div className="spinner-border" style={{ color: '#2b7a78' }} role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
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
                        monthlyData={reportData.jobStats.jobsByMonth}
                        jobTypeData={reportData.jobStats.jobsByType}
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
        <div className="container-fluid p-4">
            <div className="chart-container mb-4">
                <div className="row align-items-center mb-4">
                    <div className="col">
                        <h4 className="mb-1" style={{ color: '#17252a', fontWeight: 600 }}>Analytics Reports</h4>
                        <p className="text-muted mb-0">Platform performance and statistics</p>
                    </div>
                </div>

                <ul className="nav nav-tabs mb-4" style={{ borderBottom: '2px solid rgba(43, 122, 120, 0.1)' }}>
                    {[
                        { id: "users", icon: "bi-people", label: "User Stats" },
                        { id: "jobs", icon: "bi-briefcase", label: "Job Listings" },
                        { id: "applications", icon: "bi-file-earmark-text", label: "Applications" },
                        { id: "categories", icon: "bi-pie-chart", label: "Categories" },
                        { id: "violations", icon: "bi-shield-exclamation", label: "Violations" }
                    ].map(tab => (
                        <li className="nav-item" key={tab.id}>
                            <button
                                className={`nav-link ${activeTab === tab.id ? 'active' : ''}`}
                                onClick={() => setActiveTab(tab.id)}
                                style={{
                                    color: activeTab === tab.id ? '#2b7a78' : '#17252a',
                                    border: 'none',
                                    borderBottom: activeTab === tab.id ? '2px solid #2b7a78' : 'none',
                                    background: 'none',
                                    padding: '1rem 1.5rem',
                                    transition: 'all 0.2s ease',
                                    fontWeight: activeTab === tab.id ? '600' : '400'
                                }}
                            >
                                <i className={`bi ${tab.icon} me-2`}></i>
                                {tab.label}
                            </button>
                        </li>
                    ))}
                </ul>

                {renderStatCards()}

                {loading ? (
                    <div className="text-center p-5">
                        <div className="spinner-border" style={{ color: '#2b7a78' }} role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : error ? (
                    <div className="alert alert-danger">{error}</div>
                ) : (
                    renderChart()
                )}
            </div>
        </div>
    )
}
