# MASTER PRODUCT REQUIREMENTS DOCUMENT (PRD)
# DattaSable Digital Products Marketplace & Automated Sales Platform
## Version 3.0 — Existing Commerce System Expansion

**Website:** https://dattasable.com  
**Existing Product:** https://dattasable.com/products/dp-700-study-package  
**Technology:** Next.js, TypeScript, Prisma, Vercel, GitHub  
**Payment Provider:** Razorpay  
**Implementation Agent:** Antigravity  
**Project Type:** Existing Platform Enhancement  
**Priority:** High  

---

# 1. PROJECT VISION

Transform dattasable.com into a premium, secure, SEO-optimized, internationally accessible digital products marketplace.

The platform must enable the website owner to create, manage, publish, promote, sell, deliver, and support original digital products.

The marketplace must integrate naturally with the existing professional portfolio, blog, dashboards, services, CMS, and administration system.

The ultimate objective is to establish a sustainable digital business built around professional expertise in:

- Microsoft Fabric
- Power BI
- Advanced Excel
- MIS Reporting
- SQL and Database Management
- Data Analytics
- Business Intelligence
- Workflow Automation
- Professional Technical Education

The platform must support both individual digital products and future product bundles.

Do not implement subscriptions or recurring billing in this phase unless an existing implementation explicitly requires them.

The final platform must be scalable, reliable, maintainable, visually exceptional, and commercially credible.

---

# 2. NON-NEGOTIABLE INSTRUCTIONS

This is an existing production website, NOT a greenfield application.

We have already worked on digital commerce functionality and created the following product URL:

https://dattasable.com/products/dp-700-study-package

The repository may already contain Razorpay checkout, order management, Prisma models, customer entitlements, automated email receipts, and administrative interfaces.

The actual implementation must be verified by inspecting the repository.

**Do not assume that a feature exists merely because it was planned or previously discussed.**

Strict requirements:

1. Audit the entire repository before implementation.
2. Preserve all existing production functionality.
3. Reuse existing commerce infrastructure.
4. Preserve the existing DP-700 product URL.
5. Do not create duplicate payment systems.
6. Do not create duplicate Prisma models.
7. Do not replace existing authentication.
8. Do not overwrite production environment variables.
9. Do not reset or delete the production database.
10. Do not expose Razorpay secrets.
11. Do not activate live checkout without explicit approval.
12. Do not publish incomplete products.
13. Do not introduce paid infrastructure without approval.
14. Do not deploy to production without approval.
15. Do not fabricate ratings, testimonials, purchases, or product claims.
16. Do not use unauthorized copyrighted educational materials.
17. Do not change existing SEO URLs unnecessarily.
18. Do not silently alter payment, tax, refund, or licensing policies.
19. Do not perform destructive database migrations.
20. Document every significant architectural decision.

If any requirement conflicts with the existing architecture, identify the conflict and propose the safest solution before proceeding.

---

# 3. PHASE ZERO — COMPLETE REPOSITORY AUDIT

Before modifying code, inspect:

## 3.1 Application Architecture

- Next.js version
- App Router or Pages Router
- TypeScript configuration
- Package manager
- Existing UI framework
- Tailwind CSS configuration
- Component libraries
- Theme system
- Typography and design tokens
- Responsive layout architecture
- Navigation
- Footer
- Authentication
- Authorization
- Middleware
- API routes
- Server Actions
- Error handling
- Logging
- Caching strategy

## 3.2 Database Architecture

Inspect:

- Prisma schema
- Database provider
- Database connection handling
- Existing product models
- Category models
- Order models
- Payment models
- Customer models
- Entitlement models
- Digital asset models
- Email outbox models
- Refund models
- Audit logs
- Existing indexes
- Migration history

Do not assume the database is Neon, PostgreSQL, or any other provider until verified.

## 3.3 Commerce Architecture

Identify:

- Existing product page implementation
- Existing checkout flow
- Razorpay order creation
- Razorpay webhook handlers
- Payment signature verification
- Payment reconciliation
- Receipt generation
- Customer email delivery
- Product access logic
- Download authorization
- Refund handling
- Existing admin controls

## 3.4 CMS and SEO

Identify:

- Blog content architecture
- CMS implementation
- SEO metadata generation
- Canonical URL logic
- Sitemap generation
- Robots directives
- Structured data
- Open Graph images
- Search Console integration
- GA4 integration

## 3.5 Audit Deliverables

Produce a table:

| Component | Current Implementation | Status | Recommended Action | Risk |
|---|---|---|---|---|
| Product catalog | Inspect repository | Existing/Missing | Reuse/Build | Low/Medium/High |
| Product details | Inspect repository | Existing/Missing | Enhance | Low/Medium/High |
| Razorpay | Inspect repository | Existing/Missing | Preserve/Repair | High |
| Database | Inspect repository | Existing | Reuse | High |
| Customer library | Inspect repository | Existing/Missing | Enhance/Build | Medium |
| Admin commerce | Inspect repository | Existing/Missing | Enhance/Build | Medium |
| SEO | Inspect repository | Existing/Missing | Integrate | Medium |
| Analytics | Inspect repository | Existing/Missing | Integrate | Low |

