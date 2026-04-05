import Link from "next/link";

export default function Settings() {
  return (
    <div className="min-h-screen bg-mist flex items-center justify-center p-6">
      <div className="max-w-md text-center bg-surface rounded-2xl border border-lavender/40 shadow-xl p-8">
        <h1 className="text-2xl font-bold text-void mb-2">Settings</h1>
        <p className="text-forest mb-6">Account settings will be available here in a future update. You can adjust your budget from budget setup.</p>
        <Link href="/dashboard" className="inline-block px-6 py-3 bg-gradient-to-r from-teal to-forest text-white rounded-lg font-medium hover:from-forest hover:to-void transition-all">
          Back to dashboard
        </Link>
        <div className="mt-4">
          <Link href="/budget-setup?edit=true" className="text-sm text-forest hover:text-teal underline">
            Edit budget
          </Link>
        </div>
      </div>
    </div>
  );
}
