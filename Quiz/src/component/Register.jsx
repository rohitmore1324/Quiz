import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { auth, db } from "./firebase";
import { setDoc, doc } from "firebase/firestore";
import { toast } from "react-toastify";

function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fname, setFname] = useState("");
    const [lname, setLname] = useState("");

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            const user = auth.currentUser;
            if (user) {
                await setDoc(doc(db, "Users", user.uid), {
                    email: user.email,
                    firstName: fname,
                    lastName: lname,
                    photo: "",
                });
            }
            console.log("User Registered Successfully!!");
            toast.success("User Registered Successfully!!", {
                position: "top-center",
            });
        } catch (error) {
            console.log(error.message);
            toast.error(error.message, {
                position: "bottom-center",
            });
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <form onSubmit={handleRegister} className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
                <h3 className="text-2xl font-semibold text-center mb-6">Sign Up</h3>

                <div className="mb-4">
                    <label className="block text-gray-700">First name</label>
                    <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-100"
                        placeholder="First name"
                        onChange={(e) => setFname(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700">Last name</label>
                    <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-100"
                        placeholder="Last name"
                        onChange={(e) => setLname(e.target.value)}
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700">Email address</label>
                    <input
                        type="email"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-100"
                        placeholder="Enter email"
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-gray-700">Password</label>
                    <input
                        type="password"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-100"
                        placeholder="Enter password"
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-4">
                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition-colors duration-300"
                    >
                        Sign Up
                    </button>
                </div>

                <p className="text-center text-gray-600">
                    Already registered?{" "}
                    <a href="/login" className="text-indigo-600 hover:underline">
                        Login
                    </a>
                </p>
            </form>
        </div>
    );
}

export default Register;
