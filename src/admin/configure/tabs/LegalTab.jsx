const LEGAL_SECTIONS = [
    { key: "aboutUs",            label: "About Us" },
    { key: "privacyPolicy",      label: "Privacy Policy" },
    { key: "returnPolicy",       label: "Return Policy" },
    { key: "termsAndConditions", label: "Terms & Conditions" },
];

export default function LegalTab({ draft, updateDraft }) {
    const legal = draft.legal || {};

    const setLegal = (key, value) =>
        updateDraft({ legal: { ...legal, [key]: value } });

    return (
        <div className="max-w-9xl space-y-6">
            <div className="p-4 bg-bg-surface border border-border-base/60 rounded-xl space-y-1.5 text-xs text-text-muted font-medium">
                <p>
                    Write content in <strong className="text-text-base">Markdown</strong> format. It will be rendered on the corresponding customer-facing pages.
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                    <code className="bg-white border border-border-base px-1.5 py-0.5 rounded text-[10px]"># Heading</code>
                    <code className="bg-white border border-border-base px-1.5 py-0.5 rounded text-[10px]">**bold**</code>
                    <code className="bg-white border border-border-base px-1.5 py-0.5 rounded text-[10px]">- list item</code>
                </div>
            </div>

            {LEGAL_SECTIONS.map(({ key, label }) => (
                <div key={key} className="space-y-2">
                    <label className="block text-xs font-bold text-text-base uppercase tracking-wider pl-0.5">
                        {label}
                    </label>
                    <textarea
                        value={legal[key] || ""}
                        onChange={(e) => setLegal(key, e.target.value)}
                        placeholder={`Write the ${label} content in Markdown...`}
                        rows={8}
                        className="w-full p-4 rounded-xl border border-border-base bg-white focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary text-sm font-mono leading-relaxed resize-y min-h-[160px]"
                    />
                    <div className="flex justify-between items-center text-[10px] text-text-muted px-0.5 font-bold">
                        <span>Markdown Supported</span>
                        <span>{(legal[key] || "").length} characters</span>
                    </div>
                </div>
            ))}
        </div>
    );
}
