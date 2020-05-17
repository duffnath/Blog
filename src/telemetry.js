import { ApplicationInsights } from '@microsoft/applicationinsights-web'

const appInsights = new ApplicationInsights({ config: {
  connectionString: "InstrumentationKey=837dcc30-21da-4252-8d67-d27f19a0c049"
} });

appInsights.loadAppInsights();

export { appInsights };
