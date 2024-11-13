import { useRef, useEffect, useState } from "react";
import { Navigation } from "swiper";
import { Swiper, SwiperSlide } from 'swiper/react';
import axios from "axios";
import { formatDistanceToNow } from 'date-fns';

import 'swiper/swiper-bundle.min.css' 
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const baseURL = import.meta.env.VITE_WP_API_BASEURL;

const HomeEvents = () => {
    const [loading, setLoading] = useState(true);
    const [events, setEvents] = useState([]);
    const [error, setError] = useState(null);

    const endpoint = `${baseURL}/events?_embed`;

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await axios.get(endpoint);
                setEvents(res.data);
            } catch (err) {
                setError('Failed to load events. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    const swiperRef = useRef(null);

    // Function to get the featured image
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

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className='swiper-container'>
            <Swiper
                ref={swiperRef}
                navigation={true}
                modules={[Navigation]}
                slidesPerView={1}
                autoplay={{
                    stopOnLastSlide: false,
                }}
                keyboard={{ enabled: true }}
                breakpoints={{
                    640: { slidesPerView: 1 },
                    768: { slidesPerView: 2 },
                    1024: { slidesPerView: 3 },
                }}
            >
                {events.map((event) => (
                    <SwiperSlide key={event.id}>
                        <div className="event-slide">
                            {/* Displaying Featured Image */}
                            <img
                                src={getFeaturedImage(event)}
                                alt={event.title.rendered}
                                className='event-img'
                            />
                            <h3>{event.title.rendered}</h3>
                            <p className='date'>
                                Created&nbsp;
                                {formatDistanceToNow(new Date(event.date), { includeSeconds: true })}{' '}
                                ago
                            </p>
                            <a className='primary-button event-button' href={`#/events/${event.id}`}>Read More</a>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default HomeEvents;
