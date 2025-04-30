import React, { useEffect, useState } from "react";
import { Formik } from "formik";
import AdminHeader from "../../components/Admin/AdminHeader";
import { ServiceListingValidation } from "../../components/Common/Validations";
import { useNavigate, useParams } from "react-router-dom";
import { getService } from "../../Api/admin";
import { editExistService } from "../../Api/admin";

export interface InewService {
  _id:string;
  name: string;
  discription: string; 
}

const NewService: React.FC = () => {

  const {id} = useParams()
  console.log("Id of the service from the service listing page is ",id);
  const [serviceDetails,setServiceDetails] = useState<InewService>()
  const navigate = useNavigate();


   useEffect(() => {
    const fetchServiceDetails = async () => {
      try{
        const response = await getService(id);
        console.log("service details from the frontend is ",response?.data);
        setServiceDetails(response?.data)
      }catch(error){
        console.log(error as Error)
      }
    }

    fetchServiceDetails();
   },[id])



  return (
    <div>
      <AdminHeader heading="Edit Existing Service" />
      <div className="flex justify-center items-center py-10 h-screen">
        {
        <Formik
          initialValues={{
            name:serviceDetails?.name || "",
            discription:serviceDetails?.discription || "",
          }}
          validationSchema={ServiceListingValidation}
          enableReinitialize={true}
          onSubmit={async (values) => {
            console.log("submited addressdetails" , values);
            let _id:string | undefined;
            if(serviceDetails){
              _id= serviceDetails?._id
            }
            const result = await editExistService(_id,values);
            if(result) {
              console.log("result reached the frontend");
              navigate("/admin/services");

            }
          }}
        >
          {(formik) => (
            <form
              className="bg-white shadow-md rounded-lg p-8 w-full max-w-lg"
              onSubmit={formik.handleSubmit}
            >
              <h2 className="text-2xl font-bold text-center mb-6">Edit  Service</h2>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="name"
                >
                  Service Name
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formik.values.name}
                  onChange={ formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Enter  the service name"

                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-500 ${
                    formik.errors.name && formik.touched.name ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {formik.errors.name && formik.touched.name && (
                  <small className="text-red-500">{formik.errors.name}</small>
                )}
              </div>

              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="discription"
                >
                  Description
                </label>
                <textarea
                  id="discription"
                  name="discription"
                  value={formik.values.discription}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Enter a brief description of the service"
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-500 ${
                    formik.errors.discription && formik.touched.discription ? "border-red-500" : "border-gray-300"
                  }`}
                  rows={4}
                ></textarea>
                {formik.errors.discription && formik.touched.discription && (
                  <small className="text-red-500">{formik.errors.discription}</small>
                )}
              </div>

              <div className="flex justify-center">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md shadow focus:outline-none focus:ring focus:ring-blue-300"
                >
                  Save Changes
                </button>
              </div>
            </form>
          )}
      
        </Formik>
}
      </div>
    </div>
  );
};

export default NewService;
