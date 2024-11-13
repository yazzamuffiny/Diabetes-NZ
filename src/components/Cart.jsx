// components/Cart.js
import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';

const Cart = () => {
  const { cart, updateCart, removeFromCart } = useContext(CartContext);
  
  const getTotalAmount = () => {
    return cart.reduce((total, item) => {
  
      const parser = new DOMParser();
      const htmlDoc = parser.parseFromString(item.price_html, 'text/html');
      const priceString = htmlDoc.body.textContent || htmlDoc.body.innerText;
  
      const itemPrice = parseFloat(priceString.replace(/[^0-9.-]+/g, ""));
  
      if (isNaN(itemPrice)) {
        console.error(`Invalid price format for item ${item.name}:`, item.price_html);
        return total; 
      }
  
      return total + itemPrice * item.quantity;
    }, 0).toFixed(2);
  };

  const handleIncrement = (item) => {
    updateCart(item.id, item.quantity + 1); // Increase quantity by 1
  };

  const handleDecrement = (item) => {
    if (item.quantity > 1) {
      updateCart(item.id, item.quantity - 1); // Decrease quantity by 1
    } else {
      removeFromCart(item.id); // Remove item if quantity is 1
    }
  };

  return (
    <div>
      <h2>Donation Checkout</h2>
      {cart.length === 0 ? (
        <p className='cart-item'>No option selected</p>
      ) : (
        <ul>
          {cart.map((item) => (
            <li className='cart' key={item.id}>
              <h3 className='cart-item'>{item.name}</h3>
              <p className='cart-price'> Price:</p> <div className='cart-price' dangerouslySetInnerHTML={{ __html: item.price_html}}/>
              <p className='cart-quantity'>Quantity: {item.quantity}</p>
              <button className='primary-button' onClick={() => handleDecrement(item)}>-</button>
              <button className='primary-button' onClick={() => handleIncrement(item)}>+</button>
              <button className='primary-button' onClick={() => removeFromCart(item.id)}>Remove</button>
            </li>
          ))}
        </ul>
      )}

      {cart.length > 0 && (
        <div className="cart-total">
          <h2>Total: ${getTotalAmount()}</h2>
        </div>
      )}
      <button className='primary-button'>Proceed to Checkout</button>
    </div>
  );
};

export default Cart;
