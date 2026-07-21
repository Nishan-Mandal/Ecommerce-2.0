import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaCartPlus } from 'react-icons/fa';
import useAdmin from '../../hooks/auth/useAdmin';
import useProducts from '../../hooks/product/useProducts';
import ProductDetailTable from './ProductDetailTable';
import ProductForm from './ProductForm';
import Header from "../Components/Header";
import FilterBar from "../Components/FilterBar";

/**
 * Products Component
 * Main entry point for catalog management: handles viewing list, adding new, and updating products.
 */
function Products({ mode, formatDate }) {
    const location = useLocation();
    const navigate = useNavigate();
    const { products } = useProducts();
    const adminHook = useAdmin();
    const [view, setView] = useState('list'); // 'list', 'add', 'edit'

    // Filter states
    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('ALL');

    // Sync local view with route pathname
    useEffect(() => {
        if (location.pathname === '/addproduct') {
            adminHook.resetForm();
            setView('add');
        } else if (location.pathname === '/updateproduct') {
            const productToEdit = location.state?.product;
            if (productToEdit) {
                adminHook.edithandle(productToEdit);
            }
            setView('edit');
        } else {
            setView('list');
        }
    }, [location.pathname, location.state]);

    const handleAddClick = () => {
        adminHook.resetForm();
        navigate('/addproduct');
    };

    const handleEditClick = (item) => {
        navigate('/updateproduct', { state: { product: item } });
    };

    const handleCancel = () => {
        navigate('/dashboard', { state: { activeView: 'products' } });
    };

    if (view === 'add') {
        return (
            <ProductForm
                {...adminHook}
                products={adminHook.productForm}
                setProducts={adminHook.setProductForm}
                handleCancel={handleCancel}
            />
        );
    }

    if (view === 'edit') {
        return (
            <ProductForm
                title="Update Product"
                description="Modify existing product details, pricing, and variants."
                {...adminHook}
                products={adminHook.productForm}
                setProducts={adminHook.setProductForm}
                addProduct={adminHook.updateProduct}
                handleCancel={handleCancel}
            />
        );
    }

    // Dynamic categories list from product catalog
    const categories = Array.from(new Set(products.map(p => p.category).filter(Boolean)));

    // Derived filtered list
    const filteredProducts = products.filter(p => {
        const searchLower = search.toLowerCase();
        const matchSearch = !search || 
            p.title?.toLowerCase().includes(searchLower) || 
            p.brand?.toLowerCase().includes(searchLower) ||
            p.category?.toLowerCase().includes(searchLower);
        const matchCategory = categoryFilter === 'ALL' || p.category === categoryFilter;
        return matchSearch && matchCategory;
    });

    const filtersConfig = [
        {
            value: categoryFilter,
            onChange: setCategoryFilter,
            options: [
                { value: "ALL", label: "All Categories" },
                ...categories.map(c => ({ value: c, label: c }))
            ]
        }
    ];

    return (
        <div className="space-y-6">
            {/* Header Action Row */}
            <Header 
                title="Product Catalog" 
                description="Manage catalog items, descriptions, categories, and base prices." 
                icon={<FaCartPlus />} 
                buttonText="Add Product" 
                clickhandler={handleAddClick} 
            />

            {/* Filter Bar */}
            <FilterBar
                search={search}
                setSearch={setSearch}
                searchPlaceholder="Search products by title, brand, or category..."
                filters={filtersConfig}
            />

            <ProductDetailTable
                mode={mode}
                product={filteredProducts}
                onEditClick={handleEditClick}
                deleteProduct={adminHook.deleteProduct}
                formatDate={formatDate}
            />
        </div>
    );
}

export default Products;