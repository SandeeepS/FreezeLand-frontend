import { getProfile } from "../Api/user";
import { useAppSelector } from "../App/store";

export async function userProfileLoader() {
    const userData = useAppSelector((state) => state.auth.userData);
  
  const response = await getProfile(userData?.id as string);
  return response?.data?.data?.data;
}
