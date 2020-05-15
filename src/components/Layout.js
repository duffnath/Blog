import React from 'react'
import { Helmet } from 'react-helmet'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'
import './all.sass'
import useSiteMetadata from './SiteMetadata'
import { withPrefix } from 'gatsby'

import DarkModeStatus from './DarkModeStatus';

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
        
          <Navbar />
          <DarkModeStatus />
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
              <Helmet script={[{
                type: 'text/javascript', 
                innerHTML: "var appInsights = window.appInsights || function (a) {\
                  function b(a) { c[a] = function () { var b = arguments; c.queue.push(function () { c[a].apply(c, b) }) } } var c = { config: a }, d = document, e = window; setTimeout(function () { var b = d.createElement('script'); b.src = a.url || 'https://az416426.vo.msecnd.net/scripts/a/ai.0.js', d.getElementsByTagName('script')[0].parentNode.appendChild(b) }); try { c.cookie = d.cookie } catch (a) { } c.queue = []; for (var f = ['Event', 'Exception', 'Metric', 'PageView', 'Trace', 'Dependency']; f.length;)b('track' + f.pop()); if (b('setAuthenticatedUserContext'), b('clearAuthenticatedUserContext'), b('startTrackEvent'), b('stopTrackEvent'), b('startTrackPage'), b('stopTrackPage'), b('flush'), !a.disableExceptionTracking) { f = 'onerror', b('_' + f); var g = e[f]; e[f] = function (a, b, d, e, h) { var i = g && g(a, b, d, e, h); return !0 !== i && c['_' + f](a, b, d, e, h), i } } return c\
                  }({\
                  instrumentationKey: '837dcc30-21da-4252-8d67-d27f19a0c049'\
                  });"
              }]} />

          <Footer />   
      </div>
  )
}

export default TemplateWrapper
