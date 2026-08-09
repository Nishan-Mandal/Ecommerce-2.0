import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFilter } from '../../context/FilterContext'
import { useTheme } from '../../context/ThemeContext'
import useProducts from '../../hooks/product/useProducts'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart } from '../../redux/cartSlice'
import { toast } from 'react-toastify'
import AllProductsBanner from './sections/AllProductsBanner';
import AllProductsSidebar from './sections/AllProductsSidebar';
import AllProductsGrid from './sections/AllProductsGrid';


function Allproducts() {
    const navigate = useNavigate();
    const { products, loading } = useProducts();
    const { searchkey, setSearchkey, filterType, setFilterType, filterPrice, setFilterPrice } = useFilter();
    const { mode } = useTheme();
    const [sortBy, setSortBy] = useState('Featured');
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

    const dispatch = useDispatch()
    const cartItems = useSelector((state) => state.cart);

    const addCart = (product) => {
        const { time, ...serializableProduct } = product;
        dispatch(addToCart(serializableProduct));
        toast.success('Added to cart!');
    }

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems])

    useEffect(() => {
        window.scrollTo(0, 0);
        setFilterType('');
        setFilterPrice('');
    }, [])

    const uniqueCategory = [...new Set(products.map((item) => item.category))];
    const uniquePrices = [...new Set(products.map((item) => item.price))].sort((a, b) => a - b);

    // Apply filtering and sorting dynamically
    const filteredAndSorted = [...products]
        .filter((obj) => {
            if (!searchkey || !searchkey.trim()) return true;
            const rawQuery = searchkey.toLowerCase().trim();
            const searchTerms = rawQuery.split(',').map(t => t.trim()).filter(Boolean);

            const title = (obj.title || '').toLowerCase();
            const brand = (obj.brand || '').toLowerCase();
            const category = (obj.category || '').toLowerCase();
            const tags = Array.isArray(obj.tags)
                ? obj.tags.map(t => String(t).toLowerCase()).join(' ')
                : String(obj.tags || '').toLowerCase();

            const combinedText = `${title} ${brand} ${category} ${tags}`;

            return searchTerms.some(term => combinedText.includes(term));
        })
        .filter((obj) => obj.category.includes(filterType))
        .filter((obj) => {
            if (!filterPrice) return true;
            return Number(obj.price) <= Number(filterPrice);
        })
        .sort((a, b) => {
            if (sortBy === 'Price: Low to High') return a.price - b.price;
            if (sortBy === 'Price: High to Low') return b.price - a.price;
            return 0;
        });

    return (
        <div className="min-h-screen bg-bg-base text-text-base transition-colors duration-300">
            {/* Mobile Filter Backdrop */}
            {isMobileFilterOpen && (
                <div
                    className="fixed inset-0 z-45 bg-black/40 backdrop-blur-xs lg:hidden"
                    onClick={() => setIsMobileFilterOpen(false)}
                />
            )}

            <main className="max-w-9xl mx-auto px-4 sm:px-0 lg:px-8 py-6 sm:py-2 lg:py-10">

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">

                    {/* Sidebar Filters */}
                    <AllProductsSidebar
                        searchkey={searchkey}
                        setSearchkey={setSearchkey}
                        filterType={filterType}
                        setFilterType={setFilterType}
                        filterPrice={filterPrice}
                        setFilterPrice={setFilterPrice}
                        uniqueCategory={uniqueCategory}
                        uniquePrices={uniquePrices}
                        isMobileOpen={isMobileFilterOpen}
                        onClose={() => setIsMobileFilterOpen(false)}
                    />

                    {/* Product Grid */}
                    <AllProductsGrid
                        loading={loading}
                        filteredAndSorted={filteredAndSorted}
                        totalProductsCount={products.length}
                        sortBy={sortBy}
                        setSortBy={setSortBy}
                        addCart={addCart}
                        onMobileFilterToggle={() => setIsMobileFilterOpen(true)}
                    />

                </div>

            </main>
        </div>
    );
}

export default Allproducts