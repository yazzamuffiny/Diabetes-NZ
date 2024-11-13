import { useState, useEffect } from 'react';
import axios from 'axios';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import { ClipLoader } from 'react-spinners';
import PageHeader from '../components/PageHeader';
import Seo from '../components/Seo'

const baseURL = import.meta.env.VITE_WP_API_BASEURL;

const News = () => {

  const [loading, setLoading] = useState(true);
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [terms, setTerms] = useState([]);
  const [selectedTerm, setSelectedTerm] = useState('');

  const endpoint = `${baseURL}/news?_embed`;

  useEffect(() => {
    axios.get(endpoint)
      .then((res) => {
        const fetchedArticles = res.data;
        setArticles(fetchedArticles);
        setFilteredArticles(fetchedArticles);

        const uniqueTerms = new Set();
        fetchedArticles.forEach(article => {
          article._embedded['wp:term'][0].forEach(term => uniqueTerms.add(term.name));
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
      const filtered = articles.filter(article =>
        article._embedded['wp:term'][0].some(t => t.name === term)
      );
      setFilteredArticles(filtered);
    } else {
      setFilteredArticles(articles);
    }
  };

  const ArticleList = ({ articles }) => {
    const mappedArticles = articles.map((article, index) => {
      function getFeaturedImage(article) {
        if (
          article &&
          article._embedded &&
          article._embedded["wp:featuredmedia"] &&
          article._embedded["wp:featuredmedia"][0].source_url
        ) {
          return article._embedded["wp:featuredmedia"][0].source_url;
        } else {
          return "https://via.placeholder.com/150";
        }
      }

      const termNames = article._embedded['wp:term'][0].map(term => `<span class='categories'>${term.name}</span>`).join(' ');

      return (
        <div key={article.slug + "-" + index} className="post-container">
          <img src={getFeaturedImage(article)} alt={article.title.rendered} className='post-img' />
          <h4 className='title'>{article.title.rendered}</h4>
          <div className='terms' dangerouslySetInnerHTML={{__html: termNames}}/> 
          <a className='primary-button' href={`#/news/${article.id}`}>Read More</a>
          <p className='date'>
            Created&nbsp;
            {formatDistanceToNow(new Date(article.date), {
              includeSeconds: true,
            })}{' '}
            ago
          </p>
        </div>
      );
    });

    return <>{mappedArticles}</>;
  };

  return (
    <>
      <Seo
        title='News - Diabetes NZ'
        description='Stay updated with the latest news on diabetes research, treatments, and community initiatives with Diabetes NZ. Explore articles, updates, and insights to help you stay informed and empowered on your diabetes journey.'
        url={window.location.href}
      />
      <PageHeader title="ARTICLES" image_url="/header-imgs/news.jpg" />
      
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
              <ArticleList articles={filteredArticles} />
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default News;
