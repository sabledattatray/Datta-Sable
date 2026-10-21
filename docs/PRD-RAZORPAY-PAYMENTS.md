# CODEX MASTER IMPLEMENTATION PROMPT
## Razorpay Payment Gateway, Automated Email Receipts & Digital Product Sales System

**Project:** dattasable.com  
**Technology:** Next.js, TypeScript, Prisma ORM, Vercel, GitHub  
**Payment Provider:** Razorpay  
**First Product:** Microsoft DP-700 Self-Study Preparation Package  
**Product Price:** USD 49 equivalent, subject to Razorpay currency support and checkout configuration.

---

# 1. YOUR ROLE AND PRIMARY OBJECTIVE

Act as a Principal Full-Stack Engineer, Payment Integration Specialist, Database Architect, and Application Security Engineer.

Your task is to implement a complete, secure, production-ready digital product payment and order management system within the existing dattasable.com website.

This is an existing live website, NOT a new project.

**CRITICAL: Inspect the entire relevant codebase before making changes.**

Do not assume the existing architecture, authentication, database provider, email service, admin dashboard, or route structure.

Preserve all existing functionality, database records, content, SEO configurations, and deployments.

The primary business requirement is to allow customers to purchase digital products through Razorpay and automatically receive a branded payment confirmation email and purchase receipt.

The first commercial product is a DP-700 certification preparation package, but the system must be reusable for future products.

# 2. NON-NEGOTIABLE ENGINEERING RULES

1. Inspect package.json, Next.js configuration, Prisma schema, existing authentication, email infrastructure, admin modules, and deployment configuration.
2. Reuse existing architecture, design components, authentication, and services wherever appropriate.
3. Never delete or overwrite existing database tables or production data.
4. Use backward-compatible Prisma migrations.
5. Never expose Razorpay secret keys, webhook secrets, or email credentials to the browser.
6. Never mark an order as paid based only on a client-side callback.
7. Never deliver a purchased product until server-side payment verification succeeds.
8. Never send duplicate receipts for the same completed transaction.
9. Never trust product prices, currencies, or payment status submitted by the browser.
10. Implement robust error handling, logging, and recovery.
11. Never run destructive production commands without explicit approval.
12. Do not invent missing configuration values or credentials.
13. Use the existing package manager and established coding conventions.
14. Avoid unrelated refactoring.
15. Do not deploy to production until testing and verification are complete.

Before coding, prepare a brief architecture assessment and implementation plan. Then proceed with the approved or clearly safe implementation steps.

# 3. DIGITAL PRODUCT CATALOG

Implement a reusable product management system.

The administrator should be able to create, edit, publish, unpublish, and archive digital products.

Each product should support:

- Unique product ID
- Product title
- URL slug
- Short and detailed descriptions
- Product category
- Featured image
- Price and currency
- Product features
- Included resources
- Delivery method
- Product status
- SEO title and description
- Creation and update timestamps

Support future products such as:

- Microsoft Fabric certification study packages
- Power BI dashboard templates
- Excel automation templates
- SQL learning materials
- Data analytics learning resources
- Technical guides
- Consulting packages

Use the existing CMS and admin infrastructure wherever possible.

# 4. FIRST PRODUCT CONFIGURATION

Create a draft product with these details:

**Product Name:** DP-700 Microsoft Fabric Data Engineer Self-Study Package

**Suggested URL:** /products/dp-700-study-package

**Price:** USD 49 equivalent

**Payment Type:** One-time purchase

**Description:**

A structured 12-week self-study preparation package designed for professionals preparing for the Microsoft DP-700 Fabric Data Engineer Associate certification.

Proposed contents:

1. Complete 12-week learning roadmap.
2. Structured study notes.
3. Curated Microsoft Learn resources.
4. Fabric Lakehouse and Warehouse exercises.
5. Data Factory and Dataflows Gen2 exercises.
6. Apache Spark, PySpark, and Delta Lake exercises.
7. Data engineering monitoring and optimization guidance.
8. Original practice questions.
9. Weekly progress checklists.
10. Final exam preparation resources.

Important:

- Keep this product in DRAFT status initially.
- Do not claim study materials already exist.
- Do not fabricate or generate empty downloadable materials.
- Do not enable live purchases until the administrator confirms product readiness.
- The Microsoft certification examination fee is not included.
- Display a clear independent-training disclaimer.

# 5. RAZORPAY PAYMENT INTEGRATION

Use the official Razorpay-supported integration methods appropriate to the installed framework.

Install the necessary supported packages.

Use server-side order creation and verified payment processing.

## 5.1 Required environment variables

RAZORPAY_KEY_ID

RAZORPAY_KEY_SECRET

RAZORPAY_WEBHOOK_SECRET

EMAIL_FROM

Additional email provider credentials should be determined from the existing application infrastructure.

