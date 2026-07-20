import React from 'react'

function RoundedButton({ icon, text, onClick, className, iconClass }) {
    return (
        <div>   <div className="relative group/tooltip">
            <button
                onClick={onClick}
                className={`px-[8px] py-[6px] bg-gray-400 rounded-full font-bold text-sm hover:shadow-lg transition-all active:scale-[0.98] ${className}`}
            >
                <span className={`material-symbols-outlined text-white ${iconClass}`}>{icon}</span>
            </button>
            <span className="absolute bootom-2 hidden group-hover/tooltip:block bg-gray-900 text-white text-[10px] font-bold rounded px-2 py-1.5 whitespace-nowrap shadow-md pointer-events-none z-10">
               {text}
            </span>
        </div></div>
    )
}

export default RoundedButton