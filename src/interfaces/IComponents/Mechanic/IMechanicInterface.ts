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


export interface AddressDetails {
  district: string;
  state: string;
  pin: string;
  landMark: string;
}

export interface MechDetails {
  name: string;
  email: string;
  phone: number | string;
  address?: string;
  location?: string;
  profile_picture?:string;
  defaultAddressDetails:AddressDetails;
  
}

export interface MechDetails2{
    name: string;
  email: string;
  phone: number | string;
  address?: string;
  location?: string;
  photo?:string;
  defaultAddressDetails:AddressDetails;
}

export interface editMechDetails {
  name: string;
  phone: string;
  email: string;
  photo: string;
  mechanicType: string[];
  isVerified: boolean;
  adharProof: string;
  employeeLicense: string;
}

