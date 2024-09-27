import Api from "../Services/axios";
import mechRoutes from "../Services/Endpoints/mechEndPoints";


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

export {mechLogin,mLogout}