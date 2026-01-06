

// import { prisma } from "../config/database";
// import { VerificationStatus, VerificationType } from "@prisma/client";
// import { mockAadhaarVerification } from "../utils/aadhaar.util";

// // ✅ GET ALL
// export const getVerificationsService = () => {
//   return prisma.verification.findMany({
//     include: { borrower: true },
//   });
// };

// // ✅ CREATE
// export const createVerificationService = async (data: any) => {
//   const verification = await prisma.verification.create({
//     data: {
//       borrowerId: data.borrowerId,
//       type: data.type,
//       provider: "MOCK",
//       requestedBy: data.requestedBy,
//       priority: data.priority,
//       status: VerificationStatus.PENDING,
//     },
//   });

//   // Aadhaar static verification
//   if (data.type === VerificationType.AADHAAR) {
//     const result = mockAadhaarVerification(data.aadhaarNumber);

//     return prisma.verification.update({
//       where: { id: verification.id },
//       data: {
//         status:
//           result.status === "VERIFIED"
//             ? VerificationStatus.VERIFIED
//             : VerificationStatus.FAILED,
//         result,
//         completedAt: new Date(),
//         verifiedBy: "SYSTEM",
//       },
//     });
//   }

//   return verification;
// };

// // ✅ UPDATE
// export const updateVerificationService = (id: string, data: any) => {
//   return prisma.verification.update({
//     where: { id },
//     data,
//   });
// };

// // ✅ DELETE
// export const deleteVerificationService = (id: string) => {
//   return prisma.verification.delete({
//     where: { id },
//   });
// };



import { prisma } from "../config/database";
import { VerificationStatus, VerificationType } from "@prisma/client";

import { verifyKYC } from "../utils/aadhaar.util";
import { auditLogService } from "./auditLogService";

// ===============================
// GET ALL VERIFICATIONS
// ===============================
export const getVerificationsService = () => {
  return prisma.verification.findMany({
    include: { borrower: true },
  });
};

// ===============================
// CREATE VERIFICATION
// ===============================
export const createVerificationService = async (data: any) => {
  // 1️⃣ Create initial verification request
  const verification = await prisma.verification.create({
    data: {
      borrowerId: data.borrowerId,
      type: data.type,
      provider: "MOCK",
      requestedBy: data.requestedBy,
      priority: data.priority,
      status: VerificationStatus.PENDING,
    },
  });

  // 2️⃣ Run mock KYC verification
  let result;

  switch (data.type) {
    case VerificationType.AADHAAR:
      result = verifyKYC("AADHAAR", { aadhaar: data.aadhaarNumber });
      break;

    case VerificationType.PAN:
      result = verifyKYC("PAN", { pan: data.panNumber });
      break;

    case VerificationType.DL:
      result = verifyKYC("DRIVING_LICENSE", { dl: data.licenseNumber });
      break;

    case VerificationType.PHONE:
      result = verifyKYC("MOBILE", { mobile: data.mobileNumber });
      break;

    case VerificationType.BANK:
      result = verifyKYC("BANK", {
        accountNumber: data.accountNumber,
        ifsc: data.ifsc,
      });
      break;

    case VerificationType.VOTER:
      result = verifyKYC("VOTER_ID", { voterId: data.voterId });
      break;

    default:
      result = {
        status: "FAILED",
        reason: "Unsupported verification type",
      };
  }

  // 3️⃣ Update verification record
  const finalVerification = await prisma.verification.update({
    where: { id: verification.id },
    data: {
      status:
        result.status === "VERIFIED"
          ? VerificationStatus.VERIFIED
          : VerificationStatus.FAILED,
      result,
      completedAt: new Date(),
      verifiedBy: "SYSTEM",
    },
  });

  await auditLogService.createLog({
    borrowerId: finalVerification.borrowerId,
    module: "VERIFICATION",
    action: "CREATE",
    details: `Verification ${finalVerification.type} requested. Result: ${finalVerification.status}`,
    status: "SUCCESS",
    actorId: "SYSTEM",
  });

  return finalVerification;
};

// ===============================
// UPDATE VERIFICATION
// ===============================
// UPDATE VERIFICATION
export const updateVerificationService = async (id: string, data: any) => {
  const updatedVerification = await prisma.verification.update({
    where: { id },
    data,
  });

  await auditLogService.createLog({
    borrowerId: updatedVerification.borrowerId,
    module: "VERIFICATION",
    action: "UPDATE",
    details: `Verification ${id} updated`,
    status: "SUCCESS",
    actorId: "SYSTEM",
  });

  return updatedVerification;
};

// ===============================
// DELETE VERIFICATION
// ===============================
// DELETE VERIFICATION
export const deleteVerificationService = async (id: string) => {
  const deletedVerification = await prisma.verification.delete({
    where: { id },
  });

  await auditLogService.createLog({
    borrowerId: deletedVerification.borrowerId,
    module: "VERIFICATION",
    action: "DELETE",
    details: `Verification ${id} deleted`,
    status: "SUCCESS",
    actorId: "SYSTEM",
  });

  return deletedVerification;
};
