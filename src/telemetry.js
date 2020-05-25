import { ApplicationInsights } from '@microsoft/applicationinsights-web'

const appInsights = new ApplicationInsights({ config: {
  connectionString: process.env.appInsightsConnectionString
} });

appInsights.loadAppInsights();

export { appInsights };
