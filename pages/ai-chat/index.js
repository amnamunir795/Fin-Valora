import Link from "next/link";
import FinValoraLogo from "../../components/FinValoraLogo";

export default function AiChat() {
  return (
    <div className="min-h-screen bg-mist flex items-center justify-center p-6">
      <div className="max-w-md text-center bg-surface rounded-2xl border border-lavender/40 shadow-xl p-8">
        <div className="mb-5 flex justify-center">
          <FinValoraLogo size={56} className="drop-shadow-md" />
        </div>
        <h1 className="text-2xl font-bold text-void mb-2">FinValora AI</h1>
        <p className="text-forest mb-6">The AI assistant is coming soon. Budget and transaction features work on the dashboard and other pages.</p>
        <Link href="/dashboard" className="inline-block px-6 py-3 bg-gradient-to-r from-teal to-forest text-white rounded-lg font-medium hover:from-forest hover:to-void transition-all">
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}
