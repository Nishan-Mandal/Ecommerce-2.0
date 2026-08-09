import { useState, useEffect } from "react";
import { configureService } from "../../../services/configure/configureService";
import { collection, getDocs } from "firebase/firestore";
import { fireDB } from "../../../firebase/FirebaseConfig";
import { FaPlus, FaTrash, FaEdit, FaCheck } from "react-icons/fa";
import { toast } from "react-toastify";

function CollectionEditor({ col, products, onSave, onCancel, saving }) {
    const [form, setForm] = useState({
        title: col?.title || "",
        subtitle: col?.subtitle || "",
        productIds: col?.productIds || [],
        isActive: col?.isActive ?? true,
    });
    const [searchQuery, setSearchQuery] = useState("");

    const toggleProduct = (id) => {
        setForm((prev) => ({
            ...prev,
            productIds: prev.productIds.includes(id)
                ? prev.productIds.filter((p) => p !== id)
                : [...prev.productIds, id],
        }));
    };

    const filteredProducts = products.filter((p) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
            p.title?.toLowerCase().includes(q) ||
            p.brand?.toLowerCase().includes(q) ||
            p.category?.toLowerCase().includes(q)
        );
    });

    return (
        <div className="bg-bg-surface border border-border-base/60 rounded-2xl p-4 sm:p-5 space-y-4 shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-text-muted uppercase tracking-wider pl-0.5">Collection Title</label>
                    <input
                        value={form.title}
                        onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                        placeholder="Section title e.g. Featured Products"
                        className="w-full h-11 px-4 rounded-xl border border-border-base bg-white focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary text-sm font-medium transition-all"
                    />
                </div>
                <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-text-muted uppercase tracking-wider pl-0.5">Subheading (Optional)</label>
                    <input
                        value={form.subtitle}
                        onChange={(e) => setForm((p) => ({ ...p, subtitle: e.target.value }))}
                        placeholder="e.g. Handcrafted with love"
                        className="w-full h-11 px-4 rounded-xl border border-border-base bg-white focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary text-sm font-medium transition-all"
                    />
                </div>
            </div>

            {/* Product checklist picker */}
            <div className="space-y-2">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <label className="block text-[10px] font-bold text-text-muted uppercase tracking-wider pl-0.5">
                        Select Products ({form.productIds.length} selected)
                    </label>
                </div>

                {/* Search Bar */}
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by product name, brand, or category..."
                    className="w-full h-9 px-3 text-xs rounded-xl border border-border-base bg-white focus:outline-none focus:ring-1 focus:ring-primary"
                />

                <div className="max-h-56 overflow-y-auto border border-border-base/60 rounded-xl bg-white divide-y divide-border-base/40">
                    {filteredProducts.map((p) => (
                        <label key={p.id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50/40 cursor-pointer transition-colors">
                            <input
                                type="checkbox"
                                checked={form.productIds.includes(p.id)}
                                onChange={() => toggleProduct(p.id)}
                                className="w-4 h-4 accent-primary rounded cursor-pointer"
                            />
                            <div className="flex-1 min-w-0">
                                <span className="text-xs font-bold text-text-base truncate block">{p.title}</span>
                                {p.brand && <span className="text-[10px] text-text-muted">{p.brand}</span>}
                            </div>
                            <span className="text-[10px] text-text-muted bg-bg-surface border border-border-base/50 px-2 py-0.5 rounded-full font-bold shrink-0">{p.category}</span>
                        </label>
                    ))}
                    {filteredProducts.length === 0 && (
                        <p className="p-4 text-xs text-text-muted text-center font-semibold">
                            {searchQuery ? "No matching products found." : "No products catalogued yet."}
                        </p>
                    )}
                </div>
            </div>

            {/* Form Actions */}
            <div className="flex gap-3 justify-end pt-2 border-t border-border-base/40">
                <button
                    onClick={onCancel}
                    className="h-11 px-5 rounded-xl border border-border-base bg-white hover:bg-gray-50 text-text-muted font-bold text-sm transition-colors cursor-pointer"
                >
                    Cancel
                </button>
                <button
                    onClick={() => onSave(form)}
                    disabled={saving || !form.title}
                    className="h-11 px-5 rounded-xl bg-primary text-compli font-bold text-sm hover:bg-primary-hover disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                    <FaCheck size={12} />
                    {saving ? "Saving..." : "Save Collection"}
                </button>
            </div>
        </div>
    );
}

