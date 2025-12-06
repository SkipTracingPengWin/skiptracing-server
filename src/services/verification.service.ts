import {prisma} from "../config/database";
import { VerificationStatus } from "@prisma/client";

export const getVerificationsService = () => {
  return prisma.verification.findMany({
    include: { borrower: true },
  });
};

export const createVerificationService = (data: any) => {
  return prisma.verification.create({
    data: {
      ...data,
      status: VerificationStatus.PENDING,
    },
  });
};

export const updateVerificationService = (id: string, data: any) => {
  return prisma.verification.update({
    where: { id },
    data,
  });
};

export const deleteVerificationService = (id: string) => {
  return prisma.verification.delete({
    where: { id },
  });
};
