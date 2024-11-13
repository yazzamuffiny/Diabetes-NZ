import { useState, useEffect } from 'react';
import axios from 'axios';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import PageHeader from '../components/PageHeader';
import Seo from '../components/Seo'

const baseURL = import.meta.env.VITE_WP_API_BASEURL;

const Support = () => {

  const [loading, setLoading] = useState(true);
  const [support, setSupport] = useState([]);
  const [filteredSupport, setFilteredSupport] = useState([]);
  const [terms, setTerms] = useState([]);
  const [selectedTerm, setSelectedTerm] = useState('');

  const endpoint = `${baseURL}/support?_embed`;

  useEffect(() => {
    axios.get(endpoint)
      .then((res) => {
        const fetchedSupport = res.data;
        setSupport(fetchedSupport);
        setFilteredSupport(fetchedSupport);

        const uniqueTerms = new Set();
        fetchedSupport.forEach(item => {
          item._embedded['wp:term'][0].forEach(term => uniqueTerms.add(term.name));
        });
        setTerms([...uniqueTerms]);
        setLoading(false);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleTermChange = (event) => {
    const term = event.target.value;
    setSelectedTerm(term);
    if (term) {
      const filtered = support.filter(item =>
        item._embedded['wp:term'][0].some(t => t.name === term)
      );
      setFilteredSupport(filtered);
    } else {
      setFilteredSupport(support);
    }
  };

  const SupportList = ({ support }) => {
    const mappedSupport = support.map((item, index) => {
      function getFeaturedImage(item) {
        if (
          item &&
          item._embedded &&
          item._embedded["wp:featuredmedia"] &&
          item._embedded["wp:featuredmedia"][0].source_url
        ) {
          return item._embedded["wp:featuredmedia"][0].source_url;
        } else {
          return "https://via.placeholder.com/150";
        }
      }

      const termNames = item._embedded['wp:term'][0].map(term => `<span class='categories'>${term.name}</span>`).join(' ');

      return (
        <div key={item.slug + "-" + index} className="post-container">
          <img src={getFeaturedImage(item)} alt={item.title.rendered} className='post-img' />
          <h4 className='title'>{item.title.rendered}</h4>
          <div className='terms' dangerouslySetInnerHTML={{__html: termNames}}/> 
          <a className='primary-button' href={`#/support/${item.id}`}>Read More</a>
          <p className='date'>
            Created&nbsp;
            {formatDistanceToNow(new Date(item.date), {
              includeSeconds: true,
            })}{' '}
            ago
          </p>
        </div>
      );
    });

    return <>{mappedSupport}</>;
  };

  return (
    <>
      <Seo
          title='Support - Diabetes NZ'
          description='Find guidance, resources, and community support for managing diabetes with Diabetes NZ. Access expert advice, personal stories, and tools to help you live well with diabetes at every stage of your journey.'
          url={window.location.href}
      />
      <PageHeader title="SUPPORT" image_url="/header-imgs/support.png" />
      
      <div className='page-container'>
        {loading ? (
          <div className='loading-container'>
            <img src="../logo-only.png" alt="Loading" className='loading-logo' />
          </div>
        ) : (
          <>
            <div className='filter-container'>
              <select value={selectedTerm} onChange={handleTermChange}>
                <option value=''>All Categories</option>
                {terms.map((term, index) => (
                  <option key={index} value={term}>{term}</option>
                ))}
              </select>
            </div>
            <div className='page-grid'>
              <SupportList support={filteredSupport} />
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Support;
