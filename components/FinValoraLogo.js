import { useId } from 'react';

/**
 * FinValora brand mark — financial emblem: stacked coins, growth curve, and market bars.
 * Palette: #FFFFFF, #C4C4DB, #8ABFB2, #01332B, #251B28
 */
export default function FinValoraLogo({ className = '', size = 40, animated = false }) {
  const uid = useId().replace(/:/g, '');
  const g = (name) => `${name}-${uid}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      className={`shrink-0 ${animated ? 'fv-logo-animated' : ''} ${className}`.trim()}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={g('panel')} x1="6" y1="4" x2="58" y2="60" gradientUnits="userSpaceOnUse">
          <stop stopColor="#251B28" />
          <stop offset="0.45" stopColor="#1a1420" />
          <stop offset="1" stopColor="#01332B" />
        </linearGradient>
        <linearGradient id={g('vignette')} x1="32" y1="36" x2="32" y2="62" gradientUnits="userSpaceOnUse">
          <stop stopColor="#01332B" stopOpacity="0" />
          <stop offset="1" stopColor="#01332B" stopOpacity="0.55" />
        </linearGradient>
        <radialGradient id={g('coinLav')} cx="35%" cy="35%" r="65%">
          <stop stopColor="#FFFFFF" />
          <stop offset="0.45" stopColor="#C4C4DB" />
          <stop offset="1" stopColor="#8a8ab0" />
        </radialGradient>
        <radialGradient id={g('coinTeal')} cx="35%" cy="35%" r="65%">
          <stop stopColor="#eaf4f2" />
          <stop offset="0.5" stopColor="#8ABFB2" />
          <stop offset="1" stopColor="#4a8a7a" />
        </radialGradient>
        <radialGradient id={g('coinWhite')} cx="32%" cy="28%" r="70%">
          <stop stopColor="#FFFFFF" />
          <stop offset="0.55" stopColor="#e8e8ee" />
          <stop offset="1" stopColor="#C4C4DB" />
        </radialGradient>
        <linearGradient id={g('gloss')} x1="8" y1="8" x2="40" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFFFF" stopOpacity="0.22" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Panel */}
      <rect x="3" y="3" width="58" height="58" rx="15" fill={`url(#${g('panel')})`} />
      <rect x="3" y="3" width="58" height="58" rx="15" fill={`url(#${g('vignette')})`} />
      <rect
        x="3"
        y="3"
        width="58"
        height="58"
        rx="15"
        stroke="#C4C4DB"
        strokeOpacity="0.45"
        strokeWidth="1.25"
      />

      {/* Ledger hint */}
      <line x1="10" y1="14" x2="54" y2="14" stroke="#C4C4DB" strokeOpacity="0.1" strokeWidth="0.75" />
      <line x1="10" y1="18" x2="54" y2="18" stroke="#C4C4DB" strokeOpacity="0.08" strokeWidth="0.75" />
      <line x1="10" y1="22" x2="54" y2="22" stroke="#C4C4DB" strokeOpacity="0.06" strokeWidth="0.75" />

      {/* Growth area + line (right side, reads as performance chart) */}
      <path
        d="M 30 38 L 36 34 L 42 30 L 48 24 L 54 22 L 54 52 L 30 52 Z"
        fill="#8ABFB2"
        fillOpacity="0.2"
      />
      <path
        d="M 30 38 L 36 34 L 42 30 L 48 24 L 54 22"
        stroke="#8ABFB2"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="54" cy="22" r="2.5" fill="#FFFFFF" stroke="#8ABFB2" strokeWidth="1" />

      {/* Ground shadow under coins */}
      <ellipse cx="23" cy="49" rx="14" ry="4" fill="#01332B" fillOpacity="0.45" />

      {/* Stacked coins (back → front) */}
      <ellipse cx="19" cy="44" rx="9" ry="2.9" fill={`url(#${g('coinLav')})`} />
      <ellipse cx="23" cy="38" rx="10" ry="3.1" fill={`url(#${g('coinTeal')})`} />
      <ellipse cx="21" cy="31" rx="11" ry="3.4" fill={`url(#${g('coinWhite')})`} />
      <ellipse cx="21" cy="31" rx="11" ry="3.4" stroke="#C4C4DB" strokeOpacity="0.5" strokeWidth="0.6" fill="none" />

      {/* Embossed currency mark */}
      <text
        x="21"
        y="34.5"
        textAnchor="middle"
        fill="#01332B"
        fontSize="13"
        fontWeight="700"
        fontFamily="ui-sans-serif, system-ui, sans-serif"
        style={{ userSelect: 'none' }}
      >
        $
      </text>

      {/* Mini market bars */}
      <rect x="43" y="38" width="4.5" height="10" rx="1" fill="#C4C4DB" fillOpacity="0.85" />
      <rect x="48.5" y="32" width="4.5" height="16" rx="1" fill="#8ABFB2" />
      <rect x="54" y="26" width="4.5" height="22" rx="1" fill="#FFFFFF" fillOpacity="0.95" />

      {/* Specular gloss */}
      <path d="M 8 10 L 28 8 L 14 24 Z" fill={`url(#${g('gloss')})`} />
    </svg>
  );
}
