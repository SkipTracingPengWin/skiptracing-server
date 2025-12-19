export const isValidAadhaarFormat = (aadhaar: string) => {
  return /^[2-9]{1}[0-9]{11}$/.test(aadhaar);
};

export const mockAadhaarVerification = (aadhaar: string) => {
  if (!isValidAadhaarFormat(aadhaar)) {
    return {
      status: "FAILED",
      reason: "Invalid Aadhaar format",
    };
  }

  // Dummy rule for testing
  if (aadhaar.endsWith("0")) {
    return {
      status: "FAILED",
      reason: "Aadhaar not found",
    };
  }

  return {
    status: "VERIFIED",
    data: {
      name: "Test User",
      gender: "M",
      dob: "1996-05-12",
      maskedAadhaar: `XXXX-XXXX-${aadhaar.slice(-4)}`,
    },
  };
};
