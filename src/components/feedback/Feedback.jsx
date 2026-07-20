import React, { useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import Loader from "../../components/loader/Loader";
import { feedbackService } from "../../services/feedback/feedbackService";
import { toast } from "react-toastify";

const FeedbackPage = () => {
  const { mode } = useTheme();
  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");

  const userData = JSON.parse(localStorage.getItem("user"))?.user ?? null;

  const handleSendClick = async () => {
    if (!message.trim()) {
      return toast.error("Please write your feedback.");
    }

    setLoading(true);

    try {
      await feedbackService.submitFeedback({
        message,
        email: userData?.email || null,
      });

      toast.success("Feedback sent successfully");
      setMessage("");
    } catch (error) {
      console.error(error);
      toast.error("Failed to send feedback");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className={`min-h-[80vh] flex items-center justify-center px-5 py-12 ${
        mode === "dark" ? "bg-slate-900" : "bg-slate-50"
      }`}
    >
      {loading && <Loader />}

      <div
        className={`w-full max-w-2xl rounded-3xl border shadow-sm p-8 md:p-10 transition-all duration-300 ${
          mode === "dark"
            ? "bg-slate-800 border-slate-700/60 text-white"
            : "bg-white border-gray-100 text-gray-900"
        }`}
      >
        {/* Heading */}
        <div className="space-y-2 mb-8">
          <h2 className="text-3xl font-extrabold tracking-tight">
            We&apos;d Love Your Feedback
          </h2>

          <p
            className={`text-sm ${
              mode === "dark" ? "text-slate-400" : "text-slate-500"
            }`}
          >
            Help us improve your experience by sharing your thoughts, suggestions, or reporting any issues.
          </p>
        </div>

        {/* Textarea */}
        <div className="space-y-3">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={500}
            placeholder="Tell us what you liked, what could be improved, or report any issue..."
            className={`w-full h-48 resize-none rounded-2xl border px-5 py-4 text-base transition-all duration-200 focus:outline-none focus:border-indigo-500 focus:ring-4 ${
              mode === "dark"
                ? "bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-600 focus:ring-indigo-500/10"
                : "bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:ring-indigo-500/10"
            }`}
          />

          <div className="flex items-center justify-between text-sm">
            <span
              className={mode === "dark" ? "text-slate-500" : "text-gray-400"}
            >
              Maximum 500 characters
            </span>

            <span
              className={`font-semibold ${
                mode === "dark" ? "text-slate-400" : "text-gray-500"
              }`}
            >
              {message.length}/500
            </span>
          </div>
        </div>

        {/* Button */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={handleSendClick}
            disabled={loading}
            className="rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white font-bold px-7 py-3.5 transition-all duration-200 shadow-md shadow-indigo-600/10 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Sending..." : "Send Feedback"}
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeedbackPage;