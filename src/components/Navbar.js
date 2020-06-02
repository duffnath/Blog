import React from 'react'
import { Link } from 'gatsby'
import github from '../img/github-icon.svg'
import logo from '../img/NateDuff.com-w-l.png'
import darkLogo from '../img/NateDuff.com-w-d.png'
import DarkModeToggle from '../components/DarkModeToggle'
import { isAdmin } from './Authorization'

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
    return (
      <nav
        className="navbar is-transparent"
        role="navigation"
        aria-label="main-navigation"
      >
        <div className="container">
          <div className="navbar-brand">
            <Link to="/" className="navbar-item" title="Logo">
              <img src={darkLogo} className="darkLogo" alt="NateDuffBlogLogo" style={{ width: '150px' }} />
              <img src={logo} className="lightLogo" alt="NateDuffBlogLogoDark" style={{ width: '150px' }} />              
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
              <Link className="navbar-item" to="/services">
                Services
              </Link>
              {this.props.isAuthenticated && isAdmin() ? 
                <Link className="navbar-item" to="/products">
                  Products
                </Link> : null}
              <Link className="navbar-item" to="/blog">
                Blog
              </Link>
              <Link className="navbar-item" to="/contact">
                Contact
              </Link>              
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
