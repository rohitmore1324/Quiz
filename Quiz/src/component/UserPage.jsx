import { useState, useEffect } from "react";
import { auth, db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

function UserPage() {
    const [user, setUser] = useState(null);
    const [quizHistory, setQuizHistory] = useState([]);
    const [achievements, setAchievements] = useState([]);
    const [availableQuizzes, setAvailableQuizzes] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                const docRef = doc(db, "Users", currentUser.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setUser(docSnap.data());
                } else {
                    console.log("No user data found.");
                }
            } else {
                navigate("/login");
            }
        });

        return () => unsubscribe();
    }, [navigate]);

    // Placeholder data for quizzes and achievements
    useEffect(() => {
        setQuizHistory([
            { id: 1, title: "React Basics", score: 85, date: "2024-09-01" },
            { id: 2, title: "JavaScript Advanced", score: 90, date: "2024-08-20" },
        ]);
        setAchievements([
            { id: 1, title: "Quiz Master", description: "Completed 10 quizzes" },
            { id: 2, title: "Top Scorer", description: "Scored over 90% in 5 quizzes" },
        ]);
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
                            src={user?.photo || "https://via.placeholder.com/150"}
                            alt="User Avatar"
                            className="rounded-full w-32 h-32 mx-auto"
                        />
                        <div className="mt-4">
                            <p><strong>Email:</strong> {user?.email}</p>
                            <p><strong>First Name:</strong> {user?.firstName}</p>
                            <p><strong>Last Name:</strong> {user?.lastName}</p>
                        </div>
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
                            {quizHistory.map((quiz) => (
                                <li key={quiz.id} className="mb-3">
                                    <div className="flex justify-between">
                                        <span>{quiz.title}</span>
                                        <span>{quiz.score}%</span>
                                    </div>
                                    <small className="text-gray-500">{quiz.date}</small>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Achievements Section */}
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-xl font-semibold mb-4">Achievements</h2>
                        <ul>
                            {achievements.map((achievement) => (
                                <li key={achievement.id} className="mb-3">
                                    <div>
                                        <strong>{achievement.title}</strong>
                                        <p className="text-gray-600">{achievement.description}</p>
                                    </div>
                                </li>
                            ))}
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
                                        <button className="bg-blue-500 text-white py-1 px-3 rounded-md hover:bg-blue-600">
                                            Start Quiz
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Settings & Support Section */}
            <div className="container mx-auto px-4 py-8">
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
    );
}

export default UserPage;
