import React from 'react';

export interface TrustBadgeProps {
  className?: string;
  size?: number;
}

/**
 * 1. Microsoft Certified: Power BI Data Analyst Associate Badge
 * Exactly matches the official Microsoft role-based certification badge:
 * - Cerulean Blue shield with top gable roof and lower curved point
 * - Top charcoal slate panel with white "Microsoft CERTIFIED"
 * - Arched center white ribbon banner with dark charcoal outline and bold "POWER BI DATA ANALYST"
 * - Bottom Cerulean Blue shield with white "ASSOCIATE" and two 5-point white stars
 */
export function MicrosoftCertifiedBadge({ className = '', size = 46 }: TrustBadgeProps) {
  const badgeHeight = Math.round(size * 1.15);

  return (
    <svg
      viewBox="0 0 200 230"
      width={size}
      height={badgeHeight}
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Microsoft Certified: Power BI Data Analyst Associate Badge"
    >
      <defs>
        <filter id="msCertBadgeDrop" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="3" stdDeviation="3.5" floodColor="#000000" floodOpacity="0.28" />
        </filter>
        <filter id="msCertBannerDrop" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#000000" floodOpacity="0.22" />
        </filter>
      </defs>

      {/* Base Shield (Official Microsoft Cerulean Blue #0078D4) */}
      <g filter="url(#msCertBadgeDrop)">
        <path
          d="M 100 7
             L 169 30
             C 172.5 31.2 174.5 34 174.5 37.5
             L 174.5 116
             C 174.5 168 136 211 100 226
             C 64 211 25.5 168 25.5 116
             L 25.5 37.5
             C 25.5 34 27.5 31.2 31 30
             Z"
          fill="#0078D4"
        />
      </g>

      {/* Inner Facet / Contour inside Blue Shield Bottom */}
      <path
        d="M 100 220
           C 131 206 163 166 164 122
           L 145 122
           C 142 154 121 184 100 196
           C 79 184 58 154 55 122
           L 36 122
           C 37 166 69 206 100 220
           Z"
        fill="#005A9E"
        opacity={0.4}
      />

      {/* Top Charcoal Panel (Official Microsoft Credential #444444) */}
      <path
        d="M 100 18.5
           L 161 38.5
           L 161 108
           L 39 108
           L 39 38.5
           Z"
        fill="#444444"
      />

      {/* Top Text: Microsoft */}
      <text
        x="100"
        y="56"
        fontFamily="'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
        fontSize="19"
        fontWeight="600"
        fill="#FFFFFF"
        textAnchor="middle"
      >
        Microsoft
      </text>

      {/* Top Text: CERTIFIED */}
      <text
        x="101"
        y="77.5"
        fontFamily="'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
        fontSize="13"
        fontWeight="700"
        letterSpacing="4px"
        fill="#FFFFFF"
        textAnchor="middle"
      >
        CERTIFIED
      </text>

      {/* Bottom Blue Shield Text: ASSOCIATE */}
      <text
        x="100"
        y="170"
        fontFamily="'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
        fontSize="15"
        fontWeight="800"
        letterSpacing="2.8px"
        fill="#FFFFFF"
        textAnchor="middle"
      >
        ASSOCIATE
      </text>

      {/* Left White 5-Point Star */}
      <polygon
        points="85,181.5 88.6,191.5 99,192.5 91.2,199 94,209.5 85,203.5 76,209.5 78.8,199 71,192.5 81.4,191.5"
        fill="#FFFFFF"
      />

      {/* Right White 5-Point Star */}
      <polygon
        points="115,181.5 118.6,191.5 129,192.5 121.2,199 124,209.5 115,203.5 106,209.5 108.8,199 101,192.5 111.4,191.5"
        fill="#FFFFFF"
      />

      {/* Center Arched White Banner Ribbon */}
      <g filter="url(#msCertBannerDrop)">
        {/* Arched Ribbon Outline & Fill */}
        <path
          d="M 18 99
             Q 100 84 182 99
             C 187 100 189.5 103.5 188.5 108.5
             L 183.5 144
             C 182.5 149 178.5 152 173 151
             Q 100 137 27 151
             C 21.5 152 17.5 149 16.5 144
             L 11.5 108.5
             C 10.5 103.5 13 100 18 99
             Z"
          fill="#FFFFFF"
          stroke="#3C3C3C"
          strokeWidth={5}
          strokeLinejoin="round"
        />

        {/* Text inside Banner: POWER BI (Arched Center) */}
        <text
          x="100"
          y="118.5"
          fontFamily="'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
          fontSize="19.5"
          fontWeight="900"
          letterSpacing="1.2px"
          fill="#141414"
          textAnchor="middle"
        >
          POWER BI
        </text>

        {/* Text inside Banner: DATA ANALYST */}
        <text
          x="100"
          y="141"
          fontFamily="'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
          fontSize="16.5"
          fontWeight="900"
          letterSpacing="0.8px"
          fill="#141414"
          textAnchor="middle"
        >
          DATA ANALYST
        </text>
      </g>
    </svg>
  );
}

