import { useEffect } from 'react';
import { useRouter } from 'next/router';
import FinValoraLogo from '../../components/FinValoraLogo';

/** OCR lives on the dashboard; this route keeps /ocr-scanner links working. */
export default function OcrScannerPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/dashboard');
  }, [router]);
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-mist text-forest">
      <FinValoraLogo size={48} className="drop-shadow-sm" />
      <p className="text-sm">Redirecting to dashboard…</p>
    </div>
  );
}
