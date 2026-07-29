import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/auth/useAuth';
import Loader from '../../components/loader/Loader';
import { FaEnvelope, FaPhoneAlt, FaLock, FaKey, FaArrowLeft, FaCheckCircle } from 'react-icons/fa';

/**
 * Login Component (Adaptive Modal or Page)
 * Renders centered login form over a blurred backdrop overlay if modal,
 * or as a styled standalone container if page.
 * Supports Email/Password & Phone OTP with reCAPTCHA verification.
 */
function Login() {
    const [authMode, setAuthMode] = useState('email'); // 'email' | 'phone'
    
    // Email Auth State
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Phone Auth State
    const [phoneNumber, setPhoneNumber] = useState('');
    const [phoneStep, setPhoneStep] = useState(1); // 1: Phone input, 2: OTP input
    const [otp, setOtp] = useState('');
    const [confirmationResult, setConfirmationResult] = useState(null);
    const [otpSending, setOtpSending] = useState(false);
    const [otpVerifying, setOtpVerifying] = useState(false);
    const [timer, setTimer] = useState(0);

    const { loading, login, setupRecaptcha, sendOtp, verifyOtp, setIsLoginOpen, setIsSignupOpen } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const isPage = location.pathname === '/login';

    // Countdown Timer for OTP Resend
    useEffect(() => {
        let interval = null;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [timer]);

    // Email Signin Handler
    const handleEmailSignin = async (e) => {
        if (e) e.preventDefault();
        if (!email.trim() || !password.trim()) {
            return toast.error("Please enter email and password.");
        }
        try {
            await login(email, password);
            toast.success('Signed in successfully!');
            setIsLoginOpen(false);
            if (isPage) {
                const from = location.state?.from?.pathname || '/';
                navigate(from, { replace: true });
            }
        } catch (error) {
            console.error("Email login error:", error);
            toast.error(error.message || 'Signin Failed');
        }
    };

    // Send OTP Handler
    const handleSendOtp = async (e) => {
        if (e) e.preventDefault();
        const cleanPhone = phoneNumber.replace(/\D/g, "");
        if (!cleanPhone || cleanPhone.length < 10) {
            return toast.error("Please enter a valid 10-digit mobile number.");
        }

        setOtpSending(true);
        try {
            const verifier = setupRecaptcha("recaptcha-container", "invisible");
            const result = await sendOtp(cleanPhone, verifier);
            setConfirmationResult(result);
            setPhoneStep(2);
            setTimer(30);
            toast.success(`OTP sent to +91 ${cleanPhone}`);
        } catch (error) {
            console.error("Send OTP error:", error);
            toast.error(error.message || "Failed to send OTP. Please retry.");
        } finally {
            setOtpSending(false);
        }
    };

    // Verify OTP Handler
    const handleVerifyOtp = async (e) => {
        if (e) e.preventDefault();
        if (!otp.trim() || otp.trim().length < 6) {
            return toast.error("Please enter valid 6-digit OTP.");
        }

        setOtpVerifying(true);
        try {
            await verifyOtp(confirmationResult, otp.trim());
            toast.success("Phone Authentication Successful!");
            setIsLoginOpen(false);
            if (isPage) {
                const from = location.state?.from?.pathname || '/';
                navigate(from, { replace: true });
            }
        } catch (error) {
            console.error("Verify OTP error:", error);
            toast.error(error.message || "Invalid OTP code.");
        } finally {
            setOtpVerifying(false);
        }
    };

    const formContent = (
        <div 
            className={`relative z-10 w-full max-w-sm mx-auto bg-white border border-slate-200 p-6 sm:p-8 rounded-2xl shadow-xl ${isPage ? 'my-8 sm:my-16' : ''}`}
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
            <div className="mb-5 mt-1 text-center">
                <h1 className="text-slate-800 text-2xl font-bold tracking-tight">Welcome Back</h1>
                <p className="text-xs text-slate-500 mt-1 font-medium">Choose your sign in method</p>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="flex bg-slate-100 p-1 rounded-xl mb-6 border border-slate-200">
                <button
                    type="button"
                    onClick={() => { setAuthMode('email'); setPhoneStep(1); }}
                    className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        authMode === 'email' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-700'
                    }`}
                >
                    <FaEnvelope size={11} /> Email
                </button>
                <button
                    type="button"
                    onClick={() => { setAuthMode('phone'); setPhoneStep(1); }}
                    className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        authMode === 'phone' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-700'
                    }`}
                >
                    <FaPhoneAlt size={10} /> Phone OTP
                </button>
            </div>

            {/* Mode 1: Email & Password Form */}
            {authMode === 'email' && (
                <form onSubmit={handleEmailSignin}>
                    {/* Email Field */}
                    <div className="mb-4">
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Email Address</label>
                        <div className="relative">
                            <input
                                type="email"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 text-slate-800 placeholder:text-slate-400 pl-9 pr-3.5 py-2.5 text-sm rounded-xl focus:outline-none focus:border-slate-400 transition-all duration-200"
                                placeholder="name@example.com"
                                required
                            />
                            <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={13} />
                        </div>
                    </div>

                    {/* Password Field */}
                    <div className="mb-6">
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Password</label>
                        <div className="relative">
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 text-slate-800 placeholder:text-slate-400 pl-9 pr-3.5 py-2.5 text-sm rounded-xl focus:outline-none focus:border-slate-400 transition-all duration-200"
                                placeholder="••••••••"
                                required
                            />
                            <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={13} />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="mb-5">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-2.5 bg-primary text-compli text-sm font-semibold rounded-xl hover:opacity-95 active:scale-[0.98] transition-all shadow-sm cursor-pointer disabled:opacity-50"
                        >
                            Sign In with Email
                        </button>
                    </div>
                </form>
            )}

            {/* Mode 2: Phone OTP Form */}
            {authMode === 'phone' && (
                <div>
                    {/* Invisible Recaptcha Container */}
                    <div id="recaptcha-container"></div>

                    {phoneStep === 1 ? (
                        <form onSubmit={handleSendOtp}>
                            <div className="mb-5">
                                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Mobile Number</label>
                                <div className="flex rounded-xl border border-slate-200 bg-slate-50 overflow-hidden focus-within:border-slate-400 transition-all">
                                    <span className="px-3 py-2.5 bg-slate-200/60 text-slate-600 text-xs font-bold flex items-center border-r border-slate-200">
                                        +91
                                    </span>
                                    <input
                                        type="tel"
                                        maxLength={10}
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
                                        className="w-full bg-transparent text-slate-800 placeholder:text-slate-400 px-3 py-2.5 text-sm focus:outline-none font-semibold tracking-wider"
                                        placeholder="9876543210"
                                        required
                                    />
                                </div>
                                <p className="text-[10px] text-slate-400 mt-1.5">We will send a 6-digit verification code via SMS.</p>
                            </div>

                            <button
                                type="submit"
                                disabled={otpSending || phoneNumber.length < 10}
                                className="w-full py-2.5 bg-primary text-compli text-sm font-semibold rounded-xl hover:opacity-95 active:scale-[0.98] transition-all shadow-sm cursor-pointer disabled:opacity-50 mb-5"
                            >
                                {otpSending ? "Sending OTP..." : "Get OTP Verification Code"}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleVerifyOtp}>
                            <div className="mb-5">
                                <div className="flex items-center justify-between mb-1.5">
                                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">Enter 6-Digit OTP</label>
                                    <button
                                        type="button"
                                        onClick={() => setPhoneStep(1)}
                                        className="text-[10px] font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer"
                                    >
                                        <FaArrowLeft size={8} /> Change Number
                                    </button>
                                </div>

                                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-center mb-3">
                                    <p className="text-[11px] text-slate-600">
                                        Sent to <strong className="text-slate-900 font-mono">+91 {phoneNumber}</strong>
                                    </p>
                                </div>

                                <div className="relative">
                                    <input
                                        type="text"
                                        maxLength={6}
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                                        className="w-full bg-slate-50 border border-slate-200 text-slate-800 tracking-[0.5em] text-center font-mono font-bold text-lg px-3 py-2 rounded-xl focus:outline-none focus:border-slate-400 transition-all"
                                        placeholder="••••••"
                                        required
                                        autoFocus
                                    />
                                    <FaKey className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={13} />
                                </div>

                                {/* Timer & Resend Button */}
                                <div className="flex items-center justify-between mt-2.5 text-xs">
                                    {timer > 0 ? (
                                        <span className="text-[10.5px] text-slate-400">Resend code in <strong className="text-slate-700">{timer}s</strong></span>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={handleSendOtp}
                                            disabled={otpSending}
                                            className="text-[10.5px] font-bold text-primary hover:underline cursor-pointer"
                                        >
                                            Resend OTP Code
                                        </button>
                                    )}
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={otpVerifying || otp.length < 6}
                                className="w-full py-2.5 bg-primary text-compli text-sm font-semibold rounded-xl hover:opacity-95 active:scale-[0.98] transition-all shadow-sm cursor-pointer disabled:opacity-50 mb-5"
                            >
                                {otpVerifying ? "Verifying..." : "Verify & Sign In"}
                            </button>
                        </form>
                    )}
                </div>
            )}

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
        </div>
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
    );
}

export default Login;