Do not hardcode credentials.

Document all required variables for local development and Vercel.

## 5.2 Checkout workflow

Customer journey:

1. Customer opens a product page.
2. Customer reviews the product details.
3. Customer clicks Buy Now.
4. Application creates an internal pending order.
5. Server validates the product and determines the authoritative price.
6. Server creates a Razorpay order.
7. Customer completes payment using Razorpay Checkout.
8. Application displays a processing state.
9. Server verifies the payment.
10. Verified payment updates the order to PAID.
11. Purchase entitlement is created.
12. Automated confirmation email is queued.
13. Customer receives a receipt.
14. Customer can view the order and access eligible purchased resources.

Implement loading, success, failure, cancellation, and retry states.

## 5.3 Currency requirements

The first product is commercially quoted at USD 49.

However, do not assume an India-based Razorpay merchant account can directly accept or settle every currency.

Inspect the Razorpay account configuration and current provider documentation.

Implement one of these compliant approaches:

A. USD checkout, if explicitly supported and enabled.

B. INR checkout using a clearly displayed INR selling price approved by the administrator.

Never silently charge an amount different from the amount shown to the customer.

Never invent an exchange rate.

Persist both the displayed price and actual charged amount with their respective currencies where relevant.

Use integer minor currency units for financial calculations.

# 6. PAYMENT SECURITY AND VERIFICATION

Payment security is a critical requirement.

Implement:

- Server-side Razorpay order creation.
- Checkout signature verification.
- Razorpay webhook signature verification using the raw request body.
- Constant-time signature comparison where appropriate.
- Webhook event deduplication.
- Idempotent payment processing.
- Amount and currency verification.
- Payment-to-order ownership verification.
- Database transactions for critical state changes.
- Protection against replay attacks.
- Proper authentication and authorization.
- Secure error messages.
- Rate limiting for payment initiation.
- Audit logging without exposing secrets.

The server must treat Razorpay as the authoritative payment provider.

A successful browser callback alone must never grant paid access.

Use a durable webhook processing design.

Handle payment events such as successful captures, failed payments, and refunds according to Razorpay's supported event definitions.

Account for duplicate, delayed, and out-of-order webhook deliveries.

Do not downgrade a successfully paid order because a delayed failure event arrives.

Where supported, reconcile ambiguous payment states with Razorpay's server-side API.

# 7. DATABASE DESIGN USING PRISMA

Inspect the existing Prisma schema first.

Extend it carefully with the required models or their equivalents.

Suggested entities:

## Product

- id
- title
- slug
- description
- priceMinor
- currency
- status
- metadata
- createdAt
- updatedAt

## Customer

Reuse the existing user model if suitable.

Support guest checkout only if compatible with the site's authentication and purchase-access model.

Fields may include:

- id
- name
- email
- userId
- createdAt

## Order

- id
- orderNumber
- customerId
- customerEmail
- status
- currency
- totalMinor
- razorpayOrderId
- createdAt
- paidAt

## OrderItem

- id
- orderId
- productId
- productTitleSnapshot
- unitPriceMinor
- currency
- quantity

## Payment

- id
- orderId
- razorpayPaymentId
- razorpayOrderId
- amountMinor
- currency
- status
- paymentMethod
- verifiedAt
- createdAt

## PaymentWebhookEvent

- id
- providerEventId
- eventType
- processingStatus
- receivedAt
- processedAt

## PurchaseEntitlement

- id
- customerId
- orderId
- productId
- status
- grantedAt
- revokedAt

## EmailDelivery

- id
- orderId
- recipient
- emailType
- status
- providerMessageId
- attemptCount
- sentAt

Use appropriate foreign keys, indexes, uniqueness constraints, and relations.

Store immutable price snapshots in order records.

Do not rely on the current product price when displaying historical purchases.

Use Prisma transactions to ensure consistent order and entitlement state.

Ensure the schema works with the actual configured database provider.

# 8. AUTOMATED EMAIL RECEIPTS

This is a mandatory feature.

After successful verified payment, automatically send a professionally designed HTML email.

Use the existing email infrastructure if available.

If none exists, implement a reliable transactional email provider suitable for deployment on Vercel.

Prefer a provider API over unreliable serverless SMTP connections where practical.

Use:

**Sender Name:** Datta Sable

**Preferred Sender:** ds@dattasable.com

Verify that the domain and sender are authorized with the chosen email provider.

Configure SPF, DKIM, and DMARC appropriately without disrupting existing Hostinger email delivery.

## 8.1 Customer receipt email

**Subject:** Payment Confirmed | Your Purchase from Datta Sable

The email must contain:

- Professional branded header
- Personalized customer greeting
- Payment confirmation
- Order number
- Product name
- Payment date
- Amount paid
- Currency
- Payment reference
- Payment status
- Link to purchased resources, when available
- Support contact information
- Refund policy link
- Website link

