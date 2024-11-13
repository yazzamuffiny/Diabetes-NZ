import { useContext, useEffect, useState } from 'react';
import wooCommerceApi from '../../woocommerceApi';
import { CartContext } from '../context/CartContext';
import Seo from '../components/Seo';
import Cart from '../components/Cart';
import { ClipLoader } from 'react-spinners'; // Import a loading spinner

const Donations = () => {

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const { cart, addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await wooCommerceApi.get('/products');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products', error);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    console.log('Updated cart:', cart);
  }, [cart]);

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  return (
    <>
      <Seo
        title='Donate - Diabetes NZ'
        description='Support Diabetes NZ in the fight against diabetes. Your generous donation helps fund vital research, education, and support services for those affected by diabetes across New Zealand. Donate today to make a difference!'
        url={window.location.href}
      />

      <div className='donate-page'>
        {loading ? (
          <div className='loading-container'>
            <img src="../logo-only.png" alt="Loading" className='loading-logo' />
          </div>
        ) : (
          <div className='donate-div'>
            <h2>Donation Options</h2>
            <ul>
              {products.map(product => (
                <li className='donate-card' key={product.id}>
                  <p>{product.name}</p>
                  <div dangerouslySetInnerHTML={{ __html: product.price_html }} />
                  <button className='primary-button' onClick={() => handleAddToCart(product)}>Donate</button>
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className='cart-div'>
          <Cart />
        </div>
      </div>
    </>
  );
};

export default Donations;
