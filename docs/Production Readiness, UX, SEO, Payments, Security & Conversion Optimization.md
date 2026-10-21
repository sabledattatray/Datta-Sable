# MASTER PRODUCT REQUIREMENTS DOCUMENT (PRD)
## DattaSable Digital Products Store — Production Readiness, UX, SEO, Payments, Security & Conversion Optimization

**Project:** DattaSable Digital Commerce Platform  
**Website:** https://dattasable.com  
**Store:** https://dattasable.com/products  
**Existing product:** https://dattasable.com/products/dp-700-study-package  
**Execution Agent:** OpenAI Codex  
**Project Type:** Existing Next.js application — enhancement and production hardening  
**Priority:** High  
**Objective:** Transform the existing digital products store into a secure, professional, scalable, SEO-optimized, conversion-focused digital commerce platform without breaking existing functionality.

---

# 1. PRIMARY INSTRUCTIONS TO CODEX

You are acting as a Senior Full-Stack Engineer, Next.js Architect, UI/UX Designer, Ecommerce Security Specialist, Technical SEO Engineer, and Quality Assurance Lead.

Your assignment is to audit, improve, and complete the existing DattaSable digital products store.

This is an existing production website. **Do not rebuild the website from scratch.**

You must first understand the existing architecture, database models, payment integrations, authentication mechanisms, admin modules, and design system.

Implement improvements directly in the existing project while maintaining backward compatibility.

## Non-Negotiable Requirements

1. Preserve the existing DattaSable brand identity.
2. Preserve the dark theme, premium typography, lime-green accent system, and existing navigation.
3. Do not modify unrelated website modules unnecessarily.
4. Do not break existing blog, portfolio, dashboards, admin, authentication, or SEO functionality.
5. Reuse existing components, services, utilities, database models, and design tokens wherever appropriate.
6. Avoid unnecessary dependencies.
7. Never expose database credentials, Razorpay secrets, API tokens, or customer information.
8. Do not introduce fabricated products, reviews, testimonials, ratings, sales figures, or customer counts.
9. Never mark a product as commercially ready unless its promised deliverables actually exist.
10. Implement secure server-side payment verification.
11. Preserve existing product URLs wherever possible.
12. Use safe, backward-compatible database migrations.
13. Do not delete production records.
14. Do not make irreversible infrastructure changes.
15. Do not modify DNS, Vercel configuration, Hostinger configuration, or payment account settings without explicit authorization.
16. Do not execute real payment transactions during testing.
17. Maintain accessibility, responsive design, and strong performance.
18. Run appropriate validation and testing before declaring completion.
19. Do not claim a feature is tested unless the corresponding test has actually passed.
20. Complete the work in controlled phases, documenting every significant change.

**Important:** The current store screenshot/PDF shows a DP-700 product marked as a test-only dummy download, priced at $49. It also shows several categories with zero resources. These are confirmed visual findings. Payment security, SEO metadata, mobile functionality, and backend behavior require actual code inspection and testing.

---

# 2. PROJECT BACKGROUND

DattaSable is an independent professional platform focused on:

- Business intelligence and analytics
- Microsoft Power BI
- Microsoft Fabric
- Advanced Excel and MIS reporting
- SQL and data engineering
- Automation
- Professional learning resources
- Digital tools and templates

The website already contains a digital products page with a premium dark-themed interface.

The current store includes:

- Hero section
- Product discovery
- Category collections
- Keyword search
- Technology filters
- Sorting
- Product cards
- Product detail pages
- Account-related navigation
- My Orders
- My Purchases
- Learning articles
- Contact and support links
- Footer policies
- Razorpay-related checkout functionality or integration

Some features are visually present but must be technically verified.

The store must support genuine digital products such as certification learning resources, Excel templates, Power BI dashboards, SQL project files, automation tools, and professional bundles.

---

# 3. REQUIRED INITIAL TECHNICAL AUDIT

Before editing code, inspect the repository thoroughly.

