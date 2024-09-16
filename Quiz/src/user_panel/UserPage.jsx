import { useState, useEffect } from "react";
import { auth, db } from "../component/firebase";
import { doc, getDoc, collection, query, where, orderBy, limit, getDocs, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { toast } from "react-toastify";

function UserPage() {
    const [user, setUser] = useState(null);
    const [quizHistory, setQuizHistory] = useState([]);
    const [achievements, setAchievements] = useState({
        quizzesCompleted: 0,
        topScore: 0,
    });
    const [availableQuizzes, setAvailableQuizzes] = useState([]);
    const [userImage, setUserImage] = useState(null);
    const [imageURL, setImageURL] = useState("");
    const [uploading, setUploading] = useState(false);
    const navigate = useNavigate();

    // Fetch user data and image from Firebase on authentication state change
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                const docRef = doc(db, "Users", currentUser.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const userData = docSnap.data();
                    setUser(userData);
                    setImageURL(userData.photo || "https://via.placeholder.com/150");
                } else {
                    console.log("No user data found.");
                }
            } else {
                navigate("/login");
            }
        });

        return () => unsubscribe();
    }, [navigate]);

    // Fetch quiz history and achievements from Firebase
    useEffect(() => {
        const fetchQuizData = async () => {
            if (auth.currentUser) {
                const userId = auth.currentUser.uid;

                // Fetch the last 5 quiz records
                const quizResultsQuery = query(
                    collection(db, "QuizResults"),
                    where("userId", "==", userId),
                    orderBy("timestamp", "desc"),
                    limit(5)
                );
                const querySnapshot = await getDocs(quizResultsQuery);
                const results = querySnapshot.docs.map((doc) => doc.data());

                setQuizHistory(results);

                // Calculate achievements
                const quizzesCompleted = results.length;
                const topScore = Math.max(...results.map((result) => result.score), 0);
                setAchievements({
                    quizzesCompleted,
                    topScore,
                });
            }
        };

        fetchQuizData();
    }, []);

    // Placeholder data for available quizzes
    useEffect(() => {
        setAvailableQuizzes([
            { id: 1, title: "CSS Grid Mastery" },
            { id: 2, title: "HTML5 Essentials" },
        ]);
    }, []);

    const handleLogout = async () => {
        try {
            await auth.signOut();
            navigate("/login");
        } catch (error) {
            console.log("Error logging out:", error);
        }
    };

    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            setUserImage(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!userImage) return toast.error("Please select an image first");

        const storage = getStorage();
        const user = auth.currentUser;
        const storageRef = ref(storage, `profile_images/${user.uid}_${userImage.name}`);

        setUploading(true);

        try {
            await uploadBytes(storageRef, userImage);
            const downloadURL = await getDownloadURL(storageRef);

            const userDocRef = doc(db, "Users", user.uid);
            await updateDoc(userDocRef, { photo: downloadURL });

            setImageURL(downloadURL);
            setUploading(false);
            toast.success("Profile image updated successfully!");
        } catch (error) {
            console.error("Error uploading image:", error);
            setUploading(false);
            toast.error("Error uploading image");
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="bg-indigo-600 text-white py-6">
                <div className="container mx-auto flex justify-between items-center">
                    <h1 className="text-2xl font-semibold">Welcome {user?.firstName}!</h1>
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 px-4 py-2 rounded-md text-white hover:bg-red-600"
                    >
                        Logout
                    </button>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Profile Section */}
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-xl font-semibold mb-4">Profile</h2>
                        <img
                            src={imageURL || "https://via.placeholder.com/150"}
                            alt="User Avatar"
                            className="rounded-full w-32 h-32 mx-auto"
                        />
                        <div className="mt-4">
                            <p><strong>Email:</strong> {user?.email}</p>
                            <p><strong>First Name:</strong> {user?.firstName}</p>
                            <p><strong>Last Name:</strong> {user?.lastName}</p>
                        </div>
                        <input type="file" onChange={handleImageChange} />
                        <button onClick={handleUpload} disabled={uploading}>
                            {uploading ? "Uploading..." : "Upload Image"}
                        </button>
                        <button
                            className="mt-4 bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600"
                            onClick={() => navigate("/edit-profile")}
                        >
                            Edit Profile
                        </button>
                    </div>

                    {/* Quiz History Section */}
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-xl font-semibold mb-4">Quiz History</h2>
                        <ul>
                            {quizHistory.length > 0 ? (
                                quizHistory.map((quiz, index) => (
                                    <li key={index} className="mb-3">
                                        <div className="flex justify-between">
                                            <span>{quiz.title}</span>
                                            <span>{quiz.score}%</span>
                                        </div>
                                        <small className="text-gray-500">{new Date(quiz.timestamp.seconds * 1000).toLocaleDateString()}</small>
                                    </li>
                                ))
                            ) : (
                                <p>No quiz history available.</p>
                            )}
                        </ul>
                    </div>

                    {/* Achievements Section */}
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-xl font-semibold mb-4">Achievements</h2>
                        <ul>
                            <li className="mb-3">
                                <strong>Quizzes Completed:</strong> {achievements.quizzesCompleted}
                            </li>
                            <li className="mb-3">
                                <strong>Highest Score:</strong> {achievements.topScore}%
                            </li>
                        </ul>
                    </div>

                    {/* Available Quizzes Section */}
                    <div className="col-span-1 md:col-span-2 bg-white p-6 rounded-lg shadow-lg mt-6 md:mt-0">
                        <h2 className="text-xl font-semibold mb-4">Available Quizzes</h2>
                        <ul>
                            {availableQuizzes.map((quiz) => (
                                <li key={quiz.id} className="mb-3">
                                    <div className="flex justify-between">
                                        <span>{quiz.title}</span>
                                        <button
                                            className="bg-blue-500 text-white py-1 px-3 rounded-md hover:bg-blue-600"
                                            onClick={() => navigate(`/quiz/${quiz.id}`)}
                                        >
                                            Start Quiz
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Settings & Support Section */}
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-xl font-semibold mb-4">Settings & Support</h2>
                        <div className="flex justify-between items-center">
                            <div>
                                <p>Account Settings</p>
                                <p>Notification Preferences</p>
                            </div>
                            <button
                                className="bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600"
                                onClick={() => navigate("/support")}
                            >
                                Support
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserPage;
