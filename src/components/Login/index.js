import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'

import './index.css'

class Login extends Component {
  state = {username: '', password: '', errorMsg: '', isValid: true}

  onSubmitSuccess = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {
      expires: 30,
    })
    history.replace('/')
  }

  onSubmitFailure = errorMsg => {
    this.setState({errorMsg, isValid: false})
  }

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  verifyUser = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {username, password}
    const apiUrl = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(apiUrl, options)
    const data = await response.json()
    if (response.ok) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.onSubmitFailure(data.error_msg)
    }
  }

  render() {
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    const {username, password, isValid, errorMsg} = this.state

    return (
      <div className="login-div">
        <div className="form-div">
          <div className="login-logo-container">
            <img
              className="login-website-logo"
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
              alt="website logo"
            />
          </div>
          <form onSubmit={this.verifyUser}>
            <div className="login-input-container">
              <label className="login-input-label" htmlFor="username">
                USERNAME
              </label>
              <input
                className="login-input"
                value={username}
                id="username"
                type="text"
                placeholder="Username"
                onChange={this.onChangeUsername}
              />
            </div>
            <div className="login-input-container">
              <label className="login-input-label" htmlFor="password">
                PASSWORD
              </label>
              <input
                className="login-input"
                value={password}
                id="password"
                type="password"
                placeholder="Password"
                onChange={this.onChangePassword}
              />
            </div>
            <button className="login-button" type="submit">
              Login
            </button>
            {isValid ? '' : <p className="login-error">*{errorMsg}</p>}
          </form>
        </div>
      </div>
    )
  }
}

export default Login
