import { useEffect, useState } from "react";
import { auth, provider } from "./firebase";
import { signInWithPopup } from "firebase/auth";
import Main from "./Main"
import { useNavigate } from "react-router-dom";
function SignUp() {
  const navigate = useNavigate()
  const [value, setValue] = useState('')
  const handleClick = () => {

    signInWithPopup(auth, provider).then((data) => {
      setValue(data.user.email)
      localStorage.setItem("email", data.user.email)
      if (data.user.email) {
        navigate('/home')
      }
    })
  }


  useEffect(() => {
    const email = localStorage.getItem('email');
    setValue(email)
    console.log('got value', email);

    if (email) {
      navigate('/home')
    }
  }, [])




  return (
    <div>
      {value ? <Main /> :
        <button onClick={handleClick} className="border-solid py-1 px-3 focus:scale-95 duration-200 transition-all bg-green-600 shadow-sm rounded-md">Sign With Google</button>}
    </div>
  )
}

export default SignUp