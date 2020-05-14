import React from 'react'
import { ThemeToggler } from 'gatsby-plugin-dark-mode'

class MyComponent extends React.Component {
  render() {
    return (
      <ThemeToggler>
        {({ theme, toggleTheme }) => (
          <label id="darkModeSwitch">
            <input
              type="checkbox"
              onChange={e => toggleTheme(e.target.checked ? 'dark' : 'light')}
              checked={theme === 'dark'}
            />{' '}            
            <span className="slider round"></span>
          </label>          
        )}
      </ThemeToggler>
    )
  }
}

export default MyComponent;