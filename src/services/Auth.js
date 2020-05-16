// src/services/Auth.js
import AuthenticationContext from '../adal' //
//import AuthenticationContext from 'adal-angular' 
import AdalConfig from '../config/AdalConfig'

if (typeof window !== 'undefined') {
    window.Logging.log = function(message) {
        console.log(message);
      }
      window.Logging.level = 2
}

// Initialize the authentication
export default new AuthenticationContext(AdalConfig)