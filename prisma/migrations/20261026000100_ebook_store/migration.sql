-- AlterTable
ALTER TABLE "CommerceOrderItem" ADD COLUMN     "resourceIdSnapshot" TEXT;

-- CreateTable
-- Additive only: preserve existing products, orders, payments and customer records.
CREATE TABLE "EbookProfile" (
    "productId" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "author" TEXT NOT NULL DEFAULT 'Datta Sable',
    "edition" TEXT NOT NULL,
    "pageCount" INTEGER NOT NULL,
    "language" TEXT NOT NULL DEFAULT 'English',
    "version" TEXT NOT NULL DEFAULT '1.0',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "approved" BOOLEAN NOT NULL DEFAULT false,
    "contents" TEXT[],
    "outcomes" TEXT[],
    "audience" TEXT[],
    "prerequisites" TEXT[],
    "notIncluded" TEXT[],
    "license" TEXT NOT NULL DEFAULT 'Personal use only. Redistribution is not permitted.',
    "updatePolicy" TEXT NOT NULL DEFAULT 'Access includes the purchased edition. Future editions are not included unless stated.',

    CONSTRAINT "EbookProfile_pkey" PRIMARY KEY ("productId")
);

-- CreateTable
CREATE TABLE "EbookCategory" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "icon" TEXT NOT NULL DEFAULT 'BookOpen',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "seoTitle" TEXT,
    "seoDescription" TEXT,

    CONSTRAINT "EbookCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EbookCategoryLink" (
    "productId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "EbookCategoryLink_pkey" PRIMARY KEY ("productId","categoryId")
);

-- CreateTable
CREATE TABLE "EbookAsset" (
    "resourceId" TEXT NOT NULL,
    "sha256" TEXT NOT NULL,
    "byteSize" INTEGER NOT NULL,
    "filename" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL DEFAULT 'application/pdf',
    "version" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EbookAsset_pkey" PRIMARY KEY ("resourceId")
);

-- CreateTable
CREATE TABLE "EbookAccessToken" (
    "hash" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "expiresAt" TIMESTAMPTZ(6) NOT NULL,
    "consumedAt" TIMESTAMPTZ(6),
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EbookAccessToken_pkey" PRIMARY KEY ("hash")
);

-- CreateTable
CREATE TABLE "EbookDownloadGrant" (
    "hash" TEXT NOT NULL,
    "entitlementId" TEXT NOT NULL,
    "expiresAt" TIMESTAMPTZ(6) NOT NULL,
    "usedCount" INTEGER NOT NULL DEFAULT 0,
    "maxUses" INTEGER NOT NULL DEFAULT 3,
    "revokedAt" TIMESTAMPTZ(6),
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EbookDownloadGrant_pkey" PRIMARY KEY ("hash")
);

-- CreateTable
CREATE TABLE "EbookAccessMail" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "nextAttemptAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "leaseUntil" TIMESTAMPTZ(6),
    "lastError" TEXT,
    "providerId" TEXT,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EbookAccessMail_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EbookProfile_sku_key" ON "EbookProfile"("sku");

-- CreateIndex
CREATE UNIQUE INDEX "EbookCategory_slug_key" ON "EbookCategory"("slug");

-- CreateIndex
CREATE INDEX "EbookCategoryLink_categoryId_idx" ON "EbookCategoryLink"("categoryId");

-- CreateIndex
CREATE INDEX "EbookAccessToken_email_kind_idx" ON "EbookAccessToken"("email", "kind");

-- CreateIndex
CREATE INDEX "EbookAccessToken_expiresAt_idx" ON "EbookAccessToken"("expiresAt");

-- CreateIndex
CREATE INDEX "EbookDownloadGrant_entitlementId_idx" ON "EbookDownloadGrant"("entitlementId");

-- CreateIndex
CREATE INDEX "EbookDownloadGrant_expiresAt_idx" ON "EbookDownloadGrant"("expiresAt");

-- CreateIndex
CREATE INDEX "EbookAccessMail_status_nextAttemptAt_idx" ON "EbookAccessMail"("status", "nextAttemptAt");

-- AddForeignKey
ALTER TABLE "EbookProfile" ADD CONSTRAINT "EbookProfile_productId_fkey" FOREIGN KEY ("productId") REFERENCES "CommerceProduct"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EbookCategoryLink" ADD CONSTRAINT "EbookCategoryLink_productId_fkey" FOREIGN KEY ("productId") REFERENCES "EbookProfile"("productId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EbookCategoryLink" ADD CONSTRAINT "EbookCategoryLink_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "EbookCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EbookAsset" ADD CONSTRAINT "EbookAsset_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES "CommerceResource"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EbookDownloadGrant" ADD CONSTRAINT "EbookDownloadGrant_entitlementId_fkey" FOREIGN KEY ("entitlementId") REFERENCES "CommerceEntitlement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Database-level invariants supplement API validation.
ALTER TABLE "EbookProfile" ADD CONSTRAINT "ebook_page_count_positive" CHECK ("pageCount" > 0);
ALTER TABLE "EbookAsset" ADD CONSTRAINT "ebook_asset_integrity" CHECK ("byteSize" > 0 AND "sha256" ~ '^[a-f0-9]{64}$' AND "mimeType" = 'application/pdf');
ALTER TABLE "EbookAccessToken" ADD CONSTRAINT "ebook_access_hash" CHECK (hash ~ '^[a-f0-9]{64}$' AND kind IN ('LINK','SESSION'));
ALTER TABLE "EbookDownloadGrant" ADD CONSTRAINT "ebook_grant_limits" CHECK (hash ~ '^[a-f0-9]{64}$' AND "usedCount" >= 0 AND "maxUses" > 0 AND "usedCount" <= "maxUses");
CREATE UNIQUE INDEX "ebook_one_primary_category" ON "EbookCategoryLink"("productId") WHERE "isPrimary" = true;
