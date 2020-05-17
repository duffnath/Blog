import React from 'react'
import { Link } from 'gatsby'
import github from '../img/github-icon.svg'
import logo from '../img/logo.svg'
import DarkModeToggle from '../components/DarkModeToggle'

import AdalConfig from '../config/AdalConfig'
import AuthContext from '../services/Auth'

import * as appInsights from '../telemetry'

const Navbar = class extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      active: false,
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

    return (
      <nav
        className="navbar is-transparent"
        role="navigation"
        aria-label="main-navigation"
      >
        <div className="container">
          <div className="navbar-brand">
            <Link to="/" className="navbar-item" title="Logo">
              <img src={logo} alt="Kaldi" style={{ width: '88px' }} />
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
              <Link className="navbar-item" to="/contact/examples">
                Form Examples
              </Link>
              {this.props.isAuthenticated ? 
              <Link className="navbar-item" to="/admin">
                Admin
              </Link> : null}
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
