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
  image: string[]; 
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
  currentMechanicId: string | null;
  acceptedAt: Date | null;

  serviceDetails: Array<{
    _id: string;
    name: string;
    imageKey: string;
    discription: string[];
    serviceCharge: number;
    createdAt?: Date; // optional since not in response
    isBlocked: boolean;
    isDeleted: boolean;
  }>;

  userDetails: {
    _id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    profile_picture: string;
    isBlocked: boolean;
    isDeleted: boolean;
    wallet: number;
    locationData: {
      type: any;
      coordinates: number[];
      city: string;
      state: string;
      _id: string;
    };
    address: any[]; // adjust if address object shape is known
  };

  workHistory: Array<{
    _id: string;
    mechanicId: string;
    status: string;
    acceptedAt?: Date;
    canceledAt: Date | null;
    reason: string | null;
    canceledBy?: string | null;
  }>;

  workDetails: Array<{
    _id: string;
    description: string;
    amount: number;
    addedAt: Date;
  }>;

  defaultAdressDetails: {
    name: string;
    email: string;
    phone: number;
    district: string;
    state: string;
    pin: number;
    landMark: string;
  };

  orderDetails: Array<IOrderDetails>;

  isBlocked: boolean;
  isDeleted: boolean;
  orderId: string;
  chatId: string;
  createdAt: string;
  updatedAt: string;
  userCancellation?: {
    canceledAt: Date | null;
    reason: string | null;
  };
  needsReassignment?: boolean;
  deviceImages?: any[];
}

export interface IMechanicDetails {
  _id: string;
  name: string;
  email: string;
  phone: string;
  photo: string;
  isVerified: boolean;
  isBlocked: boolean;
  isDeleted: boolean;
  acceptedAt?: Date;
}

export interface IOrderDetails {
  orderId: string;
  mechanicId: string;
  complaintId: string;
  userId: string;
  serviceId: string;
  amount: number;
  paymentStatus: boolean;
  adminCommission: number;
  mechanicEarning: number;
  isDeleted: boolean;
  timestamp: Date;
}

