"use client";
import { useEffect, useState } from "react";

export default function Feedback() {
  const [mood, setMood] = useState("");
  const [rating, setRating] = useState("");
  const [features, setFeatures] = useState([]);
  const [feedback, setFeedback] = useState("");
  const [progress, setProgress] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  /* Update progress */
  useEffect(() => {
    let done = 0;
    let total = 3;
    if (mood) done++;
    if (rating) done++;
    if (features.length > 0 || feedback.trim().length > 0) done++;
    setProgress(Math.round((done / total) * 100));
  }, [mood, rating, features, feedback]);

  /* Confetti burst */
  const confettiBurst = () => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const confetti = document.getElementById("confetti");
    for (let i = 0; i < 80; i++) {
      const bit = document.createElement("i");
      bit.style.left = Math.random() * 100 + "vw";
      bit.style.top = -(Math.random() * 20 + 5) + "px";
      bit.style.background =
        Math.random() < 0.5
          ? "linear-gradient(180deg, #E1A36F, #6F9F9C)"
          : "linear-gradient(180deg, #DEC484, #E2D8A5)";
      bit.style.position = "absolute";
      bit.style.width = "8px";
      bit.style.height = "12px";
      bit.style.borderRadius = "2px";
      bit.style.animation = "fall 1400ms ease-in forwards";
      bit.style.animationDuration = 1000 + Math.random() * 800 + "ms";
      confetti.appendChild(bit);
      setTimeout(() => bit.remove(), 2200);
    }
  };

  /* Handle send */
  const handleSend = () => {
    if (!mood || !rating) {
      alert("Please choose your mood and rating.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setShowSuccess(true);
      confettiBurst();
      setTimeout(() => setShowSuccess(false), 1800);
    }, 900);
  };

  /* Handle feature checkbox */
  const toggleFeature = (value) => {
    setFeatures((prev) =>
      prev.includes(value) ? prev.filter((f) => f !== value) : [...prev, value]
    );
  };

  return (
    <div className="relative min-h-screen bg-[#f6f7f7] font-sans text-[#20282B] overflow-x-hidden">
      {/* Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="aurora"></div>
        <div className="beams"></div>
        <div className="pattern"></div>
      </div>

      {/* Confetti */}
      <div id="confetti" className="confetti absolute inset-0 z-10 pointer-events-none"></div>

      {/* Success Modal */}
      {showSuccess && (
        <div className="success fixed inset-0 z-20 grid place-items-center bg-[rgba(0,0,0,0.35)]">
          <div className="bg-white rounded-2xl p-6 text-center shadow-lg w-[90%] max-w-md">
            <div className="w-16 h-16 rounded-full mx-auto mb-3 grid place-items-center bg-gradient-to-br from-[#E1A36F] to-[#6F9F9C] text-white shadow-lg">
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
                <path
                  d="M20 6L9 17l-5-5"
                  stroke="#fff"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h2 className="text-[#577E89] text-xl mb-1">Thanks for your feedback!</h2>
            <p className="text-[#5a7076] text-sm">We’ll use this to improve things.</p>
          </div>
        </div>
      )}

      {/* Main Card */}
      <main className="relative z-10 max-w-3xl mx-auto my-12 px-4">
        <div className="card bg-white rounded-2xl border border-[#e7e9ec] shadow-lg overflow-hidden">
          <div className="header p-6 border-b border-dashed border-[#577E89]/25 bg-gradient-to-b from-[#E1A36F1F] to-transparent">
            <h1 className="text-3xl font-semibold text-[#577E89]">Feedback</h1>
          </div>

          <div className="p-6">
            <p className="text-xs text-[#5a7076] mb-1">Progress: {progress}%</p>
            <div className="w-full h-2 bg-[#eef0f2] rounded-full overflow-hidden mb-5">
              <div
                className="h-full bg-gradient-to-r from-[#E1A36F] to-[#6F9F9C] transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>

            {/* Mood */}
            <fieldset className="mb-5">
              <legend className="font-semibold mb-2">
                How would you describe your mood after using our product?
              </legend>
              <div className="flex gap-4">
                {["happy", "neutral", "sad"].map((m) => (
                  <label key={m} className="relative cursor-pointer">
                    <input
                      type="radio"
                      name="mood"
                      value={m}
                      checked={mood === m}
                      onChange={(e) => setMood(e.target.value)}
                      className="absolute opacity-0"
                    />
                    <span
                      className={`grid place-items-center w-14 h-14 rounded-full border ${
                        mood === m
                          ? "border-[#6F9F9C] shadow-md"
                          : "border-[#d6dee0]"
                      } bg-[#fbfbfc] hover:border-[#E1A36F] transition`}
                    >
                      {m === "happy" ? "😊" : m === "neutral" ? "😐" : "😔"}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            {/* Rating */}
            <fieldset className="mb-5">
              <legend className="font-semibold mb-2">
                How would you rate the quality of our product?
              </legend>
              <div className="flex gap-3">
                {[1, 2, 3, 4, 5].map((num) => (
                  <label key={num} className="relative cursor-pointer">
                    <input
                      type="radio"
                      name="rating"
                      value={num}
                      checked={rating === String(num)}
                      onChange={(e) => setRating(e.target.value)}
                      className="absolute opacity-0"
                    />
                    <span
                      className={`flex items-center justify-center w-12 h-12 rounded-full border ${
                        rating === String(num)
                          ? "bg-gradient-to-br from-[#E1A36F] to-[#6F9F9C] text-white"
                          : "bg-[#fbfbfc] border-[#d6dee0]"
                      } font-bold shadow-sm`}
                    >
                      {num}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            {/* Features */}
            <fieldset className="mb-5">
              <legend className="font-semibold mb-2">
                Which feature is the best for you?
              </legend>
              <div className="grid gap-2">
                {[
                  ["integration", "Integration options and tools"],
                  ["search", "The advanced search functionality"],
                  ["customize", "The customizable settings"],
                ].map(([value, label]) => (
                  <label
                    key={value}
                    className={`flex gap-2 items-start p-3 rounded-xl border ${
                      features.includes(value)
                        ? "border-[#6F9F9C] bg-white"
                        : "border-[#e3e7ea] bg-[#fafbfb]"
                    } shadow-sm transition`}
                  >
                    <input
                      type="checkbox"
                      checked={features.includes(value)}
                      onChange={() => toggleFeature(value)}
                      className="mt-1 accent-[#E1A36F]"
                    />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            {/* Feedback Text */}
            <fieldset>
              <legend className="font-semibold mb-2">Your feedback</legend>
              <div className="relative">
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  maxLength={600}
                  placeholder="Anything you'd like to add?"
                  className="w-full min-h-[140px] border border-[#d6dee0] rounded-xl p-3 bg-[#fbfbfc] outline-none shadow-sm focus:border-[#E1A36F] focus:ring-2 focus:ring-[#E1A36F]/20"
                />
                <div className="absolute bottom-2 right-3 text-xs text-[#7b8e93]">
                  {feedback.length}/600
                </div>
              </div>
              <p className="text-sm text-[#6b7f85] mt-2">We read every note.</p>
            </fieldset>
          </div>

          <div className="footer flex justify-between items-center border-t border-dashed border-[#577E89]/25 p-5 flex-wrap gap-3">
            <span className="text-sm text-[#6b7f85]">
              Press Send and we’ll log your response.
            </span>
            <button
              onClick={handleSend}
              disabled={loading}
              className="px-6 py-3 min-w-[180px] rounded-xl text-white bg-gradient-to-br from-[#E1A36F] to-[#6F9F9C] shadow-md hover:shadow-lg transition relative flex items-center justify-center"
            >
              {loading ? (
                <>
                  Sending...
                  <span className="ml-2 w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin"></span>
                </>
              ) : (
                "Send Feedback"
              )}
            </button>
          </div>
        </div>
      </main>

      {/* Styles */}
      <style jsx>{`
        @keyframes fall {
          0% {
            opacity: 0;
            transform: translateY(-20px) rotate(0deg);
          }
          10% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: translateY(100vh) rotate(540deg);
          }
        }
      `}</style>
    </div>
  );
}
