import { useNavigate } from 'react-router-dom';

function Open() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white">
            {/* Heading */}
            <h1 className="text-5xl font-bold text-purple-900 mb-4">QUIZ</h1>

            {/* Subheading */}
            <p className="text-lg text-center text-gray-600 mb-8 w-3/4 lg:w-1/2">
                Are you ready to unlock your true potential? Each quiz is an opportunity to challenge yourself, learn something new, and grow. Whether you’re testing your knowledge or exploring fresh ideas, every question brings you one step closer to mastering a new skill. Don’t just settle for what you know—dive deeper, push your limits, and see what you’re truly capable of. Take the quiz today, and turn curiosity into confidence!
            </p>

            {/* Buttons */}
            <div className="flex space-x-4 mb-12">
                {/* Read More Button */}
                <button
                    className="px-6 py-2 border-2 border-purple-900 text-purple-900 font-semibold rounded-lg hover:bg-purple-900 hover:text-white transition duration-300"
                    onClick={() => navigate('/login')}
                >
                    Login
                </button>

                {/* Sign Up Button */}
                <button
                    className="px-6 py-2 bg-purple-900 text-white font-semibold rounded-lg hover:bg-purple-700 transition duration-300"
                    onClick={() => navigate('/register')}
                >
                    Register
                </button>
            </div>
        </div>
    );
}

export default Open;
