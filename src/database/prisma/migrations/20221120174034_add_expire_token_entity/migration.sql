-- CreateTable
CREATE TABLE "ExpiredToken" (
    "id" SERIAL NOT NULL,
    "token" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expire_at" TIMESTAMP(0) NOT NULL,

    CONSTRAINT "ExpiredToken_pkey" PRIMARY KEY ("id")
);