Use a clean, responsive email design with accessible typography.

Use the website's existing brand identity.

Avoid excessive graphics.

Do not include sensitive card information.

## 8.2 Sample receipt

Dear Lotfi,

Thank you for your purchase!

We have successfully received your payment for the DP-700 Microsoft Fabric Data Engineer Self-Study Package.

Order Number: [Generated Order Number]

Product: DP-700 Self-Study Preparation Package

Amount Paid: [Actual Charged Amount and Currency]

Payment Status: Successful

Payment Date: [Date]

Your learning resources are available through your account once the package is published and access has been enabled.

Thank you for choosing Datta Sable.

Best regards,

Datta Sable  
Data Analytics & Business Intelligence  
ds@dattasable.com  
https://dattasable.com

This is a template only. Replace placeholders with verified order information.

Do not promise immediate access if the package is not available.

## 8.3 Administrator notification

Send a separate notification to the configured administrator email after a successful payment.

Include:

- Customer name
- Customer email
- Product purchased
- Order number
- Payment amount
- Payment reference
- Date
- Order management link

Avoid including unnecessary personal or payment details.

## 8.4 Reliable email delivery

Implement a durable email queue or database-backed outbox.

Email delivery must not block payment verification.

If the email provider is temporarily unavailable:

- Keep the order marked PAID.
- Preserve the pending email job.
- Retry with bounded exponential backoff.
- Avoid duplicate sends using idempotency mechanisms where supported.
- Record failures for administrator review.
- Provide a safe manual resend action.

Do not report an email as delivered merely because it was queued.

# 9. PAYMENT SUCCESS AND FAILURE PAGES

Create or reuse appropriate routes.

Suggested URLs:

/checkout/success

/checkout/failed

/account/orders

/account/purchases

Success page should show:

- Order number
- Verified payment status
- Product purchased
- Amount paid
- Confirmation email status
- Access to purchased resources
- Support link

If webhook verification is still pending, display "Payment processing" instead of prematurely declaring success.

Failure page should provide a safe retry option without duplicating charges.

# 10. CUSTOMER DASHBOARD

Implement a customer purchase area using existing authentication components.

Features:

- My Orders
- My Purchases
- Payment history
- Receipt details
- Purchased learning materials
- Secure downloads
- Order support information

Only the authorized customer and authorized administrators may access order details.

Do not expose purchases using predictable URLs without authorization.

For guest checkout, provide a secure, expiring account-claim or access mechanism.

# 11. SECURE DIGITAL DELIVERY

The system must support future downloadable products.

Requirements:

- Private file storage
- Authenticated download authorization
- Purchase entitlement verification
- Short-lived signed download URLs
- Download activity logs where useful
- Revocation following approved refund rules

Never place paid PDFs in an unrestricted public directory.

Never expose private storage credentials.

Do not create fake product files.

If a product is not ready, prevent checkout until the administrator explicitly enables sales.

# 12. ADMIN PAYMENT MANAGEMENT

Integrate a Payments or Sales module into the existing dattasable.com admin dashboard.

Do not create a duplicate administration system.

Required sections:

**Overview**

- Total paid orders
- Gross sales
- Refunds
- Net sales before provider fees
- Failed payments
- Pending payments
- Recent transactions

**Orders**

- Search and filter orders
- View payment status
- View purchased products
- View customer details
- View Razorpay transaction references
- Resend receipts
- Review delivery status

**Products**

- Create and edit products
- Set prices
- Upload private digital resources
- Publish and unpublish products
- Manage product availability

**Payments**

- View verified transactions
- Inspect failed payments
- Review webhook processing
- Reconcile unresolved transactions

**Refunds**

- Display refund history
- Support authorized refunds only through secure server-side provider APIs
- Require explicit administrator confirmation for any real refund
- Update entitlements according to the configured policy

**Email Logs**

- Sent
- Pending
- Failed
- Retrying

Protect all admin routes with server-side role-based access control.

# 13. REFUND AND POLICY REQUIREMENTS

Integrate the existing website policies where available.

Ensure the checkout provides accessible links to:

- Terms and Conditions
- Privacy Policy
- Refund Policy
- Contact Page
- Digital Product Delivery Policy

Do not invent a legally binding refund policy without administrator approval.

Display the product delivery terms clearly before payment.

Do not describe a payment confirmation as a tax invoice unless the necessary business and tax information is available.

If tax invoices are needed, implement them as a separate configurable feature using verified tax requirements.

# 14. VERCEL DEPLOYMENT

Ensure the implementation works reliably on Vercel.

Requirements:

- Serverless-compatible API routes
- Secure environment variables
- Appropriate runtime configuration
- No dependency on a continuously running local computer
- No in-memory-only payment state
- No background process that disappears when a serverless request ends
- Durable webhook and email processing
- Database-backed persistence
- Correct production webhook URL

Use a durable job mechanism for email retries.

If using Vercel Cron, implement authenticated processing, retry handling, and recovery appropriate to the application's hosting plan.

Never expose secret environment variables through NEXT_PUBLIC_ prefixes.

# 15. TESTING REQUIREMENTS

Implement and execute appropriate tests.

## Payment tests

- Successful test payment
- Failed payment
- Cancelled checkout
- Duplicate checkout callback
- Invalid payment signature
- Invalid webhook signature
- Duplicate webhook event
- Delayed webhook event
- Out-of-order events
- Incorrect amount
- Incorrect currency
- Payment belonging to another order
- Concurrent verification requests
- Refunded payment
- Database failure during processing

## Email tests

- Successful receipt generation
- Correct customer address
- Correct amount and currency
- Correct order number
- Duplicate receipt prevention
- Temporary email provider failure
- Retry processing
- Administrator notification
- Safe manual resend

## Security tests

- Unauthorized access to orders
- Unauthorized access to digital downloads
- Unauthorized access to admin payment endpoints
- Client-side price manipulation
- Forged payment callbacks
- Webhook replay attempts
- Sensitive data leakage

## Regression tests

Ensure existing functionality continues working:

- Homepage
- Portfolio
- Blog
- CMS
- Admin dashboard
- Authentication
- Contact forms
- Existing SEO metadata
- Database operations

Run the project's established linting, type checking, and build checks.

Do not claim tests passed unless they were actually executed.

# 16. IMPLEMENTATION PHASES

Work in this sequence.

**Phase 1 — Repository Audit**

Inspect architecture, dependencies, authentication, database, admin modules, and email infrastructure.

**Phase 2 — Database Foundation**

Implement backward-compatible Prisma models and migrations.

**Phase 3 — Product Catalog**

Implement product administration and the draft DP-700 product.

**Phase 4 — Razorpay Checkout**

Implement secure server-side order creation and customer checkout.

**Phase 5 — Payment Verification**

Implement signature validation, webhook processing, state transitions, and idempotency.

**Phase 6 — Automated Receipts**

Implement branded transactional emails, durable delivery records, retries, and administrator notifications.

**Phase 7 — Customer Access**

Implement order history, purchase entitlements, and secure digital delivery.

**Phase 8 — Admin Dashboard**

Integrate products, orders, payments, refunds, and email logs.

**Phase 9 — Testing**

Execute test-mode payment scenarios, security checks, and regression tests.

**Phase 10 — Production Readiness**

Prepare environment variable instructions, Razorpay dashboard configuration, deployment checklist, and rollback procedure.

# 17. REQUIRED FINAL DELIVERABLES

After implementation, provide:

1. Summary of the existing architecture discovered.
2. List of files created and modified.
3. Prisma schema and migration summary.
4. Razorpay integration explanation.
5. Environment variables required.
6. Exact Razorpay dashboard configuration steps.
7. Webhook URL and required events.
8. Email provider setup instructions.
9. Automated receipt workflow explanation.
10. Admin dashboard functionality.
11. Customer purchase workflow.
12. Test results and remaining risks.
13. Production deployment checklist.
14. Rollback instructions.
15. Outstanding manual configuration steps.

Clearly distinguish completed features from features awaiting credentials, account approval, external configuration, or testing.

# 18. STRICT GO-LIVE REQUIREMENTS

Do not activate live payment processing until all the following are confirmed:

- Razorpay account is activated for the intended business activity.
- International payment acceptance is enabled if needed.
- Checkout currency and actual amount are confirmed.
- Product contents and delivery method are ready.
- Razorpay live credentials are configured securely.
- Production webhook signature verification works.
- Transactional email sender is verified.
- Receipt delivery is tested.
- Customer access authorization is tested.
- Refund and delivery policies are published.
- Administrator approves production activation.

Use Razorpay Test Mode throughout development.

Do not initiate a real payment, issue a real refund, or activate live checkout without explicit administrator approval.

# FINAL INSTRUCTION TO CODEX

Build this as a maintainable, extensible, secure digital commerce module within the existing dattasable.com architecture.

Do not build a separate website.

Do not introduce unnecessary services.

Do not disrupt existing production functionality.

Prioritize payment integrity, reliable email receipts, data consistency, security, and a professional customer experience.

Start by inspecting the repository and reporting the implementation plan. Then implement in small, verifiable phases.

The end result should allow the administrator to publish a digital product, accept an authorized Razorpay payment, verify it securely, record the transaction, send an automated email receipt, and grant the customer appropriate access to purchased resources.

**Do not declare the system production-ready until the critical payment, security, and email tests have passed.**