Present the audit and implementation plan for approval before database or payment changes.

---

# 4. INFORMATION ARCHITECTURE

Use the existing `/products` namespace.

## 4.1 Public Routes

- `/products` — Main marketplace
- `/products/[slug]` — Individual product page
- `/products/category/[slug]` — Category page when useful
- Existing checkout route — Reuse wherever possible
- Existing checkout success route — Reuse
- Existing checkout cancellation route — Reuse
- Existing customer purchase library — Reuse or extend

Do not create `/store` as a competing commerce system.

Preserve:

`/products/dp-700-study-package`

Existing published URLs must continue to function.

## 4.2 Administrative Routes

Follow existing admin routing conventions.

Required administrative sections:

- Commerce Overview
- Products
- Categories
- Digital Assets
- Orders
- Payments
- Customers
- Entitlements
- Refunds
- Promotions
- Product SEO
- Sales Analytics
- Commerce Settings
- Audit Logs

Do not create duplicate admin dashboards if existing modules can be extended.

---

# 5. PREMIUM VISUAL DESIGN SYSTEM

The marketplace must have the appearance and usability of a premium professional SaaS platform.

## 5.1 Visual Requirements

- Modern enterprise-grade appearance
- Sophisticated typography
- Clear content hierarchy
- Spacious layout
- Balanced use of whitespace
- Subtle gradients
- Elegant borders
- Consistent shadows
- Premium product cards
- High-quality previews
- Refined micro-interactions
- Responsive mobile layouts
- Accessible color contrast
- Consistent brand identity

The interface must feel professional rather than promotional or gimmicky.

## 5.2 Existing Brand Compatibility

Inspect existing website design tokens.

Reuse:

- Current brand colors
- Typography
- Header
- Footer
- Buttons
- Card styles
- Navigation patterns
- Theme behavior
- Responsive breakpoints

Do not redesign the entire website.

## 5.3 Product Category Accents

Suggested visual accents:

- Microsoft Fabric resources — Blue and purple
- Power BI resources — Yellow and charcoal
- Excel templates — Green
- SQL projects — Blue and cyan
- Automation tools — Indigo and violet
- Professional bundles — Neutral premium gradients

These are optional category accents, not replacements for the main website design.

## 5.4 Interaction Design

Implement:

- Smooth hover states
- Clear keyboard focus
- Accessible dropdowns
- Skeleton loading
- Elegant empty states
- Responsive filters
- Product preview modals
- Reduced-motion support
- Touch-friendly mobile controls

Avoid unnecessary animation libraries and large client-side bundles.

---

# 6. MAIN DIGITAL PRODUCTS MARKETPLACE

**Route:** `/products`

Create a complete professional marketplace landing page.

## 6.1 Hero Section

Eyebrow:

DIGITAL RESOURCES & PROFESSIONAL TOOLS

Headline:

Practical Resources for Data Professionals

Description:

Explore original learning resources, analytics dashboards, automation templates, and practical tools designed to help you develop valuable skills and work more efficiently.

Primary CTA:

Explore Products

Secondary CTA:

View My Portfolio

The hero must include an elegant visual presentation of real product previews.

Do not invent products or use misleading mock sales statistics.

## 6.2 Trust Section

Display four value propositions:

**Practical Learning**  
Resources focused on real-world applications.

**Clear Documentation**  
Structured instructions and supporting materials.

**Secure Checkout**  
Payments processed through supported and approved payment methods.

**Digital Delivery**  
Access to purchased resources according to stated delivery terms.

Only claim features that are operational.

## 6.3 Product Categories

Initial categories:

1. Certification Study Resources
2. Excel & MIS Templates
3. Power BI Dashboards
4. SQL & Data Projects
5. Automation Tools
6. Professional Resource Bundles

Each category must support:

- ID
- Name
- Slug
- Description
- Icon
- Cover image
- Display order
- Active status
- SEO title
- SEO description
- Published product count

Do not fabricate category counts.

## 6.4 Featured Products

Create a premium responsive product grid.

Desktop: 3 columns.

Tablet: 2 columns.

Mobile: 1 column.

Each product card must show:

- Cover image
- Category
- Product name
- Short description
- Price
- Currency
- Technology tags
- Availability
- View Details
- Buy Now when eligible

Support badges such as:

- New
- Coming Soon
- Updated
- Bundle

Only display badges when supported by actual product data.

Do not invent ratings or bestseller claims.

## 6.5 Search and Filtering

