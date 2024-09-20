import SignUpForm from "../components/User/SignUpForm"

function SignupPage() {
  return (
    <div className="bg-[url('/src/Images/loginPageBackground.jpg')] bg-cover bg-center h-screen w-screen flex items-center">
    
      <div className="w-full lg:w-1/3 pt-8">
        <div className="pl-14 ">
            <h1 className="w-full text-5xl  text-black font-exo  p-10" >FREEZE <span className="text-white font-exo" >LAND</span> </h1>
        </div>
        <div  className="pl-6">
        <SignUpForm/>
        </div>
       
      </div>
    </div>
  )
}

export default SignupPage
