//inteface used in the MechDataListing.tsx && VerifyMechanicByAdmin
export interface MechData {
    _id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    isBlocked: boolean;
    isDeleted: boolean;
    isVerified: boolean;
    employeeLicense: string; 
    adharProof: string; 
    image: string; 
}

//interface used in the AdminHeader.tsx
export interface AdminHeaderProps {
    heading: string;
}

//interface used in the AddNewDevice.tsx
export interface InewDevice {
  name: string;
}

//used in ApproveModal.tsx
export interface ApproveModalProps {
  isOpen: boolean;
  onClose: () => void;
  id: string | undefined;
  verifyStatus: boolean | undefined;
}

//used in TopBar.tsx
export interface TopBarProps {
    heading: string;
    searchQuery: string;
    pathName:string;
    onSearchChange: (query: string) => void;

}








