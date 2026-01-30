import { useState, useEffect } from 'react';
import api from '../services/api';
import { FaPlus, FaTrash, FaSave, FaCheckCircle, FaLayerGroup, FaListUl, FaPencilAlt } from 'react-icons/fa';

const AdminQuizPage = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [questions, setQuestions] = useState([]);
    const [publishedQuizzes, setPublishedQuizzes] = useState([]);

    // State for temporary question being built
    const [newQuestion, setNewQuestion] = useState({
        questionText: '',
        options: ['', '', '', ''],
        correctOptionIndex: 0
    });
    const [status, setStatus] = useState({ type: '', msg: '' });

    // Fetch existing quizzes on mount
    useEffect(() => {
        fetchPublishedQuizzes();
    }, []);

    const fetchPublishedQuizzes = async () => {
        try {
            const { data } = await api.get('/quizzes');
            setPublishedQuizzes(data);
        } catch (err) {
            console.error("Failed to fetch quizzes");
        }
    };

    const handleDeleteQuiz = async (id) => {
        if (!window.confirm("Are you sure you want to delete this module?")) return;
        try {
            await api.delete(`/quizzes/${id}`);
            setPublishedQuizzes(publishedQuizzes.filter(q => q._id !== id));
            setStatus({ type: 'success', msg: 'Module deleted successfully' });
        } catch (err) {
            setStatus({ type: 'error', msg: 'Failed to delete module' });
        }
    };

    const addToQuiz = () => {
        if (!newQuestion.questionText || newQuestion.options.some(o => !o)) {
            setStatus({ type: 'error', msg: 'Please fill all question fields and options' });
            setTimeout(() => setStatus({ type: '', msg: '' }), 3000);
            return;
        }
        setQuestions([...questions, { ...newQuestion }]);
        // Reset builder
        setNewQuestion({
            questionText: '',
            options: ['', '', '', ''],
            correctOptionIndex: 0
        });
    };

    const removeQuestion = (idx) => {
        const newQs = questions.filter((_, i) => i !== idx);
        setQuestions(newQs);
    };

    const updateNewQuestionOption = (idx, value) => {
        const updatedOptions = [...newQuestion.options];
        updatedOptions[idx] = value;
        setNewQuestion({ ...newQuestion, options: updatedOptions });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (questions.length === 0) {
            setStatus({ type: 'error', msg: 'Please add at least one question to the quiz' });
            return;
        }

        try {
            await api.post('/quizzes', { title, description, questions });
            // Refresh list
            fetchPublishedQuizzes();
            setStatus({ type: 'success', msg: 'Training Module Published Successfully!' });
            setTitle('');
            setDescription('');
            setQuestions([]);
        } catch (err) {
            setStatus({ type: 'error', msg: 'Failed to publish module' });
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 container mx-auto text-white max-w-5xl">
            <div className="mb-10 text-center">
                <h6 className="text-purple-400 font-bold uppercase tracking-widest text-xs mb-2">Admin Dashboard</h6>
                <h1 className="text-4xl font-black text-white">Quiz Builder</h1>
            </div>

            {status.msg && (
                <div className={`p-4 mb-8 rounded-xl flex items-center gap-3 justify-center font-bold ${status.type === 'success' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                    {status.type === 'success' ? <FaCheckCircle /> : <FaTrash />}
                    {status.msg}
                </div>
            )}

            <div className="grid lg:grid-cols-2 gap-8">
                {/* LEFT COL: Module Info & Question Builder */}
                <div className="space-y-8">
                    {/* 1. Module Info */}
                    <div className="bg-[#1e293b] border border-white/5 p-6 rounded-3xl">
                        <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-300">
                            <FaLayerGroup className="text-purple-400" /> Module Metadata
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Title</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full bg-[#0f172a] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none"
                                    placeholder="e.g. Earthquake Safety"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Description</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full bg-[#0f172a] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none h-20 resize-none"
                                    placeholder="Brief overview..."
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* 2. Add Question Form */}
                    <div className="bg-[#1e293b] border border-purple-500/30 p-6 rounded-3xl shadow-lg shadow-purple-900/10">
                        <h2 className="text-lg font-bold mb-6 flex items-center gap-2 text-white">
                            <FaPencilAlt className="text-purple-400" /> Add New Question
                        </h2>

                        <div className="space-y-5">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Question Text</label>
                                <input
                                    type="text"
                                    value={newQuestion.questionText}
                                    onChange={(e) => setNewQuestion({ ...newQuestion, questionText: e.target.value })}
                                    className="w-full bg-[#0f172a] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none font-medium"
                                    placeholder="Enter question here..."
                                />
                            </div>

                            <div className="grid grid-cols-1 gap-3">
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Options (Select correct one)</label>
                                {newQuestion.options.map((opt, idx) => (
                                    <div key={idx} className="flex items-center gap-3">
                                        <button
                                            onClick={() => setNewQuestion({ ...newQuestion, correctOptionIndex: idx })}
                                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${newQuestion.correctOptionIndex === idx ? 'border-green-500 bg-green-500' : 'border-gray-600 hover:border-gray-400'}`}
                                            title="Mark as Correct"
                                        >
                                            {newQuestion.correctOptionIndex === idx && <FaCheckCircle className="text-white text-xs" />}
                                        </button>
                                        <input
                                            type="text"
                                            value={opt}
                                            onChange={(e) => updateNewQuestionOption(idx, e.target.value)}
                                            className={`flex-1 bg-[#0f172a] border rounded-lg px-3 py-2 text-sm text-white outline-none ${newQuestion.correctOptionIndex === idx ? 'border-green-500/50' : 'border-white/10'}`}
                                            placeholder={`Option ${idx + 1}`}
                                        />
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={addToQuiz}
                                type="button"
                                className="w-full py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                            >
                                <FaPlus /> Add to Quiz List
                            </button>
                        </div>
                    </div>
                </div>

                {/* RIGHT COL: Manage Quizzes & Build Queue */}
                <div className="flex flex-col h-full gap-8">

                    {/* 1. PUBLISHED QUIZZES (NEW SECTION) */}
                    <div className="bg-[#1e293b] border border-blue-500/30 p-6 rounded-3xl flex-1 flex flex-col max-h-[400px]">
                        <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-white">
                            <FaLayerGroup className="text-blue-400" /> Published Modules
                        </h2>
                        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3">
                            {publishedQuizzes.length === 0 ? (
                                <p className="text-gray-500 text-sm text-center py-4">No published modules yet.</p>
                            ) : (
                                publishedQuizzes.map(quiz => (
                                    <div key={quiz._id} className="bg-[#0f172a] p-3 rounded-xl border border-white/5 flex items-center justify-between">
                                        <div>
                                            <p className="font-bold text-white text-sm">{quiz.title}</p>
                                            <p className="text-xs text-gray-500">{quiz.questions.length} Questions</p>
                                        </div>
                                        <button
                                            onClick={() => handleDeleteQuiz(quiz._id)}
                                            className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                                            title="Delete Module"
                                        >
                                            <FaTrash size={14} />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* 2. CURRENT BUILD QUEUE */}
                    <div className="bg-[#1e293b] border border-white/5 p-6 rounded-3xl flex-1 flex flex-col">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-bold flex items-center gap-2 text-gray-300">
                                <FaListUl className="text-purple-400" /> Questions Queue
                                <span className="bg-purple-500 text-white text-xs px-2 py-1 rounded-full">{questions.length}</span>
                            </h2>
                        </div>

                        <div className="flex-1 overflow-y-auto max-h-[300px] space-y-3 custom-scrollbar">
                            {questions.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-gray-600 border-2 border-dashed border-white/5 rounded-2xl p-8">
                                    <p className="text-sm">Queue is empty.</p>
                                    <p className="text-xs mt-1">Add questions from the left.</p>
                                </div>
                            ) : (
                                questions.map((q, idx) => (
                                    <div key={idx} className="bg-[#0f172a] p-4 rounded-xl border border-white/5 flex items-start justify-between group">
                                        <div>
                                            <p className="font-bold text-white text-sm mb-1">
                                                <span className="text-purple-500 mr-2">Q{idx + 1}.</span>
                                                {q.questionText}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                Correct Answer: <span className="text-green-400">{q.options[q.correctOptionIndex]}</span>
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => removeQuestion(idx)}
                                            className="text-gray-600 hover:text-red-400 p-2 transition-colors"
                                            title="Remove"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="pt-6 mt-6 border-t border-white/10">
                            <button
                                onClick={handleSubmit}
                                disabled={questions.length === 0 || !title}
                                className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                <FaSave /> Publish Entire Module
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminQuizPage;
