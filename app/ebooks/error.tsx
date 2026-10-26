'use client';
export default function Error({reset}:{reset:()=>void}){return <section style={{padding:'140px 24px'}}><h1>The library is temporarily unavailable</h1><p>Please try again shortly.</p><button onClick={reset}>Try again</button></section>;}
