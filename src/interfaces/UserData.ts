export interface UserData {
  _id: string;
  name: string;
  email: string;
  isBlocked: boolean;
  isDeleted: boolean;
  aboutInfo: string;
  location: string;
  profile_picture?: string;
  address: [];
  password: string;
}
