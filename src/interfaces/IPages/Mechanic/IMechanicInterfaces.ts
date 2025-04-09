
//used in MechQueue
export interface AllAcceptedServices {
    _id: string;
    name: string;
    image: [];
    serviceId: string;
    userId: string;
    defaultAddress: string;
    discription: string;
    locationName: object;
    status: string;
    currentMechanicId: string | null;
    acceptedAt: Date | null;
    workHistory: [
      {
        mechanicId: string;
        status: string;
        acceptedAt: Date;
        canceledAt: Date | null;
        reason: string | null;
      }
    ];
    isBlocked: boolean;
    isDeleted: boolean;
    serviceDetails: object;
    userDetails: object;
  }
  
  // Define the base data item type with optional fields
  export interface TableDataItem {
    [key: string]: any;
  }
  
  // Define the column configuration
  export interface TableColumn {
    key: string;
    header: string;
    render?: (value: any, item: TableDataItem) => React.ReactNode;
  }

  //used in ForgetPasswordForMech.tsx
  export interface initialVal {
    email:string;
    password: string;
    cpassword: string;
  }

  //used in MechanicLoginPage.tsx
  export interface initialValues{
    email: string;
    password: string;
  }

//used in MechanicSignupPage.tsx
  export interface FormData {
    name: string;
    email: string;
    phone: string;
    password: string;
    cpassword: string;
  }
  
 export  interface initialVal2 {
    name: string;
    email: string;
    phone: string;
    password: string;
    cpassword: string;
  }

  //used in VerifyMechanic.tsx
  export interface Device {
    _id: string;
    name: string;
    isBlocked?: boolean;
    isDeleted?: boolean;
  }
  
  export interface MechanicForm {
    name: string;
    id: string;
    mechanicType: string[];
    photo: File | null;
    adharProof: File | string;
    employeeLicense: File | null;
  }
  
  
