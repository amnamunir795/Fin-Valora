import Head from 'next/head';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { isAuthenticated } from '../../utils/auth';
import AppSidebar from '../../components/AppSidebar';

export default function Settings() {
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace('/login');
    }
  }, [router]);

  return (
    <>
      <Head>
        <title>Settings — FinValora</title>
      </Head>
      <div className="min-h-screen bg-linear-to-br from-mist via-surface to-teal-soft/35 flex">
        <AppSidebar />

        <div className="flex-1 flex flex-col min-w-0">
          <header className="fv-app-page-header px-5 sm:px-8 py-5 shrink-0">
            <h1 className="font-display text-2xl font-semibold text-void">Settings</h1>
          </header>

          <main className="flex-1 p-5 sm:p-8 max-w-3xl w-full mx-auto">
            <div className="rounded-2xl border border-lavender/35 bg-white/90 p-8 shadow-md">
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-teal-soft/50 flex items-center justify-center">
                  <svg className="w-8 h-8 text-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-void mb-2">Account Settings</h2>
                <p className="text-sm text-void/60 mb-6">
                  Account settings will be available here in a future update.
                </p>
                <Link href="/dashboard" className="fv-btn-secondary inline-flex">
                  Back to Dashboard
                </Link>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