Identify:

- Next.js version and routing architecture
- TypeScript configuration
- React component structure
- Tailwind CSS and theme tokens
- Prisma schema and database provider
- Authentication implementation
- User roles and permissions
- Product database models
- Order and payment models
- Download entitlement models
- Razorpay integration
- API routes and server actions
- File storage implementation
- Email delivery integration
- Existing analytics and GA4 implementation
- Metadata and sitemap generation
- Error handling and logging
- Existing automated tests
- Deployment constraints

Produce an internal audit report classifying each required feature as:

**Implemented / Partially Implemented / Missing / Defective / Not Verifiable**

Do not duplicate features already working correctly.

Prioritize fixing existing implementations over creating competing systems.

---

# 4. STORE DESIGN AND USER EXPERIENCE

## 4.1 Preserve Existing Brand

Retain the current premium dark visual language.

Maintain:

- Dark backgrounds
- Lime-green primary accent
- Consistent typography
- Existing header and navigation
- Rounded cards
- Subtle borders
- Premium spacing
- Existing iconography
- Current footer structure

Improve clarity, usability, and conversion without introducing an unrelated design.

## 4.2 Hero Section

Existing headline:

**Practical Tools. Real Skills. Better Results.**

Preserve this headline unless a demonstrably better alternative fits the existing brand.

Improve:

- Visual hierarchy
- Mobile readability
- CTA prominence
- Section spacing
- Product discovery flow

Primary CTA: **Explore Products**

Secondary CTA: **View My Portfolio**

Both must navigate correctly.

## 4.3 Product Discovery

Create a polished, responsive product discovery experience.

Support:

- Keyword search
- Category filtering
- Technology filtering
- Price sorting
- Newest-first sorting
- Product availability
- Clear-filter functionality
- Empty search results
- Loading states
- Error states

Filters must operate on actual published product data.

Avoid unnecessary client-side hydration or large data payloads.

Use URL query parameters where appropriate so filtered views can be shared.

## 4.4 Empty Categories

Current collections include:

1. Certification Study Resources
2. Excel & MIS Templates
3. Power BI Dashboards
4. SQL & Data Projects
5. Automation Tools
6. Professional Resource Bundles

Some currently display zero resources.

Fix this carefully.

Requirements:

- Calculate counts from actual published and publicly available products.
- Exclude unpublished and inactive products.
- Avoid hardcoded counts.
- Clearly distinguish available and unavailable categories.
- Hide empty categories from primary shopping navigation when appropriate.
- Alternatively display a tasteful "Coming Soon" state.
- Never imply that a product exists when it does not.
- Preserve the categories in the administrative system for future expansion.

---

# 5. PRODUCT CATALOG ARCHITECTURE

Implement or refine a maintainable product catalog.

Each product should support appropriate fields such as:

- Unique identifier
- Product title
- URL slug
- Short description
- Full description
- Category
- Technology tags
- Product type
- Cover image
- Gallery images
- Price
- Currency
- Sale price, if applicable
- Version
- Last updated date
- Included files
- File formats
- Prerequisites
- Intended audience
- Learning objectives
- Product highlights
- Documentation
- Sample preview
- License information
- Delivery method
- Refund eligibility
- Publication status
- Commercial readiness status
- SEO title
- SEO description
- Canonical URL

Reuse existing Prisma models wherever possible.

Do not create unnecessary duplicate database tables.

Use schema validation for administrative input.

## 5.1 Product Publication States

Support a clear lifecycle:

- Draft
- Under Review
- Published
- Archived

Separately distinguish commercial readiness where needed:

- Test Only
- Coming Soon
- Ready for Sale

Only commercially ready, published products should have active production checkout.

Products lacking deliverables must not be presented as fully available.

---

# 6. CRITICAL DP-700 PRODUCT CORRECTION

Existing product:

**DP-700 Microsoft Fabric Data Engineer Self-Study Package**

Existing URL:

`/products/dp-700-study-package`

