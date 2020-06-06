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
import { getUserName, getUserId, isAdmin } from './Authorization'

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
  let isAdmin = false;

  let pushToken = "";
  if (typeof window !== 'undefined') {
    pushToken = window.localStorage.token;
  }

  AuthContext.handleWindowCallback()

  if (typeof window !== 'undefined' && (window === window.parent) && window === window.top && !AuthContext.isCallback(window.location.hash)) {
    if (!AuthContext.getCachedToken(AdalConfig.clientId) || !AuthContext.getCachedUser()) {
      appInsights.trackPageView({name: window.title, uri: window.location.href, isLoggedIn: false, properties: {Token: pushToken}})
    } else {
      AuthContext.acquireToken(AdalConfig.endpoints.api, (message, token, msg) => {
        if (token) {
          appInsights.setAuthenticatedUserContext(getUserId(), getUserName(), true);

          isAuthenticated = true;

          isAdmin = isAdmin;

          appInsights.trackPageView({name: window.title, uri: window.location.href, isLoggedIn: true, properties: {User: getUserName(), Token: pushToken}})
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
          <meta
            property="og:image"
            content={`${withPrefix('/')}img/spartyfam.jpg`}
          />
        </Helmet>
        
          <Navbar isAuthenticated={isAuthenticated} isAdmin={isAdmin}/>

          <div>{children}</div>

          <Helmet 
            script={[{ 
              type: 'text/javascript', 
              innerHTML: `var classNameDark = 'dark-mode';
              var classNameLight = 'light-mode';
              function setClassOnDocumentBody(darkMode) {
                if (document.body) {
                document.body.classList.add(
                  darkMode ? classNameDark : classNameLight
                );
                document.body.classList.remove(
                  darkMode ? classNameLight : classNameDark
                );
              }
              var preferDarkQuery = '(prefers-color-scheme: dark)';
              var mql = window.matchMedia(preferDarkQuery);
              var supportsColorSchemeQuery = mql.media === preferDarkQuery;
              var localStorageTheme = null;
              try {
                localStorageTheme = localStorage.getItem('darkMode');
              } catch (err) {}
              var localStorageExists = localStorageTheme !== null;
              if (localStorageExists) {
                localStorageTheme = JSON.parse(localStorageTheme);
              }
              if (localStorageExists) {
                setClassOnDocumentBody(localStorageTheme);
              } else if (supportsColorSchemeQuery) {
                setClassOnDocumentBody(mql.matches);
                localStorage.setItem('darkMode', mql.matches);
              } else {
                var isDarkMode = document.body.classList.contains(classNameDark);
                localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
              }}`}]} />              

          <Helmet
            style={[{
              "cssText": `
              button.toast-close-button {
                color: #000;
                font-size: 2em;
                margin-top: -8px;
              }
              .toast-info {
                background-image: url('${process.env.HOSTNAME}/img/logo.png')!important;       
                background-size: 2.5rem !important;         
                background-color: #cacaca !important;
                color: #161b1f !important;
                width: 28em !important;
                margin-top: 50px !important;
                padding-left: 65px !important;
                opacity: .75;
              }
              @media (max-width: 700px) {
                .toast-info {
                  width: 24em !important;
                }
                button.toast-close-button {
                  font-size: 2.5em;
                  margin-top: -8px;
                }
              }
              `
            }]}>
          </Helmet>

          <Helmet>          
            <script src={`${withPrefix('/')}firebase-app.js`} type="text/javascript" />
            <script src={`${withPrefix('/')}firebase-messaging.js`} type="text/javascript" />
            <script src={`${withPrefix('/')}jquery-3.1.1.min.js`} type="text/javascript" />
            <script src={`${withPrefix('/')}toastr.js`} type="text/javascript" />            
            <link rel="stylesheet" type="text/css" href={`${withPrefix('/')}toastr.min.css`} />
          </Helmet>

          <Helmet defer
            script={[{
              type: 'text/javascript', 
              innerHTML: `var firebaseConfig = {
                apiKey: '${process.env.firebase_apiKey}',
                authDomain: '${process.env.firebase_authDomain}',
                databaseURL: '${process.env.firebase_databaseURL}',
                projectId: '${process.env.firebase_projectId}',
                storageBucket: '${process.env.firebase_storageBucket}',
                messagingSenderId: '${process.env.firebase_messagingSenderId}',
                appId: '${process.env.firebase_appId}',
              };
              function showInAppNotification(data, from) {
                console.log(data);
                console.log(\`From: \${from}\`);
                let notification = "";
              
                if (from !== 'firebase') {
                  notification = data.firebaseMessaging.payload.notification;
                } else {
                  notification = data.notification;
                }                
              
                toastr.options = {
                  closeButton: true,
                  timeOut: 0,
                  extendedTimeOut: 0,
                  preventDuplicates: true
                };

                toastr.options.onclick = function(e) { 
                  if (this.data.refresh) {
                    window.location.reload();
                  } else {
                    window.location.href = \`\${window.location.origin}/\${this.data.target}\`;
                  }                  
                }
              
                toastr.info(notification.body, notification.title, {"data": {"target": notification.click_action}});
              };
              function subscribeToTopic(token, topic) {
                let cachedToken = window.localStorage.token;
                let cachedUser = window.localStorage.upn;
                if (!cachedToken || (!cachedUser && typeof _adalInstance !== 'undefined' && _adalInstance._user !== null)) {
                  window.localStorage.setItem('token', token);
                  if (!cachedUser && typeof _adalInstance !== 'undefined' && _adalInstance._user !== null) {
                    window.localStorage.setItem('upn', _adalInstance._user.profile.upn);
                  }
                  $.ajax({
                    type: 'POST',
                    url: 'https://iid.googleapis.com/iid/v1/' + token + '/rel/topics/BlogSubscribers',
                    contentType: 'application/json',
                    dataType: 'json',
                    headers: {
                      Authorization: 'key=${process.env.firebase_serverKey}',
                    },
                    success: function (response) {
                      console.log(response);
                    },
                    error: function (xhr, status, error) {
                      console.log(xhr);
                    },
                  });
                  $.ajax({
                    type: 'POST',
                    url: location.origin + '${process.env.NewSubscriberAPI}',
                    contentType: 'application/json',
                    dataType: 'json',
                    data: JSON.stringify({"regToken": token, "email": window.localStorage.upn}),
                    success: function (response) {
                      console.log(response);
                    },
                    error: function (xhr, status, error) {
                      console.log(xhr);
                    },
                  });
                }
              }
              if ('serviceWorker' in navigator) {
                navigator.serviceWorker.register('/sw.js').then(
                  function (registration) {
                    console.log('Registration successful, scope is:', registration.scope);
                    console.log('Setting up Firebase');
                    firebase.initializeApp(firebaseConfig);
                    const messaging = firebase.messaging();
                    messaging.useServiceWorker(registration);
                    messaging.usePublicVapidKey(
                      '${process.env.firebase_publicKey}'
                    );
                    messaging.onTokenRefresh(() => {
                      messaging
                        .getToken()
                        .then((refreshedToken) => {
                          console.log('Token refreshed.');
                          localStorage.setItem('token', token);
                          subscribeToTopic(token, 'BlogSubscribers');
                        })
                        .catch((err) => {
                          console.log('Unable to retrieve refreshed token ', err);
                        });
                    });
                    //messaging.onMessage((payload) => {
                      //showInAppNotification(payload, 'firebase');
                    //});
                    messaging
                        .getToken()
                        .then((token) => {
                          subscribeToTopic(token, 'BlogSubscribers');
                        });
                    registration.onupdatefound = () => {
                      const installingWorker = registration.installing;
                      installingWorker.onstatechange = () => {
                        switch (installingWorker.state) {
                          case 'installed':
                            if (navigator.serviceWorker.controller) {
                              // new update available
                              resolve(true);
                            } else {
                              // no update available
                              resolve(false);
                            }
                            break;
                        }
                      };
                    };
                  },
                  function (err) {
                    console.log('ServiceWorker registration failed: ', err);
                  }                  
                ); 
                navigator.serviceWorker.addEventListener('message', (event) => {
                  showInAppNotification(event.data, 'client');                    
                });             
                window.isUpdateAvailable = new Promise(function(resolve, reject) {
                  if ('serviceWorker' in navigator) {
                    navigator.serviceWorker.register('/sw.js').then(
                      function (registration) {
                        registration.onupdatefound = () => {
                          const installingWorker = registration.installing;
                          installingWorker.onstatechange = () => {
                            switch (installingWorker.state) {
                              case 'installed':
                                toastr.options = {
                                  closeButton: true,
                                  timeOut: 5000,
                                  extendedTimeOut: 1000,
                                  preventDuplicates: true,
                                  positionClass: "toast-bottom-full-width",
                                  progressBar: true
                                };
                
                                toastr.options.onclick = function(e) { 
                                  if (this.data.refresh) {
                                    window.location.reload();
                                  } else {
                                    window.location.href = \`\${window.location.origin}/\${this.data.target}\`;
                                  }                  
                                }
                                
                                toastr.info(null, 'New Version available! Click to refresh', {"data": {"refresh": true}});
                                if (navigator.serviceWorker.controller) {
                                  resolve(true);
                                } else {
                                  resolve(false);
                                }
                                break;
                            }
                          };
                        };
                      }
                    );                  
                }});    
              }` 
            }]}/>         

          <Footer isAuthenticated={isAuthenticated} isAdmin={isAdmin} />   
      </div>
  )
}

export default TemplateWrapper