Implement:

- Search by product title
- Search by description
- Search by tags
- Category filters
- Technology filters
- Product type filters
- Price range filters
- Newest-first sorting
- Price ascending
- Price descending
- Alphabetical sorting

Use URL query parameters for shareable filter states.

Include a clear filters action.

Search must use safe, indexed database queries.

## 6.6 Product Discovery

Add:

- Featured Products
- Recently Added
- Explore by Category
- Recommended Resources
- Related Learning Articles

Recommendation logic must be based on actual metadata or explicitly documented rules.

Do not imply AI personalization unless such functionality is genuinely implemented.

## 6.7 Educational Content Integration

Connect relevant existing blog articles.

Examples of subject areas:

- DP-700 certification preparation
- DP-600 learning
- PL-300 preparation
- Microsoft Fabric architecture
- Power BI dashboards
- SQL analytics

Retrieve real articles from the existing CMS.

Preserve existing blog URLs.

## 6.8 Final CTA

Headline:

Build Skills. Create Better Work.

Description:

Explore practical resources developed for professionals working with data, analytics, and business intelligence.

Button:

Browse All Products

---

# 7. PREMIUM PRODUCT DETAIL PAGES

**Route:** `/products/[slug]`

Improve the existing DP-700 product page rather than replacing its working functionality.

## 7.1 Product Hero

Desktop:

Two-column layout.

Left:

- Main product image
- Preview gallery
- Sample screenshots
- Thumbnail navigation
- Full-screen preview
- Optional sample download

Right:

- Product category
- Product title
- Short description
- Price and currency
- Availability status
- Key benefits
- Product format
- Purchase action
- Delivery information

Mobile:

- Optimized vertical layout
- Readable typography
- Touch-friendly previews
- Prominent purchase CTA
- No horizontal overflow

## 7.2 Product Information

Each product page must support:

### Overview

Detailed explanation of the product and its intended purpose.

### What's Included

A structured list of actual deliverables.

### Who This Is For

Target audience, prerequisites, and experience level.

### Learning Outcomes

Practical knowledge or skills the product is intended to develop.

Avoid guaranteed certification or employment outcomes.

### Product Specifications

- Product version
- Last updated date
- File formats
- File size
- Language
- Compatibility
- Prerequisites
- License type
- Delivery method
- Support terms

### Preview

Support:

- Preview images
- Sample pages
- Sample PDFs
- Demonstration videos where available
- Sample dataset previews where appropriate

### FAQ

Product-specific questions and answers.

### Related Products

Show relevant published products.

### Support

Include:

- Contact page
- Support email
- WhatsApp contact
- Refund policy
- Terms of purchase

## 7.3 Purchase Panel

Create a premium purchase card.

Include:

- Product price
- Currency
- Delivery method
- License summary
- Purchase button
- Supported payment information
- Refund policy link
- Contact support link

Possible states:

- Buy Now
- Coming Soon
- Currently Unavailable
- Already Purchased
- Download Product

Purchase eligibility must be enforced server-side.

Never trust a client-supplied price or product status.

---

# 8. INITIAL DP-700 PRODUCT

Existing product:

https://dattasable.com/products/dp-700-study-package

Product title:

DP-700 Microsoft Fabric Data Engineer Associate — Self-Study Preparation Package

Category:

Certification Study Resources

Proposed price:

USD 49

The actual charge currency must be supported by the approved Razorpay configuration.

Do not assume USD checkout is enabled merely because international card acceptance was requested.

## 8.1 Planned Contents

- Structured 12-week preparation roadmap
- Topic-wise study guides
- Curated official Microsoft Learn references
- Original practical exercises
- Microsoft Fabric data engineering scenarios
- Original practice questions
- Detailed explanations
- Revision checklists
- Exam readiness assessment

These are planned deliverables.

Do not represent them as completed unless the actual files have been created and reviewed.

## 8.2 Product Disclaimer

Display:

"This is an independently developed study resource and is not affiliated with, sponsored by, or endorsed by Microsoft. Microsoft Fabric and related trademarks belong to their respective owners."

Do not use unauthorized Microsoft logos.

Do not reproduce protected exam questions or proprietary Microsoft training materials.

Do not promise examination success.

## 8.3 Publishing Requirements

The product must remain unpublished or non-purchasable until:

- All promised materials exist
- Technical content is reviewed
- Product files are uploaded
- Preview materials are available
- Product description matches actual deliverables
- Delivery method is verified
- Checkout is approved
- Refund and support terms are published

---

# 9. PRODUCT MANAGEMENT SYSTEM

Extend the existing administration system.

## 9.1 Product Creation

Allow administrators to create products with:

- Product title
- Slug
- Category
- Short description
- Full description
- Features
- Included deliverables
- Intended audience
- Prerequisites
- Price
- Currency
- Cover image
- Preview gallery
- Downloadable files
- Tags
- Specifications
- FAQs
- SEO metadata
- License terms
- Support terms
- Publication status

