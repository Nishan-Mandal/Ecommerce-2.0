import { useState } from "react";
import { uploadService } from "../../../services/upload/uploadService";
import { FaFilePdf, FaPlus, FaTrash, FaCheck, FaTimes, FaGlobe, FaFileUpload } from "react-icons/fa";
import { toast } from "react-toastify";

const FIXED_LEGAL_PAGES = [
  { key: "aboutUs", label: "About Us", path: "/aboutus" },
  { key: "privacyPolicy", label: "Privacy Policy", path: "/privacypolicy" },
  { key: "termsAndConditions", label: "Terms & Conditions", path: "/termsconditions" },
  { key: "returnPolicy", label: "Return Policy", path: "/returnpolicy" },
  { key: "shippingPolicy", label: "Shipping Policy", path: "/shippingpolicy" },
  { key: "refundPolicy", label: "Refund Policy", path: "/refundpolicy" },
];

export default function LegalTab({ draft, updateDraft }) {
  const [uploadingKey, setUploadingKey] = useState(null);

  // Normalize legacy string formats to object structure
  const rawLegal = draft.legal || {};
  const fixedPages = rawLegal.fixedPages || {};
  const customPages = Array.isArray(rawLegal.customPages) ? rawLegal.customPages : [];

  const updateFixedPdf = (key, pdfUrl) => {
    updateDraft({
      legal: {
        ...rawLegal,
        fixedPages: {
          ...fixedPages,
          [key]: {
            pdfUrl,
            isActive: fixedPages[key]?.isActive ?? true,
          },
        },
      },
    });
  };

  const toggleFixedActive = (key) => {
    updateDraft({
      legal: {
        ...rawLegal,
        fixedPages: {
          ...fixedPages,
          [key]: {
            pdfUrl: fixedPages[key]?.pdfUrl || (typeof rawLegal[key] === 'string' ? '' : ''),
            isActive: !(fixedPages[key]?.isActive ?? true),
          },
        },
      },
    });
  };

  const handleFileUpload = async (key, file) => {
    if (!file) return;
    if (file.type !== "application/pdf") {
      toast.error("Please select a valid PDF file (.pdf)");
      return;
    }

    setUploadingKey(key);
    try {
      const url = await uploadService.uploadFile(file, "legal");
      updateFixedPdf(key, url);
      toast.success("PDF uploaded successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload PDF");
    } finally {
      setUploadingKey(null);
    }
  };

  // ── Extra Custom Pages Handlers ──────────────────────────────────────────────
  const addCustomPage = () => {
    const newPage = {
      id: Date.now().toString(),
      name: "New Policy Page",
      slug: `custom-page-${customPages.length + 1}`,
      pdfUrl: "",
      isActive: true,
    };
    updateDraft({
      legal: {
        ...rawLegal,
        customPages: [...customPages, newPage],
      },
    });
  };

  const updateCustomPage = (id, field, value) => {
    const updated = customPages.map((page) => {
      if (page.id !== id) return page;
      if (field === "name" && !page.slugEdited) {
        const autoSlug = value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
        return { ...page, name: value, slug: autoSlug };
      }
      return { ...page, [field]: value };
    });
    updateDraft({
      legal: {
        ...rawLegal,
        customPages: updated,
      },
    });
  };

  const uploadCustomPdf = async (id, file) => {
    if (!file) return;
    if (file.type !== "application/pdf") {
      toast.error("Please select a valid PDF file (.pdf)");
      return;
    }

    setUploadingKey(id);
    try {
      const url = await uploadService.uploadFile(file, "legal");
      updateCustomPage(id, "pdfUrl", url);
      toast.success("Custom PDF uploaded");
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload custom PDF");
    } finally {
      setUploadingKey(null);
    }
  };

  const deleteCustomPage = (id) => {
    const filtered = customPages.filter((p) => p.id !== id);
    updateDraft({
      legal: {
        ...rawLegal,
        customPages: filtered,
      },
    });
  };

  return (
    <div className="max-w-4xl space-y-8 text-xs">
      {/* Overview Banner */}
      <div className="p-4 bg-bg-surface border border-border-base/60 rounded-2xl space-y-1 text-text-muted">
        <h3 className="text-sm font-bold text-text-base flex items-center gap-2">
          <FaFilePdf className="text-red-500" /> Legal & Policy Documents
        </h3>
        <p className="text-xs">
          Upload PDF documents for your store policy pages. Customer panel will render these PDFs directly.
        </p>
      </div>

      {/* Standard Legal Pages */}
      <div className="space-y-4">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-text-base">Standard Legal Pages</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {FIXED_LEGAL_PAGES.map(({ key, label, path }) => {
            const pageData = fixedPages[key] || {};
            const pdfUrl = pageData.pdfUrl || (typeof rawLegal[key] === "string" ? "" : "");
            const isActive = pageData.isActive ?? true;
            const isUploading = uploadingKey === key;

            return (
              <div key={key} className="bg-bg-surface border border-border-base/60 rounded-2xl p-4 space-y-3 shadow-2xs">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-text-base">{label}</h4>
                    <p className="text-[10px] text-text-muted font-mono">{path}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleFixedActive(key)}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer transition ${
                      isActive ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {isActive ? "Active" : "Inactive"}
                  </button>
                </div>

                {pdfUrl ? (
                  <div className="flex items-center justify-between gap-2 p-2 bg-bg-base border border-border-base/60 rounded-xl">
                    <div className="flex items-center gap-2 truncate">
                      <FaFilePdf className="text-red-500 shrink-0" size={14} />
                      <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="truncate font-semibold text-primary hover:underline text-[11px]">
                        View PDF Document
                      </a>
                    </div>
                    <label className="text-[10px] font-bold text-text-muted hover:text-text-base cursor-pointer underline shrink-0">
                      Replace
                      <input type="file" accept="application/pdf" className="hidden" onChange={(e) => handleFileUpload(key, e.target.files[0])} />
                    </label>
                  </div>
                ) : (
                  <label className="flex items-center justify-center gap-2 p-3 border-2 border-dashed border-border-base hover:border-primary/50 bg-white rounded-xl cursor-pointer text-text-muted hover:text-primary transition">
                    <FaFileUpload size={14} />
                    <span className="font-semibold text-[11px]">{isUploading ? "Uploading PDF..." : "Upload PDF File"}</span>
                    <input type="file" accept="application/pdf" className="hidden" onChange={(e) => handleFileUpload(key, e.target.files[0])} disabled={isUploading} />
                  </label>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Extra Custom Pages */}
      <div className="space-y-4 pt-4 border-t border-border-base/60">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-text-base">Extra Legal & Custom Pages</h3>
            <p className="text-[11px] text-text-muted mt-0.5">Add custom policy pages (e.g. Warranty Policy, Affiliate Policy, Careers)</p>
          </div>
          <button
            type="button"
            onClick={addCustomPage}
            className="px-3 py-2 rounded-xl bg-primary text-compli text-xs font-bold hover:bg-primary-hover transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <FaPlus size={10} /> Add Custom Page
          </button>
        </div>

        {customPages.length === 0 ? (
          <div className="p-8 text-center border-2 border-dashed border-border-base/60 rounded-2xl text-text-muted">
            No extra legal pages created yet. Click "Add Custom Page" above to add one.
          </div>
        ) : (
          <div className="space-y-4">
            {customPages.map((page) => {
              const isUploading = uploadingKey === page.id;
              return (
                <div key={page.id} className="bg-bg-surface border border-border-base/60 rounded-2xl p-4 space-y-3 shadow-2xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-text-muted uppercase mb-1">Page Name</label>
                      <input
                        type="text"
                        value={page.name}
                        onChange={(e) => updateCustomPage(page.id, "name", e.target.value)}
                        placeholder="e.g. Warranty Policy"
                        className="w-full px-3 py-2 rounded-xl border border-border-base bg-white text-xs font-bold focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-text-muted uppercase mb-1">URL Slug</label>
                      <div className="flex items-center gap-1 bg-white border border-border-base rounded-xl px-3 py-2">
                        <span className="text-text-muted font-mono text-[10px]">/legal/</span>
                        <input
                          type="text"
                          value={page.slug}
                          onChange={(e) => {
                            updateCustomPage(page.id, "slugEdited", true);
                            updateCustomPage(page.id, "slug", e.target.value);
                          }}
                          placeholder="warranty-policy"
                          className="w-full bg-transparent text-xs font-bold font-mono focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                    {/* PDF File Picker */}
                    <div className="flex-1 min-w-[220px]">
                      {page.pdfUrl ? (
                        <div className="flex items-center justify-between gap-2 p-2 bg-bg-base border border-border-base/60 rounded-xl">
                          <div className="flex items-center gap-2 truncate">
                            <FaFilePdf className="text-red-500 shrink-0" size={14} />
                            <a href={page.pdfUrl} target="_blank" rel="noopener noreferrer" className="truncate font-semibold text-primary hover:underline text-[11px]">
                              {page.name} PDF
                            </a>
                          </div>
                          <label className="text-[10px] font-bold text-text-muted hover:text-text-base cursor-pointer underline shrink-0">
                            Replace
                            <input type="file" accept="application/pdf" className="hidden" onChange={(e) => uploadCustomPdf(page.id, e.target.files[0])} />
                          </label>
                        </div>
                      ) : (
                        <label className="flex items-center justify-center gap-2 p-2.5 border-2 border-dashed border-border-base hover:border-primary/50 bg-white rounded-xl cursor-pointer text-text-muted hover:text-primary transition">
                          <FaFileUpload size={12} />
                          <span className="font-semibold text-[11px]">{isUploading ? "Uploading PDF..." : "Upload PDF File"}</span>
                          <input type="file" accept="application/pdf" className="hidden" onChange={(e) => uploadCustomPdf(page.id, e.target.files[0])} disabled={isUploading} />
                        </label>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => updateCustomPage(page.id, "isActive", !page.isActive)}
                        className={`px-3 py-1.5 rounded-xl text-[10px] font-bold transition cursor-pointer ${
                          page.isActive ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {page.isActive ? "Active" : "Inactive"}
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteCustomPage(page.id)}
                        className="p-2 rounded-xl text-red-500 hover:bg-red-50 transition cursor-pointer"
                        title="Delete Page"
                      >
                        <FaTrash size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
