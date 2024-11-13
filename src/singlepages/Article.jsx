import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

import Seo from '../components/Seo'

const baseURL = import.meta.env.VITE_WP_API_BASEURL;

const Type = ({ article }) => {
  const [taxonomies, setTaxonomies] = useState([]);
  

  useEffect(() => {
    if (!article) {
      return;
    }

    const taxonomyEndpoint = article._links['wp:term'][0].href;

    axios.get(`${taxonomyEndpoint}`)
      .then((res) => {
        setTaxonomies(res.data);
      })
      .catch((err) => console.log(err));

  }, [article]);

  const renderedTaxonomies = taxonomies.map((taxonomy, index) => {
    return (
        <span key={taxonomy.id} className='taxonomy-term-pill'>
            {taxonomy.name}
            {index < taxonomies.length - 1 && <span> </span>}
        </span>
    );
  });

  return (
    <div>
      {renderedTaxonomies}
    </div>
  );
};

const Article = () => {
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  const { id } = useParams();
  const endpoint = `${baseURL}/news/${id}?_embed`;
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${endpoint}`)
      .then((res) => {
        setArticle(res.data);
        setLoading(false);
      })
      .catch((err) => console.log(err));
  }, []);

  // Featured image check
  function getFeaturedImage(article) {
    if (article && article._embedded && article._embedded['wp:featuredmedia'] && article._embedded['wp:featuredmedia'][0].source_url) {
      return article._embedded['wp:featuredmedia'][0].source_url;
    } else {
      return 'https://via.placeholder.com/150';
    }
  }

  if (loading) {
    return <>  
        <div className='loading-container'>
          <img src="../logo-only.png" alt="Loading" className='loading-logo' />
        </div> 
      </>;
  }

  return (
    <>
     <Seo
        title={article.yoast_head_json?.title || post.title.rendered}
        description={article.yoast_head_json?.description}
        image={article.yoast_head_json?.og_image?.[0]?.url}
      />
      <button onClick={() => navigate(-1)} className="back-button primary-button">
        &larr; Back
      </button>
       <div key={article.slug} className="single-container">
        <img className='single-img' src={getFeaturedImage(article)} alt="Post Featured Image" />
        <h4 className='single-title'>{article.title.rendered}</h4>
        <Type article={article} />
        <div className='single-body' dangerouslySetInnerHTML={{ __html: article.content.rendered }} />
      </div>
    </>
  );
};

export default Article;
