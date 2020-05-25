import React from 'react'
import { Link } from 'gatsby'
import github from '../img/github-icon.svg'
// import logo from '../img/logo.svg'
import logo from '../img/NateDuff.com-w-l.png'
import darkLogo from '../img/NateDuff.com-w-d.png'
import DarkModeToggle from '../components/DarkModeToggle'

import { BrowserView } from 'react-device-detect'

import AdalConfig from '../config/AdalConfig'
import AuthContext from '../services/Auth'

import { appInsights } from '../telemetry'

const Navbar = class extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      active: false,
      isAdmin: false,
      navBarActiveClass: '',
    }
  }

  toggleHamburger = () => {
    // toggle the active boolean in the state
    this.setState(
      {
        active: !this.state.active,
      },
      // after state has been updated,
      () => {
        // set the class in state for the navbar accordingly
        this.state.active
          ? this.setState({
              navBarActiveClass: 'is-active',
            })
          : this.setState({
              navBarActiveClass: '',
            })
      }
    )
  }

  render() {      
    const handleLogout = event => {    
      event.preventDefault();

      if (typeof _adalInstance !== 'undefined') {
        appInsights.trackEvent({ name: 'Logout', properties: { 'User': _adalInstance._user.userName } });
      }

      AuthContext.logOut();
    };

    const handleLogin = event => {    
      event.preventDefault();

      appInsights.trackEvent({ name: 'Login' });

      AuthContext.login();
    };

    const openAdmin = event => {
      event.preventDefault();
      
      window.location.href = "https://duffsitestore.z14.web.core.windows.net/admin/#"
    }

    return (
      <nav
        className="navbar is-transparent"
        role="navigation"
        aria-label="main-navigation"
      >
        <div className="container">
          <div className="navbar-brand">
            <Link to="/" className="navbar-item" title="Logo">
              <img src={darkLogo} className="darkLogo" alt="Kaldi" style={{ width: '150px' }} />
              <img src={logo} className="lightLogo" alt="NateDuffBlogSiteDark" style={{ width: '150px' }} />              
            </Link>
            
            {/* Hamburger menu */}
            <div
              className={`navbar-burger burger ${this.state.navBarActiveClass}`}
              data-target="navMenu"
              onClick={() => this.toggleHamburger()}
            >
              <span />
              <span />
              <span />
            </div>
          </div>
          <div
            id="navMenu"
            className={`navbar-menu ${this.state.navBarActiveClass}`}
          >
            <div className="navbar-start has-text-centered">
              <Link className="navbar-item" to="/about">
                About
              </Link>
              <Link className="navbar-item" to="/products">
                Products
              </Link>
              <Link className="navbar-item" to="/blog">
                Blog
              </Link>
              <Link className="navbar-item" to="/contact">
                Contact
              </Link>
              <BrowserView>
              {this.props.isAuthenticated && this.props.isAdmin ? 
              <Link className="navbar-item" onClick={openAdmin}>
                Admin
              </Link> : null}</BrowserView>
              {this.props.isAuthenticated ? 
              <Link className="navbar-item" 
                onClick={handleLogout}>
                Logout
              </Link> : <Link className="navbar-item" 
                onClick={handleLogin}>
                Login
              </Link>}
            </div>          
            <div className="navbar-end has-text-centered">
              <DarkModeToggle />
            </div>
          </div>
        </div>
      </nav>
    )
  }
}

export default Navbar
