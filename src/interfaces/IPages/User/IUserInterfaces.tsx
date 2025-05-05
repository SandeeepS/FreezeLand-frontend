//ForgetPassword.tsx
export interface initialVal {
    password: string;
    cpassword: string;
  }

  export interface initialVal2{
    email: string;
    password: string;
  }


  //userSingupPage.tsx
  export interface FormData {
    _id?:string;
    name: string;
    email: string;
    phone: string;
    password: string;
    cpassword: string;
  }

  export interface EditUserFormData{
    _id : string;
    name : string ;
    phone : string;
    profile_picture : string;
  }

  export interface initialVal3 {
    name: string;
    email: string;
    phone: string;
    password: string;
    cpassword: string;
  }