import { AddAddress } from "./AddAddress";

interface UserData {
  _id: string;
  name: string;
  email: string;
  isBlocked: boolean;
  isDeleted: boolean;
  address:AddAddress[];
  profile_picture?: string;
}

export default UserData;