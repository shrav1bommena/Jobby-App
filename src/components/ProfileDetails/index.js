import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  failure: 'FAILURE',
  success: 'SUCCESS',
  inProgress: 'IN_PROGRESS',
}

class ProfileDetails extends Component {
  state = {apiStatus: apiStatusConstants.initial, profileDetails: {}}

  componentDidMount() {
    this.getProfileData()
  }

  onApiSuccess = profileDetails => {
    this.setState({profileDetails, apiStatus: apiStatusConstants.success})
  }

  getProfileData = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')

    const apiUrl = 'https://apis.ccbp.in/profile'
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    const data = await response.json()
    if (response.ok) {
      this.onApiSuccess(data.profile_details)
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderProfileData = () => {
    const {profileDetails} = this.state
    return (
      <div className="profile-bg-container">
        <img
          src={profileDetails.profile_image_url}
          className="profile-image"
          alt="profile"
        />
        <h1 className="profile-name">{profileDetails.name}</h1>
        <p className="profile-designation">{profileDetails.short_bio}</p>
      </div>
    )
  }

  renderFailure = () => (
    <div className="profile-failure-container">
      <button
        className="profile-failure-retry-button"
        onClick={this.getProfileData}
        type="button"
      >
        Retry
      </button>
    </div>
  )

  renderInProgress = () => (
    // eslint-disable-next-line react/no-unknown-property
    <div className="loader-container" testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderData = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        // console.log('here')
        return this.renderInProgress()
      case apiStatusConstants.success:
        return this.renderProfileData()
      case apiStatusConstants.failure:
        return this.renderFailure()

      default:
        return null
    }
  }

  render() {
    return <>{this.renderData()}</>
  }
}

export default ProfileDetails
