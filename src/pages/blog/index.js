import React from 'react'

import Layout from '../../components/Layout'
import BlogRoll from '../../components/BlogRoll'
import { appInsights } from '../../telemetry'

export default class BlogIndexPage extends React.Component {
  render() {
    
    appInsights.trackPageView();

    return (
      <Layout>
        <div
          className="full-width-image-container margin-top-0"
          style={{
            backgroundImage: `url('/img/blog-index.jpg')`,
          }}
        >
          <h1
            className="has-text-weight-bold is-size-1"
            style={{
              boxShadow: '0.5rem 0 0 rgb(24, 69, 59, 0.54), -0.5rem 0 0 rgb(24, 69, 59, 0.54)',
              backgroundColor: 'rgb(24, 69, 59, 0.54)',
              color: 'white',
              padding: '1rem',
            }}
          >
            Latest Stories
          </h1>
        </div>
        <section className="section">
          <div className="container">
            <div className="content">
              <BlogRoll />
            </div>
          </div>
        </section>
      </Layout>
    )
  }
}
