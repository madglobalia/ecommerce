"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Review {
  _id: string;
  clientName: string;
  productName?: string;
  rating: number;
  title: string;
  comment: string;
  createdAt: string;
}

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0);
  const labels = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            className="text-4xl transition-all duration-150 hover:scale-125 focus:outline-none"
          >
            <span className={`${star <= (hovered || value) ? "text-yellow-400" : "text-gray-300"} drop-shadow`}>
              ★
            </span>
          </button>
        ))}
      </div>
      {(hovered || value) > 0 && (
        <span className="text-sm font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
          {labels[hovered || value]}
        </span>
      )}
    </div>
  );
}

function StarDisplay({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" | "lg" }) {
  const sizes = { sm: "text-base", md: "text-xl", lg: "text-3xl" };
  return (
    <span className={`${sizes[size]} tracking-tight`}>
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} className={s <= rating ? "text-yellow-400" : "text-gray-200"}>★</span>
      ))}
    </span>
  );
}

function RatingBar({ count, total, star }: { count: number; total: number; star: number }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-500 w-5 text-right">{star}</span>
      <span className="text-yellow-400 text-xs">★</span>
      <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
        <div
          className="h-full bg-yellow-400 rounded-full transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs text-gray-400 w-6">{count}</span>
    </div>
  );
}

