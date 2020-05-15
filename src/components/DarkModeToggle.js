import React from 'react';

import Toggle from './Toggle';
import useDarkMode from 'use-dark-mode';
import { ApplicationInsights } from '@microsoft/applicationinsights-web'

const appInsights = new ApplicationInsights({ config: {
  connectionString: "InstrumentationKey=837dcc30-21da-4252-8d67-d27f19a0c049"
} });

appInsights.loadAppInsights();

const DarkModeToggle = () => {
  const darkMode = useDarkMode(false);

  return (
    <div className="dark-mode-toggle">
      <button type="button" onClick={darkMode.disable && darkMode.value ? null : appInsights.trackEvent({ name: 'DarkMode', properties: { 'Action': 'Disable' } })}>
        ☀
      </button>
      <Toggle checked={darkMode.value} onChange={darkMode.toggle} />
      <button type="button" onClick={darkMode.enable && darkMode.value ? appInsights.trackEvent({ name: 'DarkMode', properties: { 'Action': 'Enable' } }) : null}>
        ☾
      </button>
    </div>
  );
};

export default DarkModeToggle;
