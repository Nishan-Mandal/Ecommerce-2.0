import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaCartPlus } from 'react-icons/fa';
import useAdmin from '../../hooks/auth/useAdmin';
import useProducts from '../../hooks/product/useProducts';
import ProductDetailTable from './ProductDetailTable';
import ProductForm from './ProductForm';
import Header from "../Components/Header";
import FilterBar from "../Components/FilterBar";
import UnsavedChangesDialog from '../Components/common/UnsavedChangesDialog';

/**
 * Products Component
 * Main entry point for catalog management: handles viewing list, adding new, and updating products.
 *
 * Navigation Guard (BrowserRouter-compatible):
 *  Since useBlocker requires createBrowserRouter (data router), we implement a manual
 *  interception pattern:
 *   1. When a location change is detected while isDirty, we navigate back to the form.
 *   2. The pending destination is stored in a ref.
 *   3. The UnsavedChangesDialog lets the user Stay or Discard & Leave.
 */
function Products({ mode, formatDate: propFormatDate }) {
    const formatDate = propFormatDate || ((dateValue) => {
        if (!dateValue) return 'N/A';
        if (typeof dateValue?.toDate === 'function') {
            return dateValue.toDate().toLocaleString('en-IN');
        }
        if (typeof dateValue === 'number') {
            return new Date(dateValue).toLocaleDateString('en-IN');
        }
        return String(dateValue);
    });

    const location = useLocation();
    const navigate = useNavigate();
    const { products, loading } = useProducts();
    const adminHook = useAdmin();
    const [view, setView] = useState('list'); // 'list' | 'add' | 'edit'

    // Filter states
    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('ALL');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [stockFilter, setStockFilter] = useState('ALL');

    // ── Navigation guard state ─────────────────────────────────────────────────
    const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);

    // Refs for use inside effects (avoid stale closures)
    const prevViewRef = useRef('list');
    const pendingNavRef = useRef(null);        // path user tried to navigate to
    const interceptingRef = useRef(false);     // prevents re-entry on navigate-back
    const isDirtyRef = useRef(adminHook.isDirty);

    // Keep isDirty ref in sync with latest state
    useEffect(() => {
        isDirtyRef.current = adminHook.isDirty;
    }, [adminHook.isDirty]);

    // ── Route sync + navigation interception ──────────────────────────────────
    useEffect(() => {
        // If we're mid-interception (we just navigated back to the form), skip processing
        if (interceptingRef.current) {
            interceptingRef.current = false;
            return;
        }

        const currPath = location.pathname;
        const prevView = prevViewRef.current;
        const isLeavingForm = (prevView === 'add' || prevView === 'edit') &&
            currPath !== '/addproduct' && currPath !== '/updateproduct';

        // ── Intercept navigation away from dirty form ──────────────────────────
        if (isLeavingForm && isDirtyRef.current) {
            // Remember where the user wanted to go
            pendingNavRef.current = { pathname: currPath, state: location.state };

            // Navigate back to the form (silently, without re-triggering full interception)
            interceptingRef.current = true;
            const formPath = prevView === 'add' ? '/addproduct' : '/updateproduct';
            navigate(formPath, { replace: true });

            // Show the confirmation dialog
            setShowUnsavedDialog(true);
            return;
        }

        // ── Normal route sync ──────────────────────────────────────────────────
        if (currPath === '/addproduct') {
            setView('add');
            prevViewRef.current = 'add';
            adminHook.recheckDraft();
        } else if (currPath === '/updateproduct') {
            const productToEdit = location.state?.product;
            if (productToEdit) adminHook.edithandle(productToEdit);
            setView('edit');
            prevViewRef.current = 'edit';
        } else {
            // Clean leave (not dirty)
            if (prevView === 'add') adminHook.resetForm();
            setView('list');
            prevViewRef.current = 'list';
        }
    }, [location.pathname, location.state]);

    // ── Navigation guard handlers ──────────────────────────────────────────────

    /** User chose to stay on the form */
    const handleStay = useCallback(() => {
        setShowUnsavedDialog(false);
        pendingNavRef.current = null;
    }, []);

    /** User confirmed leaving — discard draft and proceed */
    const handleDiscardAndLeave = useCallback(() => {
        const target = pendingNavRef.current;
        adminHook.discardDraft();
        adminHook.resetForm();
        setShowUnsavedDialog(false);
        pendingNavRef.current = null;
        prevViewRef.current = 'list';
        setView('list');
        if (target) navigate(target.pathname, { state: target.state, replace: true });
    }, [adminHook, navigate]);

    // ── Form button handlers ───────────────────────────────────────────────────
    const handleAddClick = () => navigate('/addproduct');

    const handleEditClick = (item) => navigate('/updateproduct', { state: { product: item } });

    const handleCancel = useCallback(() => {
        if (isDirtyRef.current) {
            // Trigger the guard manually (don't navigate yet, show dialog first)
            pendingNavRef.current = { pathname: '/products' };
            setShowUnsavedDialog(true);
        } else {
            adminHook.resetForm();
            navigate('/products');
        }
    }, [adminHook, navigate]);

    // ── Render form views ──────────────────────────────────────────────────────
    if (view === 'add') {
        return (
            <>
                <ProductForm
                    {...adminHook}
                    products={adminHook.productForm}
                    setProducts={adminHook.setProductForm}
                    handleCancel={handleCancel}
                />
                {showUnsavedDialog && (
                    <UnsavedChangesDialog
                        onStay={handleStay}
                        onDiscard={handleDiscardAndLeave}
                    />
                )}
            </>
        );
    }

    if (view === 'edit') {
        return (
            <>
                <ProductForm
                    title="Update Product"
                    description="Modify existing product details, pricing, and variants."
                    {...adminHook}
                    products={adminHook.productForm}
                    setProducts={adminHook.setProductForm}
                    addProduct={adminHook.updateProduct}
                    handleCancel={handleCancel}
                />
                {showUnsavedDialog && (
                    <UnsavedChangesDialog
                        onStay={handleStay}
                        onDiscard={handleDiscardAndLeave}
                    />
                )}
            </>
        );
    }

    // ── Product list view ──────────────────────────────────────────────────────
    const categories = Array.from(new Set(products.map(p => p.category).filter(Boolean)));

    const filteredProducts = products.filter(p => {
        const searchLower = search.toLowerCase();
        const matchSearch = !search ||
            p.title?.toLowerCase().includes(searchLower) ||
            p.brand?.toLowerCase().includes(searchLower) ||
            p.category?.toLowerCase().includes(searchLower);

        const matchCategory = categoryFilter === 'ALL' || p.category === categoryFilter;

        const isLive = p.isActive !== false;
        const matchStatus = statusFilter === 'ALL' ||
            (statusFilter === 'LIVE' && isLive) ||
            (statusFilter === 'DRAFT' && !isLive);

        const stockCount = p.hasVariants && Array.isArray(p.variants) && p.variants.length > 0
            ? p.variants.reduce((acc, v) => acc + Number(v.inStock || v.quantity || 0), 0)
            : Number(p.inStock ?? p.stock ?? 0);

        const matchStock = stockFilter === 'ALL' ||
            (stockFilter === 'OUT_OF_STOCK' && stockCount <= 0) ||
            (stockFilter === 'LOW_STOCK' && stockCount > 0 && stockCount <= 5) ||
            (stockFilter === 'IN_STOCK' && stockCount > 5);

        return matchSearch && matchCategory && matchStatus && matchStock;
    });

    const filtersConfig = [
        {
            value: statusFilter,
            onChange: setStatusFilter,
            options: [
                { value: "ALL", label: "All Status" },
                { value: "LIVE", label: "Live" },
                { value: "DRAFT", label: "Draft" }
            ]
        },
        {
            value: categoryFilter,
            onChange: setCategoryFilter,
            options: [
                { value: "ALL", label: "All Categories" },
                ...categories.map(c => ({ value: c, label: c }))
            ]
        },
        {
            value: stockFilter,
            onChange: setStockFilter,
            options: [
                { value: "ALL", label: "All Stock Status" },
                { value: "IN_STOCK", label: "In Stock (>5)" },
                { value: "LOW_STOCK", label: "Low Stock (1-5)" },
                { value: "OUT_OF_STOCK", label: "Out of Stock (0)" }
            ]
        }
    ];

    return (
        <div className="space-y-6 px-4 md:px-0">
            <Header
                title="Product Catalog"
                description="Manage catalog items, descriptions, categories, and base prices."
                icon={<FaCartPlus />}
                buttonText="Add Product"
                clickhandler={handleAddClick}
            />
            <FilterBar
                search={search}
                setSearch={setSearch}
                searchPlaceholder="Search products by title, brand, or category..."
                filters={filtersConfig}
            />
            <ProductDetailTable
                mode={mode}
                product={filteredProducts}
                loading={loading}
                onEditClick={handleEditClick}
                deleteProduct={adminHook.deleteProduct}
                toggleActiveStatus={adminHook.toggleProductActiveStatus}
                formatDate={formatDate}
            />
        </div>
    );
}

export default Products;