## 9.2 Product Statuses

Support:

- DRAFT
- COMING_SOON
- PUBLISHED
- ARCHIVED

Use separate availability or purchasability controls.

Publishing a product must not automatically enable payment if the product is incomplete.

## 9.3 Product Editor

Provide a professional editing interface with:

- General Information
- Description
- Media
- Digital Files
- Pricing
- Inventory/Availability
- SEO
- FAQs
- Related Products
- Publishing

Digital products should not use physical inventory or shipping fields unless explicitly applicable.

## 9.4 Product Duplication

Allow administrators to duplicate a product as a new draft.

Ensure:

- New product ID
- New slug
- No duplicated purchase entitlements
- No duplicated order records
- No accidental publication

## 9.5 Product Versioning

Support:

- Product version number
- Release notes
- Updated files
- Update history
- Customer update eligibility

Do not silently revoke existing customer access when a product is updated.

---

# 10. DIGITAL ASSET MANAGEMENT

Create or extend a secure digital asset management system.

Support:

- PDF
- ZIP
- XLSX
- CSV
- PBIX
- SQL
- DOCX
- PPTX
- TXT
- Other approved digital formats

## 10.1 Storage Security

Requirements:

- Private storage for paid files
- No publicly guessable download URLs
- Server-side authorization
- Short-lived signed download links or secure streaming
- MIME type validation
- File size limits
- Safe filename handling
- Malware scanning where feasible
- Download audit logs
- Protection against path traversal

Do not store private paid files in the public Next.js directory.

## 10.2 Download Entitlements

Only authorized customers may access purchased products.

Verify:

- Authenticated customer or secure purchase-access mechanism
- Ownership of the order
- Verified successful payment
- Product entitlement
- Entitlement validity
- Asset availability

Do not rely on a customer-provided email address alone as proof of ownership.

## 10.3 Download Experience

Customers must be able to:

- View purchased products
- Download eligible files
- View product version
- Access documentation
- See support information
- Retrieve purchase receipts

Expired or revoked access must show a clear explanation.

---

# 11. RAZORPAY INTEGRATION

Reuse the existing Razorpay implementation.

Do not build a second payment gateway integration.

## 11.1 Payment Flow

Expected sequence:

1. Customer selects product.
2. Server validates product availability.
3. Server calculates authoritative price.
4. Server creates or reuses a valid pending order.
5. Razorpay checkout begins.
6. Payment is processed.
7. Server verifies payment through trusted Razorpay evidence.
8. Order status is updated.
9. Entitlement is granted.
10. Receipt is queued.
11. Customer receives purchase confirmation.
12. Product becomes available for authorized download.

Never grant access solely because the browser reports a successful payment.

## 11.2 Payment Security

Require:

- Server-side amount validation
- Currency validation
- Razorpay signature verification
- Raw-body webhook verification
- Constant-time signature comparison where applicable
- Webhook idempotency
- Replay protection
- Database transactions
- Unique payment identifiers
- Secure error handling
- Rate limiting
- Payment reconciliation
- No secret exposure

## 11.3 International Payments

The platform must support international customers only through payment methods and currencies approved for the merchant account.

Account for:

- International card activation
- Supported presentment currencies
- INR settlement
- Exchange-rate communication
- Gateway fees
- Refund currency implications
- Tax documentation
- Settlement reporting

Do not invent currency conversion rates.

Do not assume Canadian customers can pay in USD until verified.

## 11.4 Failure Handling

Handle:

- Checkout cancellation
- Failed payments
- Pending payments
- Duplicate callbacks
- Delayed webhooks
- Payment capture delays
- Refunds
- Partial refunds if supported
- Disputes and chargebacks
- Email delivery failures
- Temporary database errors

Payment status and email delivery status must remain independent.

---

# 12. AUTOMATED EMAIL SYSTEM

Reuse the existing email service where possible.

## 12.1 Customer Emails

Support:

- Order confirmation
- Payment receipt
- Download access instructions
- Payment failure notification where appropriate
- Refund confirmation
- Product update notification
- Support response

## 12.2 Branding

Use professional DattaSable branding.

Emails should contain:

- Logo or brand name
- Customer-facing order reference
- Product title
- Amount and currency
- Payment status
- Purchase date
- Access instructions
- Support contact
- Relevant policy links

Do not expose internal payment secrets or sensitive identifiers.

## 12.3 Reliability

Use a durable email outbox.

Support:

- Retry attempts
- Retry backoff
- Delivery status
- Failure logging
- Administrative resend
- Duplicate prevention

Email failure must never reverse a verified successful payment.

---

# 13. CUSTOMER PURCHASE LIBRARY

Create or enhance the customer purchase area.

