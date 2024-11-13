import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Seo from '../components/Seo';
const baseURL = import.meta.env.VITE_WP_API_BASEURL;

const SupportCategories = ({ supportPost }) => {
  const [taxonomies, setTaxonomies] = useState([]);

  useEffect(() => {
    if (!supportPost) {
      return;
    }

    const taxonomyEndpoint = supportPost._links['wp:term'][0].href;

    axios.get(`${taxonomyEndpoint}`)
      .then((res) => {
        setTaxonomies(res.data);
      })
      .catch((err) => console.log(err));

  }, [supportPost]);

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

const SupportPost = () => {
  const [supportPost, setSupportPost] = useState(null);
  const [loading, setLoading] = useState(true);

  const { id } = useParams();
  const endpoint = `${baseURL}/support/${id}?_embed`;
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${endpoint}`)
      .then((res) => {
        setSupportPost(res.data);
        setLoading(false);
      })
      .catch((err) => console.log(err));
  }, [endpoint]);

  // Featured image check
  function getFeaturedImage(supportPost) {
    if (supportPost && supportPost._embedded && supportPost._embedded['wp:featuredmedia'] && supportPost._embedded['wp:featuredmedia'][0].source_url) {
      return supportPost._embedded['wp:featuredmedia'][0].source_url;
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
        title={supportPost.yoast_head_json?.title || post.title.rendered}
        description={supportPost.yoast_head_json?.description}
        image={supportPost.yoast_head_json?.og_image?.[0]?.url}
      />
    <button onClick={() => navigate(-1)} className="back-button primary-button">
        &larr; Back
      </button>
      <div key={supportPost.slug} className="single-container">
        <img src={getFeaturedImage(supportPost)} alt="Featured Support Post" className='single-img' />
        <h4 className="single-title">{supportPost.title.rendered}</h4>
        <SupportCategories supportPost={supportPost} />
        <div className='single-body' dangerouslySetInnerHTML={{ __html: supportPost.content.rendered }} />
      </div>
    </>
  );
};

export default SupportPost;
