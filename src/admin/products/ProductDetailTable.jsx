import React, { useState, useEffect } from 'react';
import WarningModal from '../../components/modal/WarningModal';
import TableSkeleton from '../../components/loader/SkeletonLoader/TableSkeleton';
import Pagination from '../../components/common/Pagination';
import DataTable from '../Components/common/DataTable';
import ProductMobileCard from './tableComponents/ProductMobileCard';
import getProductTableColumns  from './tableComponents/ProductColumns';

/**
 * ProductDetailTable Component (Admin Products Module)
 * Main product management table panel: renders desktop data table, mobile cards, pagination, and delete warning modal.
 * Uses modular section components and utilities to keep the component clean and maintainable.
 */
function ProductDetailTable({ mode, product = [], loading = false, onAddClick, onEditClick, deleteProduct, toggleActiveStatus, formatDate }) {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedProductToDelete, setSelectedProductToDelete] = useState(null);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    // Reset to page 1 if products list length changes
    useEffect(() => {
        setCurrentPage(1);
    }, [product.length]);

    const handleDeleteClick = (item) => {
        setSelectedProductToDelete(item);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (selectedProductToDelete && deleteProduct) {
            deleteProduct(selectedProductToDelete);
        }
        setIsDeleteModalOpen(false);
        setSelectedProductToDelete(null);
    };

    if (loading) {
        return <TableSkeleton rows={pageSize} columns={8} />;
    }

    // Paginated subset
    const startIndex = (currentPage - 1) * pageSize;
    const paginatedProducts = product.slice(startIndex, startIndex + pageSize);

    // Column definitions generated via utility helper
    const columns = getProductTableColumns({
        startIndex,
        onEditClick,
        onDeleteClick: handleDeleteClick,
        toggleActiveStatus,
        formatDate,
    });

    return (
        <div className="mb-12 space-y-4">
            {/* Reusable Data Table */}
            <DataTable
                columns={columns}
                data={paginatedProducts}
                emptyMessage="No products available."
                mobileCardRender={(item, idx) => (
                    <ProductMobileCard
                        key={idx}
                        item={item}
                        index={idx}
                        onEditClick={onEditClick}
                        onDeleteClick={handleDeleteClick}
                        toggleActiveStatus={toggleActiveStatus}
                        formatDate={formatDate}
                    />
                )}
            />

            {/* Universal Pagination */}
            <Pagination
                currentPage={currentPage}
                totalItems={product.length}
                pageSize={pageSize}
                onPageChange={setCurrentPage}
                onPageSizeChange={(newSize) => {
                    setPageSize(newSize);
                    setCurrentPage(1);
                }}
            />

            {/* Confirmation delete modal */}
            <WarningModal
                isOpen={isDeleteModalOpen}
                message={`Are you sure you want to delete "${selectedProductToDelete?.title}"? This action cannot be undone.`}
                onConfirm={handleConfirmDelete}
                onCancel={() => {
                    setIsDeleteModalOpen(false);
                    setSelectedProductToDelete(null);
                }}
                confirmText="Delete"
                mode={mode}
            />
        </div>
    );
}

export default ProductDetailTable;