## 13.1 Customer Dashboard

Show:

- Purchased products
- Purchase dates
- Download actions
- Product versions
- Order references
- Receipt access
- Support options

## 13.2 Account Access

Reuse existing authentication.

If guest checkout exists, provide a secure claim or access flow.

Avoid creating duplicate customer accounts.

Use appropriate verification before associating guest purchases with an account.

## 13.3 Customer Security

Customers must never access another customer's:

- Orders
- Receipts
- Entitlements
- Files
- Payment information

Enforce authorization in every server-side endpoint.

---

# 14. ADMIN COMMERCE DASHBOARD

Extend the existing admin dashboard.

## 14.1 Overview

Display actual metrics:

- Gross sales
- Net sales
- Completed orders
- Pending orders
- Failed payments
- Refunds
- Products sold
- Average order value
- Sales by product
- Sales by currency
- Sales by country where reliable data is available

Clearly distinguish gross revenue, gateway deductions, refunds, and settlement amounts.

## 14.2 Charts

Include:

- Daily sales trend
- Monthly sales trend
- Product revenue
- Orders by status
- Revenue by product category
- Payment method breakdown
- Refund trend

Do not fabricate analytics.

## 14.3 Order Management

Allow authorized administrators to:

- Search orders
- Filter by status
- View order details
- View payment verification status
- View customer entitlement status
- Review receipt delivery
- Resend receipts
- Review refund requests
- Export permitted order data

## 14.4 Access Control

Only authorized administrators may access commerce management.

Enforce authorization on the server.

Use least-privilege permissions.

Log sensitive administrative actions.

---

# 15. PRODUCT PRICING AND PROMOTIONS

Build a flexible but controlled pricing system.

## 15.1 Pricing

Support:

- Base price
- Currency
- Effective price
- Optional scheduled promotions
- Product-specific discounts
- Bundle pricing in a future phase

All calculations must be performed server-side.

## 15.2 Discount Codes

If implemented, support:

- Unique code
- Fixed or percentage discount
- Start date
- Expiry date
- Maximum redemption count
- Per-customer usage limits
- Product restrictions
- Active/inactive status

Prevent negative totals and discount stacking errors.

Do not implement fake permanent discounts.

## 15.3 Tax and Invoicing

Support accurate tax configuration without hardcoding legal conclusions.

The system should accommodate:

- Merchant legal information
- Customer billing details
- Applicable tax treatment
- Invoice or receipt numbering
- Tax-inclusive or tax-exclusive pricing
- Currency
- Refund adjustments
- Record retention

Do not assume all international digital sales are automatically tax-free.

Any tax calculation or invoice format must be reviewed against applicable requirements before production activation.

---

# 16. SEO STRATEGY

The store must be designed for organic search visibility.

## 16.1 Product Metadata

Each published product must support:

- Unique SEO title
- Meta description
- Canonical URL
- Open Graph title
- Open Graph description
- Social preview image
- Structured data
- Breadcrumbs
- Search-friendly description

## 16.2 Structured Data

Implement valid schema.org markup where appropriate:

- Product
- Offer
- BreadcrumbList
- Organization
- FAQPage where applicable

Only include verified prices, currencies, availability, and review information.

## 16.3 Indexing Rules

- Published public products: indexable when appropriate
- Draft products: noindex and inaccessible as public sales offers
- Private previews: authenticated or securely tokenized
- Checkout pages: noindex
- Customer account pages: noindex
- Admin pages: noindex

Avoid duplicate canonical URLs.

## 16.4 Internal Linking

Connect:

- Relevant blog posts to products
- Product pages to educational articles
- Product pages to related products
- Category pages to relevant products
- Portfolio projects to matching resources where appropriate

Do not insert excessive promotional links into unrelated articles.

## 16.5 Sitemap

Include eligible published products and categories in the existing sitemap infrastructure.

Exclude drafts, private pages, and account routes.

---

# 17. GOOGLE ANALYTICS 4

Integrate with the existing GA4 implementation.

## 17.1 Recommended Events

Track:

- view_item_list
- select_item
- view_item
- add_to_cart only if cart functionality exists
- begin_checkout
- add_payment_info where appropriate
- purchase
- refund
- whatsapp_click
- generate_lead when a genuine lead is confirmed

## 17.2 Ecommerce Parameters

Use appropriate GA4 fields:

- transaction_id
- currency
- value
- items
- item_id
- item_name
- item_category
- price
- quantity

Do not send customer names, emails, phone numbers, or other prohibited personal information to GA4.

## 17.3 Duplicate Prevention

Purchase events must be associated with verified transactions.

Prevent duplicate client-side firing.

Use stable transaction identifiers and an explicit deduplication strategy.

## 17.4 Funnel Reporting

Enable reporting for:

Product View → Checkout Started → Payment Completed → Product Access

