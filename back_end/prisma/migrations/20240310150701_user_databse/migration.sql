-- CreateEnum
CREATE TYPE "Role" AS ENUM ('Client', 'Collaborateur');

-- CreateEnum
CREATE TYPE "Statut" AS ENUM ('Actif', 'Inactif');

-- CreateTable
CREATE TABLE "Project" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "client" TEXT NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "URS" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "processType" TEXT NOT NULL,
    "criticalityClient" TEXT NOT NULL,
    "criticalityVSI" TEXT NOT NULL,
    "projectId" INTEGER NOT NULL,
    "auditTrailId" TEXT NOT NULL,

    CONSTRAINT "URS_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CategoryStep" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "URSId" TEXT,

    CONSTRAINT "CategoryStep_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Step" (
    "name" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3),
    "updatedBy" TEXT,
    "URSId" TEXT NOT NULL,

    CONSTRAINT "Step_pkey" PRIMARY KEY ("URSId","name")
);

-- CreateTable
CREATE TABLE "SupplierResponse" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "statut" BOOLEAN NOT NULL DEFAULT false,
    "answer" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "customTmpsDev" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "customCost" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "customApprouved" BOOLEAN NOT NULL DEFAULT false,
    "URSId" TEXT NOT NULL,

    CONSTRAINT "SupplierResponse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditTrail" (
    "id" TEXT NOT NULL,
    "consultation" BOOLEAN NOT NULL,
    "consultationComment" TEXT NOT NULL,
    "revue" BOOLEAN NOT NULL,
    "revueComment" TEXT NOT NULL,

    CONSTRAINT "AuditTrail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Risk" (
    "id" TEXT NOT NULL,
    "deficiencyDescription" TEXT NOT NULL,
    "riskClass" TEXT NOT NULL,
    "consequence" TEXT NOT NULL,
    "impact" INTEGER NOT NULL,
    "riskResidueLevel" TEXT NOT NULL,
    "comment" TEXT NOT NULL,
    "actionPlanId" TEXT NOT NULL,
    "URSId" TEXT NOT NULL,

    CONSTRAINT "Risk_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Test" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "documentation" TEXT NOT NULL,
    "comments" TEXT NOT NULL,
    "riskId" TEXT,

    CONSTRAINT "Test_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cause" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "probability" INTEGER NOT NULL,
    "riskId" TEXT,

    CONSTRAINT "Cause_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActionPlan" (
    "id" TEXT NOT NULL,
    "qiqo" BOOLEAN NOT NULL,
    "documentation" BOOLEAN NOT NULL,
    "datamigration" BOOLEAN NOT NULL,
    "revueConfig" BOOLEAN NOT NULL,
    "qp" BOOLEAN NOT NULL,

    CONSTRAINT "ActionPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "surname" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "employer_name" TEXT NOT NULL,
    "employer_phone" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "statut" "Statut" NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "URS_auditTrailId_key" ON "URS"("auditTrailId");

-- CreateIndex
CREATE UNIQUE INDEX "Risk_actionPlanId_key" ON "Risk"("actionPlanId");

-- AddForeignKey
ALTER TABLE "URS" ADD CONSTRAINT "URS_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "URS" ADD CONSTRAINT "URS_auditTrailId_fkey" FOREIGN KEY ("auditTrailId") REFERENCES "AuditTrail"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoryStep" ADD CONSTRAINT "CategoryStep_URSId_fkey" FOREIGN KEY ("URSId") REFERENCES "URS"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Step" ADD CONSTRAINT "Step_URSId_fkey" FOREIGN KEY ("URSId") REFERENCES "URS"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupplierResponse" ADD CONSTRAINT "SupplierResponse_URSId_fkey" FOREIGN KEY ("URSId") REFERENCES "URS"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Risk" ADD CONSTRAINT "Risk_actionPlanId_fkey" FOREIGN KEY ("actionPlanId") REFERENCES "ActionPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Risk" ADD CONSTRAINT "Risk_URSId_fkey" FOREIGN KEY ("URSId") REFERENCES "URS"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Test" ADD CONSTRAINT "Test_riskId_fkey" FOREIGN KEY ("riskId") REFERENCES "Risk"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cause" ADD CONSTRAINT "Cause_riskId_fkey" FOREIGN KEY ("riskId") REFERENCES "Risk"("id") ON DELETE SET NULL ON UPDATE CASCADE;
