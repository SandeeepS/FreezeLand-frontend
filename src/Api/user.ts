import { FormData } from "../Pages/User/UserSignupPage";
import Api from "../Services/axios";
import userRoutes from "../Services/Endpoints/userEndPoints";

const signup = async({name,phone,email,password}:FormData) => {
          try{
            console.log("Entered in signup ");
              const result = await Api.post(userRoutes.signUp,{name,phone,email,password});
              console.log("result of api post",result);
           
          }catch(error){
            console.log(error as Error);
          }
}

export {
    signup
}