Also track:

Blog Article → Product Page → Checkout

This will help identify which educational content generates actual business interest.

---

# 18. WHATSAPP LEAD INTEGRATION

Preserve the existing WhatsApp contact button.

Enhance tracking without disrupting its functionality.

Track:

- Button click
- Source page
- Product page context
- Contact method

Do not assume a click means a conversation was completed.

If an authenticated lead form or confirmed inquiry workflow is added, record that separately.

Do not automatically collect or store WhatsApp conversations without appropriate consent and authorization.

---

# 19. CONTENT MANAGEMENT AND PRODUCT MARKETING

Extend the existing CMS where appropriate.

Support:

- Product descriptions
- Product FAQs
- Product previews
- Product update announcements
- Product-specific educational articles
- Product landing page SEO
- Featured product selection
- Promotional banners
- Category descriptions

Do not introduce a separate CMS unless clearly justified.

Allow the administrator to control homepage product promotion.

Promotional sections must never display unpublished or unavailable products as purchasable.

---

# 20. INTERNATIONAL CUSTOMER EXPERIENCE

Design for customers in:

- India
- Canada
- United States
- United Kingdom
- Europe
- Other supported countries

## 20.1 Currency Display

Show the actual checkout currency clearly.

If displaying approximate conversions:

- Label them as estimates.
- Use an authorized exchange-rate source.
- Explain that bank conversion charges may vary.
- Never substitute estimated currency amounts for the authoritative checkout amount.

## 20.2 Language

Use clear international English.

Do not assume localization is necessary in the first release.

Architect product content so additional languages can be supported later.

## 20.3 Time Zones

Store timestamps in UTC.

Display dates consistently in customer and administrator interfaces.

## 20.4 International Payment Availability

If the merchant account is not approved for a requested payment method, show an accurate message rather than a broken checkout.

---

# 21. SECURITY REQUIREMENTS

The platform handles payments and customer access.

Security is mandatory.

Implement or verify:

- Server-side validation
- Authentication
- Authorization
- Secure session handling
- CSRF protections where applicable
- XSS protections
- SQL injection protections
- Rate limiting
- Input sanitization
- Secure file access
- Webhook signature verification
- Secret management
- Secure logging
- Idempotent payment processing
- Audit trails
- Safe error messages
- Dependency security review
- Principle of least privilege

Never store raw payment card information.

Never expose Razorpay secret keys in client-side code.

Never log full payment credentials.

---

# 22. DATABASE DESIGN

Reuse existing Prisma models.

Only introduce additional models if the audit proves they are required.

Possible logical entities:

- Product
- ProductCategory
- ProductMedia
- ProductAsset
- ProductVersion
- ProductFAQ
- ProductPrice
- Order
- OrderItem
- Payment
- Refund
- CustomerEntitlement
- DownloadEvent
- EmailOutbox
- Promotion
- PromotionRedemption
- CommerceAuditLog

These are logical capabilities, not instructions to create every table.

Prefer extending existing models rather than duplicating entities.

## 22.1 Database Integrity

Require:

- Unique product slugs
- Unique provider payment identifiers
- Appropriate foreign keys
- Transactional order updates
- Idempotency constraints
- Useful database indexes
- Consistent money representation
- Immutable historical order prices
- Safe migrations

Store money in integer minor units where compatible with the existing architecture.

Do not use floating-point arithmetic for authoritative payment amounts.

## 22.2 Migration Safety

Before any schema migration:

1. Review existing migrations.
2. Confirm database provider.
3. Identify production impact.
4. Prepare migration plan.
5. Prepare rollback or recovery strategy.
6. Test against a nonproduction database.
7. Obtain approval.

Never run destructive schema synchronization against production.

---

# 23. PERFORMANCE REQUIREMENTS

Aim for strong Core Web Vitals.

Targets:

- LCP ≤ 2.5 seconds
- CLS ≤ 0.1
- INP ≤ 200 milliseconds

These are performance targets, not guaranteed outcomes.

Use:

- Next.js Server Components where appropriate
- Optimized images
- Responsive image sizes
- Lazy loading
- Efficient Prisma queries
- Pagination
- Caching
- Minimal client JavaScript
- Optimized fonts
- Appropriate static generation
- Safe cache invalidation

Never cache private customer information in shared public caches.

---

# 24. ACCESSIBILITY

Aim for WCAG 2.2 AA compliance.

Implement:

- Semantic HTML
- Correct heading hierarchy
- Keyboard navigation
- Visible focus states
- Screen-reader support
- Proper labels
- Accessible modals
- Adequate contrast
- Reduced-motion preferences
- Accessible validation messages
- Mobile-friendly touch targets

Test the checkout and customer purchase experience using keyboard navigation.

---

# 25. MOBILE-FIRST DESIGN

Support:

- 320px screens where practical
- 360px mobile
- 390px mobile
- Tablets
- Laptops
- Large desktop screens

Requirements:

- No horizontal overflow
- Responsive product gallery
- Mobile filter drawer
- Readable pricing
- Clear CTA
- Touch-friendly controls
- Optimized images
- Fast navigation
- Accessible checkout

A sticky mobile purchase action may be used if it does not obscure content.

---

# 26. PRODUCT REVIEWS AND TESTIMONIALS

Do not create fake testimonials or ratings.

If reviews are implemented:

- Accept reviews only through a controlled workflow.
- Clearly distinguish verified purchasers.
- Moderate abusive or irrelevant content.
- Prevent duplicate review abuse.
- Allow legitimate critical reviews.
- Avoid misleading aggregate ratings.

Do not display an empty five-star rating as if a product has been reviewed.

Reviews are optional for the initial release.

---

# 27. CUSTOMER SUPPORT

Provide a clear support experience.

Support channels may include:

- Contact form
- Support email
- WhatsApp contact

Product support pages should explain:

- How to access downloads
- Supported file formats
- How to report technical problems
- How to request help
- Refund request process
- Product update policy

Do not promise 24/7 support unless that service is actually available.

---

# 28. LEGAL AND POLICY REQUIREMENTS

Integrate with existing website policies.

Required policy coverage:

- Privacy Policy
- Terms and Conditions
- Digital Product Delivery Policy
- Refund and Cancellation Policy
- License Terms
- Contact Information

Policies must accurately describe the real business.

Do not invent legal registrations, tax numbers, addresses, or business certifications.

Obtain appropriate legal or accounting review before enabling international sales.

---

# 29. HOSTING AND DEPLOYMENT

The current deployment uses Vercel.

Inspect the actual plan and configuration.

The website has previously been hosted on Vercel Hobby.

Before enabling commercial checkout, verify that the hosting arrangement permits commercial use.

Do not assume the free plan is suitable for a commercial marketplace.

Avoid introducing unnecessary paid infrastructure.

## 29.1 Scheduled Tasks

Do not depend on high-frequency cron jobs that exceed hosting-plan capabilities.

Prefer:

- Reliable webhook processing
- Durable database-backed jobs
- Idempotent workers
- Controlled retry mechanisms
- Administrative reconciliation tools

Document any infrastructure limitations.

## 29.2 Deployment Safety

Use the existing GitHub and Vercel workflow.

Require:

- Clean Git status
- Reviewed changes
- Successful build
- Passing tests
- Validated environment variables
- Database migration approval
- Preview deployment testing
- Production deployment approval

Never automatically deploy major commerce changes without authorization.

---

# 30. TESTING STRATEGY

## 30.1 Functional Tests

Test:

- Product listing
- Product search
- Product filters
- Category navigation
- Product detail pages
- Product previews
- Draft visibility
- Product publishing
- Price display
- Checkout initiation
- Purchase confirmation
- Download access
- Customer library
- Admin management
- Email receipts
- Refund handling

## 30.2 Security Tests

Test:

- Unauthorized downloads
- Forged payment callbacks
- Invalid webhook signatures
- Duplicate webhook delivery
- Replay attempts
- Client-side price manipulation
- Cross-customer order access
- Admin permission bypass
- Invalid file uploads
- Expired signed links
- Duplicate entitlement creation

## 30.3 Failure Tests

Simulate:

- Payment failure
- Payment cancellation
- Webhook delay
- Duplicate webhooks
- Email provider outage
- Database interruption
- Missing product file
- Download link expiry
- Partial deployment failure

## 30.4 Regression Tests

Ensure:

- Existing portfolio works
- Existing blog works
- Existing dashboards work
- Existing CMS works
- Existing admin works
- Existing authentication works
- Existing SEO URLs work
- Existing contact forms work
- Existing WhatsApp button works

## 30.5 Build Validation

Run applicable commands for:

- TypeScript
- Lint
- Unit tests
- Integration tests
- Production build
- Prisma validation
- Schema migration checks
- Accessibility checks
- Structured data checks

Report actual results.

Never claim tests passed if they were not executed.

---

# 31. IMPLEMENTATION PHASES

## Phase 1 — Audit and Planning

Deliver:

- Repository audit
- Existing commerce inventory
- Architecture diagram
- Risk assessment
- Reuse strategy
- Implementation plan

**Approval gate:** Obtain approval before significant database or payment changes.

## Phase 2 — Design System and Marketplace UI

Build:

- `/products` page
- Hero
- Categories
- Product grid
- Search
- Filters
- Sorting
- Responsive layouts

## Phase 3 — Product Detail Enhancement

Improve:

- Existing DP-700 product page
- Product gallery
- Specifications
- FAQs
- Related products
- Purchase panel
- Mobile design

## Phase 4 — Administration