Current listed price:

**USD $49.00**

The captured page contains this statement:

"TEST ONLY: a dummy download for verifying the purchase flow. No DP-700 course materials are included."

This is the highest-priority issue.

## Required Actions

1. Inspect the existing product record.
2. Inspect the actual attached downloadable files.
3. Determine whether the complete study package exists.
4. Determine whether the product is currently available for live purchase.
5. Preserve the existing URL.
6. Do not fabricate study materials.
7. Do not claim that the package contains resources that have not been created.
8. Do not silently remove the test-only disclosure while leaving the product purchasable.

## If the Product Is Still Test-Only

- Disable production checkout for this product.
- Clearly label it as a preview or test product.
- Remove misleading "Instant Access" claims if access is not to the advertised materials.
- Preserve the product for development and testing if needed.
- Ensure test purchases cannot be mistaken for real commercial fulfillment.

## If Complete Materials Exist

- Verify the actual files and contents.
- Update the description to accurately reflect the package.
- Display the real deliverables.
- Show supported file formats.
- Provide legitimate sample previews.
- Enable checkout only after delivery testing succeeds.

Do not change the $49 price without explicit authorization.

Do not imply official Microsoft affiliation or endorsement.

Add an appropriate independent-study disclaimer.

---

# 7. PREMIUM PRODUCT DETAIL PAGE

Improve the existing product detail layout.

Recommended structure:

## Section A — Product Overview

- Product cover
- Title
- Category
- Short description
- Price
- Purchase availability
- Primary CTA
- Product highlights

## Section B — What Is Included

List verified deliverables only.

Examples of possible file types:

- PDF
- XLSX
- PBIX
- SQL
- ZIP
- CSV

Display only formats actually supplied by the product.

## Section C — Who This Is For

Explain the intended audience based on the product's real content.

## Section D — Learning Outcomes

Display outcomes supported by the actual package.

## Section E — Requirements

Show relevant software, knowledge, or account prerequisites.

## Section F — Preview

Allow customers to inspect authorized samples without exposing paid files.

## Section G — Delivery and Licensing

Explain:

- How files are delivered
- Where customers access purchases
- Whether downloads expire
- Whether updates are included
- Permitted usage
- Refund eligibility

## Section H — Frequently Asked Questions

Use genuine product-specific questions.

## Section I — Related Resources

Recommend relevant published products and educational articles.

Avoid unrelated recommendations.

---

# 8. PRODUCT IMAGES AND VISUAL PRESENTATION

The current DP-700 product card uses a relatively simple visual.

Improve the product presentation using the existing design system.

Requirements:

- Premium product cover layout
- Clear product title
- Consistent aspect ratio
- Optimized image formats
- Responsive image sizes
- Descriptive alt text
- Lazy loading where appropriate
- No cumulative layout shift
- No copyrighted third-party branding used improperly

If no approved product image exists, create a clean branded placeholder using existing assets or CSS.

Do not introduce unrelated stock imagery.

Do not use Microsoft logos in a way that implies endorsement.

---

# 9. RAZORPAY PAYMENT INTEGRATION AUDIT

Inspect the existing Razorpay implementation before making changes.

Verify:

- Server-side order creation
- Product price calculation
- Currency handling
- Payment signature verification
- Webhook signature verification
- Order status transitions
- Duplicate webhook protection
- Failed payment handling
- Cancelled checkout handling
- Refund status synchronization
- Customer order association
- Secure logging

## 9.1 Server-Side Price Authority

Never trust product prices supplied by the browser.

The backend must retrieve authoritative pricing from the database.

Prevent:

- Price manipulation
- Currency manipulation
- Product ID substitution
- Unauthorized discount application
- Checkout for unpublished products

## 9.2 Payment Verification

Payment success must be established using trusted server-side verification.

Never grant downloadable access based only on a frontend success callback.

Use Razorpay's documented signature verification requirements.

## 9.3 Webhook Reliability

Implement or verify:

