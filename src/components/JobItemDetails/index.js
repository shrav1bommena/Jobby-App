/* eslint-disable react/no-unknown-property */
import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'
import {BsBriefcaseFill} from 'react-icons/bs'
import {BiLinkExternal} from 'react-icons/bi'

import Header from '../Header'

import './index.css'

const apiStatusConstants = {
  failure: 'FAILURE',
  success: 'SUCCESS',
  inProgress: 'IN_PROGRESS',
  initial: 'INITIAL',
}

class JobItemDetails extends Component {
  state = {
    jobDetails: {},
    similarJobs: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getJobItemDetails()
  }

  onApiSuccess = (jobDetails, similarJobs) => {
    this.setState({
      jobDetails,
      similarJobs,
      apiStatus: apiStatusConstants.success,
    })
  }

  getJobItemDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    const data = await response.json()
    if (response.ok) {
      const jobDetails = data.job_details
      const similarJobs = data.similar_jobs
      const updatedJobDetails = {
        companyLogoUrl: jobDetails.company_logo_url,
        companyWebsiteUrl: jobDetails.company_website_url,
        employmentType: jobDetails.employment_type,
        id: jobDetails.id,
        jobDescription: jobDetails.job_description,
        lifeAtCompany: {
          description: jobDetails.life_at_company.description,
          imageUrl: jobDetails.life_at_company.image_url,
        },
        location: jobDetails.location,
        packagePerAnnum: jobDetails.package_per_annum,
        rating: jobDetails.rating,
        skills: jobDetails.skills.map(eachSkill => ({
          name: eachSkill.name,
          imageUrl: eachSkill.image_url,
        })),
        title: jobDetails.title,
      }
      const updatedSimilarJobs = similarJobs.map(eachJob => ({
        companyLogoUrl: eachJob.company_logo_url,
        employmentType: eachJob.employment_type,
        id: eachJob.id,
        jobDescription: eachJob.job_description,
        location: eachJob.location,
        rating: eachJob.rating,
        title: eachJob.title,
      }))

      this.onApiSuccess(updatedJobDetails, updatedSimilarJobs)
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderJobDetails = () => {
    const {jobDetails, similarJobs} = this.state
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      jobDescription,
      lifeAtCompany,
      location,
      packagePerAnnum,
      rating,
      skills,
      title,
    } = jobDetails

    return (
      <div>
        <div className="job-details-content">
          <div className="job-details-logo-container">
            <img
              className="job-details-logo"
              src={companyLogoUrl}
              alt="job details company logo"
            />
            <div className="job-details-designation-container">
              <h1 className="job-details-designation">{title}</h1>
              <div className="job-details-rating-container">
                <AiFillStar className="job-details-rating-star" />
                <p className="job-details-rating">{rating}</p>
              </div>
            </div>
          </div>
          <div className="job-details-salary-container">
            <div className="job-details-location-container">
              <MdLocationOn className="job-details-icon" />
              <p className="job-details-label">{location}</p>
            </div>
            <div className="job-details-type-container">
              <BsBriefcaseFill className="job-details-icon" />
              <p className="job-details-label">{employmentType}</p>
            </div>

            <p className="job-details-salary">{packagePerAnnum}</p>
          </div>
          <hr className="job-details-hr-line" />
          <div className="job-details-visit-container">
            <h1 className="job-details-description-heading">Description</h1>
            <a
              className="job-details-visit"
              href={companyWebsiteUrl}
              target="_blank"
              rel="noreferrer"
            >
              Visit
              <BiLinkExternal />
            </a>
          </div>
          <p className="job-details-description">{jobDescription}</p>
          <h1>Skills</h1>
          <ul className="job-details-skills-container">
            {skills.map(eachSkill => (
              <li className="job-details-skill-container" key={eachSkill.name}>
                <img
                  className="job-details-skill-image"
                  src={eachSkill.imageUrl}
                  alt={eachSkill.name}
                />
                <p className="job-details-skill-name">{eachSkill.name}</p>
              </li>
            ))}
          </ul>
          <h1>Life at Company</h1>
          <div className="job-details-life-container">
            <p className="job-details-life-description">
              {lifeAtCompany.description}
            </p>
            <img
              className="job-details-life-image"
              src={lifeAtCompany.imageUrl}
              alt="life at company"
            />
          </div>
        </div>
        <h1>Similar Jobs</h1>
        <ul className="similar-jobs-container">
          {similarJobs.map(eachJob => (
            <li className="similar-job-container" key={eachJob.id}>
              <div className="job-details-logo-container">
                <img
                  className="job-details-logo"
                  src={eachJob.companyLogoUrl}
                  alt="similar job company logo"
                />
                <div className="job-details-designation-container">
                  <h1 className="job-details-designation">{eachJob.title}</h1>
                  <div className="job-details-rating-container">
                    <AiFillStar className="job-details-rating-star" />
                    <p className="job-details-rating">{eachJob.rating}</p>
                  </div>
                </div>
              </div>
              <h1 className="job-details-description-heading">Description</h1>
              <p className="job-details-description">
                {eachJob.jobDescription}
              </p>
              <div className="job-details-salary-container">
                <div className="job-details-location-container">
                  <MdLocationOn className="job-details-icon" />
                  <p className="job-details-label">{eachJob.location}</p>
                </div>
                <div className="job-details-type-container">
                  <BsBriefcaseFill className="job-details-icon" />
                  <p className="job-details-label">{eachJob.employmentType}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  renderInProgressView = () => (
    <div className="loader-container" testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderFailureView = () => (
    <div className="job-details-failure-container">
      <img
        className="job-details-failure-image"
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1 className="job-details-failure-heading">
        Oops! Something Went Wrong
      </h1>
      <p className="job-details-failure-description">
        We cannot seem to find the page you are looking for.
      </p>
      <button
        className="job-details-failure-retry-button"
        type="button"
        onClick={this.getJobItemDetails}
      >
        Retry
      </button>
    </div>
  )

  renderJobItemData = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderInProgressView()
      case apiStatusConstants.success:
        return this.renderJobDetails()
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
        <div className="job-bg-details">{this.renderJobItemData()}</div>
      </>
    )
  }
}

export default JobItemDetails
