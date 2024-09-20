import { FormData } from "../Pages/User/UserSignupPage";
import Api from "../Services/axios";
import userRoutes from "../Services/Endpoints/userEndPoints";

const signup = async({name,phone,email,password,cpassword}:FormData) => {
          try{
              const result = await Api.post(userRoutes.signup,{name,phone,email,password});
              console.log("result of api post",result);
           
          }catch(error){
            console.log(error as Error);
          }
}

export {
    signup
}