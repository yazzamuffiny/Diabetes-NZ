import { useState, useEffect } from "react";
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';

const baseURL = import.meta.env.VITE_WP_API_BASEURL;

const HomeNews = () => {
    const [loadingLatest, setLoadingLatest] = useState(true);
    const [loadingTrending, setLoadingTrending] = useState(true);
    const [latest, setLatest] = useState([]);
    const [trending, setTrending] = useState([]);
    const [error, setError] = useState(null);

    const latestEndpoint = `${baseURL}/news?article-type=34&_embed`;
    const trendingEndpoint = `${baseURL}/news?article-type=35&_embed`;

    useEffect(() => {
        const fetchLatest = async () => {
            try {
                const res = await axios.get(latestEndpoint);
                setLatest(res.data);
            } catch (err) {
                setError('Failed to load Latest Articles. Please try again later.');
            } finally {
                setLoadingLatest(false);
            }
        };
        fetchLatest();
    }, []);

    useEffect(() => {
        const fetchTrending = async () => {
            try {
                const res = await axios.get(trendingEndpoint);
                setTrending(res.data);
            } catch (err) {
                setError('Failed to load Trending Articles. Please try again later.');
            } finally {
                setLoadingTrending(false);
            }
        };
        fetchTrending();
    }, []);

    const getFeaturedImage = (article) => {
        return article?._embedded?.["wp:featuredmedia"]?.[0]?.source_url || "https://via.placeholder.com/150";
    };

    const DisplayArticles = ({ articles }) => {
        return (
            <>
                {articles.map((article, index) => (
                    <div key={article.slug + "-" + index} className="home-container">
                        <div className='home-img-container'>
                            <img src={getFeaturedImage(article)} alt={article.title.rendered} className='home-img'/>
                        </div>
                        
                        <div className='home-info'>
                            <h4 className='home-title'>{article.title.rendered}</h4>
                            <p className='date'>
                                Created&nbsp;
                                {formatDistanceToNow(new Date(article.date), { includeSeconds: true })}{' '}
                                ago
                            </p>
                            <a className='primary-button news-button' href={`#/news/${article.id}`}>Read More</a>
                        </div>
                        
                    </div>
                ))}
            </>
        );
    };

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <section className='news-section'>
            <h2>News</h2>
            <div className='news-container'>
            <div className='latest-container'>
                {loadingLatest ? (
                    <p>Loading latest articles...</p>
                ) : (
                    <div className="latest-articles">
                        <DisplayArticles articles={latest.slice(0, 3)} />
                    </div>
                    )}
                </div>
                <div className='trending-container'>
                    {loadingTrending ? <p>Loading trending articles...</p> : <DisplayArticles articles={trending.slice(0, 4)} />}
                </div>
            </div>
        </section>
    );
}

export default HomeNews;
