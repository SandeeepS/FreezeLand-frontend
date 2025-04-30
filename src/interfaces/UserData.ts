interface UserData {
  _id: string;
  name: string;
  email: string;
  isBlocked: boolean;
  isDeleted: boolean;
  profile_picture?: string;
}

export default UserData;