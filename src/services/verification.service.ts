// import {prisma} from "../config/database";
// import { VerificationStatus } from "@prisma/client";

// export const getVerificationsService = () => {
//   return prisma.verification.findMany({
//     include: { borrower: true },
//   });
// };

// export const createVerificationService = (data: any) => {
//   return prisma.verification.create({
//     data: {
//       ...data,
//       status: VerificationStatus.PENDING,
//     },
//   });
// };

// export const updateVerificationService = (id: string, data: any) => {
//   return prisma.verification.update({
//     where: { id },
//     data,
//   });
// };

// export const deleteVerificationService = (id: string) => {
//   return prisma.verification.delete({
//     where: { id },
//   });
// };


import { prisma } from "../config/database";
import { VerificationStatus, VerificationType } from "@prisma/client";
import { mockAadhaarVerification } from "../utils/aadhaar.util";

// ✅ GET ALL
export const getVerificationsService = () => {
  return prisma.verification.findMany({
    include: { borrower: true },
  });
};

// ✅ CREATE
export const createVerificationService = async (data: any) => {
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

  // Aadhaar static verification
  if (data.type === VerificationType.AADHAAR) {
    const result = mockAadhaarVerification(data.aadhaarNumber);

    return prisma.verification.update({
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
  }

  return verification;
};

// ✅ UPDATE
export const updateVerificationService = (id: string, data: any) => {
  return prisma.verification.update({
    where: { id },
    data,
  });
};

// ✅ DELETE
export const deleteVerificationService = (id: string) => {
  return prisma.verification.delete({
    where: { id },
  });
};