- Raw-body signature validation
- Idempotent processing
- Unique event handling
- Safe retry behavior
- Transactional entitlement creation
- Proper handling of out-of-order events
- Non-sensitive operational logging

Do not duplicate customer orders or entitlements when webhooks are retried.

## 9.4 Test and Production Separation

Maintain clear separation between test and live payment environments.

Never expose secret keys to client-side code.

Do not switch production credentials automatically.

Do not perform real payment transactions.

---

# 10. SECURE DIGITAL PRODUCT DELIVERY

Implement or improve a secure digital fulfillment system.

## 10.1 Purchase Entitlements

Only authorized customers should access purchased files.

Verify:

- Authenticated user identity
- Successful verified payment
- Correct product ownership
- Active purchase entitlement
- Product delivery availability

## 10.2 Secure File Access

Paid files must not be exposed through unrestricted public URLs.

Use a secure storage mechanism compatible with the existing infrastructure.

Preferred characteristics:

- Private storage
- Server-side authorization
- Short-lived signed access where supported
- Secure download responses
- Download activity logging
- Appropriate rate limiting

Do not assume a file is private merely because its URL is difficult to guess.

## 10.3 My Purchases

Improve the customer library.

Each purchased product should display:

- Product name
- Purchase date
- Payment status
- Available files
- Download action
- Version information
- License information
- Support link

## 10.4 My Orders

Display:

- Order reference
- Product
- Date
- Amount
- Currency
- Payment status
- Delivery status
- Invoice or receipt, if supported

Customers must never be able to view another customer's orders.

---

# 11. AUTHENTICATION AND AUTHORIZATION

Audit the existing authentication implementation.

Verify:

- Secure sessions
- Appropriate cookie settings
- Protected customer routes
- Protected admin routes
- Role-based permissions
- Server-side authorization
- Login redirect behavior
- Session expiration
- Unauthorized access handling

A logged-in customer must not gain access to administrative product management.

Prevent insecure direct object references.

Ensure product downloads validate ownership independently of the UI.

---

# 12. ADMIN PRODUCT MANAGEMENT

Reuse the existing admin dashboard.

Enhance it only where necessary.

Required capabilities:

- Create product
- Edit product
- Upload approved product assets
- Manage pricing
- Assign categories
- Assign tags
- Set publication status
- Set commercial readiness
- Manage download files
- View orders
- View payment status
- View fulfillment status
- Review product analytics

## Administrative Safeguards

- Validate all inputs.
- Enforce server-side permissions.
- Prevent accidental publication of incomplete products.
- Warn before destructive changes.
- Do not expose payment secrets.
- Maintain useful audit logs.
- Avoid deleting files that belong to existing purchases.

If a paid product is archived, define how existing buyers retain access to their purchases.

---

# 13. TECHNICAL SEO OPTIMIZATION

Implement SEO improvements compatible with the existing Next.js architecture.

## 13.1 Store Metadata

Optimize:

`https://dattasable.com/products`

Suggested title:

**Digital Products for Power BI, Excel, SQL & Microsoft Fabric | Datta Sable**

Suggested description:

**Explore practical digital resources for Power BI, Microsoft Fabric, Excel, SQL, MIS reporting, and automation. Discover independent learning materials, templates, and professional tools.**

Keep metadata accurate to the products actually available.

## 13.2 Product Metadata

Each published product must have:

- Unique title
- Unique description
- Canonical URL
- Open Graph metadata
- Social sharing image
- Appropriate robots directives

Avoid duplicate metadata.

## 13.3 Structured Data

Implement appropriate JSON-LD:

- Product
- Offer, when a genuine purchasable offer exists
- BreadcrumbList
- Organization, reusing existing site-wide implementation where appropriate

Do not fabricate:

- Reviews
- Ratings
- Availability
- Pricing
- Discounts
- Product identifiers

Structured data must match visible page content.

## 13.4 Sitemap

Include published, indexable product pages in the existing sitemap.

