import { createContext, useState, useEffect, useContext } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const storedCart = localStorage.getItem('cartItems');
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  const addToCart = (product, qty) => {
    setCartItems((prevItems) => {
      const existItem = prevItems.find((x) => x.product === product._id);
      let newItems;
      
      if (existItem) {
        // Update quantity if item already exists
        newItems = prevItems.map((x) =>
          x.product === existItem.product ? { ...x, qty: x.qty + qty } : x
        );
      } else {
        // Add new item
        newItems = [...prevItems, { 
          product: product._id, 
          name: product.name, 
          image: product.images[0], 
          price: product.price, 
          countInStock: product.stock, 
          qty 
        }];
      }
      
      localStorage.setItem('cartItems', JSON.stringify(newItems));
      return newItems;
    });
  };

  const removeFromCart = (id) => {
    setCartItems((prevItems) => {
      const newItems = prevItems.filter((x) => x.product !== id);
      localStorage.setItem('cartItems', JSON.stringify(newItems));
      return newItems;
    });
  };

  const updateCartQty = (id, qty) => {
    setCartItems((prevItems) => {
      const newItems = prevItems.map((x) =>
        x.product === id ? { ...x, qty } : x
      );
      localStorage.setItem('cartItems', JSON.stringify(newItems));
      return newItems;
    });
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cartItems');
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateCartQty, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