export default function CollectionsTab() {
    const [collections, setCollections] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editing, setEditing] = useState(null); // collectionId | "new"
    const [deleting, setDeleting] = useState(null);

    useEffect(() => {
        Promise.all([
            configureService.getCollections(),
            getDocs(collection(fireDB, "products")).then((snap) =>
                snap.docs.map((d) => ({ id: d.id, ...d.data() }))
            ),
        ]).then(([cols, prods]) => {
            setCollections(cols);
            setProducts(prods);
        }).catch(() => toast.error("Failed to load collections"))
          .finally(() => setLoading(false));
    }, []);

    const handleSaveNew = async (form) => {
        setSaving(true);
        try {
            const created = await configureService.addCollection({ ...form, order: collections.length });
            setCollections((prev) => [...prev, created]);
            setEditing(null);
            toast.success("Collection created");
        } catch (err) {
            toast.error("Failed to create collection");
        } finally {
            setSaving(false);
        }
    };

    const handleSaveEdit = async (collectionId, form) => {
        setSaving(true);
        try {
            await configureService.updateCollection(collectionId, form);
            setCollections((prev) =>
                prev.map((c) => (c.collectionId === collectionId ? { ...c, ...form } : c))
            );
            setEditing(null);
            toast.success("Collection updated");
        } catch (err) {
            toast.error("Failed to update collection");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (col) => {
        setDeleting(col.collectionId);
        try {
            await configureService.deleteCollection(col.collectionId);
            setCollections((prev) => prev.filter((c) => c.collectionId !== col.collectionId));
            toast.success("Collection deleted");
        } catch (err) {
            toast.error("Failed to delete collection");
        } finally {
            setDeleting(null);
        }
    };

    if (loading) return <div className="py-8 text-center text-text-muted text-xs font-bold">Loading collections...</div>;

    return (
        <div className="max-w-2xl space-y-5">
            <p className="text-xs text-text-muted font-medium mb-3 pl-0.5">
                Each collection becomes a product section on the home page. Products are shown in the order selected.
            </p>

            {/* Existing collections */}
            <div className="space-y-3">
                {collections.map((col) => (
                    <div key={col.collectionId}>
                        {editing === col.collectionId ? (
                            <CollectionEditor
                                col={col}
                                products={products}
                                onSave={(form) => handleSaveEdit(col.collectionId, form)}
                                onCancel={() => setEditing(null)}
                                saving={saving}
                            />
                        ) : (
                            <div className="flex items-center justify-between gap-3 p-4 border border-border-base/60 rounded-2xl bg-bg-surface hover:border-gray-300 transition-colors shadow-xs">
                                <div className="flex-1 min-w-0">
                                    <p className="font-extrabold text-text-base text-sm truncate">{col.title}</p>
                                    <p className="text-xs text-text-muted mt-1 font-semibold">{col.productIds?.length || 0} products</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                                        col.isActive
                                            ? "bg-emerald-50 text-[#17700d] border-emerald-100"
                                            : "bg-gray-50 text-text-muted border-gray-150"
                                    }`}>
                                        {col.isActive ? "Active" : "Hidden"}
                                    </span>
                                    <button
                                        onClick={() => setEditing(col.collectionId)}
                                        className="h-10 w-10 flex items-center justify-center rounded-xl bg-white border border-border-base/60 hover:bg-gray-50 text-primary transition shadow-xs cursor-pointer"
                                        title="Edit Collection"
                                    >
                                        <FaEdit size={14} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(col)}
                                        disabled={deleting === col.collectionId}
                                        className="h-10 w-10 flex items-center justify-center rounded-xl bg-white border border-border-base/60 hover:bg-rose-50 text-rose-600 disabled:opacity-50 transition shadow-xs cursor-pointer"
                                        title="Delete Collection"
                                    >
                                        <FaTrash size={12} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}

                {editing === "new" ? (
                    <CollectionEditor
                        products={products}
                        onSave={handleSaveNew}
                        onCancel={() => setEditing(null)}
                        saving={saving}
                    />
                ) : (
                    <button
                        onClick={() => setEditing("new")}
                        className="w-full py-3.5 border-2 border-dashed border-border-base/80 rounded-2xl text-xs font-extrabold text-primary hover:border-primary hover:bg-primary/5 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                        <FaPlus size={12} /> Add New Collection Section
                    </button>
                )}
            </div>
        </div>
    );
}