/**
 * 2. Bank-Grade 256-Bit SSL / TLS Security Padlock Shield
 * Distinct High-Security Tapered Shield Shape with polished chrome shackle,
 * high-gloss emerald body, and heavy golden padlock core.
 */
export function SslSecurityBadge({ className = '', size = 46 }: TrustBadgeProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Bank-Grade 256-Bit SSL Security Padlock Shield"
    >
      <defs>
        <filter id="sslShieldShadow" x="0" y="0" width="100" height="100" filterUnits="userSpaceOnUse">
          <feDropShadow dx="0" dy="2.5" stdDeviation="2.5" floodColor="#000000" floodOpacity="0.22" />
        </filter>
        <linearGradient id="sslEmeraldGrad" x1="50" y1="18" x2="50" y2="94" gradientUnits="userSpaceOnUse">
          <stop stopColor="#10B981" />
          <stop offset="0.5" stopColor="#059669" />
          <stop offset="1" stopColor="#047857" />
        </linearGradient>
        <linearGradient id="sslChromeGrad" x1="32" y1="4" x2="68" y2="30" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFFFF" />
          <stop offset="0.3" stopColor="#E2E8F0" />
          <stop offset="0.7" stopColor="#94A3B8" />
          <stop offset="1" stopColor="#64748B" />
        </linearGradient>
        <linearGradient id="sslGoldGrad" x1="38" y1="42" x2="62" y2="70" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FEF08A" />
          <stop offset="0.4" stopColor="#F59E0B" />
          <stop offset="1" stopColor="#B45309" />
        </linearGradient>
      </defs>

      {/* Heavy Chrome Padlock Shackle Arch on Top */}
      <path
        d="M 33 32 V 16 C 33 6.5 40.5 3.5 50 3.5 C 59.5 3.5 67 6.5 67 16 V 32"
        stroke="url(#sslChromeGrad)"
        strokeWidth="9"
        strokeLinecap="round"
      />

      {/* Main Security Shield Silhouette */}
      <g filter="url(#sslShieldShadow)">
        <path
          d="M 50 18 L 87 29 C 87 60 70 84 50 96 C 30 84 13 60 13 29 Z"
          fill="url(#sslEmeraldGrad)"
          stroke="#047857"
          strokeWidth="2.5"
        />
      </g>

      {/* Inner White Rim on Shield */}
      <path
        d="M 50 24 L 81 33 C 81 58 66 79 50 89 C 34 79 19 58 19 33 Z"
        fill="#FFFFFF"
        stroke="#E2E8F0"
        strokeWidth="1.5"
      />

      {/* "256-BIT" Top Security Banner */}
      <rect x="28" y="27" width="44" height="9.5" rx="4.75" fill="#047857" />
      <text x="50" y="34" fontFamily="'Segoe UI', Roboto, sans-serif" fontSize="5.8" fontWeight="900" fill="#FFFFFF" textAnchor="middle" letterSpacing="0.6">
        256-BIT
      </text>

      {/* Golden Hardened Padlock Core */}
      <g transform="translate(0, 4)">
        {/* Inner Lock Shackle */}
        <path d="M 43 42 V 37 C 43 33 46 31 50 31 C 54 31 57 33 57 37 V 42" stroke="url(#sslChromeGrad)" strokeWidth="3.2" fill="none" />
        {/* Golden Padlock Body */}
        <rect x="37" y="42" width="26" height="21" rx="4.5" fill="url(#sslGoldGrad)" stroke="#B45309" strokeWidth="1.2" />
        {/* Keyhole */}
        <circle cx="50" cy="50" r="3.2" fill="#0F172A" />
        <path d="M 50 52.5 V 58" stroke="#0F172A" strokeWidth="2.8" strokeLinecap="round" />
      </g>

      {/* Bottom "SSL / TLS 1.3" Pill */}
      <rect x="24" y="72" width="52" height="10" rx="3" fill="#10B981" stroke="#059669" strokeWidth="0.8" />
      <text x="50" y="79" fontFamily="'Segoe UI', Roboto, sans-serif" fontSize="5.4" fontWeight="900" fill="#FFFFFF" textAnchor="middle" letterSpacing="0.6">
        SSL / TLS 1.3
      </text>
    </svg>
  );
}

