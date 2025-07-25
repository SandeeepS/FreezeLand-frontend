import { Button } from '@nextui-org/react'
import { AiFillGoogleCircle } from "react-icons/ai";
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth'
import app from '../../firebase';
import { googleLogin } from '../../Api/user';
import { useDispatch } from 'react-redux';
import {  setUserCredental } from '../../App/slices/AuthSlice';

const OAuth = () => {

    const auth = getAuth(app)
    const dispatch = useDispatch();

    const handleGoogleClick = async () => {
        try {
            const provider = new GoogleAuthProvider();
            provider.setCustomParameters({ prompt: "select_account" });
            const resultsFromGoogle = await signInWithPopup(auth, provider);
            console.log(resultsFromGoogle);
            if (resultsFromGoogle) {
                const result = await googleLogin(resultsFromGoogle.user.displayName, resultsFromGoogle.user.email, resultsFromGoogle.user.photoURL);
                console.log("result from the googleLoging in the OAuth",result)
                if (result) {
                    const data = result.data.data.data;
                    const userData  = {
                        id:data.id,
                        name:data.name,
                        email:data.email,
                        role:data.role
                    }
                    dispatch(setUserCredental(userData));
                    // navigate('/user/home');
                }
            }

        } catch (error) {
            console.log(error as Error);
        }
    }
    return (
        <Button onClick={handleGoogleClick} type='button' className='bg-gradient-to-r from-red-500 to-orange-400  w-full rounded-md'>
            <AiFillGoogleCircle />
            Sign In with Google
        </Button>
    )
}

export default OAuth
