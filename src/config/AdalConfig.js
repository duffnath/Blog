// src/config/AdalConfig.js
export default {
    clientId: '10c8583f-ca09-4a85-830c-64c04459ee87',
    endpoints: {
      api: "10c8583f-ca09-4a85-830c-64c04459ee87" // Necessary for CORS requests, for more info see https://github.com/AzureAD/azure-activedirectory-library-for-js/wiki/CORS-usage
    },
    // 'tenant' is the Azure AD instance.
    tenant: '52a6b4f9-ebe5-40c8-96c1-51a352fbe525',
    // 'cacheLocation' is set to 'sessionStorage' by default (see https://github.com/AzureAD/azure-activedirectory-library-for-js/wiki/Config-authentication-context#configurable-options.
    // We change it to'localStorage' because 'sessionStorage' does not work when our app is served on 'localhost' in development.
    cacheLocation: 'sessionStorage'
  }