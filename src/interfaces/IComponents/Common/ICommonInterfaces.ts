import { UnknownAction } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";

//used in ConformationModal.tsx
export interface ConformationModalProps {
  onClose: () => void;
  show: boolean;
}

//used in DynamicTable.tsx
export interface DynamicTableProps {
  columns: TableColumn[];
  data: TableDataItem[];
  title?: string;
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
  onRowClick?: (item: TableDataItem) => void;
  itemsPerPageOptions?: number[];
  defaultItemsPerPage?: number;
}

export interface TableDataItem {
  [key: string]: unknown;
}

export interface TableColumn {
  key: string;
  header: string;
  render?: (value: unknown, item: TableDataItem) => React.ReactNode;
}

export interface ErrorFallbackProps {
  error: unknown;
  resetErrorBoundary: () => void;
}

export interface NavItem {
  icon?: React.ReactNode;
  label: string;
  path: string;
}

export interface HeaderDropDownProps {
  isOpen: boolean;
  onClose: () => void;

  logout: () => Promise<AxiosResponse | undefined>;
  authLogout: () => UnknownAction;
  navigateTo: string;
  // New props
  coverImage: string;
  profileImage: string;
  userName: string;
  userRole: string;
  navigationItems: NavItem[];
}

//used in LargeModal.tsx
export interface ModalProps {
  image: string;
  isOpen: boolean;
  onClose: () => void;
  onCropedImageBack: (croppedImage: string) => void;
}

//used in LocationModal.tsx
export interface LocationModalProps {
  onClose: () => void;
  userId: string; // Callback function to close the modal
}

//used in PageLeaveModal.tsx
export interface ConfirmationModalProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

//used in the PopulaCities.tsx
export interface PopularCitiesProps {
  onCityClick: () => void;
  userId: string;
}

export interface AddressDetails {
  district: string;
  state: string;
  pin: string;
  landMark: string;
}

//used in the Profile.tsx
export interface UserDetails {
  name: string;
  email: string;
  phone: number | string;
  address?: string;
  location?: string;
  profile_picture?: string;
  defaultAddressDetails: AddressDetails;
}

export interface IMainProfileDetails {
  name: string;
  email: string;
  phone: number | string;
  profile_picture?: string;
  address: [];
}

export interface UserDetailsInProfile {
  name: string;
  profile_picture?: string;
}

//used in ServiceListingCards.tsx
export interface ServiceListingCardProps {
  data: {
    _id: string;
    imageKey: string;
    title?: string;
    name?: string;
    discription?: string;
    serviceCharge?: number;
  };
}

//interfacees in the TableCommon.tsx
export interface Column {
  id: string;
  label: string;
  minWidth?: number;
  align?: string;
  format?: (value: boolean) => "Blocked" | "Active";
}

export interface Data {
  _id: string;
  name: string;
  email?: string;
  isBlocked?: boolean;
  isDeleted: boolean;
  status?: boolean;
}

export interface BlockingResponse {
  success: boolean;
  message: string;
}

export interface DeletingResponse {
  success: boolean;
  message: string;
}

export interface TableCommonProps {
  columns: Column[];
  data: Data[];
  updateStatus: (id: string, isBlocked: boolean, isDeleted: boolean) => void;
  blockUnblockFunciton?: (id: string) => Promise<BlockingResponse>;
  deleteFunction: (id: string) => Promise<DeletingResponse>;
  handleViewMore?: (id: string) => void;
  navLink?: string;
  role?: string;
}

//used in TableCommon2
export interface MechData {
  _id: string;
  name: string;
  email: string;
  isVerified: boolean;
  isBlocked: boolean;
  isDeleted: boolean;
}

export interface MainProfileDetailsData {
  role: string;
  getImage: (
    imageKey: string,
    type: string
  ) => Promise<{ data: { url: string } } | undefined>;
}

export interface IAddress {
  _id?:string;
  userId: string;
  addressType: "Home" | "Work";
  fullAddress: string;
  houseNumber: string;
  longitude: number;
  latitude: number;
  landmark: string;

}

export interface IAddressResponse {
   _id: string;
  userId: string;
  addressType: "Home" | "Work";
  fullAddress:string;
  houseNumber:string;
  longitude:number;
  latitude:number;
  landmark:string;
  isDeleted:boolean;
  isDefaultAddress:boolean;
}
