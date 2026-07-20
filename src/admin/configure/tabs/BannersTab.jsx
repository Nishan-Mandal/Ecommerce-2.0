import { useState, useEffect } from "react";
import { configureService } from "../../../services/configure/configureService";
import { FaTrash, FaPlus, FaCloudUploadAlt, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";

function BannerCard({ banner, onDelete, deleting }) {
    return (
        <div className="relative rounded-2xl overflow-hidden border border-border-base/60 group bg-bg-surface hover:shadow-xs transition-all duration-200">
            <img
                src={banner.imageUrl}
                alt={banner.title || "Banner"}
                className="w-full h-36 object-cover"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                <button
                    onClick={() => onDelete(banner)}
                    disabled={deleting === banner.bannerId}
                    className="p-2 bg-red-650 hover:bg-red-700 text-white rounded-lg transition text-xs font-semibold flex items-center gap-1.5 disabled:opacity-60 cursor-pointer"
                >
                    <FaTrash />
                    {deleting === banner.bannerId ? "Deleting..." : "Delete"}
                </button>
            </div>
            <div className="px-4 py-3 bg-white border-t border-border-base/60">
                <p className="font-extrabold text-text-base text-xs truncate">{banner.title || "Untitled Banner"}</p>
                <p className="text-[10px] text-text-muted truncate mt-0.5 font-bold">{banner.ctaUrl || "/"}</p>
            </div>
        </div>
    );
}

export default function BannersTab() {
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [deleting, setDeleting] = useState(null);

    // Queue for selected files
    const [queue, setQueue] = useState([]);

    useEffect(() => {
        configureService.getBanners()
            .then(setBanners)
            .catch(() => toast.error("Failed to load banners"))
            .finally(() => setLoading(false));
    }, []);

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        const newQueueItems = files.map((file, idx) => ({
            id: `${Date.now()}-${idx}-${file.name}`,
            file,
            preview: URL.createObjectURL(file),
            title: "",
            subtitle: "",
            ctaLabel: "",
            ctaUrl: "",
            progress: 0,
            status: "pending", // pending, uploading, success, error
        }));

        setQueue((prev) => [...prev, ...newQueueItems]);
        // Reset file input value
        e.target.value = "";
    };

    const handleQueueFieldChange = (id, field, value) => {
        setQueue((prev) =>
            prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
        );
    };

    const removeFromQueue = (id) => {
        setQueue((prev) => {
            const item = prev.find((i) => i.id === id);
            if (item && item.preview) {
                URL.revokeObjectURL(item.preview);
            }
            return prev.filter((i) => i.id !== id);
        });
    };

    const clearQueue = () => {
        queue.forEach((item) => {
            if (item.preview) URL.revokeObjectURL(item.preview);
        });
        setQueue([]);
    };

    const handleUploadAll = async () => {
        if (queue.length === 0) return;
        setUploading(true);

        const pendingItems = queue.filter((item) => item.status === "pending" || item.status === "error");
        
        let successCount = 0;
        let failCount = 0;

        for (let i = 0; i < pendingItems.length; i++) {
            const item = pendingItems[i];
            
            // Set status to uploading
            setQueue((prev) =>
                prev.map((q) => (q.id === item.id ? { ...q, status: "uploading" } : q))
            );

            try {
                const newBanner = await configureService.addBanner(
                    item.file,
                    {
                        title: item.title,
                        subtitle: item.subtitle,
                        ctaLabel: item.ctaLabel,
                        ctaUrl: item.ctaUrl,
                        order: banners.length + successCount,
                    },
                    (p) => {
                        setQueue((prev) =>
                            prev.map((q) => (q.id === item.id ? { ...q, progress: p } : q))
                        );
                    }
                );

                // Add to list and set status to success
                setBanners((prev) => [...prev, newBanner]);
                setQueue((prev) =>
                    prev.map((q) => (q.id === item.id ? { ...q, status: "success", progress: 100 } : q))
                );
                successCount++;
            } catch (err) {
                console.error("Failed to upload", item.file.name, err);
                setQueue((prev) =>
                    prev.map((q) => (q.id === item.id ? { ...q, status: "error" } : q))
                );
                failCount++;
            }
        }

        setUploading(false);

        if (successCount > 0) {
            toast.success(`Successfully uploaded ${successCount} banner(s)`);
            // Clean up successfully uploaded items from queue
            setQueue((prev) => {
                const succeeded = prev.filter((q) => q.status === "success");
                succeeded.forEach((item) => {
                    if (item.preview) URL.revokeObjectURL(item.preview);
                });
                return prev.filter((q) => q.status !== "success");
            });
        }
        
        if (failCount > 0) {
            toast.error(`Failed to upload ${failCount} banner(s)`);
        }
    };

    const handleDelete = async (banner) => {
        setDeleting(banner.bannerId);
        try {
            await configureService.deleteBanner(banner.bannerId, banner.imageUrl);
            setBanners((prev) => prev.filter((b) => b.bannerId !== banner.bannerId));
            toast.success("Banner deleted");
        } catch (err) {
            toast.error("Failed to delete banner");
        } finally {
            setDeleting(null);
        }
    };

    if (loading) return <div className="py-8 text-center text-text-muted text-xs font-bold">Loading banners...</div>;

    return (
        <div className="max-w-3xl space-y-6">

            {/* Dropzone & Picker */}
            <div className="bg-bg-surface border border-border-base/60 rounded-2xl p-4 sm:p-5 space-y-4">
                <h3 className="font-bold text-text-base text-sm">Upload Banners</h3>

                <label className="block cursor-pointer">
                    <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border-base hover:border-primary/50 py-8 px-4 transition bg-white text-center">
                      <span>Select Image</span>
                    </div>
                    <input 
                        type="file" 
                        accept="image/*" 
                        multiple 
                        className="hidden" 
                        onChange={handleFileSelect} 
                        disabled={uploading}
                    />
                </label>
            </div>

            {/* Upload Queue */}
            {queue.length > 0 && (
                <div className="bg-bg-surface border border-border-base/60 rounded-2xl p-4 sm:p-5 space-y-4 shadow-sm">
                    <div className="flex justify-between items-center pb-2 border-b border-border-base/60">
                        <span className="font-bold text-text-base text-xs uppercase tracking-wider">
                            Upload Queue ({queue.length} item{queue.length !== 1 ? "s" : ""})
                        </span>
                        <button
                            onClick={clearQueue}
                            disabled={uploading}
                            className="text-[11px] font-bold text-red-500 hover:text-red-600 disabled:opacity-50 cursor-pointer"
                        >
                            Clear Queue
                        </button>
                    </div>

                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-border-base [&::-webkit-scrollbar-thumb]:rounded-full">
                        {queue.map((item) => (
                            <div key={item.id} className="relative p-3 rounded-xl border border-border-base/60 bg-bg-base/30 flex flex-col md:flex-row gap-3">
                                {/* Image Preview */}
                                <div className="relative w-full md:w-32 h-20 rounded-lg overflow-hidden border border-border-base bg-white flex-shrink-0">
                                    <img src={item.preview} alt="preview" className="w-full h-full object-cover" />
                                    {item.status !== "uploading" && item.status !== "success" && (
                                        <button
                                            onClick={() => removeFromQueue(item.id)}
                                            className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-600/80 text-white flex items-center justify-center hover:bg-red-650 transition cursor-pointer"
                                            title="Remove from queue"
                                        >
                                            <FaTimes size={10} />
                                        </button>
                                    )}
                                    {/* Upload overlay */}
                                    {(item.status === "uploading" || item.status === "success") && (
                                        <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white text-[10px] font-bold gap-1">
                                            {item.status === "uploading" ? (
                                                <>
                                                    <span className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></span>
                                                    <span>{item.progress}%</span>
                                                </>
                                            ) : (
                                                <span className="text-green-400">Ready</span>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Form Fields */}
                                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    <input
                                        value={item.title}
                                        onChange={(e) => handleQueueFieldChange(item.id, "title", e.target.value)}
                                        placeholder="Banner Title (optional)"
                                        disabled={uploading || item.status === "success"}
                                        className="h-9 px-3 rounded-lg border border-border-base bg-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-xs font-semibold"
                                    />
                                    <input
                                        value={item.subtitle}
                                        onChange={(e) => handleQueueFieldChange(item.id, "subtitle", e.target.value)}
                                        placeholder="Subtitle (optional)"
                                        disabled={uploading || item.status === "success"}
                                        className="h-9 px-3 rounded-lg border border-border-base bg-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-xs font-semibold"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="pt-2">
                        <button
                            onClick={handleUploadAll}
                            disabled={uploading || queue.length === 0}
                            className="w-full h-11 rounded-xl bg-primary text-compli font-bold text-sm transition hover:bg-primary-hover disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                        >
                            <FaPlus className="text-xs" />
                            {uploading ? "Uploading Banners..." : `Upload ${queue.length} Banner${queue.length !== 1 ? "s" : ""}`}
                        </button>
                    </div>
                </div>
            )}

            {/* Existing Banners */}
            <div className="space-y-4">
                <p className="text-xs text-text-muted font-extrabold">{banners.length} banner{banners.length !== 1 ? "s" : ""} configured</p>
                {banners.length === 0 && (
                    <div className="text-center py-12 text-text-muted text-sm border border-dashed border-border-base/60 rounded-2xl bg-bg-surface font-bold">
                        No banners yet. Upload one above.
                    </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {banners.map((b) => (
                        <BannerCard key={b.bannerId} banner={b} onDelete={handleDelete} deleting={deleting} />
                    ))}
                </div>
            </div>

        </div>
    );
}

export { BannersTab };
