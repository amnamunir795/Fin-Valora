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
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduce) return;
    const confetti = document.getElementById("confetti");
    for (let i = 0; i < 80; i++) {
      const bit = document.createElement("i");
      bit.style.left = Math.random() * 100 + "vw";
      bit.style.top = -(Math.random() * 20 + 5) + "px";
      bit.style.background =
        Math.random() < 0.5
          ? "linear-gradient(180deg, #8abfb2, #01332b)"
          : "linear-gradient(180deg, #eaf4f2, #c4c4db)";
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
    <div className="relative min-h-screen overflow-x-hidden bg-mist font-sans text-void">
      {/* Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="aurora"></div>
        <div className="beams"></div>
        <div className="pattern"></div>
      </div>

      {/* Confetti */}
      <div
        id="confetti"
        className="confetti absolute inset-0 z-10 pointer-events-none"
      ></div>

      {/* Success Modal */}
      {showSuccess && (
        <div className="success fixed inset-0 z-20 grid place-items-center bg-void/40">
          <div className="w-[90%] max-w-md rounded-2xl bg-surface p-6 text-center shadow-fv-lg">
            <div className="mx-auto mb-3 grid h-16 w-16 place-items-center rounded-full bg-forest text-white shadow-fv-md">
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
            <h2 className="mb-1 text-xl font-semibold text-forest">
              Thanks for your feedback!
            </h2>
            <p className="text-sm text-ink-secondary">
              We’ll use this to improve things.
            </p>
          </div>
        </div>
      )}

      {/* Main Card */}
      <main className="relative z-10 max-w-3xl mx-auto my-12 px-4">
        <div className="card overflow-hidden rounded-2xl border border-border-subtle bg-surface shadow-fv-lg">
          <div className="header border-b border-dashed border-teal/30 bg-teal-soft p-6">
            <h1 className="font-display text-3xl font-semibold text-forest">Feedback</h1>
          </div>

          <div className="p-6">
            <p className="mb-1 text-xs text-ink-secondary">Progress: {progress}%</p>
            <div className="mb-5 h-2 w-full overflow-hidden rounded-full bg-mist">
              <div
                className="h-full bg-gradient-to-r from-teal to-forest transition-all duration-300"
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
                      className={`grid h-14 w-14 place-items-center rounded-full border transition ${
                        mood === m
                          ? "border-teal shadow-fv-sm"
                          : "border-lavender/60"
                      } bg-mist hover:border-teal`}
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
                      className={`flex h-12 w-12 items-center justify-center rounded-full border font-bold shadow-sm ${
                        rating === String(num)
                          ? "border-transparent bg-forest text-white"
                          : "border-lavender/60 bg-mist"
                      }`}
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
                    className={`flex items-start gap-2 rounded-xl border p-3 shadow-sm transition ${
                      features.includes(value)
                        ? "border-teal bg-surface"
                        : "border-border-subtle bg-mist"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={features.includes(value)}
                      onChange={() => toggleFeature(value)}
                      className="mt-1 accent-teal"
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
                  className="min-h-[140px] w-full rounded-xl border border-lavender bg-surface p-3 text-void shadow-sm outline-none transition focus:border-teal focus:ring-2 focus:ring-teal/30"
                />
                <div className="absolute bottom-2 right-3 text-xs text-ink-muted">
                  {feedback.length}/600
                </div>
              </div>
              <p className="mt-2 text-sm text-ink-secondary">We read every note.</p>
            </fieldset>
          </div>

          <div className="footer flex flex-wrap items-center justify-between gap-3 border-t border-dashed border-teal/25 p-5">
            <span className="text-sm text-ink-secondary">
              Press Send and we’ll log your response.
            </span>
            <button
              onClick={handleSend}
              disabled={loading}
              className="fv-btn-primary relative flex min-w-[180px] items-center justify-center px-6 py-3"
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