Exclude:

- Draft products
- Private purchases
- Admin routes
- Checkout sessions
- Customer account pages
- Internal test pages

## 13.5 URL Preservation

Maintain existing product slugs.

If any URL must change, implement appropriate permanent redirects.

Do not create redirect loops.

---

# 14. GOOGLE ANALYTICS 4 ECOMMERCE TRACKING

Inspect the existing GA4 implementation.

Reuse the existing measurement setup.

Implement or verify appropriate ecommerce events:

- `view_item_list`
- `select_item`
- `view_item`
- `begin_checkout`
- `purchase`
- `refund`, where supported

Ensure event parameters follow GA4 ecommerce conventions.

Include relevant information such as:

- Item ID
- Item name
- Item category
- Price
- Currency
- Transaction ID
- Purchase value

## Critical Requirements

- Do not fire `purchase` on an unverified frontend callback.
- Avoid duplicate purchase events.
- Do not send customer passwords, payment credentials, or personally identifiable information to GA4.
- Respect existing cookie-consent and privacy controls.
- Do not create a duplicate GA4 installation.

Implement a reliable event strategy consistent with the existing analytics architecture.

---

# 15. CONVERSION OPTIMIZATION

Improve purchase confidence without misleading marketing.

## Required Improvements

- Clear pricing
- Clear product contents
- Clear delivery explanation
- Visible support options
- Easy-to-find refund policy
- Easy-to-find terms
- Strong product CTA
- Product preview
- Transparent licensing
- Clear payment and download expectations

Do not create artificial urgency.

Do not use fake countdown timers.

Do not display fabricated sales numbers or reviews.

Do not add misleading scarcity messages.

Use legitimate trust indicators only.

---

# 16. MOBILE RESPONSIVENESS

The supplied PDF represents a desktop page capture, so mobile behavior requires independent testing.

Test at representative widths including:

- 320px
- 375px
- 390px
- 768px
- 1024px
- 1440px

Verify:

- Header navigation
- Mobile menu
- Hero section
- Product cards
- Category grid
- Search field
- Filter controls
- Sorting
- Pricing
- Checkout button
- Product detail layout
- Account navigation
- Footer
- Floating WhatsApp button

Prevent horizontal overflow.

Ensure adequate touch targets.

Avoid sticky elements obscuring content.

---

# 17. ACCESSIBILITY

Target WCAG 2.2 AA where feasible.

Audit:

- Keyboard navigation
- Visible focus states
- Semantic headings
- Accessible form labels
- Color contrast
- Screen-reader announcements
- Modal focus management
- Error messages
- Loading indicators
- Accessible product cards
- Image alt text

Avoid interactions that depend only on hover.

Respect reduced-motion preferences.

---

# 18. PERFORMANCE OPTIMIZATION

Optimize the store without damaging existing design quality.

Targets:

- LCP: 2.5 seconds or less
- INP: 200 milliseconds or less
- CLS: 0.1 or less

Treat these as performance targets, not guaranteed outcomes.

Review:

- Server Components
- Client Component boundaries
- JavaScript bundle size
- Image optimization
- Font loading
- Database queries
- API response time
- Caching
- Lazy loading
- Third-party scripts
- Checkout script loading

Avoid unnecessary client-side libraries.

Ensure caching never leaks customer-specific or authenticated information.

---

# 19. SECURITY HARDENING

Audit the complete ecommerce attack surface.

Include:

- Authentication
- Authorization
- Payment endpoints
- Webhooks
- File downloads
- Product management
- Input validation
- Database access
- Rate limiting
- CSRF protections where applicable
- XSS prevention
- Secure headers
- Secret management
- Error disclosure
- Dependency vulnerabilities

Do not introduce unsafe file uploads.

Validate file type, size, and authorization.

Prevent path traversal.

Keep sensitive data out of client bundles and application logs.

Apply dependency updates carefully, with compatibility testing.

---

# 20. LEGAL AND POLICY INTEGRATION

