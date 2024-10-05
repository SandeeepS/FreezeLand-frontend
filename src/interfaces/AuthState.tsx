export interface AuthState {
    adminData: AdminDataType | null;
    userData: UserDataType | null;
    mechData: MechDataType | null;
    user: UserAddressType | null;
    mech: MechAddressType | null;
  }
  
  // Define the actual types for AdminDataType, UserDataType, MechDataType, etc.
  // Example:

  
  interface AdminDataType {
    id: string;
    name: string;
  }
  
  interface UserDataType {
    id: string;
    name: string;
  }
  
  interface MechDataType {
    id: string;
    name: string;
  }
  
  interface UserAddressType {
    city: string;
    state: string;
  }
  
  interface MechAddressType {
    city: string;
    state: string;
  }
  