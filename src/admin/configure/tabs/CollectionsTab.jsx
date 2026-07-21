import { useState, useEffect } from "react";
import { configureService } from "../../../services/configure/configureService";
import { collection, getDocs } from "firebase/firestore";
import { fireDB } from "../../../firebase/FirebaseConfig";
import { FaPlus, FaTrash, FaEdit, FaCheck } from "react-icons/fa";
import { toast } from "react-toastify";

const LAYOUTS = ["grid", "horizontal-scroll"];

function CollectionEditor({ col, products, onSave, onCancel, saving }) {
    const [form, setForm] = useState({
        title: col?.title || "",
        subtitle: col?.subtitle || "",
        productIds: col?.productIds || [],
        layout: col?.layout || "grid",
        isActive: col?.isActive ?? true,
    });

    const toggleProduct = (id) => {
        setForm((prev) => ({
            ...prev,
            productIds: prev.productIds.includes(id)
                ? prev.productIds.filter((p) => p !== id)
                : [...prev.productIds, id],
        }));
    };

    return (
        <div className="bg-bg-surface border border-border-base/60 rounded-2xl p-4 sm:p-5 space-y-4 shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2 space-y-1">
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
                <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-text-muted uppercase tracking-wider pl-0.5">Layout Type</label>
                    <select
                        value={form.layout}
                        onChange={(e) => setForm((p) => ({ ...p, layout: e.target.value }))}
                        className="w-full h-11 px-4 rounded-xl border border-border-base bg-white focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary text-sm font-bold text-text-base cursor-pointer transition-all appearance-none"
                    >
                        {LAYOUTS.map((l) => (
                            <option key={l} value={l}>
                                {l.charAt(0).toUpperCase() + l.slice(1)}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Product checklist picker */}
            <div className="space-y-2">
                <label className="block text-[10px] font-bold text-text-muted uppercase tracking-wider pl-0.5">
                    Select Products ({form.productIds.length} selected)
                </label>
                <div className="max-h-56 overflow-y-auto border border-border-base/60 rounded-xl bg-white divide-y divide-border-base/40">
                    {products.map((p) => (
                        <label key={p.id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50/40 cursor-pointer transition-colors">
                            <input
                                type="checkbox"
                                checked={form.productIds.includes(p.id)}
                                onChange={() => toggleProduct(p.id)}
                                className="w-4 h-4 accent-primary rounded cursor-pointer"
                            />
                            <span className="text-xs font-bold text-text-base truncate flex-1">{p.title}</span>
                            <span className="text-[10px] text-text-muted bg-bg-surface border border-border-base/50 px-2 py-0.5 rounded-full font-bold">{p.category}</span>
                        </label>
                    ))}
                    {products.length === 0 && (
                        <p className="p-4 text-xs text-text-muted text-center font-semibold">No products catalogued yet.</p>
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
                                    <p className="text-xs text-text-muted mt-1 font-semibold">{col.productIds?.length || 0} products · {col.layout}</p>
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
            </div>

            {/* New collection editor */}
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
                    className="w-full h-11 border-2 border-dashed border-border-base hover:border-primary/50 bg-white rounded-xl text-xs sm:text-sm text-text-muted hover:text-primary transition font-bold flex items-center justify-center gap-2 cursor-pointer"
                >
                    <FaPlus className="text-xs" /> Add Collection
                </button>
            )}
        </div>
    );
}
