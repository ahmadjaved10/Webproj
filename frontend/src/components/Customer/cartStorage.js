const CART_KEY = 'customerCart';

export const readCart = () => {
  try {
    const storedCart = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
    if (!Array.isArray(storedCart)) {
      return [];
    }

    return storedCart.filter((item) => (
      typeof item.productId === 'string' &&
      Number.isInteger(Number(item.quantity)) &&
      Number(item.quantity) > 0
    )).map((item) => ({ productId: item.productId, quantity: Number(item.quantity) }));
  } catch {
    return [];
  }
};

const saveCart = (cart) => {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  window.dispatchEvent(new Event('customerCartUpdated'));
};

export const addCartItem = (productId) => {
  const cart = readCart();
  const existingItem = cart.find((item) => item.productId === productId);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ productId, quantity: 1 });
  }
  saveCart(cart);
  return cart;
};

export const updateCartQuantity = (productId, quantity) => {
  const cart = readCart()
    .map((item) => item.productId === productId ? { ...item, quantity: Number(quantity) } : item)
    .filter((item) => Number.isInteger(item.quantity) && item.quantity > 0);
  saveCart(cart);
  return cart;
};

export const removeCartItem = (productId) => {
  const cart = readCart().filter((item) => item.productId !== productId);
  saveCart(cart);
  return cart;
};

export const clearCart = () => saveCart([]);
