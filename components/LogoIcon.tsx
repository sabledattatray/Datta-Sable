export default function LogoIcon({ className = 'w-6 h-6', color = 'var(--accent)' }: { className?: string; color?: string }) {
  return <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true" focusable="false">
    <path d="M41 8a22 22 0 1 0 0 41" stroke={color} strokeWidth="5" strokeLinecap="round"/>
    <path d="M18 44 7 55" stroke={color} strokeWidth="10" strokeLinecap="round"/>
    <path d="M17 46 8 55" stroke={color} strokeWidth="3" strokeLinecap="round" opacity=".3"/>
    <rect x="25" y="17" width="35" height="33" rx="3" fill={color} fillOpacity=".08" stroke={color} strokeOpacity=".4" strokeWidth="1.5"/>
    <rect x="30" y="36" width="6" height="9" rx="1" fill={color} opacity=".4"/>
    <rect x="39" y="30" width="6" height="15" rx="1" fill={color} opacity=".7"/>
    <rect x="48" y="24" width="6" height="21" rx="1" fill={color}/>
    <path d="m29 29 9-9 7 2 9-11m-7 0h7v7" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>;
}
