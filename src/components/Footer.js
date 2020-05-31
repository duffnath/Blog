import React, {Component} from 'react'
import { Link } from 'gatsby'

// import logo from '../img/logo.svg'
import logo from '../img/Nateduff.com-l.png'
import darkLogo from '../img/Nateduff.com-d.png'
import facebook from '../img/social/facebook.svg'
import linkedin from '../img/social/linkedin.svg'
import twitter from '../img/social/twitter.svg'

import { BrowserView, CustomView  } from 'react-device-detect'
import AdalConfig from '../config/AdalConfig'
import AuthContext from '../services/Auth'
import { appInsights } from '../telemetry'
import { isLoggedIn, getUserName } from './Authorization'

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
      
      window.location.href = "https://duffsitestore.z14.web.core.windows.net/admin/#"
    }

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
                    <li>
                      <Link className="navbar-item" to="/products">
                        Products
                      </Link>
                    </li>
                  </ul>
                </section>
              </div>
              <div className="column is-4">
                <section>
                  <ul className="menu-list">
                    <li>
                      <Link className="navbar-item" to="/blog">
                        Latest Stories
                      </Link>
                    </li>
                    <li>
                      <Link className="navbar-item" to="/contact">
                        Contact
                      </Link>
                    </li>
                    
                    {/* <CustomView condition={typeof navigator !== "undefined" && navigator.platform === "Win32"}>
                      {this.props.isAuthenticated && this.props.isAdmin ? 
                      <li><Link className="navbar-item" onClick={openAdmin} to="#">
                        Admin
                      </Link></li> : null}
                    </CustomView> */}
                    <BrowserView>
                      {this.props.isAuthenticated && this.props.isAdmin ? 
                      <li><Link className="navbar-item" onClick={openAdmin} to="#admin">
                        Admin
                      </Link></li> : null}
                    </BrowserView>
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
                <a title="facebook" href="https://www.facebook.com/n8duff">
                  <img
                    src={facebook}
                    alt="Facebook"
                    style={{ width: '1em', height: '1em' }}
                  />
                </a>
                <a title="twitter" href="https://twitter.com/n8duff">
                  <img
                    className="fas fa-lg"
                    src={twitter}
                    alt="Twitter"
                    style={{ width: '1em', height: '1em' }}
                  />
                </a>
                <a title="linkedin" href="http://www.linkedin.com/in/nate-duff">
                  <img
                    src={linkedin}
                    alt="LinkedIn"
                    style={{ width: '1em', height: '1em' }}
                  />
                </a>
                { this.props.isAuthenticated  ? 
                  <div><br /><br />
                    <img id="buildStatusBadge" src="https://dev.azure.com/NateDuff/Netlify/_apis/build/status/duffnath.Blog?branchName=master"></img>
                  <br /><br />
                  <img id="releaseStatusBadge" src="https://vsrm.dev.azure.com/NateDuff/_apis/public/Release/badge/d73e4336-92ad-4fee-b549-9b78fbc20fe1/2/2"></img>
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
