import { FormikProps } from "formik";
import UserData from "../../UserData";

//used in the CompaintDetails.tsx
export interface IComplaintDetails {
  _id: string;
  name: string;
  image: [];
  serviceId: string;
  userId: string;
  defaultAddress: string;
  discription: string;
  locationName?: {
    address?: string;
  };
  status: string;
  currentMechanicId: string | null;
  acceptedAt: Date | null;
  serviceDetails: [
    {
      _id: string;
      name: string;
      imageKey: string;
      discription: string[];
      serviceCharge: number;
      createdAt: Date;
      isBlocked: boolean;
      isDeleted: boolean;
    }
  ];
  userDetails: object[];
  workHistory: [
    {
      mechanicId: string;
      status: string;
      acceptedAt: Date;
      canceledAt: Date | null;
      reason: string | null;
    }
  ];
  workDetails: [
    {
      description: string;
      amount: number;
      addedAt: Date;
    }
  ];

  isBlocked: boolean;
  isDeleted: boolean;
  deviceImages?: string[];
  orderId: string;
  chatId: string;
  createdAt: Date;
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
  acceptedAt?: string;
}

//used in the ComplaintHeader.tsx
export interface Props {
  image: string;
  name: string;
  requestId: string;
  status: string;
}

export interface IServiceDetails {
  _id?: string;
  name: string;
  imageKey?: string;
  discription?: string[];
  serviceCharge?: number;
  createdAt?: Date;
  isBlocked?: boolean;
  isDeleted?: boolean;
}

//used in the ComplaintInfo.tsx
export interface Props2 {
  serviceDetails: IServiceDetails;
  complaint: IComplaintDetails;
  deviceImages: string[];
}

//used in the CustomerInfor.tsx
export interface Props3 {
  userDetails: userDetails;
  fallbackName: string;
}

//used in the StatusBadge.tsx
export interface StatusBadgeProps {
  status: string;
}

//used in queue.tsx
export interface AllRegisteredServices {
  _id: string;
  name: string;
  image: [];
  serviceId: string;
  userId: string;
  defaultAddress: string;
  description: string;
  locationName: object;
  isBlocked: boolean;
  isDeleted: boolean;
  userDetails: object;
  serviceDetails: object;
  status?: string;
  deviceImages?: string[];
  completionPercentage?: number;
  updatedAt:string;
  createdAt:string;
}

// Define the base data item type with optional fields
export interface TableDataItem {
  name: string;
  _id: string;
  image: string;
  serviceId: string;
  userId: string;
  defaultAddress: string;
  [key: string]: unknown;
  description: string;
  locationName: string;
  isBlocked: boolean;
  isDeleted: boolean;
  userDetails:object;
  serviceDetails:object;
}

// Define the column configuration
export interface TableColumn {
  key: string;
  header: string;
  render?: (value: unknown, item: TableDataItem) => React.ReactNode;
}

//used in the AboutTheService.tsx
export interface ServiceCardProps {
  title: string;
  points: string[];
}

//used in ServiceForm.tsx
export interface ServiceFormProps {
  formik: FormikProps<{
    name: string;
    discription: string;
    location: string;
    file: File | null;
    defaultAddress: string;
  }>;
  userProfile: UserData | undefined;
  defaultAddress: string;
  setDefaultAddress: (value: string) => void;
  locationName: {
    address: string;
    latitude: number | null;
    longitude: number | null;
  };
  locationError: string | undefined;
  validateLocationName: (value: unknown) => { ok: boolean; message?: string };
  handleFetchLocation: () => void;
  handleRemoveLocation: () => void;
  showLocationOptions: boolean;
  setShowLocationOptions: (value: boolean) => void;
}

//used in AllAddress.tsx
export interface userDetails {
  _id?: string;
  name?: string;
  email?: string;
  phone?: number;
  address?: string;
  location?: string;
}

//used in Carousal Component
export interface Slide {
  image: string;
  text1: string;
  text2: string;
  text3: string;
  text4: string;
}

export interface CarouselProps {
  slides: Slide[];
}

export interface PreviewImageProps {
  file: File | null;
}

export interface ServiceData {
  _id: string;
  name: string;
  discription: string;
  status: boolean;
  isDeleted: boolean;
  imageKey: string;
}
