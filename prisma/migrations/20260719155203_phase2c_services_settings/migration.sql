-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "tax" DECIMAL(10,2) NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Quote" ADD COLUMN     "assignedToId" TEXT,
ADD COLUMN     "currency" TEXT NOT NULL DEFAULT 'USD',
ADD COLUMN     "deliveredAt" TIMESTAMP(3),
ADD COLUMN     "execStatus" TEXT NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "invoiceNumber" TEXT,
ADD COLUMN     "paidAt" TIMESTAMP(3),
ADD COLUMN     "paymentMethod" TEXT,
ADD COLUMN     "paymentRef" TEXT,
ADD COLUMN     "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "startedAt" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "Quote_invoiceNumber_key" ON "Quote"("invoiceNumber");

-- CreateIndex
CREATE INDEX "Quote_execStatus_idx" ON "Quote"("execStatus");

-- CreateIndex
CREATE INDEX "Quote_assignedToId_idx" ON "Quote"("assignedToId");

-- AddForeignKey
ALTER TABLE "Quote" ADD CONSTRAINT "Quote_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

