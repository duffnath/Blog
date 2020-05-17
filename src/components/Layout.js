import React from 'react'
import { Helmet } from 'react-helmet'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'
import './all.sass'
import useSiteMetadata from './SiteMetadata'
import { withPrefix } from 'gatsby'

import AdalConfig from '../config/AdalConfig'
import AuthContext from '../services/Auth'

import { BrowserView } from 'react-device-detect'

// import * as toastr from 'toastr'

import { appInsights } from '../telemetry'

export const onServiceWorkerUpdateReady = () => {
  const answer = window.confirm(
    `This application has been updated. ` +
      `Reload to display the latest version?`
  )
  if (answer === true) {
    window.location.reload()
  }
}

const TemplateWrapper = ({ children }) => {
  const { title, description } = useSiteMetadata()
  let isAuthenticated = false;

  let pushToken = "";
  if (typeof window !== 'undefined') {
    pushToken = window.localStorage.token;
  }

  AuthContext.handleWindowCallback()

  if (typeof window !== 'undefined' && (window === window.parent) && window === window.top && !AuthContext.isCallback(window.location.hash)) {
    if (!AuthContext.getCachedToken(AdalConfig.clientId) || !AuthContext.getCachedUser()) {
      console.log('Not logged in');

      appInsights.trackPageView({name: window.title, uri: window.location.href, isLoggedIn: false, properties: {Token: pushToken}})
    } else {
      AuthContext.acquireToken(AdalConfig.endpoints.api, (message, token, msg) => {
        if (token) {
          appInsights.setAuthenticatedUserContext(_adalInstance._user.profile.oid, _adalInstance._user.profile.upn, true);

          isAuthenticated = true;

          appInsights.trackPageView({name: window.title, uri: window.location.href, isLoggedIn: true, properties: {User: _adalInstance._user.profile.upn, Token: pushToken}})
        }
      })
    }
  }

  return (
      <div className="content">      
        <Helmet>
          <html lang="en" />
          <title>{title}</title>
          <meta name="description" content={description} />

          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href={`${withPrefix('/')}img/apple-touch-icon.png`}
          />
          <link
            rel="icon"
            type="image/png"
            href={`${withPrefix('/')}img/favicon-32x32.png`}
            sizes="32x32"
          />
          <link
            rel="icon"
            type="image/png"
            href={`${withPrefix('/')}img/favicon-16x16.png`}
            sizes="16x16"
          />

          <link
            rel="mask-icon"
            href={`${withPrefix('/')}img/safari-pinned-tab.svg`}
            color="#ff4400"
          />
          <meta name="theme-color" content="#fff" />

          <meta property="og:type" content="business.business" />
          <meta property="og:title" content={title} />
          <meta property="og:url" content="/" />
          <meta
            property="og:image"
            content={`${withPrefix('/')}img/og-image.jpg`}
          />
        </Helmet>
        
          <Navbar isAuthenticated={isAuthenticated}/>

          <div>{children}</div>

          <Helmet 
            script={[{ 
              type: 'text/javascript', 
              innerHTML: "var classNameDark = 'dark-mode';\
              var classNameLight = 'light-mode';\
              function setClassOnDocumentBody(darkMode) {\
                if (document.body) {\
                document.body.classList.add(\
                  darkMode ? classNameDark : classNameLight\
                );\
                document.body.classList.remove(\
                  darkMode ? classNameLight : classNameDark\
                );\
              }\
              var preferDarkQuery = '(prefers-color-scheme: dark)';\
              var mql = window.matchMedia(preferDarkQuery);\
              var supportsColorSchemeQuery = mql.media === preferDarkQuery;\
              var localStorageTheme = null;\
              try {\
                localStorageTheme = localStorage.getItem('darkMode');\
              } catch (err) {}\
              var localStorageExists = localStorageTheme !== null;\
              if (localStorageExists) {\
                localStorageTheme = JSON.parse(localStorageTheme);\
              }\
              if (localStorageExists) {\
                setClassOnDocumentBody(localStorageTheme);\
              } else if (supportsColorSchemeQuery) {\
                setClassOnDocumentBody(mql.matches);\
                localStorage.setItem('darkMode', mql.matches);\
              } else {\
                var isDarkMode = document.body.classList.contains(classNameDark);\
                localStorage.setItem('darkMode', JSON.stringify(isDarkMode));\
              }}"}]} />              

          <Helmet>
            <script src="https://www.gstatic.com/firebasejs/7.14.1/firebase-app.js"></script>
            <script src="https://www.gstatic.com/firebasejs/7.14.1/firebase-messaging.js"></script>
          </Helmet>

          <Helmet
            script={[{
              type: 'text/javascript', 
              innerHTML: "var firebaseConfig = {\
                apiKey: 'AIzaSyAyiEi2fGHUVCafFOnjIABB94iibC1Oq8c',\
                authDomain: 'nateduffpwa.firebaseapp.com',\
                databaseURL: 'https://nateduffpwa.firebaseio.com',\
                projectId: 'nateduffpwa',\
                storageBucket: 'nateduffpwa.appspot.com',\
                messagingSenderId: '275924356890',\
                appId: '1:275924356890:web:0e7f2a1d04922879',\
              };\
              if ('serviceWorker' in navigator) {\
                navigator.serviceWorker.register('/sw.js').then(\
                  function (registration) {\
                    console.log('Registration successful, scope is:', registration.scope);\
                    console.log('Setting up Firebase');\
                    firebase.initializeApp(firebaseConfig);\
                    const messaging = firebase.messaging();\
                    messaging.useServiceWorker(registration);\
                    messaging.usePublicVapidKey(\
                      'BKT14aRXCrYZ4IrvjgjNCo7jP0lAAnZnJTtHFT3Pi11q9Hh0QAcAX2LoYxrLB51JwywwitgDEFhHDW_vuX9Dfcg'\
                    );\
                    messaging.onTokenRefresh(() => {\
                      messaging\
                        .getToken()\
                        .then((refreshedToken) => {\
                          console.log('Token refreshed.');\
                          localStorage.setItem('token', token);\
                        })\
                        .catch((err) => {\
                          console.log('Unable to retrieve refreshed token ', err);\
                        });\
                    });\
                    messaging.onMessage((payload) => {\
                      console.log('Message received. ', payload);\
                    });\
                    messaging\
                        .getToken()\
                        .then((token) => {\
                          console.log('Token retrieved.');\
                          console.log(token);\
                          localStorage.setItem('token', token);\
                        });\
                  },\
                  function (err) {\
                    console.log('ServiceWorker registration failed: ', err);\
                  }\
                )}" 
            }]}/>
          <Footer />   
      </div>
  )
}

export default TemplateWrapper
