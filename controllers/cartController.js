const Cart = require('../models/Cart');
const Product = require('../models/Product');

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate('items.product', 'name price image stock');
    
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart/add
// @access  Private
const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    const existingItemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (existingItemIndex > -1) {
      // Update quantity if item exists
      const newQty = cart.items[existingItemIndex].quantity + quantity;
      cart.items[existingItemIndex].quantity = Math.min(newQty, product.stock || 99);
    } else {
      // Add new item
      cart.items.push({
        product: productId,
        name: product.name,
        price: product.price,
        image: product.image,
        brand: product.brand,
        stock: product.stock,
        quantity: Math.min(quantity, product.stock || 99),
      });
    }

    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/update
// @access  Private
const updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (quantity < 1) {
      return res.status(400).json({ message: 'Quantity must be at least 1' });
    }

    const cart = await Cart.findOne({ user: req.user._id });
    
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    // Check stock limit
    const maxQty = cart.items[itemIndex].stock || 99;
    cart.items[itemIndex].quantity = Math.min(quantity, maxQty);

    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/remove/:productId
// @access  Private
const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });
    
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Clear cart
// @route   DELETE /api/cart/clear
// @access  Private
const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    
    if (cart) {
      cart.items = [];
      cart.couponCode = null;
      cart.discount = 0;
      await cart.save();
    }

    res.json({ message: 'Cart cleared', cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Apply coupon to cart
// @route   POST /api/cart/apply-coupon
// @access  Private
const applyCouponToCart = async (req, res) => {
  try {
    const { code, discount } = req.body;

    const cart = await Cart.findOne({ user: req.user._id });
    
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.couponCode = code;
    cart.discount = discount;
    await cart.save();

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Remove coupon from cart
// @route   DELETE /api/cart/remove-coupon
// @access  Private
const removeCouponFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    
    if (cart) {
      cart.couponCode = null;
      cart.discount = 0;
      await cart.save();
    }

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Sync local cart with server cart (for after login)
// @route   POST /api/cart/sync
// @access  Private
const syncCart = async (req, res) => {
  try {
    const { items } = req.body;

    let cart = await Cart.findOne({ user: req.user._id });
    
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    // Merge local items with server cart
    for (const localItem of items) {
      const existingIndex = cart.items.findIndex(
        (item) => item.product.toString() === localItem._id
      );

      if (existingIndex > -1) {
        // Add quantities if item exists
        cart.items[existingIndex].quantity += localItem.quantity;
      } else {
        // Add new item
        cart.items.push({
          product: localItem._id,
          name: localItem.name,
          price: localItem.price,
          image: localItem.image,
          brand: localItem.brand,
          stock: localItem.stock,
          quantity: localItem.quantity,
        });
      }
    }

    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  applyCouponToCart,
  removeCouponFromCart,
  syncCart,
};
