import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import AppSidebar from '../../components/AppSidebar';
import ActivityLog from '../../components/ActivityLog';
import { authenticatedFetch } from '../../utils/auth';
import { CURRENCY_OPTIONS } from '../../constants/currencies';

export default function ActivityPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currencySym, setCurrencySym] = useState('$');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await authenticatedFetch('/api/auth/me');
        if (!res.ok) {
          router.push('/login');
          return;
        }
        const data = await res.json();
        setUser(data.user);
        const curr = CURRENCY_OPTIONS.find(c => c.code === data.user?.currency);
        if (curr) setCurrencySym(curr.symbol);
      } catch {
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-mist flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-teal/25 border-t-teal rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Activity Log — FinValora</title>
      </Head>
      <div className="min-h-screen bg-linear-to-br from-mist via-surface to-teal-soft/30 flex">
        <AppSidebar />

        <div className="flex-1 flex flex-col min-w-0">
          <header className="px-6 py-5 border-b border-lavender/15 bg-white/60 backdrop-blur-sm shrink-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-teal mb-1">History</p>
            <h1 className="font-display text-2xl font-semibold text-void">Activity Log</h1>
            <p className="text-sm text-ink-secondary mt-1">All your actions in one place</p>
          </header>

          <main className="flex-1 p-6 overflow-y-auto">
            <div className="max-w-5xl">
              <ActivityLog currency={currencySym} limit={100} />
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
