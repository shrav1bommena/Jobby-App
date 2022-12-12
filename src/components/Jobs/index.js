/* eslint-disable react/no-unknown-property */
import {Component} from 'react'
import Cookies from 'js-cookie'
import {BsSearch} from 'react-icons/bs'
import Loader from 'react-loader-spinner'

import Header from '../Header'
import ProfileDetails from '../ProfileDetails'
import JobItem from '../JobItem'

import './index.css'

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Jobs extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    jobsList: [],
    searchJob: '',
    employmentType: [],
    minimumPackage: '',
  }

  componentDidMount() {
    this.getJobsData()
  }

  onApiSuccess = jobsList => {
    this.setState({jobsList, apiStatus: apiStatusConstants.success})
  }

  getJobsData = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {searchJob, employmentType, minimumPackage} = this.state
    const combinedEmploymentType = employmentType.join()
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${combinedEmploymentType}&minimum_package=${minimumPackage}&search=${searchJob}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    const data = await response.json()
    if (response.ok) {
      const jobsData = data.jobs
      const updatedJobsData = jobsData.map(eachJob => ({
        companyLogoUrl: eachJob.company_logo_url,
        employmentType: eachJob.employment_type,
        id: eachJob.id,
        jobDescription: eachJob.job_description,
        location: eachJob.location,
        packagePerAnnum: eachJob.package_per_annum,
        rating: eachJob.rating,
        title: eachJob.title,
      }))
      this.onApiSuccess(updatedJobsData)
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  updateSearch = event => {
    this.setState({searchJob: event.target.value})
  }

  updateFilterSalary = salary => {
    this.setState({minimumPackage: salary}, this.getJobsData)
  }

  updateTypeEmployment = id => {
    const {employmentType} = this.state
    const isPresent = employmentType.includes(id)
    if (isPresent) {
      this.setState(
        prevState => ({
          employmentType: prevState.employmentType.filter(
            eachType => eachType !== id,
          ),
        }),
        this.getJobsData,
      )
    } else {
      this.setState(
        prevState => ({
          employmentType: [...prevState.employmentType, id],
        }),
        this.getJobsData,
      )
    }
  }

  filterBySearchJob = () => {
    this.getJobsData()
  }

  renderFilterTypeEmployment = () => (
    <>
      <h1 className="jobs-filter-heading">Type of Employment</h1>
      <ul className="jobs-filter-list">
        {employmentTypesList.map(eachType => {
          const updateTypeSalary = () => {
            this.updateTypeEmployment(eachType.employmentTypeId)
          }
          return (
            <li className="jobs-filter-item" key={eachType.employmentTypeId}>
              <input
                type="checkbox"
                id={eachType.employmentTypeId}
                value={eachType.employmentTypeId}
                onChange={updateTypeSalary}
              />
              <label
                className="jobs-filter-label"
                htmlFor={eachType.employmentTypeId}
              >
                {eachType.label}
              </label>
            </li>
          )
        })}
      </ul>
    </>
  )

  renderFilterSalary = () => (
    <>
      <h1 className="jobs-filter-heading">Salary Range</h1>
      <ul className="jobs-filter-list">
        {salaryRangesList.map(eachSalaryRange => {
          const updateSalary = () => {
            this.updateFilterSalary(eachSalaryRange.salaryRangeId)
          }
          return (
            <li
              className="jobs-filter-item"
              key={eachSalaryRange.salaryRangeId}
            >
              <input
                type="radio"
                id={eachSalaryRange.salaryRangeId}
                name="salaryRange"
                value={eachSalaryRange.salaryRangeId}
                onChange={updateSalary}
              />
              <label
                className="jobs-filter-label"
                htmlFor={eachSalaryRange.salaryRangeId}
              >
                {eachSalaryRange.label}
              </label>
            </li>
          )
        })}
      </ul>
    </>
  )

  renderMobileSearch = () => {
    const {searchJob} = this.state
    return (
      <div className="job-item-mobile-input-container">
        <input
          className="job-item-input"
          type="search"
          value={searchJob}
          onChange={this.updateSearch}
        />
        <button
          className="job-item-search-button"
          type="button"
          testid="searchButton"
          onClick={this.getJobsData}
        >
          <BsSearch className="search-icon" />
        </button>
      </div>
    )
  }

  renderDesktopSearch = () => {
    const {searchJob} = this.state
    return (
      <div className="job-item-desktop-input-container">
        <input
          className="job-item-input"
          type="search"
          value={searchJob}
          onChange={this.updateSearch}
        />
        <button
          className="job-item-search-button"
          type="button"
          testid="searchButton"
          onClick={this.getJobsData}
        >
          <BsSearch className="search-icon" />
        </button>
      </div>
    )
  }

  renderInProgressView = () => (
    <div className="loader-container" testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderFailureView = () => (
    <div className="jobs-failure-container">
      <img
        className="jobs-failure-image"
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1 className="jobs-failure-heading">Oops! Something Went Wrong</h1>
      <p className="jobs-failure-description">
        We cannot seem to find the page you are looking for.
      </p>
      <button
        className="jobs-failure-retry-button"
        onClick={this.getJobsData}
        type="button"
      >
        Retry
      </button>
    </div>
  )

  renderJobsData = () => {
    const {jobsList} = this.state

    if (jobsList.length !== 0) {
      return (
        <ul className="jobs-list">
          {jobsList.map(eachJob => (
            <JobItem key={eachJob.id} eachJob={eachJob} />
          ))}
        </ul>
      )
    }
    return (
      <div className="jobs-not-found-container">
        <img
          className="jobs-not-found-image"
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
          alt="no jobs"
        />
        <h1 className="jobs-not-found-heading">No Jobs Found</h1>
        <p className="jobs-not-found-description">
          We could not find any jobs. Try other filters
        </p>
      </div>
    )
  }

  renderBasedOnApiStatus = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderJobsData()
      case apiStatusConstants.inProgress:
        return this.renderInProgressView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="jobs-bg-container">
          <div className="jobs-filter-container">
            {this.renderMobileSearch()}
            <ProfileDetails />
            <hr className="job-item-hr-line" />
            {this.renderFilterTypeEmployment()}
            <hr className="job-item-hr-line" />
            {this.renderFilterSalary()}
          </div>
          <div className="jobs-list-container">
            {this.renderDesktopSearch()}
            {this.renderBasedOnApiStatus()}
          </div>
        </div>
      </>
    )
  }
}

export default Jobs
