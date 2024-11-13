import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Seo from '../components/Seo'

const baseURL = import.meta.env.VITE_WP_API_BASEURL;

const Categories = ({ educationalInfo }) => {
  const [taxonomies, setTaxonomies] = useState([]);

  useEffect(() => {
    if (!educationalInfo) {
      return;
    }

    const taxonomyEndpoint = educationalInfo._links['wp:term'][0].href;

    axios.get(`${taxonomyEndpoint}`)
      .then((res) => {
        setTaxonomies(res.data);
      })
      .catch((err) => console.log(err));

  }, [educationalInfo]);

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

const EducationalInfo = () => {
  const [educationalInfo, setEducationalInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [seoData, setSeoData] = useState(null);

  const { id } = useParams();
  const endpoint = `${baseURL}/info/${id}?_embed`;
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${endpoint}`)
      .then((res) => {
        setEducationalInfo(res.data);
        setSeoData(res.data.yoast_head_json)
        setLoading(false);
      })
      .catch((err) => console.log(err));
  }, [endpoint]);



  function getFeaturedImage(info) {
    if (info && info._embedded && info._embedded['wp:featuredmedia'] && info._embedded['wp:featuredmedia'][0].source_url) {
      return info._embedded['wp:featuredmedia'][0].source_url;
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
        title={educationalInfo.yoast_head_json?.title || post.title.rendered}
        description={educationalInfo.yoast_head_json?.description}
        image={educationalInfo.yoast_head_json?.og_image?.[0]?.url}
      />
      <button onClick={() => navigate(-1)} className="back-button primary-button">
          &larr; Back
      </button>
      <div key={educationalInfo.slug} className="single-container">
        <img src={getFeaturedImage(educationalInfo)} alt="Featured Educational Info" className='single-img' />
        <h4 className="single-title">{educationalInfo.title.rendered}</h4>
        <Categories educationalInfo={educationalInfo} />
        <div className='single-body' dangerouslySetInnerHTML={{ __html: educationalInfo.content.rendered }} />
      </div>
    </>
  );
};

export default EducationalInfo;
