import { ImageResponse } from 'next/og';
export const alt = 'Datta Sable — Digital resources and independent learning';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export default function Image() {
  return new ImageResponse(<div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: '#090a0d', color: '#f5f5f5', padding: 70, borderBottom: '12px solid #c9f31d', fontFamily: 'sans-serif' }}><div style={{ display: 'flex', color: '#c9f31d', fontSize: 28 }}>DATTA SABLE / DIGITAL RESOURCES</div><div style={{ display: 'flex', flexDirection: 'column', fontSize: 68, fontWeight: 700, letterSpacing: -3 }}><span>Practical Tools. Real Skills.</span><span style={{ color: '#c9f31d' }}>Better Results.</span></div><div style={{ display: 'flex', fontSize: 24, color: '#b9bec8' }}>Independent resources · Clearly labeled test previews · dattasable.com</div></div>, size);
}