/**
 * 3. Enterprise NDA & Client Confidentiality Legal Seal
 * Distinct Legal Contract Document Shape:
 * Crisp ivory document with folded corner, royal navy blue header, signature line,
 * and an authentic 3D Crimson & Gold Notary Wax Seal stamp with hanging ribbons.
 */
export function ConfidentialityBadge({ className = '', size = 46 }: TrustBadgeProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Enterprise NDA & Confidentiality Legal Seal"
    >
      <defs>
        <filter id="ndaDocShadow" x="0" y="0" width="100" height="100" filterUnits="userSpaceOnUse">
          <feDropShadow dx="0" dy="2.5" stdDeviation="2.5" floodColor="#000000" floodOpacity="0.22" />
        </filter>
        <linearGradient id="docParchment" x1="16" y1="8" x2="84" y2="92" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#F1F5F9" />
        </linearGradient>
        <linearGradient id="waxRedGrad" x1="48" y1="48" x2="88" y2="88" gradientUnits="userSpaceOnUse">
          <stop stopColor="#EF4444" />
          <stop offset="0.5" stopColor="#DC2626" />
          <stop offset="1" stopColor="#7F1D1D" />
        </linearGradient>
        <linearGradient id="waxGoldRing" x1="50" y1="50" x2="86" y2="86" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FDE68A" />
          <stop offset="1" stopColor="#D97706" />
        </linearGradient>
      </defs>

      {/* Main Legal Document Body with Folded Top-Right Corner */}
      <g filter="url(#ndaDocShadow)">
        <path
          d="M 16 7 H 64 L 84 27 V 89 C 84 92 81.5 94.5 78.5 94.5 H 16 C 13 94.5 10.5 92 10.5 89 V 12.5 C 10.5 9.5 13 7 16 7 Z"
          fill="url(#docParchment)"
          stroke="#94A3B8"
          strokeWidth="1.8"
        />
        {/* Folded Corner Triangle with 3D Bevel */}
        <path
          d="M 64 7 V 24.5 C 64 26 65.5 27.5 67 27.5 H 84 Z"
          fill="#CBD5E1"
          stroke="#94A3B8"
          strokeWidth="1.5"
        />
      </g>

      {/* Navy Blue Header Bar */}
      <rect x="18" y="15" width="42" height="9" rx="2" fill="#1E3A8A" />
      <text x="39" y="21.5" fontFamily="'Segoe UI', Roboto, sans-serif" fontSize="5.2" fontWeight="900" fill="#FFFFFF" textAnchor="middle" letterSpacing="0.8">
        NON-DISCLOSURE
      </text>

      {/* Faux Legal Contract Clause Lines */}
      <line x1="18" y1="30" x2="76" y2="30" stroke="#64748B" strokeWidth="2.2" strokeLinecap="round" />
      <line x1="18" y1="36" x2="76" y2="36" stroke="#94A3B8" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="18" y1="42" x2="76" y2="42" stroke="#CBD5E1" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="18" y1="48" x2="52" y2="48" stroke="#CBD5E1" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="18" y1="54" x2="48" y2="54" stroke="#CBD5E1" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="18" y1="60" x2="44" y2="60" stroke="#CBD5E1" strokeWidth="1.8" strokeLinecap="round" />

      {/* Signature Flourish */}
      <path d="M 18 75 Q 26 69 32 75 T 44 74" stroke="#1E3A8A" strokeWidth="1.8" fill="none" />
      <line x1="18" y1="78" x2="46" y2="78" stroke="#64748B" strokeWidth="1.2" />
      <text x="18" y="85" fontFamily="'Segoe UI', Roboto, sans-serif" fontSize="4.6" fontWeight="800" fill="#1E3A8A" letterSpacing="0.4">
        100% PRIVATE
      </text>

      {/* Red Wax Ribbon Tails Extending Under the Seal */}
      <path d="M 62 72 L 56 95 L 63 90 L 70 95 L 67 72 Z" fill="#B91C1C" />
      <path d="M 72 72 L 69 95 L 75 90 L 82 95 L 78 72 Z" fill="#991B1B" />

      {/* Authentic Crimson Notary Wax Seal */}
      <g filter="url(#ndaDocShadow)">
        {/* Outer Wax Disc with Rim */}
        <circle cx="68" cy="67" r="19" fill="url(#waxRedGrad)" stroke="#991B1B" strokeWidth="1.2" />
        <circle cx="68" cy="67" r="15.5" fill="none" stroke="url(#waxGoldRing)" strokeWidth="1.2" strokeDasharray="2.5 1.5" />
        {/* Inner Seal Medallion */}
        <circle cx="68" cy="67" r="12.5" fill="#7F1D1D" />
        {/* Gold Seal Text */}
        <text x="68" y="65" fontFamily="'Segoe UI', Roboto, sans-serif" fontSize="6.5" fontWeight="900" fill="#FDE68A" textAnchor="middle" letterSpacing="0.4">
          100%
        </text>
        <text x="68" y="72.5" fontFamily="'Segoe UI', Roboto, sans-serif" fontSize="5" fontWeight="900" fill="#FFFFFF" textAnchor="middle" letterSpacing="0.8">
          NDA
        </text>
      </g>
    </svg>
  );
}