The existing footer includes links for:

- Privacy
- Terms
- Refund policy
- Delivery policy
- Cookies
- Cookie preferences

Verify that these links work and their content accurately reflects the implemented commerce workflow.

Ensure customers can understand:

- Seller identity
- Product delivery
- Payment processing
- Refund eligibility
- Digital licensing
- Support contact
- Data handling

Do not invent legal promises.

Flag any policy language requiring owner or legal review.

---

# 21. EDUCATIONAL CONTENT INTEGRATION

Preserve the existing "Learn Before You Buy" section.

It currently connects the store to technical articles covering:

- Microsoft Fabric
- Power BI and certification comparisons
- Cybersecurity and cloud security

Improve relevance by associating products with related articles.

Requirements:

- Show genuine published articles.
- Avoid broken links.
- Avoid unrelated recommendations.
- Preserve existing article SEO.
- Do not create duplicate article content.
- Maintain a clear distinction between free educational content and paid deliverables.

---

# 22. EMAIL NOTIFICATIONS

Audit existing transactional email functionality.

Where supported, provide:

- Order confirmation
- Payment confirmation
- Download availability
- Payment failure guidance
- Refund confirmation
- Support information

Use the existing email provider.

Do not introduce a new paid email service without authorization.

Avoid duplicate messages caused by webhook retries.

Never include sensitive payment credentials in emails.

---

# 23. ERROR HANDLING

Implement user-friendly error states for:

- Product unavailable
- Product not found
- Payment cancelled
- Payment failed
- Payment pending
- Payment verification delayed
- Unauthorized download
- Missing downloadable file
- Expired access
- Database unavailable
- Temporary server error

Do not display raw stack traces to customers.

Provide appropriate recovery actions.

For payment uncertainty, do not encourage duplicate payments without first checking the original transaction status.

---

# 24. DATABASE AND DATA INTEGRITY

Before changing the Prisma schema:

1. Inspect existing models and relationships.
2. Review migration history.
3. Identify existing production data.
4. Design backward-compatible changes.
5. Generate and review migrations.
6. Verify rollback or recovery procedures.
7. Test changes against a non-production database.

Never run destructive resets against production.

Do not silently overwrite orders, customers, or purchases.

Preserve financial records and entitlement history.

---

# 25. QUALITY ASSURANCE TEST PLAN

Create or extend automated tests for critical commerce functionality.

## Catalog Tests

- Published products display correctly.
- Draft products remain private.
- Category counts are accurate.
- Search returns relevant products.
- Filters work.
- Sorting works.
- Empty states display correctly.

## Checkout Tests

- Valid product checkout succeeds in test mode.
- Invalid product IDs are rejected.
- Manipulated prices are rejected.
- Unpublished products cannot be purchased.
- Failed payments do not grant access.
- Duplicate payment callbacks do not duplicate orders.
- Invalid webhook signatures are rejected.
- Repeated valid webhooks are idempotent.

## Download Tests

- Authorized purchasers can access files.
- Unauthenticated users cannot access paid files.
- Non-purchasers cannot access files.
- One customer's entitlement cannot access another customer's purchases.
- Expired links are rejected.
- Missing files produce safe errors.

## Admin Tests

- Authorized administrators can manage products.
- Customers cannot access admin functions.
- Invalid uploads are rejected.
- Incomplete products cannot accidentally become purchasable.

## SEO Tests

- Metadata is generated correctly.
- Canonical URLs are correct.
- Structured data is valid.
- Sitemap excludes private routes.
- Existing URLs remain functional.

## Responsive Tests

- Mobile navigation works.
- Product cards fit the viewport.
- Checkout controls remain usable.
- No horizontal overflow occurs.

Use mocks and test credentials for payment tests.

Never charge real customers.

---

# 26. IMPLEMENTATION PHASES

## Phase 1 — Repository Audit

Inspect architecture and existing implementation.

Identify confirmed defects and missing features.

## Phase 2 — Critical Commerce Safety

