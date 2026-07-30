import ProductHeader from "./Sections/ProductHeader";
import ProductImages from "./Sections/ProductImage";
import ProductBasicInfo from "./Sections/ProductInfo";
import ProductVariants from "./Sections/ProductVariants";
import VariantTable from "./Sections/VariantTable";
import ProductActions from "./Sections/ProductAction";

function ProductForm(props) {

    const {
        title,
        description,

        products,
        setProducts,

        uploading,
        uploadProgress,

        handleCancel,
        addProduct,

        handleImageUpload,
        handleImageDelete,

        handleTagsChange,

        addVariantType,
        deleteVariantType,

        handleVariantTypeNameChange,
        handleVariantTypeValuesChange,

        generateCombinations,
        addManualVariant,

        deleteVariant,
        handleVariantChange,
        handleVariantImageUpload,
        handleVariantImageDelete,
        variantUploadingIndex,
    } = props;

    return (
        <div className="w-full max-w-screen-2xl mx-auto py-2 space-y-6 lg:space-y-8">
            <ProductHeader
                title={title || "Product Configuration"}
                description={description || "Manage product info, images, structured description text/tables, and variant inventory."}
                uploading={uploading}
                handleCancel={handleCancel}
                addProduct={addProduct}
            />

            <ProductImages
                products={products}
                setProducts={setProducts}
                uploading={uploading}
                uploadProgress={uploadProgress}
                handleImageUpload={handleImageUpload}
                handleImageDelete={handleImageDelete}
            />

            <div className={`grid grid-cols-1 ${products.hasVariants ? "xl:grid-cols-2" : ""} gap-6 xl:gap-8`}>
                <ProductBasicInfo
                    products={products}
                    setProducts={setProducts}
                    handleTagsChange={handleTagsChange}
                />

                {products.hasVariants && (
                    <ProductVariants
                        products={products}
                        addVariantType={addVariantType}
                        deleteVariantType={deleteVariantType}
                        handleVariantTypeNameChange={handleVariantTypeNameChange}
                        handleVariantTypeValuesChange={handleVariantTypeValuesChange}
                        generateCombinations={generateCombinations}
                        addManualVariant={addManualVariant}
                    />
                )}
            </div>

            {products.hasVariants && (
                <VariantTable
                    products={products}
                    setProducts={setProducts}
                    deleteVariant={deleteVariant}
                    handleVariantChange={handleVariantChange}
                    handleVariantImageUpload={handleVariantImageUpload}
                    handleVariantImageDelete={handleVariantImageDelete}
                    variantUploadingIndex={variantUploadingIndex}
                />
            )}

            <ProductActions
                uploading={uploading}
                addProduct={addProduct}
                handleCancel={handleCancel}
            />
        </div>

    );
}

export default ProductForm;