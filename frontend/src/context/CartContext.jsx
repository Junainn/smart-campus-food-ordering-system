import { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ vendorId: null, vendorName: null, items: [], timestamp: Date.now() });

  useEffect(() => {
    // Load cart from localStorage on mount
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      try {
        const parsedCart = JSON.parse(storedCart);
        // Check if cart is older than 24 hours
        const now = Date.now();
        const cartAge = now - (parsedCart.timestamp || 0);
        const maxAge = 24 * 60 * 60 * 1000; // 24 hours

        if (cartAge < maxAge) {
          setCart(parsedCart);
        } else {
          // Clear expired cart
          localStorage.removeItem('cart');
        }
      } catch (error) {
        console.error('Failed to parse cart data:', error);
        localStorage.removeItem('cart');
      }
    }
  }, []);

  const saveCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const addToCart = (vendorId, vendorName, item) => {
    // If cart has different vendor, return false to trigger confirmation
    if (cart.vendorId && cart.vendorId !== vendorId) {
      return false;
    }

    const newCart = {
      vendorId,
      vendorName,
      timestamp: Date.now(),
      items: [...cart.items],
    };

    // Check if item already exists
    const existingItemIndex = newCart.items.findIndex((i) => i.menuItemId === item.menuItemId);

    if (existingItemIndex >= 0) {
      // Update quantity
      newCart.items[existingItemIndex].quantity += item.quantity;
    } else {
      // Add new item
      newCart.items.push(item);
    }

    saveCart(newCart);
    return true;
  };

  const removeFromCart = (menuItemId) => {
    const newCart = {
      ...cart,
      items: cart.items.filter((item) => item.menuItemId !== menuItemId),
      timestamp: Date.now(),
    };
    saveCart(newCart);
  };

  const updateQuantity = (menuItemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(menuItemId);
      return;
    }

    const newCart = {
      ...cart,
      items: cart.items.map((item) =>
        item.menuItemId === menuItemId ? { ...item, quantity } : item
      ),
      timestamp: Date.now(),
    };
    saveCart(newCart);
  };

  const clearCart = () => {
    const emptyCart = { vendorId: null, vendorName: null, items: [], timestamp: Date.now() };
    saveCart(emptyCart);
  };

  const getTotalPrice = () => {
    return cart.items.reduce((total, item) => total + item.priceAtOrder * item.quantity, 0);
  };

  const getTotalItems = () => {
    return cart.items.reduce((total, item) => total + item.quantity, 0);
  };

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
