import {Link} from 'react-router-dom'
import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'
import {BsBriefcaseFill} from 'react-icons/bs'

import './index.css'

const JobItem = props => {
  const {eachJob} = props
  const {
    companyLogoUrl,
    id,
    employmentType,
    jobDescription,
    location,
    packagePerAnnum,
    rating,
    title,
  } = eachJob

  return (
    <li className="job-item-container">
      <Link className="job-item-content" to={`/jobs/${id}`}>
        <div className="job-item-logo-container">
          <img
            className="job-item-logo"
            src={companyLogoUrl}
            alt="company logo"
          />
          <div className="job-item-designation-container">
            <h1 className="job-item-designation">{title}</h1>
            <div className="job-item-rating-container">
              <AiFillStar className="job-item-rating-star" />
              <p className="job-item-rating">{rating}</p>
            </div>
          </div>
        </div>
        <div className="job-item-salary-container">
          <div className="job-item-location-container">
            <MdLocationOn className="job-item-icon" />
            <p className="job-item-label">{location}</p>
          </div>
          <div className="job-item-type-container">
            <BsBriefcaseFill className="job-item-icon" />
            <p className="job-item-label">{employmentType}</p>
          </div>

          <p className="job-item-salary">{packagePerAnnum}</p>
        </div>
        <hr className="job-item-hr-line" />
        <h1 className="job-item-description-heading">Description</h1>
        <p className="job-item-description">{jobDescription}</p>
      </Link>
    </li>
  )
}

export default JobItem
