import { useAuth } from '../context/AuthContext';
import { useAlerts } from '../context/AlertContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import ChatBot from '../components/ChatBot';
import DisasterFeed from '../components/DisasterFeed';
import { FaBullhorn, FaFileAlt, FaCalendarAlt } from 'react-icons/fa';

const Dashboard = () => {
    const { user, loading } = useAuth();
    const { alerts } = useAlerts();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && !user) navigate('/login');
    }, [user, loading, navigate]);

    if (loading || !user) return (
        <div className="min-h-screen flex items-center justify-center text-white">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );

    return (
        <div className="min-h-screen container mx-auto px-4 py-8 text-white">

            {/* ALERT SECTION */}
            {/* ALERT SECTION - USERS ONLY */}
            {user.role === 'user' && alerts.length > 0 && (
                <section className="mb-4 space-y-4">
                    {alerts.map(alert => (
                        <div key={alert._id} className={`p-4 rounded-xl border-l-4 backdrop-blur-md ${alert.severity === 'emergency' ? 'bg-red-900/20 border-red-500' :
                            alert.severity === 'warning' ? 'bg-orange-900/20 border-orange-500' :
                                'bg-blue-900/20 border-blue-500'
                            }`}>
                            <div className="flex items-center gap-3">
                                <span className={`text-xs font-bold px-2 py-0.5 rounded uppercase ${alert.severity === 'emergency' ? 'bg-red-500 text-white' :
                                    alert.severity === 'warning' ? 'bg-orange-500 text-white' :
                                        'bg-blue-500 text-white'
                                    }`}>
                                    {alert.severity}
                                </span>
                                <h3 className="font-bold">{alert.title}</h3>
                            </div>
                            <p className="mt-2 text-gray-300 text-sm">{alert.description}</p>
                        </div>
                    ))}
                </section>
            )}

            <div className="dashboard-content h-full">

                {/* === USER VIEW: CHATBOT + DISASTER FEED === */}
                {user.role === 'user' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[85vh]">
                        {/* Chatbot - Takes 2 columns */}
                        <div className="lg:col-span-2 rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-[#171717]">
                            <ChatBot embedded={true} />
                        </div>

                        {/* Disaster Feed - Takes 1 column on right */}
                        <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl hidden lg:block">
                            <DisasterFeed />
                        </div>
                    </div>
                )}

                {/* === ADMIN VIEW: MANAGEMENT WIDGETS === */}
                {(user.role === 'institution_admin' || user.role === 'super_admin') && (
                    <div className="grid md:grid-cols-3 gap-6">
                        {/* Broadcast Widget */}
                        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition group">
                            <div className="w-12 h-12 rounded-lg bg-red-500/20 flex items-center justify-center mb-4 text-red-400 group-hover:bg-red-500/30">
                                <FaBullhorn className="text-xl" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Broadcast Alert</h3>
                            <p className="text-gray-400 text-sm mb-6">Issue a new warning to all users instantly.</p>
                            <button
                                onClick={() => navigate('/admin')}
                                className="w-full py-3 bg-red-600 hover:bg-red-500 rounded-lg font-bold transition shadow-lg shadow-red-900/20"
                            >
                                Create Alert
                            </button>
                        </div>

                        {/* SOP Widget */}
                        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition group">
                            <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center mb-4 text-blue-400 group-hover:bg-blue-500/30">
                                <FaFileAlt className="text-xl" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Manage SOPs</h3>
                            <p className="text-gray-400 text-sm mb-6">Upload and organize safety documents.</p>
                            <button
                                onClick={() => navigate('/admin/sops')}
                                className="w-full py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-bold transition shadow-lg shadow-blue-900/20"
                            >
                                Upload SOP
                            </button>
                        </div>

                        {/* Drill Widget */}
                        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition group">
                            <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center mb-4 text-green-400 group-hover:bg-green-500/30">
                                <FaCalendarAlt className="text-xl" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Drill Scheduler</h3>
                            <p className="text-gray-400 text-sm mb-6">Plan and track institutional mock drills.</p>
                            <button
                                onClick={() => navigate('/admin/drills')}
                                className="w-full py-3 bg-green-600 hover:bg-green-500 rounded-lg font-bold transition shadow-lg shadow-green-900/20"
                            >
                                Schedule Drill
                            </button>
                        </div>
                    </div>
                )}

            </div>

            {/* Floating Chat for Admins */}
            {user.role !== 'user' && <ChatBot />}
        </div>
    );
};

export default Dashboard;
