import { useEffect } from 'react';
import { useRouter } from 'next/router';

/** OCR lives on the dashboard; this route keeps /ocr-scanner links working. */
export default function OcrScannerPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/dashboard');
  }, [router]);
  return (
    <div className="min-h-screen flex items-center justify-center bg-mist text-forest">
      <p className="text-sm">Redirecting to dashboard…</p>
    </div>
  );
}
