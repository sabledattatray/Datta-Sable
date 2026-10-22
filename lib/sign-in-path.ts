export function signInReturnPath(value?: string, origin = 'https://dattasable.com') {
  if (!value || value.includes('\\')) return '/';
  try {
    const url = new URL(value, origin);
    if (url.origin !== origin || url.username || url.password || /^\/sign-(in|up)\/?$/.test(url.pathname)) return '/';
    return `${url.pathname}${url.search}${url.hash}`;
  } catch { return '/'; }
}
