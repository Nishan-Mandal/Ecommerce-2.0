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

    // If admin has configured collections, render those; otherwise fall back
    const useDynamicCollections = !collectionsLoading && collections.length > 0;

    if (useDynamicCollections) {
        return (
            <section className="py-12">
                <div className="container mx-auto px-4 space-y-20">
                    {collections.map((col) => {
                        // Resolve full product objects from the productIds list
                        const collectionProducts = col.productIds
                            .map((id) => products.find((p) => p.id === id))
                            .filter(Boolean);

                        const filtered = applySearchFilters(collectionProducts);
                        if (filtered.length === 0) return null;

                        return (
                            <div key={col.collectionId}>
                                <div className="mb-8 flex items-end justify-between">
                                    <div>
                                        {col.subtitle && (
                                            <p className="text-sm font-bold uppercase tracking-[3px] text-primary">
                                                {col.subtitle}
                                            </p>
                                        )}
                                        <h2 className="mt-1 text-3xl font-extrabold text-text-base">
                                            {col.title}
                                        </h2>
                                    </div>
                                    <Link to="/allproducts" className="text-sm font-bold text-primary hover:text-primary-hover transition-colors">
                                        View All →
                                    </Link>
                                </div>
                                <div className={
                                    col.layout === "horizontal-scroll"
                                        ? "flex overflow-x-auto gap-4 sm:gap-6 pb-4 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent"
                                        : "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6"
                                }>
                                    {filtered.map((item, i) => (
                                        <div 
                                            key={item.id || i} 
                                            className={col.layout === "horizontal-scroll" ? "w-[230px] sm:w-[240px] md:w-[280px] shrink-0" : ""}
                                        >
                                            <ProductCard item={item} addCart={addCart} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>
        );
    }

    // Fallback: original category-based hardcoded sections
    const customProducts = applySearchFilters(products.filter((p) => p.category?.includes("Custom")));
    const readyMade = applySearchFilters(products.filter((p) => p.category?.includes("ReadyMade") && !p.category?.includes("Premium")));
    const premium = applySearchFilters(products.filter((p) => p.category?.includes("ReadyMade-Premium")));

    const fallbackSections = [
        { label: "New Arrival", title: "Custom Collection", items: customProducts },
        { label: "Trending", title: "Ready Made Collection", items: readyMade },
        { label: "Premium", title: "Premium Collection", items: premium },
    ];

    return (
        <section className="py-8 sm:py-2 lg:py-12">
            <div className="space-y-4">

                {fallbackSections
                    .filter((s) => s.items.length > 0)
                    .map((sec) => (
                        <div key={sec.title}>

                            {/* Section Header */}
                            <div className="mb-5 sm:mb-6 lg:mb-8 flex items-end justify-between gap-4 ">

                                <div>
                                    {/* <p className="text-[10px] sm:text-xs lg:text-sm font-bold uppercase tracking-[2px] sm:tracking-[3px] text-primary">
                                        {sec.label}
                                    </p> */}

                                    <h2 className="mt-1 sm:mt-2 text-lg sm:text-xl lg:text-2xl font-extrabold text-text-base">
                                        {sec.title}
                                    </h2>
                                </div>

                                <Link
                                    to="/allproducts"
                                    className="text-xs sm:text-sm font-bold text-primary hover:text-primary-hover whitespace-nowrap transition-colors"
                                >
                                    View All →
                                </Link>

                            </div>

                            {/* Products */}
                            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-1 sm:gap-2 lg:gap-3">
                                {sec.items.map((item, i) => (
                                    <ProductCard
                                        key={item.id || i}
                                        item={item}
                                        addCart={addCart}
                                    />
                                ))}
                            </div>

                        </div>
                    ))}

            </div>
        </section>
    );
}

export default ProductsGrid;