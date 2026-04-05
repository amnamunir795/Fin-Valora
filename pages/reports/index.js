import Link from "next/link";

export default function Reports() {
  return (
    <div className="min-h-screen bg-mist flex items-center justify-center p-6">
      <div className="max-w-md text-center bg-surface rounded-2xl border border-lavender/40 shadow-xl p-8">
        <h1 className="text-2xl font-bold text-void mb-2">Reports</h1>
        <p className="text-forest mb-6">Detailed reports are not available yet. This feature is coming soon.</p>
        <Link href="/dashboard" className="inline-block px-6 py-3 bg-gradient-to-r from-teal to-forest text-white rounded-lg font-medium hover:from-forest hover:to-void transition-all">
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}
