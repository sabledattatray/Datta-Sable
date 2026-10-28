# Library navigation and account access — 28 October 2026

## Reported symptoms and evidence

- Clicking the public eBooks menu showed the bare `Opening the library…` route fallback. This was reproduced in the live browser; the catalog eventually replaced it. Three complete HTTP responses finished in approximately 0.5–1.4 seconds and contained the books.
- Checkout showed a generic sign-in/guest-verification message even though the header displayed a signed-in account. A read-only database check confirmed that the affected account was already verified. No user verification or role was changed.
- Direct inspection of the signed-in Chrome session was blocked by the computer-use tool because it could not confidently determine the current browser URL. That personal-browser verification remains unavailable; the auth recovery is covered with real encrypted NextAuth test cookies and isolated account records.

## Changes

- Desktop and mobile eBooks menu entries use document navigation. This obtains the commerce document's own CSP and does not retain a prefetched loading segment from an editorial document.
- Removed the bare route-wide loading fallback. The public catalog renders its actual content, with its existing unavailable-state handling for database errors.
- If NextAuth cannot materialise the account session, eBook access can decode the actual request's encrypted session cookie using the configured NextAuth secret. Secure/non-secure cookie names and chunked cookies are supported. The current database user must still exist, have a verified non-placeholder email, and match the token's session version. Signature/decryption, expiry and revocation remain enforced.
- Signed-in checkout refreshes its session cookie before requesting an order. A 401 offers explicit sign-in recovery and a guest-verification form on the book page; the sign-in return URL points back to that book's purchase section.
- The library distinguishes initial loading, authentication required and temporary service failure. Service/network failures offer retry rather than incorrectly displaying the email-verification form. Requests have finite client timeouts, and existing purchase idempotency keys remain intact.

## Validation

- TypeScript and focused ESLint checks pass.
- Auth tests exercise verified account identity, encrypted and chunked cookies under both names, tampering, expiry, revoked session versions, unverified email and deleted users.
- Reader tests exercise successful account library access, service-error retry, inline guest access, sign-in return paths, session refresh and document navigation for the eBook entry.
- No payment was charged, email sent or paid-file access granted as part of these tests.

Production deployment and HTTP verification are recorded in the task's final result. The affected personal Chrome session could not be inspected directly, as noted above.
