export interface AuthState {
    adminData: AdminDataType | null;
    userData: UserDataType | null ;
    mechData: MechDataType | null;
    user: UserAddressType | null; //chck this is using , if not remove later
    mech: MechAddressType | null; //chck this is using , if not remove later
  }


  interface AdminDataType {
    id: string;
    name: string;
    email:string;
  }
  
  interface UserDataType {
    id: string;
    name: string;
    email:string;
  }
  
  interface MechDataType {
  id:string;
  name: string;
  email: string;
  }
  
  interface UserAddressType {
    city: string;
    state: string;
  }
  
  interface MechAddressType {
    city: string;
    state: string;
  }
  