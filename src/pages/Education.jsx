import { useState, useEffect } from 'react';
import axios from 'axios';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';

import PageHeader from '../components/PageHeader';
import Seo from '../components/Seo'
const baseURL = import.meta.env.VITE_WP_API_BASEURL;

const Education = () => {

  const [loading, setLoading] = useState(true);
  const [education, setEducation] = useState([]);
  const [filteredEducation, setFilteredEducation] = useState([]);
  const [terms, setTerms] = useState([]);
  const [selectedTerm, setSelectedTerm] = useState('');

  const endpoint = `${baseURL}/info?_embed`;

  useEffect(() => {
    axios.get(endpoint)
      .then((res) => {
        const fetchedEducation = res.data;
        setEducation(fetchedEducation);
        setFilteredEducation(fetchedEducation);

        const uniqueTerms = new Set();
        fetchedEducation.forEach(item => {
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
      const filtered = education.filter(item =>
        item._embedded['wp:term'][0].some(t => t.name === term)
      );
      setFilteredEducation(filtered);
    } else {
      setFilteredEducation(education);
    }
  };

  const EducationList = ({ education }) => {
    const mappedEducation = education.map((item, index) => {
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
          <a className='primary-button' href={`#/education/${item.id}`}>Read More</a>
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

    return <>{mappedEducation}</>;
  };

  return (
    <>
      <Seo
        title='Education - Diabetes NZ'
        description='Discover essential information on managing and understanding diabetes. Diabetes NZ offers expert resources, educational programs, and support for individuals and families. Learn about symptoms, treatment, lifestyle tips, and how to take control of your health with our trusted guidance.'
        url={window.location.href}
      />
      <PageHeader title="EDUCATION" image_url="/header-imgs/education.png" />
      
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
              <EducationList education={filteredEducation} />
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Education;
