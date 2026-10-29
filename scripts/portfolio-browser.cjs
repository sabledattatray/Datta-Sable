// Use an installed Playwright package, or a bundled runtime selected by the caller.
// Browser binaries are managed outside this script; no installation occurs here.
let playwright;
try { playwright = require(process.env.PLAYWRIGHT_MODULE || 'playwright'); }
catch { throw new Error('Playwright is required. Install it in your development environment or set PLAYWRIGHT_MODULE to its absolute module path.'); }
module.exports = playwright;
