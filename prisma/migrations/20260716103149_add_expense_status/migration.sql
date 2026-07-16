-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PAID', 'UNPAID');

-- AlterTable
ALTER TABLE "Expense" ADD COLUMN     "status" "PaymentStatus" NOT NULL DEFAULT 'UNPAID';
