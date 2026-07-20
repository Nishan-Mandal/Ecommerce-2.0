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

function Cart() {
  const navigate = useNavigate();
  const { mode } = useTheme();
  const { products } = useProducts();

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
                <div className="text-center py-20 bg-bg-surface text-text-muted text-sm font-semibold rounded-[24px] border border-dashed border-border-base">
                  Your shopping cart is empty.
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
            onCheckout={() => navigate('/order')}
          />
          
        </div>
      </main>
    </div>
  )
}

export default Cart