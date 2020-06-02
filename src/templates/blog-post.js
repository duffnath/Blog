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
import { isAdmin, isLoggedIn } from '../components/Authorization'

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

  const sendToFacebook = () => {
    if (typeof window !== 'undefined')
      var url = `https://www.facebook.com/dialog/share?app_id=246272106789439&display=page&href=${window.location.href}&redirect_uri=https://blog.nateduff.com/blog/`;

      var win = window.open(url, '_blank');
      win.focus();
  };

  const sendToLinkedin = () => {
    if (typeof window !== 'undefined')
      var url = `https://www.linkedin.com/sharing/share-offsite/?url=${window.location.href}`;

      var win = window.open(url, '_blank');
      win.focus();
  };

  const sendToTwitter = () => {
    if (typeof window !== 'undefined')
      var url = `https://twitter.com/share?url=${window.location.href}`;

      var win = window.open(url, '_blank');
      win.focus();
  };

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
            {isLoggedIn() ? <div id="promoteBlogSection">
              <h4>Social Promotion</h4>
              {
                isAdmin() ? <button className="button is-link" onClick={() => sendPushNotification()}>
                Send Push Notification
                </button> : null
              }
              <button className="button is-link" onClick={() => sendToFacebook()}>
                Share on Facebook
              </button>
              <button className="button is-link" onClick={() => sendToLinkedin()}>
                Share on LinkedIn
              </button>
              <button className="button is-link" onClick={() => sendToTwitter()}>
                Share on Twitter
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
            <meta
              property="og:image"
              content={`../../${post.frontmatter.featuredimage}`}
            />
            <meta
              property="og:title"
              content={`${useSiteMetadata().title} | ${post.frontmatter.title}`}
            />
            <meta
              property="og:description"
              content={`${post.frontmatter.description}`}
            />
            <meta
              property="og:type"
              content={"article"}
            />
            <meta
              property="article:publisher"
              content={`Nathan Duff`}
            />
            <meta
              property="article:author"
              content={`https://www.facebook.com/n8duff`}
            />
            <meta property="twitter:card" content={"summary_large_image"} />
            {/* <meta property="twitter:site" content={"@N8Duff"} /> */}
            <meta property="twitter:creator" content={"@N8Duff"} />
            <meta property="twitter:title" content={`${post.frontmatter.title}`} />
            <meta property="twitter:description" content={`${post.frontmatter.description}`} />
            <meta property="twitter:image" content={`../../${post.frontmatter.featuredimage}`} />
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
