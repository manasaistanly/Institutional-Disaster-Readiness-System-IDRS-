import { useState, useEffect } from 'react';
import api from '../services/api';
import { FaBookOpen, FaCheckCircle, FaTimesCircle, FaTrophy, FaArrowRight, FaBrain } from 'react-icons/fa';

const QuizPage = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [activeQuiz, setActiveQuiz] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});
    const [score, setScore] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchQuizzes();
    }, []);

    const fetchQuizzes = async () => {
        try {
            const { data } = await api.get('/quizzes');
            setQuizzes(data);
        } catch (err) {
            console.error("Failed to load quizzes");
        } finally {
            setLoading(false);
        }
    };

    const handleStart = (quiz) => {
        setActiveQuiz(quiz);
        setCurrentQuestion(0);
        setAnswers({});
        setScore(null);
    };

    const handleAnswer = (optionIndex) => {
        setAnswers({ ...answers, [currentQuestion]: optionIndex });
    };

    const handleSubmit = async () => {
        try {
            // Calculate local score for instant feedback
            let correctCount = 0;
            activeQuiz.questions.forEach((q, idx) => {
                if (answers[idx] === q.correctOptionIndex) correctCount++;
            });
            const calculatedScore = (correctCount / activeQuiz.questions.length) * 100;

            // Submit to backend
            await api.post(`/quizzes/${activeQuiz._id}/submit`, {
                score: calculatedScore,
                answers: Object.values(answers)
            });

            setScore(calculatedScore);
        } catch (err) {
            alert("Failed to submit results");
        }
    };

    if (loading) return (
        <div className="min-h-screen pt-24 flex items-center justify-center bg-[#0f172a]">
            <div className="relative">
                <div className="w-16 h-16 rounded-full border-4 border-blue-500/30 border-t-blue-500 animate-spin"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-500 text-xs font-bold">LOADING</div>
            </div>
        </div>
    );

    // 1. QUIZ LIST VIEW
    if (!activeQuiz) {
        return (
            <div className="min-h-screen pt-24 px-4 pb-12 bg-gray-900 selection:bg-blue-500 selection:text-white">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-12 relative">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
                        <h1 className="relative text-3xl md:text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 animate-gradient-x">
                            Safety Training Center
                        </h1>
                        <p className="relative text-gray-400 max-w-2xl mx-auto text-base leading-relaxed">
                            Master disaster response protocols through interactive simulations. Earn certifications and ensure you're ready for any emergency.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {quizzes.map(quiz => (
                            <div key={quiz._id} className="group relative bg-[#1e293b]/60 backdrop-blur-xl border border-white/10 p-6 rounded-2xl hover:border-blue-500/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/20">
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-purple-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                <div className="relative z-10">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white text-xl mb-4 shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform duration-300">
                                        <FaBrain />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">{quiz.title}</h3>
                                    <p className="text-gray-400 text-sm mb-6 leading-relaxed h-10 line-clamp-2">{quiz.description}</p>
                                    <button
                                        onClick={() => handleStart(quiz)}
                                        className="w-full py-3 bg-white/5 hover:bg-blue-600 hover:text-white rounded-xl border border-white/10 transition-all font-bold flex items-center justify-center gap-2 group-hover:shadow-lg group-hover:shadow-blue-600/30 text-sm"
                                    >
                                        Start Module <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        ))}

                        {quizzes.length === 0 && (
                            <div className="col-span-full flex flex-col items-center justify-center py-32 text-gray-500 animate-fade-in">
                                <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mb-6">
                                    <FaBookOpen className="text-4xl opacity-50" />
                                </div>
                                <p className="text-xl font-medium">No training modules available yet.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // 2. RESULT VIEW
    if (score !== null) {
        return (
            <div className="min-h-screen pt-24 px-4 flex items-center justify-center bg-[#0f172a]">
                <div className="max-w-md w-full bg-[#1e293b]/80 backdrop-blur-2xl border border-white/10 p-10 rounded-[2.5rem] text-center shadow-2xl relative overflow-hidden animate-scale-in">
                    <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 to-transparent pointer-events-none"></div>

                    <div className="relative mb-8">
                        <div className="absolute inset-0 bg-yellow-500/20 blur-3xl rounded-full"></div>
                        <div className="w-32 h-32 bg-gradient-to-br from-yellow-300 to-orange-500 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-orange-500/40 animate-bounce-slow relative z-10">
                            <FaTrophy className="text-5xl text-white drop-shadow-md" />
                        </div>
                    </div>

                    <h2 className="text-4xl font-black text-white mb-2 tracking-tight">Completed!</h2>
                    <p className="text-gray-400 mb-8 text-lg">You mastered the <span className="text-blue-400 font-semibold">{activeQuiz.title}</span> module.</p>

                    <div className="mb-10 p-6 bg-black/20 rounded-2xl border border-white/5">
                        <div className="text-sm text-gray-400 uppercase tracking-wider font-bold mb-1">Your Score</div>
                        <div className="text-6xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-green-400">
                            {score.toFixed(0)}%
                        </div>
                    </div>

                    <button
                        onClick={() => setActiveQuiz(null)}
                        className="w-full py-5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-2xl font-bold text-white text-lg transition-all shadow-xl hover:shadow-indigo-500/30 hover:scale-[1.02] active:scale-[0.98]"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    // 3. QUIZ TAKING VIEW
    const question = activeQuiz.questions[currentQuestion];
    const isLastQuestion = currentQuestion === activeQuiz.questions.length - 1;

    return (
        <div className="min-h-screen pt-24 px-4 pb-12 bg-[#0f172a] flex flex-col items-center">
            <div className="container mx-auto max-w-2xl w-full">

                {/* Header */}
                <div className="w-full mb-6 flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest pl-1 mb-1">Module</span>
                        <h2 className="text-lg font-bold text-white tracking-tight">
                            {activeQuiz.title}
                        </h2>
                    </div>
                    <button
                        onClick={() => setActiveQuiz(null)}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold text-gray-400 hover:text-white hover:bg-white/5 transition-all flex items-center gap-2 group border border-transparent hover:border-white/10"
                    >
                        <FaTimesCircle className="group-hover:text-red-400 transition-colors text-base" />
                        <span>Exit</span>
                    </button>
                </div>

                {/* Main Card */}
                <div className="w-full bg-[#1e293b]/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden transition-all duration-500">
                    {/* Decorative Blurs */}
                    <div className="absolute -top-32 -right-32 w-64 h-64 bg-blue-600/10 rounded-full blur-[80px] pointer-events-none"></div>
                    <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-purple-600/10 rounded-full blur-[80px] pointer-events-none"></div>

                    {/* Progress */}
                    <div className="relative mb-8">
                        <div className="flex justify-between items-end mb-3">
                            <span className="text-2xl font-black text-white tracking-tighter">
                                <span className="text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-400">
                                    {(currentQuestion + 1).toString().padStart(2, '0')}
                                </span>
                                <span className="text-lg text-gray-600 font-medium ml-1">/ {activeQuiz.questions.length.toString().padStart(2, '0')}</span>
                            </span>
                            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest bg-indigo-500/10 px-2 py-1 rounded-full border border-indigo-500/20">Question</span>
                        </div>
                        <div className="h-1.5 bg-black/40 rounded-full overflow-hidden shadow-inner">
                            <div
                                className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)] transition-all duration-700 ease-out"
                                style={{ width: `${((currentQuestion + 1) / activeQuiz.questions.length) * 100}%` }}
                            ></div>
                        </div>
                    </div>

                    {/* Question */}
                    <div className="relative z-10 min-h-[5rem] flex items-center mb-8">
                        <h3 className="text-xl md:text-2xl font-bold text-white leading-snug">
                            {question.questionText}
                        </h3>
                    </div>

                    {/* Options */}
                    <div className="space-y-3 mb-8 relative z-10">
                        {question.options.map((opt, idx) => {
                            const isSelected = answers[currentQuestion] === idx;
                            return (
                                <button
                                    key={idx}
                                    onClick={() => handleAnswer(idx)}
                                    className={`w-full p-4 text-left transition-all duration-200 text-sm md:text-base flex items-center justify-between group rounded-xl border ${isSelected
                                            ? 'bg-blue-600 border-blue-500 text-white shadow-lg font-semibold'
                                            : 'bg-white/5 border-transparent text-gray-300 hover:bg-white/10 hover:border-white/10 hover:pl-5'
                                        }`}
                                >
                                    <span className="relative z-10">{opt}</span>
                                    {isSelected ? (
                                        <div className="flex-shrink-0 w-6 h-6 bg-white text-blue-600 rounded-full flex items-center justify-center animate-scale-in">
                                            <FaCheckCircle className="text-sm" />
                                        </div>
                                    ) : (
                                        <div className="flex-shrink-0 w-6 h-6 rounded-full border-2 border-white/20 group-hover:border-white/40 transition-colors"></div>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Navigation */}
                    <div className="flex justify-end relative z-10 pt-4 border-t border-white/5">
                        <button
                            disabled={answers[currentQuestion] === undefined}
                            onClick={() => {
                                if (isLastQuestion) handleSubmit();
                                else setCurrentQuestion(curr => curr + 1);
                            }}
                            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-indigo-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none flex items-center gap-2 transform hover:-translate-y-0.5 active:translate-y-0 text-sm"
                        >
                            {isLastQuestion ? 'Complete' : 'Next'} <FaArrowRight />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuizPage;
