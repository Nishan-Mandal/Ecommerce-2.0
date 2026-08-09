import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { addToCart } from '../../../redux/cartSlice';
import { useFilter } from '../../../context/FilterContext';
import ProductCard from '../../../components/Common/ProductCard';
import useProducts from '../../../hooks/product/useProducts';
import { configureService } from '../../../services/configure/configureService';

function ProductsGrid() {
    const { products } = useProducts();
    const { searchkey, filterType, filterPrice, setFilterType, setFilterPrice } = useFilter();
    const dispatch = useDispatch();
    const cartItems = useSelector((state) => state.cart);

    const [collections, setCollections] = useState([]);
    const [collectionsLoading, setCollectionsLoading] = useState(true);

    const handleCopyProducts = () => {
        if (!products || products.length === 0) {
            toast.info("No products loaded yet.");
            return;
        }
        const jsonStr = JSON.stringify(products, null, 2);
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(jsonStr)
                .then(() => toast.success(`Copied ${products.length} products to clipboard!`))
                .catch(() => fallbackCopy(jsonStr));
        } else {
            fallbackCopy(jsonStr);
        }
    };

    const fallbackCopy = (text) => {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
        toast.success(`Copied ${products.length} products to clipboard!`);
    };

    useEffect(() => {
        window.copyProductsData = handleCopyProducts;
    }, [products]);

    useEffect(() => {
        setFilterType('');
        setFilterPrice('');
    }, []);

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    useEffect(() => {
        configureService.getCollections()
            .then((cols) => {
                const active = cols.filter((c) => c.isActive !== false);
                setCollections(active);
            })
            .catch(() => setCollections([]))
            .finally(() => setCollectionsLoading(false));
    }, []);

    const addCart = (product) => {
        const { time, ...serializableProduct } = product;
        dispatch(addToCart(serializableProduct));
        toast.success('Added to cart');
    };

    const applySearchFilters = (arr) =>
        arr
            .filter((p) => p.title?.toLowerCase().includes(searchkey.toLowerCase()))
            .filter((p) => !filterType || p.category?.includes(filterType))
            .filter((p) => !filterPrice || p.price?.includes(filterPrice));

    if (collectionsLoading) {
        return (
            <section className="py-6 sm:py-8 lg:py-12">
                <div className="space-y-8 animate-pulse">
                    <div className="h-6 w-48 bg-border-base/50 rounded-lg"></div>
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-2 sm:gap-3 lg:gap-4">
                        {[1, 2, 3, 4, 5].map((n) => (
                            <div key={n} className="h-64 bg-border-base/30 rounded-2xl"></div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (!collections || collections.length === 0) {
        return null;
    }

    return (
        <section className="py-6 sm:py-8 lg:py-12">
            <div className="space-y-8 sm:space-y-12">
                {collections.map((col) => {
                    const collectionProducts = (col.productIds || [])
                        .map((id) => products.find((p) => p.id === id))
                        .filter(Boolean);

                    const filtered = applySearchFilters(collectionProducts);
                    if (filtered.length === 0) return null;

                    return (
                        <div key={col.collectionId || col.id}>
                            {/* Section Header */}
                            <div className="mb-4 sm:mb-6 flex items-end justify-between gap-4">
                                <div>
                                    {col.subtitle && (
                                        <p className="text-[10px] sm:text-xs font-bold uppercase tracking-[2px] text-primary">
                                            {col.subtitle}
                                        </p>
                                    )}
                                    <h2 className="mt-1 text-lg sm:text-xl lg:text-2xl font-extrabold text-text-base">
                                        {col.title}
                                    </h2>
                                </div>
                                <Link
                                    to="/allproducts"
                                    className="text-xs sm:text-sm font-bold text-primary hover:text-primary-hover whitespace-nowrap transition-colors"
                                >
                                    View All →
                                </Link>
                            </div>

                            {/* Auto-fitting Responsive UI Grid */}
                            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-2 sm:gap-3 lg:gap-4">
                                {filtered.map((item, i) => (
                                    <ProductCard
                                        key={item.id || i}
                                        item={item}
                                        addCart={addCart}
                                    />
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}

export default ProductsGrid;