Extend:

- Product management
- Category management
- Media management
- Pricing
- Publishing
- SEO fields
- Product versioning

## Phase 5 — Digital Delivery

Implement or improve:

- Secure storage
- Customer entitlements
- Authorized downloads
- Customer purchase library
- Product update access

## Phase 6 — Commerce Integration

Connect the storefront to the existing:

- Razorpay checkout
- Order records
- Payment verification
- Receipts
- Refunds
- Customer access

Do not activate live payments.

## Phase 7 — Analytics and SEO

Implement:

- Product metadata
- Structured data
- Sitemap
- GA4 ecommerce events
- Internal linking
- WhatsApp click tracking

## Phase 8 — Testing and Optimization

Perform:

- Functional testing
- Security testing
- Accessibility testing
- Responsive testing
- Performance testing
- Regression testing

## Phase 9 — Production Readiness Review

Prepare:

- Deployment checklist
- Environment variable checklist
- Database migration plan
- Razorpay approval checklist
- Hosting compliance review
- Rollback strategy
- Known limitations

Do not deploy without approval.

---

# 32. DEFINITION OF DONE

The project is complete only when:

1. Existing production functionality is preserved.
2. The `/products` marketplace is implemented.
3. The existing DP-700 product page is enhanced.
4. Products can be managed through the existing admin system.
5. Draft products cannot be purchased.
6. Prices are validated server-side.
7. Existing Razorpay integration remains secure.
8. Customer entitlements are correctly enforced.
9. Digital downloads are protected.
10. Purchase receipts are reliable.
11. Storefront SEO is correctly implemented.
12. GA4 ecommerce events are validated.
13. Mobile layouts work correctly.
14. Accessibility requirements are tested.
15. Security tests pass.
16. Production build succeeds.
17. Existing website routes remain operational.
18. All new environment variables are documented.
19. Database changes are reviewed.
20. Production deployment remains subject to explicit approval.

---

# 33. REQUIRED FINAL REPORT

After implementation, provide:

### A. Executive Summary

What was built and improved.

### B. Existing Functionality Reused

List all reused components, models, services, and routes.

### C. New Features

Describe all new functionality.

### D. Modified Files

Provide a file-by-file change summary.

### E. Database Changes

Explain migrations, indexes, and compatibility.

### F. Payment Security

Explain how Razorpay security and idempotency were preserved.

### G. Testing Results

Show actual executed tests and outcomes.

### H. SEO Validation

Summarize metadata, sitemap, canonical, and structured data results.

### I. Performance Results

Provide measured results where available.

### J. Outstanding Issues

Identify incomplete work, risks, and limitations.

### K. Deployment Checklist

Explain exactly what must be reviewed before production activation.

---

# 34. FUTURE EXPANSION ROADMAP

Design the architecture to accommodate future capabilities without implementing everything immediately.

Potential future features:

- Multiple certification preparation packages
- Product bundles
- Discount campaigns
- Affiliate partnerships
- Customer wishlists
- Advanced recommendations
- Learning progress tracking
- Interactive practice assessments
- Video learning resources
- Software license delivery
- Subscription products
- Corporate bulk licensing
- Multi-language content
- Advanced customer analytics
- Automated product update notifications

Future features must not delay the initial reliable marketplace release.

---

# 35. FINAL MASTER INSTRUCTION TO ANTIGRAVITY

You are acting as a senior full-stack architect, e-commerce engineer, UI/UX designer, database engineer, security reviewer, and technical QA lead.

Your task is to expand the existing dattasable.com commerce functionality into a premium, scalable digital products marketplace.

The website already has a DP-700 product page developed.

Do not rebuild working infrastructure unnecessarily.

Audit first, reuse second, improve third, and introduce new functionality only when required.

Preserve the existing Next.js architecture, Prisma models, Razorpay integration, SEO infrastructure, CMS, authentication, and administration system.

The marketplace must be visually exceptional, fast, accessible, secure, and suitable for international professional customers.

Do not compromise payment security for design convenience.

Do not introduce unnecessary costs.

Do not fabricate customer reviews, sales figures, or product claims.

Do not publish unfinished products.

Do not activate live checkout or deploy to production without explicit authorization.

**Primary business objective:** Create a reliable digital commerce platform that can support the first DP-700 product and scale to additional educational resources, professional templates, analytics projects, and digital tools.

**Primary engineering objective:** Achieve this through careful extension of the existing application, minimal duplication, strong security, and maintainable architecture.

**Execution instruction:** Begin with a full repository audit and provide an implementation plan. Once approved, implement in controlled phases with testing and review checkpoints.

**Final success criterion:** A visitor should be able to discover a product, understand its value, review its contents, purchase it securely when enabled, receive confirmation, and access the purchased files reliably—while the website owner can manage the complete lifecycle through the existing administration system.