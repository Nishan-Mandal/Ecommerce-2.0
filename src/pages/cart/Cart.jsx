import React, { useEffect } from 'react'
import { useTheme } from '../../context/ThemeContext';
import OrderSummary from './sections/OrderSummery';
import CrossSellSection from './sections/CrossSellSection';
import CartItem from './sections/cartitem';
import { useDispatch, useSelector } from 'react-redux';
import { deleteFromCart, updateCartQuantity, addToCart } from '../../redux/cartSlice';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import useProducts from '../../hooks/product/useProducts';
import useAuth from '../../hooks/auth/useAuth';

function Cart() {
  const navigate = useNavigate();
  const { mode } = useTheme();
  const { products } = useProducts();
  const { user, setIsLoginOpen } = useAuth();

  const dispatch = useDispatch()
  const cart = useSelector((state) => state.cart)

  // Sync cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart])

  // Quantity updates handler
  const handleUpdateQuantity = (item, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveItem(item);
    } else {
      dispatch(updateCartQuantity({
        id: item.id,
        selectedVariant: item.selectedVariant,
        quantity: newQuantity
      }));
    }
  };

  // Remove item handler
  const handleRemoveItem = (item) => {
    dispatch(deleteFromCart(item));
    toast.success('Removed from cart!');
  };

  // Add suggested item directly to cart
  const handleAddToCart = (product) => {
    const hasVariants = product.variantTypes && product.variantTypes.length > 0;
    if (hasVariants) {
      navigate(`/productdetails/${product.id}`);
      toast.info('Please select variant options first.');
    } else {
      dispatch(addToCart({
        ...product,
        price: product.price,
        originalPrice: product.originalPrice || product.price,
        selectedVariant: null,
        quantity: 1
      }));
      toast.success('Added to cart!');
    }
  };

  // Derived calculations
  const totalItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cart.reduce((acc, item) => acc + (Number(item.price) * item.quantity), 0);
  const grandTotal = subtotal + (subtotal * 0.05);

  const handleInitiateCheckout = () => {
    if (cart.length === 0) {
      toast.error('Your shopping cart is empty!');
      return;
    }
    if (!user) {
      setIsLoginOpen(true);
    } else {
      navigate('/checkout');
    }
  };

  // Filter suggested cross-sell items (products in DB not already in cart)
  const SUGGESTED_ITEMS = products
    .filter(p => !cart.some(cItem => cItem.id === p.id))
    .slice(0, 2);

  return (
    <div className="bg-bg-base text-text-base  flex flex-col transition-colors duration-300">  
      <main className="flex-grow  md:px-6 max-w-8xl w-full mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Shopping Cart Stack */}
          <div className="lg:col-span-8 space-y-8">
            <h1 className="md:text-3xl text-xl font-extrabold text-text-base mb-2 sm:mb-8 font-h1">
              Your Cart ({totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'})
            </h1>
            
            <div className="space-y-4">
              {cart.length > 0 ? (
                cart.map((item, index) => (
                  <CartItem 
                    key={`${item.id}-${index}`} 
                    item={item} 
                    onUpdateQuantity={handleUpdateQuantity} 
                    onRemove={handleRemoveItem} 
                  />
                ))
              ) : (
                <div className="text-center py-16 px-6 bg-bg-surface text-text-muted text-sm font-semibold rounded-[24px] border border-dashed border-border-base/70 flex flex-col items-center justify-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-3xl">shopping_bag</span>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-extrabold text-text-base">Your shopping cart is empty</h3>
                    <p className="text-xs text-text-muted">Looks like you haven't added anything to your cart yet.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate('/allproducts')}
                    className="mt-2 px-6 py-2.5 rounded-xl bg-primary text-compli text-xs font-bold shadow-md hover:opacity-90 transition-all cursor-pointer flex items-center gap-2 active:scale-95"
                  >
                    <span className="material-symbols-outlined text-base">storefront</span>
                    Explore Products
                  </button>
                </div>
              )}
            </div>

            <CrossSellSection 
              items={SUGGESTED_ITEMS} 
              onAddToCart={handleAddToCart} 
            />
          </div>

          {/* Pricing Calculations Summary Sidebar */}
          <OrderSummary 
            subtotal={subtotal} 
            shippingFee="Free" 
            taxRate={0.05} 
            cartItems={cart}
            onCheckout={handleInitiateCheckout}
          />
          
        </div>
      </main>
    </div>
  )
}

export default Cart