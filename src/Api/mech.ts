import Api from "../Services/axios";
import mechRoutes from "../Services/Endpoints/mechEndPoints";
import { FormData } from "../Pages/Mechanic/MechanicSignupPage";

const mechSignup = async ({ name, phone, email, password }: FormData) => {
    try {
      console.log("Entered in mech signup ");
      const result = await Api.post(mechRoutes.signup, {
        name,
        phone,
        email,
        password,
      });
      console.log("result of api post", result);
      return result;
    } catch (error) {
      console.log(error as Error);
    }
  };
const mechLogin = async(email:string,password:string) => {
    try{
        const result = await Api.post(mechRoutes.login,{email,password});
        console.log("result reached in the frontend ",result);
        return result;
    }catch(error){
        console.log(error as Error);
    }
}

const mLogout = async () => {
    try {
      const result = await Api.get(mechRoutes.logout);
      if (result) {
        console.log("logut success from the admin.ts");
        return result;
      }
    } catch (error) {
      console.log(error as Error);
    }
  };

export {mechLogin,mLogout,mechSignup}