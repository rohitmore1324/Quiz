import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Use the navigate hook
import { auth, db } from "./firebase"; // Import db to access Firestore
import { toast } from "react-toastify";
import SignInwithGoogle from './SignInWithGoogle';
import { getDoc, doc } from "firebase/firestore"; // Firestore methods

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate(); // Initialize the navigate hook

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Fetch user data from Firestore to check the role
            const userDoc = await getDoc(doc(db, "Users", user.uid));
            const userData = userDoc.data();

            if (userData && userData.role === "admin") {
                // Redirect to admin page if the user is an admin
                toast.success("Admin logged in successfully", {
                    position: "top-center",
                });
                navigate("/admin-page"); // Use navigate for routing
            } else {
                // Redirect to user page if not an admin
                toast.success("User logged in successfully", {
                    position: "top-center",
                });
                navigate("/user-pages"); // Use navigate for routing
            }
        } catch (error) {
            console.log(error.message);
            toast.error("Login failed: " + error.message, {
                position: "bottom-center",
            });
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
                <h3 className="text-2xl font-semibold text-center mb-6">Login</h3>

                <div className="mb-4">
                    <label className="block text-gray-700">Email address</label>
                    <input
                        type="email"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-100"
                        placeholder="Enter email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-gray-700">Password</label>
                    <input
                        type="password"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-100"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <div className="mb-4">
                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition-colors duration-300"
                    >
                        Submit
                    </button>
                </div>

                <p className="text-center text-gray-600">
                    New user?{" "}
                    <a href="/register" className="text-indigo-600 hover:underline">
                        Register Here
                    </a>
                </p>
                <div className="mt-4">
                    <SignInwithGoogle />
                </div>
            </form>
        </div>
    );
}

export default Login;
