import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import {AiFillHome} from 'react-icons/ai'
import {BsBriefcaseFill} from 'react-icons/bs'
import {FiLogOut} from 'react-icons/fi'

import './index.css'

const Header = props => {
  const logoutUser = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }
  return (
    <nav className="nav-header">
      <div className="nav-content">
        <Link to="/">
          <img
            className="website-logo"
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
          />
        </Link>

        <div className="nav-menu">
          <Link to="/" className="nav-link">
            Home
          </Link>

          <Link to="/jobs" className="nav-link">
            Jobs
          </Link>
        </div>

        <button
          onClick={logoutUser}
          className="logout-desktop-button"
          type="button"
        >
          Logout
        </button>

        <ul className="nav-mobile-menu">
          <li>
            <Link to="/" className="nav-link">
              <AiFillHome className="nav-icon" />
            </Link>
          </li>
          <li>
            <Link to="/jobs" className="nav-link">
              <BsBriefcaseFill className="nav-icon" />
            </Link>
          </li>
          <li>
            <button
              onClick={logoutUser}
              className="logout-mobile-button"
              type="button"
            >
              <FiLogOut />
            </button>
          </li>
        </ul>
      </div>
    </nav>
  )
}
export default withRouter(Header)
