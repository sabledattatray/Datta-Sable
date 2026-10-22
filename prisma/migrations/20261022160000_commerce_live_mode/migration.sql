-- Allow both 'test' and 'live' modes for CommerceOrder
ALTER TABLE "CommerceOrder" DROP CONSTRAINT IF EXISTS "commerce_order_test_only";
ALTER TABLE "CommerceOrder" ADD CONSTRAINT "commerce_order_mode_valid" CHECK (mode IN ('test', 'live'));
