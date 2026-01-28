import { useState, useRef, useEffect } from 'react';
import api from '../services/api';
import { FaRobot, FaPaperPlane, FaTimes } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';

const ChatBot = ({ embedded = false }) => {
    const [isOpen, setIsOpen] = useState(embedded);
    const [messages, setMessages] = useState([
        { text: "Hello! I am your Disaster Safety Assistant. Ask me about Fire, Flood, or Earthquake safety.", isBot: true }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = input;
        setMessages(prev => [...prev, { text: userMsg, isBot: false }]);
        setInput('');
        setLoading(true);

        try {
            const { data } = await api.post('/chat', { message: userMsg });

            setMessages(prev => [...prev, {
                text: data.response,
                isBot: true,
                isEmergency: data.isEmergency
            }]);
        } catch (error) {
            setMessages(prev => [...prev, { text: "Sorry, I'm having trouble connecting to the server.", isBot: true }]);
        } finally {
            setLoading(false);
        }
    };

    // Shared Message Bubble Component
    const MessageBubble = ({ msg }) => (
        <div className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}>
            <div className={`max-w-[85%] rounded-2xl p-4 shadow-md ${msg.isBot
                    ? `bg-gray-800/80 border border-white/10 text-gray-100 ${msg.isEmergency ? 'border-red-500 bg-red-900/20' : ''}`
                    : 'bg-blue-600 text-white'
                }`}>
                <div className="flex items-start gap-3">
                    {msg.isBot && <div className="p-1 bg-white/10 rounded-full"><FaRobot className="text-blue-300" /></div>}
                    <div className="prose prose-invert prose-sm max-w-none leading-relaxed">
                        {msg.isBot ? <ReactMarkdown>{msg.text}</ReactMarkdown> : msg.text}
                    </div>
                </div>
            </div>
        </div>
    );

    // --------------------------------------------------------
    // EMBEDDED MODE (Full Screen / Dashboard)
    // --------------------------------------------------------
    if (embedded) {
        return (
            <div className="flex flex-col h-full bg-[#1F2937] text-white">
                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                    {messages.map((msg, idx) => (
                        <MessageBubble key={idx} msg={msg} />
                    ))}
                    {loading && (
                        <div className="flex justify-start">
                            <div className="bg-gray-800/50 p-4 rounded-2xl flex items-center gap-2">
                                <FaRobot className="text-blue-400 animate-bounce" />
                                <span className="text-gray-400 text-sm">Thinking...</span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-white/10 bg-gray-900/50">
                    <form className="flex gap-2 relative" onSubmit={sendMessage}>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask about safety protocols..."
                            className="w-full bg-black/30 border border-white/10 rounded-xl py-4 pl-4 pr-12 text-white focus:border-blue-500 focus:bg-black/50 transition-all outline-none"
                            autoFocus
                        />
                        <button
                            type="submit"
                            disabled={loading || !input.trim()}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <FaPaperPlane />
                        </button>
                    </form>
                    <p className="text-center text-xs text-gray-500 mt-2">
                        AI can make mistakes. For real emergencies, call 101/112.
                    </p>
                </div>
            </div>
        );
    }

    // --------------------------------------------------------
    // FLOATING WIDGET MODE (Overlay)
    // --------------------------------------------------------
    return (
        <>
            <button
                className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-500 text-white rounded-full shadow-2xl flex items-center justify-center text-2xl z-50 transition-transform hover:scale-110"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <FaTimes /> : <FaRobot />}
            </button>

            {isOpen && (
                <div className="fixed bottom-24 right-6 w-[90vw] md:w-[400px] h-[500px] bg-gray-900 border border-white/10 rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden animate-slide-up">
                    {/* Header */}
                    <div className="p-4 bg-gradient-to-r from-blue-900 to-gray-900 border-b border-white/10 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="bg-green-500 w-2 h-2 rounded-full animate-pulse"></div>
                            <h3 className="font-bold text-white">Safety Assistant</h3>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-900/95">
                        {messages.map((msg, idx) => (
                            <MessageBubble key={idx} msg={msg} />
                        ))}
                        {loading && (
                            <div className="text-gray-400 text-sm ml-2 animate-pulse">Assistant is typing...</div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <form className="p-3 bg-gray-800 border-t border-white/10 flex gap-2" onSubmit={sendMessage}>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type a question..."
                            className="flex-1 bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-blue-500 outline-none text-sm"
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="p-2 bg-blue-600 rounded-lg text-white hover:bg-blue-500 transition-colors"
                        >
                            <FaPaperPlane />
                        </button>
                    </form>
                </div>
            )}
        </>
    );
};

export default ChatBot;
