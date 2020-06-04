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
import facebook from '../img/social/facebook.svg'
import linkedin from '../img/social/linkedin.svg'
import twitter from '../img/social/twitter.svg'
import bell from '../img/social/bell.svg'

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
            <div id="promoteBlogSection">              
              <h4>Spread the word!</h4>
              <div className="column social">
              {
                isAdmin() ? <a title="Send Push Notification" onClick={() => sendPushNotification()}>
                <img
                  src={bell}
                  alt="Send Push Notification"
                  style={{ width: '1em', height: '1em' }}
                />
              </a> : null
              }
              <a title="Share on Facebook" onClick={() => sendToFacebook()}>
                <img
                  src={facebook}
                  alt="Share on Facebook"
                  style={{ width: '1em', height: '1em' }}
                />
              </a>
              <a title="Share on LinkedIn" onClick={() => sendToLinkedin()}>
                <img
                  src={linkedin}
                  alt="Share on LinkedIn"
                  style={{ width: '1em', height: '1em' }}
                />
              </a>
              <a title="Share on Twitter" onClick={() => sendToTwitter()}>
                <img
                  src={twitter}
                  alt="Share on Twitter"
                  style={{ width: '1em', height: '1em' }}
                />
              </a>
              </div></div>
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
              property="og:title"
              content={`${useSiteMetadata().title} | ${post.frontmatter.title}`}
            />

            <meta
              name="title"
              content={`${useSiteMetadata().title} | ${post.frontmatter.title}`}
            />
            <meta
              property="og:description"
              content={`${post.frontmatter.description}`}
            />
            <meta
              name="description"
              content={`${post.frontmatter.description}`}
            />
            
            <meta
              name="image"
              property="og:image"
              content={`${typeof window !== 'undefined' ? window.location.origin : null}/${post.frontmatter.featuredimage}`}
            />          
            <meta
              property="og:image:width"
              content={`500`}
            />
            <meta
              property="og:image:height"
              content={`500`}
            />
            <meta
              property="og:type"
              content={"article"}
            />
            <meta
              name="author"
              content={`Nathan Duff`}
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
            <meta property="twitter:title" content={`${useSiteMetadata().title} | ${post.frontmatter.title}`} />
            <meta property="twitter:description" content={`${post.frontmatter.description}`} />
            <meta property="twitter:image" content={
              `${typeof window !== 'undefined' ? window.location.origin : '../..'}/${post.frontmatter.featuredimage}`} />
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
        featuredimage {
          childImageSharp {
            sizes(maxWidth: 630) {
              ...GatsbyImageSharpSizes
            }
          }
        }
      }
    }
  }
`
