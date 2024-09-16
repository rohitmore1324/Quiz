import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../component/firebase';
import { toast } from 'react-toastify';
import { auth } from '../component/firebase';
import axios from 'axios';
import { addDoc, collection } from 'firebase/firestore';
import { RateLimiterMemory } from 'rate-limiter-flexible';

const QuizPage = () => {
    const { quizId } = useParams();
    const [quiz, setQuiz] = useState({ title: '', questions: [] });
    const [answers, setAnswers] = useState({});
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isNewQuizRequested, setIsNewQuizRequested] = useState(false);

    // Rate limiter configuration
    const rateLimiter = new RateLimiterMemory({
        points: 100, // 100 requests per minute
        duration: 60, // 1 minute
    });

    // Function to fetch quiz data from API
    const fetchQuiz = async () => {
        try {
            await rateLimiter.consume(1); // consume 1 point

            const response = await axios.get(`https://opentdb.com/api.php?amount=10&category=23&difficulty=easy`);
            const data = response.data;
            if (data.results) {
                setQuiz({ title: 'Quiz', questions: data.results });
                setStartTime(new Date()); // Set start time when quiz is fetched
                setAnswers({});
                setIsSubmitted(false);
                setIsNewQuizRequested(false); // Reset new quiz request flag
            } else {
                toast.error('No quiz data available');
            }
        } catch (error) {
            if (error.response?.status === 429) {
                toast.error('Rate limit exceeded. Please try again later.');
            } else {
                console.error(error);
                toast.error('Error fetching quiz data');
            }
        }
    };

    useEffect(() => {
        if (!isSubmitted && !isNewQuizRequested) {
            fetchQuiz();
        }
    }, [isNewQuizRequested]);

    // Handle change in selected answers
    const handleChange = (questionIndex, answer) => {
        setAnswers((prev) => ({ ...prev, [questionIndex]: answer }));
    };

    // Handle quiz submission
    const handleSubmit = async () => {
        try {
            const end = new Date();
            setEndTime(end);
            setIsSubmitted(true);

            const durationInSeconds = (end - startTime) / 1000; // Calculate duration in seconds
            const score = calculateScore(); // Calculate score

            // Save result to Firestore
            await addDoc(collection(db, 'QuizResults'), {
                score,
                duration: durationInSeconds,
                answers,
                userId: auth.currentUser.uid,
                quizId,
                timestamp: new Date()
            });
            toast.success('Quiz submitted successfully!');
        } catch (error) {
            toast.error('Error submitting quiz');
        }
    };

    // Calculate the score based on correct answers
    const calculateScore = () => {
        let correctAnswersCount = 0;
        quiz.questions.forEach((question, index) => {
            const userAnswer = answers[index];
            if (userAnswer === question.correct_answer) {
                correctAnswersCount++;
            }
        });
        return (correctAnswersCount / quiz.questions.length) * 100; // Return percentage score
    };

    // Format time into minutes and seconds
    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}m ${secs}s`;
    };

    // Handle Load More Questions (Start a new quiz)
    const handleLoadMore = () => {
        setIsNewQuizRequested(true); // Set flag to request a new quiz
    };

    // Start New Quiz
    const handleStartNewQuiz = () => {
        fetchQuiz(); // Fetch new quiz data
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4 flex flex-col justify-center items-center">
            <div className="max-w-3xl w-full bg-white p-6 rounded-lg shadow-lg">
                <h1 className="text-2xl font-bold mb-4 text-center">{quiz.title}</h1>
                {quiz.questions.length ? (
                    quiz.questions.map((question, index) => (
                        <div key={index} className="mb-4">
                            <p className="font-semibold">{question.question}</p>
                            <div>
                                {question.incorrect_answers.concat(question.correct_answer).sort().map((option, idx) => (
                                    <label key={idx} className="block">
                                        <input
                                            type="radio"
                                            name={index}
                                            value={option}
                                            checked={answers[index] === option}
                                            onChange={() => handleChange(index, option)}
                                            className="mr-2"
                                        />
                                        {option}
                                    </label>
                                ))}
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No questions available</p>
                )}
                {!isSubmitted && (
                    <div className="flex justify-between mt-6">
                        <button
                            onClick={handleSubmit}
                            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                        >
                            Submit Quiz
                        </button>
                        {!isNewQuizRequested && (
                            <button
                                onClick={handleLoadMore}
                                className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600"
                            >
                                Load More Questions
                            </button>
                        )}
                    </div>
                )}
                {isSubmitted && endTime && (
                    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
                        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
                            <p className="text-xl font-bold mb-4">Quiz Submitted!</p>
                            <p><strong>Score:</strong> {calculateScore().toFixed(2)}%</p>
                            <p><strong>Time Taken:</strong> {formatTime((endTime - startTime) / 1000)}</p>
                            <button
                                onClick={handleStartNewQuiz}
                                className="bg-green-500 text-white py-2 px-4 rounded-md mt-4 hover:bg-green-600"
                            >
                                Start New Quiz
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default QuizPage;
