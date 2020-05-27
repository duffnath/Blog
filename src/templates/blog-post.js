import React from 'react'
import PropTypes from 'prop-types'
import { kebabCase } from 'lodash'
import { Helmet } from 'react-helmet'
import { graphql, Link } from 'gatsby'
import Layout from '../components/Layout'
import Content, { HTMLContent } from '../components/Content'
import { appInsights } from '../telemetry'
import useSiteMetadata from '../components/SiteMetadata'
import $ from 'jquery'
import { isAdmin } from '../components/Authorization'

export const BlogPostTemplate = ({
  content,
  contentComponent,
  description,
  tags,
  title,
  helmet,
}) => {
  const PostContent = contentComponent || Content

  const sendPushNotification = () => {
    var imagePath = $("section > div > div > div > div:nth-child(3) img")[0].src;
    var title = $("h1.title")[0].innerText;
    var body = $("#gatsby-focus-wrapper > div > div > section > div > div > div > p")[0].innerText;
    var pagePath = window?.location.pathname.substring(1);

    $.ajax({
      type: "POST",
      url: "https://fcm.googleapis.com/fcm/send",
      headers: {
        Authorization: `key=${process.env.firebase_serverKey}`,
      },
      contentType: "application/json",
      dataType: "json",
      data: JSON.stringify({
        to: `/topics/BlogSubscribers`,
        notification: {
          body: body,
          title: title,
          icon: "https://blog.nateduff.com/img/logo-whitebackground.png",
          image: imagePath,
          tag:  "message-tag-01",
          forceClick: true,
          click_action: pagePath,
          actionTitle: "Read More",
          actionIcon: "https://blog.nateduff.com/img/logo.png",
          badge: "https://blog.nateduff.com/img/logo.png"
        },
        webpush: {
          fcm_options: {
            link: pagePath,
          },
        },
      }),
      success: function (response) {
        appInsights.trackEvent(`Push for ${pagePath}`, {"reponse": response});
      },
      error: function (xhr, status, error) {
        console.log(error);
      },
    });
  }

  return (
    <section className="section">
      {helmet || ''}
      <div className="container content">
        <div className="columns">
          <div className="column is-10 is-offset-1">
            <h1 className="title is-size-2 has-text-weight-bold is-bold-light">
              {title}
            </h1>
            <p>{description}</p>
            <PostContent content={content} />
            {tags && tags.length ? (
              <div style={{ marginTop: `4rem` }}>
                <h4>Tags</h4>
                <ul className="taglist">
                  {tags.map((tag) => (
                    <li key={tag + `tag`}>
                      <Link to={`/tags/${kebabCase(tag)}/`}>{tag}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            {/* _adalInstance?._user.profile.upn.endsWith("@nateduff.com") */}
            {isAdmin ? <div id="promoteBlogSection">
              <h4>Social Promotion</h4>
              <button className="button is-link" onClick={() => sendPushNotification()}>
                Send Push Notification
              </button>
            </div> : null}
          </div>
        </div>
      </div>
    </section>
  )
}

BlogPostTemplate.propTypes = {
  content: PropTypes.node.isRequired,
  contentComponent: PropTypes.func,
  description: PropTypes.string,
  title: PropTypes.string,
  helmet: PropTypes.object,
}

const BlogPost = ({ data }) => {
  const { markdownRemark: post } = data

  appInsights.trackPageView();

  return (
    <Layout>
      <BlogPostTemplate
        content={post.html}
        contentComponent={HTMLContent}
        description={post.frontmatter.description}
        helmet={
          <Helmet>
            <title>{`${useSiteMetadata().title} | ${post.frontmatter.title}`}</title>
            <meta
              name="description"
              content={`${post.frontmatter.description}`}
            />
          </Helmet>
        }
        tags={post.frontmatter.tags}
        title={post.frontmatter.title}
      />
    </Layout>
  )
}

BlogPost.propTypes = {
  data: PropTypes.shape({
    markdownRemark: PropTypes.object,
  }),
}

export default BlogPost

export const pageQuery = graphql`
  query BlogPostByID($id: String!) {
    markdownRemark(id: { eq: $id }) {
      id
      html
      frontmatter {
        date(formatString: "MMMM DD, YYYY")
        title
        description
        tags
      }
    }
  }
`
