-- CreateTable
CREATE TABLE "CommerceProduct" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "image" TEXT,
    "priceMinor" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "salesEnabled" BOOLEAN NOT NULL DEFAULT false,
    "deliveryReady" BOOLEAN NOT NULL DEFAULT false,
    "features" TEXT[],
    "includedResources" TEXT[],
    "deliveryMethod" TEXT NOT NULL DEFAULT 'ACCOUNT_DOWNLOAD',
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "CommerceProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommerceResource" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "pathname" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CommerceResource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommerceOrder" (
    "id" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "userId" TEXT,
    "customerEmail" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "requestKey" TEXT NOT NULL,
    "mode" TEXT NOT NULL DEFAULT 'test',
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "totalMinor" INTEGER NOT NULL,
    "currency" TEXT NOT NULL,
    "displayedMinor" INTEGER NOT NULL,
    "displayedCurrency" TEXT NOT NULL,
    "razorpayOrderId" TEXT,
    "lastError" TEXT,
    "paidAt" TIMESTAMPTZ(6),
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "CommerceOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommerceOrderItem" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "unitPriceMinor" INTEGER NOT NULL,
    "currency" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "CommerceOrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommercePayment" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "amountMinor" INTEGER NOT NULL,
    "currency" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "method" TEXT,
    "verifiedAt" TIMESTAMPTZ(6),
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CommercePayment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommerceRefund" (
    "id" TEXT NOT NULL,
    "paymentId" TEXT NOT NULL,
    "requestKey" TEXT NOT NULL,
    "providerId" TEXT,
    "amountMinor" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "reason" TEXT NOT NULL,
    "actorId" TEXT,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "CommerceRefund_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommerceWebhook" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "nextAttemptAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "leaseUntil" TIMESTAMPTZ(6),
    "leaseOwner" TEXT,
    "lastError" TEXT,
    "receivedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processedAt" TIMESTAMPTZ(6),

    CONSTRAINT "CommerceWebhook_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommerceEntitlement" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "grantedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revokedAt" TIMESTAMPTZ(6),

    CONSTRAINT "CommerceEntitlement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommerceEmail" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "dedupeKey" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "recipient" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "providerId" TEXT,
    "lastError" TEXT,
    "nextAttemptAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "leaseUntil" TIMESTAMPTZ(6),
    "leaseOwner" TEXT,
    "firstAttemptAt" TIMESTAMPTZ(6),
    "acceptedAt" TIMESTAMPTZ(6),
    "deliveredAt" TIMESTAMPTZ(6),
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CommerceEmail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommerceDownload" (
    "id" TEXT NOT NULL,
    "resourceId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CommerceDownload_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommerceLimit" (
    "key" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 1,
    "expiresAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "CommerceLimit_pkey" PRIMARY KEY ("key")
);

-- CreateIndex
CREATE UNIQUE INDEX "CommerceProduct_slug_key" ON "CommerceProduct"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "CommerceResource_pathname_key" ON "CommerceResource"("pathname");

-- CreateIndex
CREATE INDEX "CommerceResource_productId_active_idx" ON "CommerceResource"("productId", "active");

-- CreateIndex
CREATE UNIQUE INDEX "CommerceOrder_number_key" ON "CommerceOrder"("number");

-- CreateIndex
CREATE UNIQUE INDEX "CommerceOrder_requestKey_key" ON "CommerceOrder"("requestKey");

-- CreateIndex
CREATE UNIQUE INDEX "CommerceOrder_razorpayOrderId_key" ON "CommerceOrder"("razorpayOrderId");

-- CreateIndex
CREATE INDEX "CommerceOrder_userId_createdAt_idx" ON "CommerceOrder"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "CommerceOrder_status_createdAt_idx" ON "CommerceOrder"("status", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "CommerceOrderItem_orderId_productId_key" ON "CommerceOrderItem"("orderId", "productId");

-- CreateIndex
CREATE UNIQUE INDEX "CommercePayment_providerId_key" ON "CommercePayment"("providerId");

-- CreateIndex
CREATE INDEX "CommercePayment_orderId_idx" ON "CommercePayment"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "CommerceRefund_requestKey_key" ON "CommerceRefund"("requestKey");

-- CreateIndex
CREATE UNIQUE INDEX "CommerceRefund_providerId_key" ON "CommerceRefund"("providerId");

-- CreateIndex
CREATE UNIQUE INDEX "CommerceWebhook_eventId_key" ON "CommerceWebhook"("eventId");

-- CreateIndex
CREATE INDEX "CommerceWebhook_status_nextAttemptAt_idx" ON "CommerceWebhook"("status", "nextAttemptAt");

-- CreateIndex
CREATE UNIQUE INDEX "CommerceEntitlement_orderId_productId_key" ON "CommerceEntitlement"("orderId", "productId");

-- CreateIndex
CREATE UNIQUE INDEX "CommerceEmail_dedupeKey_key" ON "CommerceEmail"("dedupeKey");

-- CreateIndex
CREATE INDEX "CommerceEmail_status_nextAttemptAt_idx" ON "CommerceEmail"("status", "nextAttemptAt");

-- AddForeignKey
ALTER TABLE "CommerceResource" ADD CONSTRAINT "CommerceResource_productId_fkey" FOREIGN KEY ("productId") REFERENCES "CommerceProduct"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommerceOrder" ADD CONSTRAINT "CommerceOrder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommerceOrderItem" ADD CONSTRAINT "CommerceOrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "CommerceOrder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommerceOrderItem" ADD CONSTRAINT "CommerceOrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "CommerceProduct"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommercePayment" ADD CONSTRAINT "CommercePayment_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "CommerceOrder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommerceRefund" ADD CONSTRAINT "CommerceRefund_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "CommercePayment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommerceEntitlement" ADD CONSTRAINT "CommerceEntitlement_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "CommerceOrder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommerceEntitlement" ADD CONSTRAINT "CommerceEntitlement_productId_fkey" FOREIGN KEY ("productId") REFERENCES "CommerceProduct"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommerceEmail" ADD CONSTRAINT "CommerceEmail_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "CommerceOrder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommerceDownload" ADD CONSTRAINT "CommerceDownload_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES "CommerceResource"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
-- Financial invariants are enforced independently of browser and application validation.
ALTER TABLE "CommerceProduct" ADD CONSTRAINT "commerce_product_price_positive" CHECK ("priceMinor" > 0), ADD CONSTRAINT "commerce_product_currency" CHECK (currency IN ('USD','INR'));
ALTER TABLE "CommerceOrder" ADD CONSTRAINT "commerce_order_amount_positive" CHECK ("totalMinor" > 0 AND "displayedMinor" > 0), ADD CONSTRAINT "commerce_order_test_only" CHECK (mode = 'test');
ALTER TABLE "CommerceOrderItem" ADD CONSTRAINT "commerce_item_amount_positive" CHECK ("unitPriceMinor" > 0 AND quantity = 1);
ALTER TABLE "CommercePayment" ADD CONSTRAINT "commerce_payment_amount_positive" CHECK ("amountMinor" > 0);
ALTER TABLE "CommerceRefund" ADD CONSTRAINT "commerce_refund_amount_positive" CHECK ("amountMinor" > 0);
