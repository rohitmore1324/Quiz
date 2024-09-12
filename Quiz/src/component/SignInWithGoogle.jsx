import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, db } from "./firebase";
import { toast } from "react-toastify";
import { setDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

function SignInwithGoogle() {
    const navigate = useNavigate();

    function googleLogin() {
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider)
            .then(async (result) => {
                const user = result.user;
                if (user) {
                    // Set default role for all users as "user"
                    await setDoc(doc(db, "Users", user.uid), {
                        email: user.email,
                        firstName: user.displayName,
                        photo: user.photoURL,
                        lastName: "",
                        role: "user", // Default role
                    });

                    // Show success toast notification
                    toast.success("User logged in successfully", {
                        position: "top-center",
                    });

                    // Navigate to profile page after login
                    navigate("/user-pages");
                }
            })
            .catch((error) => {
                // Show error toast notification
                toast.error("Error logging in: " + error.message, {
                    position: "top-center",
                });
                console.error("Error during sign-in:", error);
            });
    }

    return (
        <div>
            <div
                style={{ display: "flex", justifyContent: "center", cursor: "pointer" }}
                onClick={googleLogin}
            >
                Sign in with Google
            </div>
        </div>
    );
}

export default SignInwithGoogle;
