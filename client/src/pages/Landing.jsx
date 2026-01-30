import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBolt, FaRobot, FaClipboardCheck, FaPhoneAlt, FaAmbulance, FaFireExtinguisher, FaHardHat, FaTimes } from 'react-icons/fa';

const Landing = () => {
    const [showSOS, setShowSOS] = useState(false);

    const handleCall = (number) => {
        window.location.href = `tel:${number}`;
    };

    return (
        <div className="min-h-screen bg-[#111827] text-white overflow-hidden">
            {/* Hero Section */}
            <header className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
                {/* Background Glows */}
                <div className="absolute top-20 left-10 w-72 h-72 bg-blue-600/20 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px]"></div>

                <div className="container mx-auto px-4 text-center z-10">
                    <div className="inline-block mb-4 px-4 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm font-semibold tracking-wider uppercase animate-fade-in-up">
                        ResQ AI: Disaster Readiness
                    </div>
                    <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight animate-fade-in-up delay-100">
                        Stay <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Safe.</span> <br />
                        Stay <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">Prepared.</span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up delay-200">
                        The next-generation disaster management system. Seamless alerts, AI guidance, and verified protocols right at your command center.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-300">
                        <Link
                            to="/login"
                            className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-blue-600/25"
                        >
                            Get Started
                        </Link>
                        <button
                            onClick={() => setShowSOS(true)}
                            className="w-full sm:w-auto px-8 py-4 bg-red-600/20 hover:bg-red-600/30 border border-red-500/50 text-red-400 rounded-xl font-bold text-lg transition-all shadow-lg shadow-red-900/10 flex items-center justify-center gap-2"
                        >
                            <FaPhoneAlt className="animate-pulse" /> Emergency SOS
                        </button>
                    </div>
                </div>
            </header>

            {/* Features Grid */}
            <section className="container mx-auto px-4 py-20">
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="p-8 rounded-3xl bg-white/5 border border-white/5 backdrop-blur-sm hover:transform hover:-translate-y-2 transition-all duration-300 group">
                        <div className="w-14 h-14 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-6 text-blue-400 group-hover:text-blue-300 group-hover:bg-blue-500/30 transition-colors">
                            <FaBolt className="text-2xl" />
                        </div>
                        <h3 className="text-2xl font-bold mb-3 text-gray-100">Real-time Alerts</h3>
                        <p className="text-gray-400 leading-relaxed">
                            Instant, verified broadcasts from administration directly to your device. Never miss a critical warning.
                        </p>
                    </div>

                    <div className="p-8 rounded-3xl bg-white/5 border border-white/5 backdrop-blur-sm hover:transform hover:-translate-y-2 transition-all duration-300 group">
                        <div className="w-14 h-14 bg-purple-500/20 rounded-2xl flex items-center justify-center mb-6 text-purple-400 group-hover:text-purple-300 group-hover:bg-purple-500/30 transition-colors">
                            <FaRobot className="text-2xl" />
                        </div>
                        <h3 className="text-2xl font-bold mb-3 text-gray-100">AI Chatbot</h3>
                        <p className="text-gray-400 leading-relaxed">
                            24/7 intelligent assistant ready to answer safety queries and guide you through emergency protocols instantly.
                        </p>
                    </div>

                    <div className="p-8 rounded-3xl bg-white/5 border border-white/5 backdrop-blur-sm hover:transform hover:-translate-y-2 transition-all duration-300 group">
                        <div className="w-14 h-14 bg-green-500/20 rounded-2xl flex items-center justify-center mb-6 text-green-400 group-hover:text-green-300 group-hover:bg-green-500/30 transition-colors">
                            <FaClipboardCheck className="text-2xl" />
                        </div>
                        <h3 className="text-2xl font-bold mb-3 text-gray-100">Live Drills</h3>
                        <p className="text-gray-400 leading-relaxed">
                            Participate in scheduled mock drills to ensure you are always ready for the unexpected.
                        </p>
                    </div>
                </div>
            </section>

            {/* SOS MODAL */}
            {showSOS && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
                    <div className="bg-[#1f2937] border border-red-500/30 w-full max-w-md rounded-3xl p-6 shadow-2xl relative overflow-hidden">
                        {/* Red Pulse Effect */}
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 to-orange-500 animate-pulse"></div>

                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                                    <FaPhoneAlt className="text-red-500" /> Emergency SOS
                                </h2>
                                <p className="text-gray-400 text-sm mt-1">Tap to call immediately</p>
                            </div>
                            <button onClick={() => setShowSOS(false)} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition">
                                <FaTimes />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <button
                                onClick={() => handleCall('112')}
                                className="w-full flex items-center justify-between p-4 bg-red-600 hover:bg-red-500 rounded-xl transition-all group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-black/20 rounded-lg flex items-center justify-center text-white">
                                        <FaPhoneAlt />
                                    </div>
                                    <div className="text-left">
                                        <h3 className="font-bold text-white">General Emergency</h3>
                                        <p className="text-red-100 text-xs">Police / Fire / Ambulance</p>
                                    </div>
                                </div>
                                <span className="text-2xl font-bold text-white group-hover:scale-110 transition-transform">112</span>
                            </button>

                            <button
                                onClick={() => handleCall('101')}
                                className="w-full flex items-center justify-between p-4 bg-orange-600 hover:bg-orange-500 rounded-xl transition-all group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-black/20 rounded-lg flex items-center justify-center text-white">
                                        <FaFireExtinguisher />
                                    </div>
                                    <div className="text-left">
                                        <h3 className="font-bold text-white">Fire Service</h3>
                                        <p className="text-orange-100 text-xs">Fire Accidents</p>
                                    </div>
                                </div>
                                <span className="text-2xl font-bold text-white group-hover:scale-110 transition-transform">101</span>
                            </button>

                            <button
                                onClick={() => handleCall('108')}
                                className="w-full flex items-center justify-between p-4 bg-green-600 hover:bg-green-500 rounded-xl transition-all group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-black/20 rounded-lg flex items-center justify-center text-white">
                                        <FaAmbulance />
                                    </div>
                                    <div className="text-left">
                                        <h3 className="font-bold text-white">Ambulance</h3>
                                        <p className="text-green-100 text-xs">Medical Emergency</p>
                                    </div>
                                </div>
                                <span className="text-2xl font-bold text-white group-hover:scale-110 transition-transform">108</span>
                            </button>
                        </div>

                        <div className="mt-6 pt-4 border-t border-white/5 text-center">
                            <p className="text-xs text-gray-500">
                                Only use this feature in case of genuine emergencies. Misuse is punishable by law.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Landing;
