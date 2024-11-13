import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Seo from '../components/Seo'
const baseURL = import.meta.env.VITE_WP_API_BASEURL;

const EventCategories = ({ event }) => {
  const [taxonomies, setTaxonomies] = useState([]);

  useEffect(() => {
    if (!event) {
      return;
    }

    const taxonomyEndpoint = event._links['wp:term'][0].href;

    axios.get(`${taxonomyEndpoint}`)
      .then((res) => {
        setTaxonomies(res.data);
      })
      .catch((err) => console.log(err));

  }, [event]);

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

const Event = () => {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  const { id } = useParams();
  const endpoint = `${baseURL}/events/${id}?_embed`;
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${endpoint}`)
      .then((res) => {
        setEvent(res.data);
        setLoading(false);
      })
      .catch((err) => console.log(err));
  }, [endpoint]);

  // Featured image check
  function getFeaturedImage(event) {
    if (event && event._embedded && event._embedded['wp:featuredmedia'] && event._embedded['wp:featuredmedia'][0].source_url) {
      return event._embedded['wp:featuredmedia'][0].source_url;
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
        title={event.yoast_head_json?.title || post.title.rendered}
        description={event.yoast_head_json?.description}
        image={event.yoast_head_json?.og_image?.[0]?.url}
      />
    <button onClick={() => navigate(-1)} className="back-button primary-button">
        &larr; Back
      </button>
      <div key={event.slug} className="single-container">
        <img src={getFeaturedImage(event)} alt="Featured Event" className='single-img'/>
        <h4 className="single-title">{event.title.rendered}</h4>
        <EventCategories event={event} />
        <div className='single-body' dangerouslySetInnerHTML={{ __html: event.content.rendered }} />
      </div>
    </>
  );
};

export default Event;
