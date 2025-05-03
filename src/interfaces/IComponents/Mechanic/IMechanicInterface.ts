//used in AssignedWorks.tsx
export interface MechanicData {
  _id: string;
  name: string;
  email: string;
  phone: number;
  password: string;
  role: "mechanic";
  photo: string;
  adharProof: string | null; // Ensure this matches the backend type
  employeeLicense: string;
  isBlocked: boolean;
  isDeleted: boolean;
  isVerified: boolean;
  mechanicType: string[]; // Assuming these are ObjectId strings
  __v: number;
}

export interface MechDetails {
  name: string;
  email: string;
  phone: number | string;
  address?: string;
  location?: string;
  profile_picture?:string;
  defaultAddressDetails:object;
  
}

