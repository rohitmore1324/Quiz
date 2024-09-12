import { useEffect, useState } from "react";
import { auth, db } from "./firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

function UserPage() {
    const [userDetails, setUserDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchUserData = async () => {
        auth.onAuthStateChanged(async (user) => {
            if (user) {
                console.log("User detected:", user);

                const docRef = doc(db, "Users", user.uid);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    console.log("User document found in Firestore:", docSnap.data());
                    setUserDetails(docSnap.data());
                } else {
                    console.log("User document not found in Firestore. Creating new document...");

                    const userData = {
                        firstName: user.displayName.split(" ")[0],
                        email: user.email,
                        photo: user.photoURL,
                    };

                    await setDoc(docRef, userData);
                    setUserDetails(userData);
                    console.log("New user data saved to Firestore:", userData);
                }
            } else {
                console.log("No user is logged in");
            }
            setLoading(false);
        });
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    async function handleLogout() {
        try {
            await auth.signOut();
            window.location.href = "/login";
            console.log("User logged out successfully!");
        } catch (error) {
            console.error("Error logging out:", error.message);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            {loading ? (
                <p className="text-lg font-semibold">Loading...</p>
            ) : userDetails ? (
                <div className="bg-white p-6 rounded-lg shadow-md text-center w-96">
                    <div className="flex justify-center mb-4">
                        <img
                            src={userDetails.photo}
                            alt="User Profile"
                            className="rounded-full w-40 h-40 object-cover"
                        />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Welcome {userDetails.firstName} 🙏🙏</h3>
                    <div className="text-gray-600 mb-4">
                        <p>Email: {userDetails.email}</p>
                        <p>First Name: {userDetails.firstName}</p>
                    </div>
                    <button
                        className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md shadow-sm transition duration-200"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </div>
            ) : (
                <p className="text-lg font-semibold">User not logged in or no data found</p>
            )}
        </div>
    );
}

export default UserPage;

