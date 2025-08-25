import { getMechanicDetails } from "../Api/mech";
import { useAppSelector } from "../App/store";

export async function mechanicProfileLoader() {
  const mechData = useAppSelector((state) => state.auth.mechData);
  const response = await getMechanicDetails(mechData?.id as string);
  console.log(response);
  return response?.data?.result;
}
