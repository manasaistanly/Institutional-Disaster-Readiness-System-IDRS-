import { useState, useRef, useEffect } from 'react';
import api from '../services/api';
import { FaRobot, FaPaperPlane, FaTimes, FaFire, FaHeartbeat, FaWater, FaGlobeAmericas } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';

const ChatBot = ({ embedded = false }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const textareaRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        // Only scroll to bottom if:
        // 1. We are loading (showing typing indicator)
        // 2. The last message is from the User (so they see what they just sent)
        // We DO NOT scroll for Bot messages, so the user stays at the top of the new answer to read it.
        const lastMsg = messages[messages.length - 1];
        if (loading || (lastMsg && !lastMsg.isBot)) {
            scrollToBottom();
        }
    }, [messages, loading]);

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 150) + 'px';
        }
    }, [input]);

    const sendMessage = async (msgText = input) => {
        if (!msgText.trim() || loading) return;

        const userMsg = msgText;
        setMessages(prev => [...prev, { text: userMsg, isBot: false }]);
        setInput('');
        setLoading(true);

        // Reset height
        if (textareaRef.current) textareaRef.current.style.height = 'auto';

        try {
            const { data } = await api.post('/chat', { message: userMsg });

            setMessages(prev => [...prev, {
                text: data.response,
                isBot: true,
                isEmergency: data.isEmergency
            }]);
        } catch (error) {
            setMessages(prev => [...prev, {
                text: "⚠️ **Connection Error**: I'm having trouble retrieving the information. Please check your connection or call emergency services directly.",
                isBot: true,
                isError: true
            }]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    // --------------------------------------------------------
    // UI COMPONENTS
    // --------------------------------------------------------

    const MessageBubble = ({ msg }) => (
        <div className={`flex w-full ${msg.isBot ? 'justify-start' : 'justify-end'} mb-6 group`}>

            {/* Avatar for Bot (Left side) */}
            {msg.isBot && (
                <div className="flex-shrink-0 mr-4 mt-0.5 hidden md:block">
                    <div className={`w-8 h-8 rounded-sm flex items-center justify-center ${msg.isEmergency ? 'bg-red-600' : 'bg-[#10a37f]' // Standard AI Green
                        }`}>
                        <FaRobot className="text-white text-sm" />
                    </div>
                </div>
            )}

            {/* Bubble Layout */}
            <div className={`relative max-w-[95%] md:max-w-[85%] ${!msg.isBot
                ? 'bg-[#2f2f2f] text-white rounded-3xl px-5 py-3 ml-auto' // User bubble looks like a pill
                : 'text-gray-100 pl-0' // Bot message has NO background, just text
                }`}>

                {/* Emergency Header if needed */}
                {msg.isBot && msg.isEmergency && (
                    <div className="inline-flex items-center gap-2 text-red-400 font-bold mb-3 text-sm border border-red-500/30 bg-red-900/20 px-3 py-1 rounded-full">
                        <FaFire /> EMERGENCY ALERT
                    </div>
                )}

                {/* Content - GPT Style Typography */}
                <div className={`prose prose-invert max-w-none ${msg.isBot ? 'text-[16px] leading-7' : 'text-[16px]'}`}>
                    <ReactMarkdown components={{
                        p: ({ node, ...props }) => <p className="mb-4 last:mb-0 text-gray-100 font-light" {...props} />,
                        strong: ({ node, ...props }) => <strong className="font-bold text-white" {...props} />,
                        ul: ({ node, ...props }) => <ul className="list-disc pl-6 mb-4 space-y-1" {...props} />,
                        ol: ({ node, ...props }) => <ol className="list-decimal pl-6 mb-4 space-y-1" {...props} />,
                        li: ({ node, ...props }) => <li className="pl-1" {...props} />,
                        h1: ({ node, ...props }) => <h1 className="text-2xl font-bold text-white mb-4" {...props} />,
                        h2: ({ node, ...props }) => <h2 className="text-xl font-bold text-white mb-3 mt-6" {...props} />,
                        h3: ({ node, ...props }) => <h3 className="text-lg font-bold text-white mb-2 mt-4" {...props} />,
                    }}>
                        {msg.text}
                    </ReactMarkdown>
                </div>
            </div>
        </div>
    );

    // --------------------------------------------------------
    // EMPTY STATE (No Welcome Screen, just Logo)
    // --------------------------------------------------------
    const EmptyState = () => (
        <div className="flex flex-col items-center justify-center h-full opacity-30">
            <div className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center mb-4">
                <FaRobot className="text-3xl" />
            </div>
            <h2 className="text-xl font-semibold text-white">Disaster Readiness Bot</h2>
        </div>
    );

    // --------------------------------------------------------
    // EMBEDDED MODE (Full Screen / Dashboard)
    // --------------------------------------------------------
    if (embedded) {
        return (
            <div className="flex flex-col h-full bg-[#171717] text-gray-100">
                {/* Main Chat Area */}
                <div className="flex-1 overflow-y-auto relative z-0 custom-scrollbar scroll-smooth">
                    {messages.length === 0 ? (
                        <EmptyState />
                    ) : (
                        <div className="w-full max-w-3xl mx-auto p-4 md:p-6 pb-2 min-h-full">
                            {messages.map((msg, idx) => (
                                <MessageBubble key={idx} msg={msg} />
                            ))}

                            {loading && (
                                <div className="flex justify-start mb-8 pl-0 md:pl-12">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:0.2s]"></div>
                                        <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:0.4s]"></div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} className="h-4" />
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <div className="flex-none p-4 pb-6 bg-[#171717] mx-auto w-full max-w-3xl">
                    <div className="relative bg-[#2f2f2f] rounded-[26px] p-1 flex flex-col focus-within:ring-1 focus-within:ring-gray-400/50 transition-all">
                        <textarea
                            ref={textareaRef}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Message Disaster Bot..."
                            className="w-full bg-transparent text-white placeholder-gray-400 text-[16px] p-3 pl-4 max-h-[200px] min-h-[52px] resize-none outline-none custom-scrollbar leading-relaxed"
                            rows={1}
                        />
                        <div className="flex justify-between items-center px-2 pb-1">
                            <div className="text-xs text-gray-500 pl-2 hidden md:block">
                                AI can make mistakes. Always verify critical safety info.
                            </div>
                            <button
                                type="submit"
                                onClick={(e) => { e.preventDefault(); sendMessage(); }}
                                disabled={loading || !input.trim()}
                                className={`p-2 rounded-full transition-all duration-200 ${input.trim() && !loading
                                    ? 'bg-white text-black hover:bg-gray-200'
                                    : 'bg-[#676767] text-[#2f2f2f] cursor-not-allowed'
                                    }`}
                            >
                                <FaPaperPlane className="text-sm" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return null;
};

export default ChatBot;
