import { useState, useEffect } from 'react';
import axios from 'axios';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import PageHeader from '../components/PageHeader';
import Seo from '../components/Seo'

const baseURL = import.meta.env.VITE_WP_API_BASEURL;

const Events = () => {

  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [terms, setTerms] = useState([]);
  const [selectedTerm, setSelectedTerm] = useState('');

  const endpoint = `${baseURL}/events?_embed`;

  useEffect(() => {
    axios.get(endpoint)
      .then((res) => {
        const fetchedEvents = res.data;
        setEvents(fetchedEvents);
        setFilteredEvents(fetchedEvents);

        const uniqueTerms = new Set();
        fetchedEvents.forEach(event => {
          event._embedded['wp:term'][0].forEach(term => uniqueTerms.add(term.name));
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
      const filtered = events.filter(event =>
        event._embedded['wp:term'][0].some(t => t.name === term)
      );
      setFilteredEvents(filtered);
    } else {
      setFilteredEvents(events);
    }
  };

  const EventList = ({ events }) => {
    const mappedEvents = events.map((event, index) => {
      function getFeaturedImage(event) {
        if (
          event &&
          event._embedded &&
          event._embedded["wp:featuredmedia"] &&
          event._embedded["wp:featuredmedia"][0].source_url
        ) {
          return event._embedded["wp:featuredmedia"][0].source_url;
        } else {
          return "https://via.placeholder.com/150";
        }
      }

      const termNames = event._embedded['wp:term'][0].map(term => `<span class='categories'>${term.name}</span>`).join(' ');

      return (
        <div key={event.slug + "-" + index} className="post-container">
          <img src={getFeaturedImage(event)} alt={event.title.rendered} className='post-img' />
          <h4 className='title'>{event.title.rendered}</h4>
          <div className='terms' dangerouslySetInnerHTML={{__html: termNames}}/> 
          <a className='primary-button' href={`#/events/${event.id}`}>Read More</a>
          <p className='date'>
            Created&nbsp;
            {formatDistanceToNow(new Date(event.date), {
              includeSeconds: true,
            })}{' '}
            ago
          </p>
        </div>
      );
    });

    return <>{mappedEvents}</>;
  };

  return (
    <>
      <Seo
        title='Events - Diabetes NZ'
        description='Join Diabetes NZ events to connect, learn, and take action in the diabetes community. Find workshops, webinars, and local events that offer support, education, and ways to get involved.'
        url={window.location.href}
      />
      <PageHeader title="EVENTS" image_url="/header-imgs/events.jpg" />
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
              <EventList events={filteredEvents} />
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Events;
