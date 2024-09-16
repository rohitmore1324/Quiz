import { useEffect, useState } from "react";
import { auth, provider } from "./firebase";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import UserPage from "../user_panel/UserPage";



function SignUp() {
  const navigate = useNavigate()
  const [value, setValue] = useState('')
  const handleClick = () => {

    signInWithPopup(auth, provider).then((data) => {
      setValue(data.user.email)
      localStorage.setItem("email", data.user.email)
      if (data.user.email) {
        navigate('/user-pages')
      }
    })
  }


  useEffect(() => {
    const email = localStorage.getItem('email');
    setValue(email)
    console.log('got value', email);

    if (email) {
      navigate('/user-pages')
    }
  }, [])




  return (
    <div>
      {value ? <UserPage /> :
        <button onClick={handleClick} className="border-solid py-1 px-3 focus:scale-95 duration-200 transition-all bg-green-600 shadow-sm rounded-md">Sign With Google</button>}
    </div>
  )
}

export default SignUp


