import Api from "../Services/axios";
import chatRoute from "../Services/Endpoints/ChatEndPoints";
import errorHandler from "./errorHandler";
//function to get the specified complaint by id


const getComplaintDetails = async (id: string) => {
  try {
    console.log("Entered in the getComplaintDetails in the chat.ts");
    const result = await Api.get(chatRoute.getComplaintDetails, {
      params: { id },
    });
    return result;
  } catch (error) {
    console.log(error as Error);
    errorHandler(error as Error);
  }
};

export { getComplaintDetails };
