
//used in AdminDeviceListing.tsx
export interface DeviceData {
  _id: string;
  name: string;
  isBlocked: boolean;
  isDeleted: boolean;
}

//used in AdminLoginpage.tsx
export interface initialVal{
    email: string;
    password: string;
}

//used in AdminMechListing
export interface MechData {
  _id: string;
  name: string;
  email: string;
  isBlocked: boolean;
  isDeleted: boolean;
}

//used in AdminServices.tsx
export interface ServiceData {
  _id: string;
  name: string;
  discription: string;
  status: boolean;
  isDeleted: boolean;
}

//used in AdminUserListing
export interface UserData {
  _id: string;
  name: string;
  email: string;
  isBlocked: boolean;
  isDeleted: boolean;
}

//used in EditService.tsx and NewServices.tsx
export interface InewService {
  _id: string;
  name: string;
  discription: string[];
  serviceCharge: number;
  imageKey: string;
}






  