/**
 * 4. 100% Quality Assurance Guarantee Medal
 * Distinct Scalloped Gold Rosette Award Medal Shape:
 * Authentic 16-lobe circular rosette with dual royal sapphire silk ribbon tails,
 * metallic gold gradients, 5-point star crest, and bold "100% QUALITY" center.
 */
export function QualityAssuranceBadge({ className = '', size = 46 }: TrustBadgeProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="100% Quality Assurance Guarantee Medal"
    >
      <defs>
        <filter id="qaMedalShadow" x="0" y="0" width="100" height="100" filterUnits="userSpaceOnUse">
          <feDropShadow dx="0" dy="2.5" stdDeviation="2.5" floodColor="#000000" floodOpacity="0.22" />
        </filter>
        <linearGradient id="qaGoldGrad" x1="18" y1="6" x2="82" y2="76" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFBEB" />
          <stop offset="0.25" stopColor="#FDE68A" />
          <stop offset="0.55" stopColor="#F59E0B" />
          <stop offset="0.85" stopColor="#D97706" />
          <stop offset="1" stopColor="#92400E" />
        </linearGradient>
        <linearGradient id="qaRibbonBlue" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#2563EB" />
          <stop offset="0.7" stopColor="#1D4ED8" />
          <stop offset="1" stopColor="#1E3A8A" />
        </linearGradient>
      </defs>

      {/* Dual Hanging Silk Ribbon Tails with Swallowtail Notches */}
      <g filter="url(#qaMedalShadow)">
        {/* Left Ribbon */}
        <path d="M 37 46 L 23 93 L 36 85 L 47 92 L 44 46 Z" fill="url(#qaRibbonBlue)" stroke="#1D4ED8" strokeWidth="0.8" />
        {/* Right Ribbon */}
        <path d="M 63 46 L 53 92 L 64 85 L 77 93 L 63 46 Z" fill="url(#qaRibbonBlue)" stroke="#1E40AF" strokeWidth="0.8" />
      </g>

      {/* Scalloped Gold Rosette Outer Edge (16 overlapping petal curves) */}
      <g filter="url(#qaMedalShadow)">
        <path
          d="M 50 6
             C 54 6 57 10 61 11 C 65 12 69 10 73 14 C 77 18 76 22 79 26 C 83 30 87 32 88 37 C 90 42 86 46 87 51 C 87 56 90 60 88 65 C 87 70 83 72 79 76 C 76 80 77 84 73 88 C 69 92 65 90 61 91 C 57 92 54 96 50 96 C 46 96 43 92 39 91 C 35 90 31 92 27 88 C 23 84 24 80 21 76 C 17 72 13 70 12 65 C 10 60 13 56 13 51 C 14 46 10 42 12 37 C 13 32 17 30 21 26 C 24 22 23 18 27 14 C 31 10 35 12 39 11 C 43 10 46 6 50 6 Z"
          fill="url(#qaGoldGrad)"
          stroke="#B45309"
          strokeWidth="1.4"
        />
      </g>

      {/* Inner Metallic Gold Beaded Rim */}
      <circle cx="50" cy="51" r="32" fill="#B45309" />
      <circle cx="50" cy="51" r="30.5" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="1.5" />
      <circle cx="50" cy="51" r="25.5" fill="#0F172A" stroke="#F59E0B" strokeWidth="2" />

      {/* 5-Point Center Gold Star */}
      <g transform="translate(42, 30)">
        <polygon
          points="8,0 10.5,5.5 16,6.2 12,10.2 13,16 8,13 3,16 4,10.2 0,6.2 5.5,5.5"
          fill="#FDE68A"
          stroke="#D97706"
          strokeWidth="0.6"
        />
      </g>

      {/* "100%" Large Bold Gold Typography */}
      <text x="50" y="56" fontFamily="'Segoe UI', Roboto, sans-serif" fontSize="10.8" fontWeight="900" fill="#FDE68A" textAnchor="middle" letterSpacing="0.6">
        100%
      </text>

      {/* "QUALITY" Center Golden Ribbon Banner */}
      <rect x="26" y="60" width="48" height="9" rx="2.5" fill="#F59E0B" stroke="#B45309" strokeWidth="0.8" />
      <text x="50" y="66.5" fontFamily="'Segoe UI', Roboto, sans-serif" fontSize="5.2" fontWeight="900" fill="#0F172A" textAnchor="middle" letterSpacing="0.8">
        QUALITY
      </text>

      {/* Bottom Subtitle */}
      <text x="50" y="73" fontFamily="'Segoe UI', Roboto, sans-serif" fontSize="3.8" fontWeight="800" fill="#94A3B8" textAnchor="middle" letterSpacing="0.5">
        GUARANTEED
      </text>
    </svg>
  );
}
