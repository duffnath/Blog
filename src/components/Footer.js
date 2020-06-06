import React, {Component} from 'react'
import { Link } from 'gatsby'

// import logo from '../img/logo.svg'
import logo from '../img/Nateduff.com-l.png'
import darkLogo from '../img/Nateduff.com-d.png'
import facebook from '../img/social/facebook.svg'
import linkedin from '../img/social/linkedin.svg'
import twitter from '../img/social/twitter.svg'

import AdalConfig from '../config/AdalConfig'
import AuthContext from '../services/Auth'
import { appInsights } from '../telemetry'
import { isLoggedIn, getUserName, isAdmin } from './Authorization'

const Footer = class extends React.Component {
  render() {
    const handleLogout = event => {    
      event.preventDefault();

      let logoutProps = {};
      if (isLoggedIn()) {
        logoutProps = { 'User': getUserName() }        
      }

      appInsights.trackEvent({ name: 'Logout', properties: logoutProps });

      AuthContext.logOut();
    };

    const handleLogin = event => {    
      event.preventDefault();

      appInsights.trackEvent({ name: 'Login' });

      AuthContext.login();
    };

    const openAdmin = event => {
      event.preventDefault();
      
      window.location.href = `${process.env.CmsAdminURL}`;
    }

    const openBuild = () => {
      if (typeof window !== 'undefined')
        var url = `${process.env.SYSTEM_TEAMFOUNDATIONCOLLECTIONURI}`;
  
        var win = window.open(url, '_blank');
        win.focus();
    };

    const openRelease = () => {
      if (typeof window !== 'undefined')
        var url = `${process.env.RELEASE_URL}`;
  
        var win = window.open(url, '_blank');
        win.focus();
    };

    return (
      <footer className="footer has-background-black has-text-white-ter">
        <div className="content has-text-centered">
          <img
            src={logo}
            alt="NateDuffBlogSite"
            className="darkLogo"
            style={{ width: '14em', height: '10em' }}
          />
          <img
            src={darkLogo}
            alt="NateDuffBlogSiteDark"
            className="lightLogo"
            style={{ width: '14em', height: '10em' }}
          />
        </div>
        <div className="content has-text-centered has-background-black has-text-white-ter">
          <div className="container has-background-black has-text-white-ter">
            <div className="columns">
              <div className="column is-4">
                <section className="menu">
                  <ul className="menu-list">
                    <li>
                      <Link to="/" className="navbar-item">
                        Home
                      </Link>
                    </li>
                    <li>
                      <Link className="navbar-item" to="/about">
                        About
                      </Link>
                    </li>
                    <Link className="navbar-item" to="/services">
                        Services  
                    </Link>
                    {this.props.isAuthenticated && isAdmin() ? 
                    <li>
                      <Link className="navbar-item" to="/products">
                        Products
                      </Link>
                    </li> : null
                    }
                  </ul>
                </section>
              </div>
              <div className="column is-4">
                <section>
                  <ul className="menu-list">                    
                    <li>
                      <Link className="navbar-item" to="/blog">
                        Blog
                      </Link>
                    </li>
                    <li>
                      <Link className="navbar-item" to="/contact">
                        Contact
                      </Link>
                    </li>
                    {this.props.isAuthenticated && isAdmin() ? 
                      <li><Link className="navbar-item" onClick={openAdmin} to="#">
                        Admin
                      </Link></li> : null}
                    {this.props.isAuthenticated ? 
                      <li><Link className="navbar-item" 
                        onClick={handleLogout} to="#logout">
                        Logout
                      </Link></li> : <li><Link className="navbar-item" 
                        onClick={handleLogin} to="#login">
                        Login
                      </Link></li>
                    }
                    
                  </ul>
                </section>
              </div>
              <div className="column is-4 social">
                <span>Follow me!</span><br /><br />
                <a title="Follow us on Facebook" href={process.env.FacebookPage}>
                  <img
                    src={facebook}
                    alt="Facebook"
                    style={{ width: '1em', height: '1em' }}
                  />
                </a>
                <a title="Follow us on Twitter" href={`https://twitter.com/${process.env.TwitterHandle.toLowerCase()}`}>
                  <img
                    className="fas fa-lg"
                    src={twitter}
                    alt="Twitter"
                    style={{ width: '1em', height: '1em' }}
                  />
                </a>
                <a title="Follow us on Linkedin" href={process.env.LinkedInPage}>
                  <img
                    src={linkedin}
                    alt="LinkedIn"
                    style={{ width: '1em', height: '1em' }}
                  />
                </a>
                { this.props.isAuthenticated  ? 
                  <div><br /><br />
                    <img id="buildStatusBadge" src={process.env.BuildStatusBadge} onClick={openBuild}></img>
                  <br /><br />
                  <img id="releaseStatusBadge" src={process.env.ReleaseStatusBadge} onClick={openRelease}></img>
                  </div> : null }
              </div>
            </div>
          </div>
        </div>
      </footer>
    )
  }
}

export default Footer
