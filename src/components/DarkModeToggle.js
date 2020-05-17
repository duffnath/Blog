import React from 'react';

import Toggle from './Toggle';
import useDarkMode from 'use-dark-mode';
import appInsights from '../telemetry'

const DarkModeToggle = () => {
  const darkMode = useDarkMode(false);

  const handleToggle = event => {
    //event.preventDefault(); //this forces 2nd click...dont

    let action = 'Enable';
    
    if (darkMode.value) {
      action = 'Disable'
    }

    if (_adalInstance?._user) {
      appInsights.trackEvent({ name: 'DarkMode', properties: { 'Action': action, 'User': _adalInstance._user.userName } })
    } else {
      appInsights.trackEvent({ name: 'DarkMode', properties: { 'Action': action } })
    }
  }

  return (
    <div className="dark-mode-toggle" onChange={handleToggle}>
      <button type="button">
        ☀
      </button>
      <Toggle checked={darkMode.value} onChange={darkMode.toggle} />
      <button>
        ☾
      </button>
    </div>
  );
};

export default DarkModeToggle;
