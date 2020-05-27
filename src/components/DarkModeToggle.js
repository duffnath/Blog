import React from 'react';

import Toggle from './Toggle';
import useDarkMode from 'use-dark-mode';
import { appInsights } from '../telemetry'
import { isLoggedIn, getUserName } from './Authorization'

const DarkModeToggle = () => {
  const darkMode = useDarkMode(false);

  const handleToggle = event => {
    //event.preventDefault(); //this forces 2nd click...dont

    let action = 'Enable';
    
    if (darkMode.value) {
      action = 'Disable'
    }

    if (isLoggedIn()) {
      appInsights.trackEvent({ name: 'DarkMode', properties: { 'Action': action, 'User': getUserName() } })
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
