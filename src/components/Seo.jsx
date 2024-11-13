import { Helmet } from "react-helmet"

const Seo = ({ title, description, image, url, twitterCard = "summary_large_image"}) => {
  return (
    <Helmet>
        {/* Basic SEO */}
        {title && <title>{title}</title>}
        {description && <meta name='description' content={description}/>}

        {/* Open Graph/FB  */}
        {title && <meta property='og:title' content={title}/>}
        {description && <meta property='og:description' content={description}/>}
        {url && <meta property='og:url' content={url}/>}
        {image && <meta property='og:image' content={image} />}
        <meta property="og:type" content="website"/>

        {/* Twitter */}
        <meta name='twitter:card' content={twitterCard}/>
        {title && <meta property='twitter:title' content={title}/>}
        {description && <meta property='twitter:description' content={description}/>}
        {image && <meta property='twitter:image' content={image} />}
    </Helmet>
  )
}

export default Seo