export default function ReviewsPage() {
  const router = useRouter();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);

  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [productName, setProductName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const userData = localStorage.getItem("currentUser");
    if (userData) setCurrentUser(JSON.parse(userData));
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await fetch("/api/reviews");
      const text = await res.text();
      const data = text ? JSON.parse(text) : [];
      setReviews(Array.isArray(data) ? data : []);
    } catch { } finally { setLoading(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!currentUser) { router.push("/login"); return; }
    if (rating === 0) { setError("Please select a star rating"); return; }
    if (!title.trim()) { setError("Please enter a review title"); return; }
    if (!comment.trim()) { setError("Please write your review"); return; }

    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId: currentUser._id,
          clientName: currentUser.name,
          productName: productName.trim() || null,
          rating, title: title.trim(), comment: comment.trim(),
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setSubmitted(true);
        setRating(0); setTitle(""); setComment(""); setProductName("");
      } else { setError(data.error || "Failed to submit review"); }
    } catch { setError("Something went wrong."); }
    finally { setSubmitting(false); }
  };

  const avgRating = reviews.length > 0
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : 0;

  const ratingCounts = [5, 4, 3, 2, 1].map((s) => ({
    star: s,
    count: reviews.filter((r) => r.rating === s).length,
  }));

  const avatarColors = [
    "bg-indigo-500", "bg-pink-500", "bg-emerald-500",
    "bg-amber-500", "bg-violet-500", "bg-cyan-500",
  ];

  return (
    <div className="min-h-screen bg-white">

      {/* ── Hero ─────────────────────────────────── */}
      <div className="bg-white border-b border-gray-100 py-12 px-8">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-1.5 rounded-full text-sm font-medium mb-5">
            ⭐ Customer Reviews
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">What People Say</h1>
          <p className="text-gray-500 text-lg mb-8">Honest reviews from our real customers</p>

          {/* Rating summary */}
          {reviews.length > 0 ? (
            <div className="inline-flex items-center gap-8 bg-gray-50 border border-gray-200 rounded-2xl px-8 py-5">
              <div className="text-center">
                <p className="text-6xl font-black text-yellow-500">{avgRating.toFixed(1)}</p>
                <StarDisplay rating={Math.round(avgRating)} size="md" />
                <p className="text-gray-400 text-sm mt-1">{reviews.length} review{reviews.length !== 1 ? "s" : ""}</p>
              </div>
              <div className="hidden sm:block w-px h-20 bg-gray-200" />
              <div className="hidden sm:flex flex-col gap-1.5 min-w-[160px]">
                {ratingCounts.map(({ star, count }) => (
                  <RatingBar key={star} star={star} count={count} total={reviews.length} />
                ))}
              </div>
            </div>
          ) : (
            <p className="text-gray-400">No reviews yet — be the first!</p>
          )}
        </div>
      </div>

      {/* ── Content ──────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-10">

          {/* ── Write a Review ─────────────────────── */}
          <div className="lg:w-96 flex-shrink-0">
            {!showForm && !submitted ? (
              <div className="bg-white border-2 border-indigo-100 rounded-2xl p-8 text-center shadow-sm">
                <div className="text-5xl mb-4">✍️</div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Share Your Experience</h2>
                <p className="text-gray-500 text-sm mb-6">
                  Your review helps others make better decisions
                </p>
                <button
                  onClick={() => {
                    if (!currentUser) { router.push("/login"); return; }
                    setShowForm(true);
                  }}
                  className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition shadow-md"
                >
                  Write a Review
                </button>
                {!currentUser && (
                  <p className="text-gray-400 text-xs mt-3">You need to login first</p>
                )}
              </div>
            ) : submitted ? (
              <div className="bg-white rounded-2xl shadow-lg border border-green-100 p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">✅</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Review Submitted!</h3>
                <p className="text-gray-500 text-sm mb-5">
                  Your review is pending admin approval and will appear here once accepted.
                </p>
                <button
                  onClick={() => { setSubmitted(false); setShowForm(false); }}
                  className="text-indigo-600 text-sm font-semibold hover:underline"
                >
                  ← Back to Reviews
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                {/* Form header */}
                <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
                  <h2 className="text-gray-800 font-bold text-lg">Write a Review</h2>
                  <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                  {/* Stars */}
                  <div className="text-center">
                    <p className="text-sm font-semibold text-gray-600 mb-3">How would you rate us? <span className="text-red-500">*</span></p>
                    <StarPicker value={rating} onChange={setRating} />
                  </div>

                  {/* Product */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Product <span className="text-gray-400 font-normal text-xs">(optional)</span>
                    </label>
                    <input
                      type="text"
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      placeholder="e.g. iPhone 15 Pro"
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50"
                    />
                  </div>

                  {/* Title */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Sum up your experience"
                      maxLength={100}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50"
                    />
                  </div>

                  {/* Comment */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Review <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={4}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Tell others about your experience..."
                      maxLength={500}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50 resize-none"
                    />
                    <p className="text-xs text-gray-400 text-right">{comment.length}/500</p>
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-2.5 rounded-xl">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition disabled:opacity-50 shadow-md"
                  >
                    {submitting ? "Submitting..." : "Submit Review"}
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* ── Reviews List ───────────────────────── */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {loading ? "Loading..." : reviews.length > 0
                  ? `${reviews.length} Review${reviews.length !== 1 ? "s" : ""}`
                  : "No reviews yet"}
              </h2>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl p-6 animate-pulse border border-gray-100">
                    <div className="flex gap-3 mb-4">
                      <div className="w-10 h-10 bg-gray-200 rounded-full" />
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
                        <div className="h-3 bg-gray-200 rounded w-1/4" />
                      </div>
                    </div>
                    <div className="h-3 bg-gray-200 rounded mb-2" />
                    <div className="h-3 bg-gray-200 rounded w-3/4" />
                  </div>
                ))}
              </div>
            ) : reviews.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <div className="text-7xl mb-4">⭐</div>
                <h3 className="text-xl font-bold text-gray-700 mb-2">No reviews yet</h3>
                <p className="text-gray-400">Be the first to write a review!</p>
              </div>
            ) : (
              <div className="space-y-5">
                {reviews.map((review, idx) => {
                  const color = avatarColors[idx % avatarColors.length];
                  return (
                    <div
                      key={review._id}
                      className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-6"
                    >
                      {/* Top row */}
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-11 h-11 rounded-full ${color} flex items-center justify-center text-white font-bold text-lg shadow-sm`}>
                            {review.clientName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-gray-800">{review.clientName}</p>
                            <p className="text-xs text-gray-400">
                              {new Date(review.createdAt).toLocaleDateString("en-IN", {
                                day: "numeric", month: "long", year: "numeric",
                              })}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-1">
                          <StarDisplay rating={review.rating} size="sm" />
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                            review.rating >= 4 ? "bg-green-100 text-green-700" :
                            review.rating === 3 ? "bg-yellow-100 text-yellow-700" :
                            "bg-red-100 text-red-700"
                          }`}>
                            {review.rating}/5
                          </span>
                        </div>
                      </div>

                      {/* Product tag */}
                      {review.productName && (
                        <div className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-600 text-xs font-medium px-3 py-1 rounded-full mb-3">
                          📦 {review.productName}
                        </div>
                      )}

                      {/* Review text */}
                      <h4 className="font-bold text-gray-800 mb-1.5">"{review.title}"</h4>
                      <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>

                      {/* Verified badge */}
                      <div className="mt-3 flex items-center gap-1 text-xs text-emerald-600">
                        <span>✅</span>
                        <span className="font-medium">Verified Review</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
