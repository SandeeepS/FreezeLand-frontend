import { IUserData } from "../../IUserData";

//used in AdminDeviceListing.tsx
export interface DeviceData {
  _id: string;
  name: string;
  isBlocked: boolean;
  isDeleted: boolean;
}

//used in AdminLoginpage.tsx
export interface initialVal {
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
  _id?: string;
  name: string;
  discription: string[];
  serviceCharge: number;
  imageKey: string;
}

export interface ICompliantData {
  _id: string;
  name: string;
  image: [];
  serviceId: string;
  userId: string;
  defaultAddress: string;
  discription: string;
  locationName: {
    address: string;
    latitude: number;
    longitude: number;
  };
  status: string;
  currentMechanicId: string;
  acceptedAt: Date | null;
  workHistory: [
    {
      mechanicId: string;
      status: string;
      reason: string | null;
      canceledAt: string | null;
      _id: string;
    }
  ];
  workDetails: [
    {
      addedAt: string;
      amount: number;
      description: string;
      _id: string;
    }
  ];
  serviceDetails: [
    {
      name: string;
      serviceCharge: number;
      discription: string[];
      imageKey?: string;
      _id: string;
    }
  ];
  userDetails: {
    profile_picture?: string;
    email: string;
    phone: string;
    role?: string;
    isBlocked?: boolean;
  };
  chatId?: string;
  isBlocked: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  defaultAddressDetails: {
    name: string;
    email: string;
    phone: number;
    district: string;
    state: string;
    pin: number;
    landMark: string;
  };
}
