import { useState, useEffect } from 'react';
import { db } from '../component/firebase'; // Import firebase db
import { collection, onSnapshot, query, orderBy, getDocs } from 'firebase/firestore';
import { toast } from 'react-toastify';

const AdminPage = () => {
    const [users, setUsers] = useState([]);
    const [quizzes, setQuizzes] = useState([]);
    const [analytics, setAnalytics] = useState({ totalUsers: 0, totalQuizzes: 0 });

    // Listen for new users and fetch users
    useEffect(() => {
        const q = query(collection(db, 'Users'), orderBy('createdAt', 'desc')); // Listen for changes in Users collection

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const usersList = [];
            snapshot.docChanges().forEach((change) => {
                if (change.type === 'added') {
                    const newUser = change.doc.data();
                    toast.info(`New User Registered: ${newUser.firstName} ${newUser.lastName} (${newUser.email})`, {
                        position: 'top-right',
                        autoClose: 5000,
                        hideProgressBar: true,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                    });
                }
                usersList.push({ id: change.doc.id, ...change.doc.data() });
            });
            setUsers(usersList);
            setAnalytics((prev) => ({ ...prev, totalUsers: usersList.length }));
        });

        return () => unsubscribe();
    }, []);

    // Fetch quizzes (you can modify this as per your quiz fetching logic)
    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const quizzesSnapshot = await getDocs(collection(db, 'Quizzes'));
                const quizzesList = quizzesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setQuizzes(quizzesList);
                setAnalytics((prev) => ({ ...prev, totalQuizzes: quizzesList.length }));
            } catch (error) {
                toast.error('Error fetching quizzes');
            }
        };
        fetchQuizzes();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-center mb-6">Admin Dashboard</h1>

                {/* Analytics Dashboard */}
                <div className="grid grid-cols-2 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h3 className="text-xl font-semibold">Total Users</h3>
                        <p className="text-4xl mt-2">{analytics.totalUsers}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h3 className="text-xl font-semibold">Total Quizzes</h3>
                        <p className="text-4xl mt-2">{analytics.totalQuizzes}</p>
                    </div>
                </div>

                {/* User Management Section */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-4">User Management</h2>
                    <div className="overflow-auto bg-white p-6 rounded-lg shadow-lg">
                        <table className="min-w-full">
                            <thead>
                                <tr className="text-left bg-gray-200">
                                    <th className="p-2">Name</th>
                                    <th className="p-2">Email</th>
                                    <th className="p-2">Role</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => (
                                    <tr key={user.id} className="border-b">
                                        <td className="p-2">{user.firstName} {user.lastName}</td>
                                        <td className="p-2">{user.email}</td>
                                        <td className="p-2">{user.role}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Quiz Management Section */}
                <section>
                    <h2 className="text-2xl font-bold mb-4">Quiz Management</h2>
                    <div className="overflow-auto bg-white p-6 rounded-lg shadow-lg">
                        <table className="min-w-full">
                            <thead>
                                <tr className="text-left bg-gray-200">
                                    <th className="p-2">Title</th>
                                    <th className="p-2">Category</th>
                                    <th className="p-2">Difficulty</th>
                                </tr>
                            </thead>
                            <tbody>
                                {quizzes.map(quiz => (
                                    <tr key={quiz.id} className="border-b">
                                        <td className="p-2">{quiz.title}</td>
                                        <td className="p-2">{quiz.category}</td>
                                        <td className="p-2">{quiz.difficulty}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default AdminPage;
