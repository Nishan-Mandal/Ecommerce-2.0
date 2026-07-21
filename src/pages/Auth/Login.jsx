import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/auth/useAuth';
import Loader from '../../components/loader/Loader';

/**
 * Login Component (Adaptive Modal or Page)
 * Renders centered login form over a blurred backdrop overlay if modal,
 * or as a styled standalone container if page.
 */
function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { loading, login, setIsLoginOpen, setIsSignupOpen } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const isPage = location.pathname === '/login';

    const signin = async (e) => {
        if (e) e.preventDefault();
        if (email === "" || password === "") {
            return toast.error("All fields are required");
        }
        try {
            await login(email, password);
            toast.success('Signin Successfully', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: true,
                closeOnClick: true,
                theme: "colored",
            });
            if (isPage) {
                const from = location.state?.from?.pathname || '/';
                navigate(from, { replace: true });
            }
        } catch (error) {
            console.error(error);
            toast.error(error.message || 'Signin Failed', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                theme: "colored",
            });
        }
    }

    const formContent = (
        <form 
            onSubmit={signin} 
            className={`relative z-10 w-full max-w-sm mx-auto bg-white border border-slate-200 p-8 rounded-2xl shadow-xl ${isPage ? 'my-8 sm:my-16' : ''}`}
            onClick={(e) => e.stopPropagation()}
        >
            {/* Cross Button (Only for modal) */}
            {!isPage && (
                <button
                    type="button"
                    onClick={() => setIsLoginOpen(false)}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                    aria-label="Close"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            )}

            {/* Header */}
            <div className="mb-6 mt-2">
                <h1 className="text-center text-slate-800 text-2xl font-bold tracking-tight">Welcome Back</h1>
                <p className="text-center text-xs text-slate-500 mt-1.5 font-medium">Enter your details to sign in</p>
            </div>

            {/* Email Field */}
            <div className="mb-4">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Email Address</label>
                <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 placeholder:text-slate-400 px-3.5 py-2.5 text-sm rounded-xl focus:outline-none focus:border-slate-400 transition-all duration-200"
                    placeholder="name@example.com"
                    required
                />
            </div>

            {/* Password Field */}
            <div className="mb-6">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Password</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 placeholder:text-slate-400 px-3.5 py-2.5 text-sm rounded-xl focus:outline-none focus:border-slate-400 transition-all duration-200"
                    placeholder="••••••••"
                    required
                />
            </div>

            {/* Submit Button */}
            <div className="mb-5">
                <button
                    type="submit"
                    className="w-full py-2.5 bg-primary text-compli text-sm font-semibold rounded-xl hover:opacity-95 active:scale-[0.98] transition-all shadow-sm cursor-pointer">
                    Sign In
                </button>
            </div>

            {/* Footer Link */}
            <p className="text-center text-xs text-slate-500">
                Don&apos;t have an account?{' '}
                {isPage ? (
                    <button
                        type="button"
                        onClick={() => navigate('/signup', { state: location.state })}
                        className="text-slate-700 hover:text-slate-900 font-semibold underline transition-colors focus:outline-none cursor-pointer"
                    >
                        Create one
                    </button>
                ) : (
                    <button
                        type="button"
                        onClick={() => {
                            setIsLoginOpen(false);
                            setIsSignupOpen(true);
                        }}
                        className="text-slate-700 hover:text-slate-900 font-semibold underline transition-colors focus:outline-none cursor-pointer"
                    >
                        Create one
                    </button>
                )}
            </p>
        </form>
    );

    if (isPage) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center bg-slate-50/50 py-12 px-4 sm:px-6 lg:px-8">
                {loading && <Loader />}
                {formContent}
            </div>
        );
    }

    return (
        <div 
            className="fixed inset-0 z-[100] flex justify-center items-center bg-black/40 backdrop-blur-md overflow-hidden"
            onClick={() => setIsLoginOpen(false)}
        >
            {loading && <Loader />}
            {formContent}
        </div>
    )
}

export default Login;