Address:

- Test-only product availability
- Server-side price validation
- Payment verification
- Webhook reliability
- Download authorization

## Phase 3 — Product Catalog and Admin

Improve:

- Product model
- Publication status
- Category counts
- Search and filters
- Product management

## Phase 4 — Premium Storefront UX

Improve:

- Product cards
- Product details
- Previews
- Mobile layout
- Empty states
- CTA clarity

## Phase 5 — SEO and Analytics

Implement:

- Metadata
- Structured data
- Sitemap
- GA4 ecommerce events
- Conversion tracking

## Phase 6 — Performance and Accessibility

Optimize:

- Images
- JavaScript
- Loading behavior
- Responsive layout
- Accessibility

## Phase 7 — Testing and Production Readiness

Run:

- Lint
- Type checking
- Unit tests
- Integration tests
- Production build
- Relevant end-to-end tests
- Security checks

Report any tests that cannot be executed.

---

# 27. ACCEPTANCE CRITERIA

The project is considered complete only when:

- [ ] Existing website design remains intact.
- [ ] Existing navigation works.
- [ ] Product categories show accurate counts.
- [ ] Search, sorting, and filtering work.
- [ ] Product detail pages accurately describe deliverables.
- [ ] Test-only products cannot accidentally accept production payments.
- [ ] Product prices are validated server-side.
- [ ] Razorpay signatures are verified securely.
- [ ] Webhook processing is idempotent.
- [ ] Paid files require valid purchase authorization.
- [ ] My Orders works correctly.
- [ ] My Purchases works correctly.
- [ ] Admin permissions are enforced.
- [ ] Product metadata and canonical URLs are correct.
- [ ] Structured data matches actual product information.
- [ ] GA4 purchase tracking avoids duplicates.
- [ ] Mobile layout works correctly.
- [ ] Accessibility issues are addressed.
- [ ] Production build passes.
- [ ] Existing unrelated modules remain functional.
- [ ] No sensitive credentials are exposed.
- [ ] No destructive production changes are performed.
- [ ] Any remaining blockers are explicitly documented.

---

# 28. REQUIRED CODEX DELIVERY REPORT

After implementation, provide a structured completion report containing:

### A. Executive Summary

What was improved and why.

### B. Initial Audit Findings

What existed, what was broken, and what was missing.

### C. Implemented Changes

List changes by module.

### D. Files Modified

Provide relevant file paths and descriptions.

### E. Database Changes

Document any migrations and their safety considerations.

### F. Security Improvements

Describe payment, authentication, and download protections.

### G. SEO Improvements

Document metadata, sitemap, structured data, and analytics changes.

### H. Test Results

Clearly distinguish passed, failed, skipped, and unexecuted tests.

### I. Outstanding Issues

Identify anything requiring credentials, external access, owner approval, or manual testing.

### J. Deployment Instructions

Provide safe deployment steps appropriate to the existing infrastructure.

### K. Rollback Guidance

Explain how to recover if the deployment introduces problems.

---

# 29. FINAL EXECUTION DIRECTIVE

Codex, begin by inspecting the actual repository.

Do not assume that features are missing merely because they were not visible in the supplied PDF.

Use the existing implementation as the source of truth.

Prioritize production safety over visual enhancements.

Preserve all working features.

Do not create fake products or learning materials.

Do not enable live checkout for incomplete products.

Implement all safe, clearly authorized improvements directly in the codebase.

For operations involving real payments, destructive migrations, production secrets, or external account configuration, prepare the changes and request explicit authorization before execution.

Work systematically through the implementation phases.

After every major phase, validate the affected functionality.

Do not stop after producing recommendations or a design proposal. Implement the required changes wherever the repository and available permissions allow.

**Final Objective: Deliver a production-ready, premium, secure, SEO-optimized digital commerce experience at https://dattasable.com/products that customers can trust and that can support future digital products without repeated architectural redesign.**

**END OF MASTER PRD**