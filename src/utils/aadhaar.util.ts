
type VerificationResult =
  | { status: "VERIFIED"; data: any }
  | { status: "FAILED"; reason: string };

// ===============================
// Aadhaar
// ===============================
export const isValidAadhaarFormat = (aadhaar: string): boolean =>
  /^[2-9]{1}[0-9]{11}$/.test(aadhaar);

export const verifyAadhaar = (aadhaar: string): VerificationResult => {
  if (!isValidAadhaarFormat(aadhaar)) {
    return { status: "FAILED", reason: "Invalid Aadhaar format" };
  }

  if (aadhaar.endsWith("0")) {
    return { status: "FAILED", reason: "Aadhaar not found" };
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

// ===============================
// PAN
// ===============================
export const isValidPANFormat = (pan: string): boolean =>
  /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(pan);

export const verifyPAN = (pan: string): VerificationResult => {
  if (!isValidPANFormat(pan)) {
    return { status: "FAILED", reason: "Invalid PAN format" };
  }

  if (pan.endsWith("Z")) {
    return { status: "FAILED", reason: "PAN not found" };
  }

  return {
    status: "VERIFIED",
    data: {
      name: "Test User",
      pan,
      category: "Individual",
    },
  };
};

// ===============================
// Driving License
// ===============================
export const isValidDLFormat = (dl: string): boolean =>
  /^[A-Z]{2}[0-9]{13,15}$/.test(dl);

export const verifyDrivingLicense = (dl: string): VerificationResult => {
  if (!isValidDLFormat(dl)) {
    return { status: "FAILED", reason: "Invalid Driving License format" };
  }

  return {
    status: "VERIFIED",
    data: {
      name: "Test User",
      licenseNumber: dl,
      validTill: "2035-12-31",
      vehicleClass: ["MCWG", "LMV"],
    },
  };
};

// ===============================
// Mobile
// ===============================
export const isValidMobileFormat = (mobile: string): boolean =>
  /^[6-9][0-9]{9}$/.test(mobile);

export const verifyMobile = (mobile: string): VerificationResult => {
  if (!isValidMobileFormat(mobile)) {
    return { status: "FAILED", reason: "Invalid mobile number" };
  }

  if (mobile.endsWith("0000")) {
    return { status: "FAILED", reason: "Mobile number not reachable" };
  }

  return {
    status: "VERIFIED",
    data: {
      mobile,
      carrier: "Jio",
      verifiedVia: "OTP",
    },
  };
};

// ===============================
// Bank Account
// ===============================
export const isValidBankDetails = (
  accountNumber: string,
  ifsc: string
): boolean =>
  /^[0-9]{9,18}$/.test(accountNumber) &&
  /^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc);

export const verifyBankAccount = (
  accountNumber: string,
  ifsc: string
): VerificationResult => {
  if (!isValidBankDetails(accountNumber, ifsc)) {
    return { status: "FAILED", reason: "Invalid bank details" };
  }

  return {
    status: "VERIFIED",
    data: {
      accountHolderName: "Test User",
      maskedAccount: `XXXXXX${accountNumber.slice(-4)}`,
      bankName: "State Bank of India",
      ifsc,
    },
  };
};

// ===============================
// Voter ID
// ===============================
export const isValidVoterIdFormat = (voterId: string): boolean =>
  /^[A-Z]{3}[0-9]{7}$/.test(voterId);

export const verifyVoterId = (voterId: string): VerificationResult => {
  if (!isValidVoterIdFormat(voterId)) {
    return { status: "FAILED", reason: "Invalid Voter ID format" };
  }

  return {
    status: "VERIFIED",
    data: {
      name: "Test User",
      voterId,
      constituency: "Chennai South",
    },
  };
};

// ===============================
// Unified KYC Verifier
// ===============================
export const verifyKYC = (type: string, payload: any): VerificationResult => {
  switch (type) {
    case "AADHAAR":
      return verifyAadhaar(payload.aadhaar);

    case "PAN":
      return verifyPAN(payload.pan);

    case "DRIVING_LICENSE":
      return verifyDrivingLicense(payload.dl);

    case "MOBILE":
      return verifyMobile(payload.mobile);

    case "BANK":
      return verifyBankAccount(payload.accountNumber, payload.ifsc);

    case "VOTER_ID":
      return verifyVoterId(payload.voterId);

    default:
      return { status: "FAILED", reason: "Unsupported KYC type" };
  }
};
