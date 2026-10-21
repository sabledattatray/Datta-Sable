'use client';
export default function ErrorPage({reset}:{reset:()=>void}) { return <section><h1>Your library could not be loaded.</h1><p role="alert">Please try again. Do not make another payment to recover an existing purchase.</p><button onClick={reset}>Retry</button><p><a href="mailto:orders@dattasable.com">Purchase support</a></p></section>; }
