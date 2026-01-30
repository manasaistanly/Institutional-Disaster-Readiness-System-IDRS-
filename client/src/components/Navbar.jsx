import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaShieldAlt, FaUserCircle, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
        setIsMenuOpen(false);
    };

    return (
        <nav className="sticky top-0 z-50 w-full backdrop-blur-md bg-black/40 border-b border-white/5">
            <div className="container mx-auto px-4 py-4">
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-2 group z-50">
                        <div className="bg-blue-600 p-2 rounded-lg group-hover:bg-blue-500 transition-colors">
                            <FaShieldAlt className="text-white text-xl" />
                        </div>
                        <span className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300 group-hover:to-white transition-all">
                            ResQ AI
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-6">
                        {user ? (
                            <div className="flex items-center gap-4">
                                <Link
                                    to="/dashboard"
                                    className="text-gray-400 hover:text-white font-medium transition-colors"
                                >
                                    Dashboard
                                </Link>

                                <Link
                                    to={user.role === 'user' ? "/training" : "/admin/quiz"}
                                    className="text-gray-400 hover:text-white font-medium transition-colors"
                                >
                                    Quiz
                                </Link>

                                <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-full border border-white/5">
                                    <span className="flex items-center gap-2 font-semibold text-sm text-blue-200">
                                        <FaUserCircle className="text-lg" />
                                        {user.name}
                                    </span>
                                    <div className="h-4 w-[1px] bg-white/10"></div>
                                    <button
                                        onClick={handleLogout}
                                        className="text-red-400 hover:text-red-300 transition-colors flex items-center"
                                        title="Logout"
                                    >
                                        <FaSignOutAlt />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <Link
                                to="/login"
                                className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-full font-bold transition-all shadow-lg hover:shadow-blue-600/20"
                            >
                                Login
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden text-white text-2xl z-50 focus:outline-none"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <FaTimes /> : <FaBars />}
                    </button>
                </div>

                {/* Mobile Menu Overlay */}
                {isMenuOpen && (
                    <div className="absolute top-0 left-0 w-full h-screen bg-[#111827] flex flex-col items-center justify-center gap-8 md:hidden z-40 animate-fade-in-down">
                        {user ? (
                            <>
                                <div className="text-center">
                                    <FaUserCircle className="text-5xl text-blue-500 mx-auto mb-2" />
                                    <h3 className="text-xl font-bold text-white">{user.name}</h3>
                                    <p className="text-gray-400 text-sm capitalize">{user.role.replace('_', ' ')}</p>
                                </div>

                                <Link
                                    to="/dashboard"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="text-2xl text-white hover:text-blue-400 font-bold"
                                >
                                    Dashboard
                                </Link>

                                <Link
                                    to={user.role === 'user' ? "/training" : "/admin/quiz"}
                                    onClick={() => setIsMenuOpen(false)}
                                    className="text-2xl text-white hover:text-blue-400 font-bold"
                                >
                                    Quiz
                                </Link>

                                <button
                                    onClick={handleLogout}
                                    className="text-xl text-red-500 hover:text-red-400 flex items-center gap-2"
                                >
                                    <FaSignOutAlt /> Logout
                                </button>
                            </>
                        ) : (
                            <Link
                                to="/login"
                                onClick={() => setIsMenuOpen(false)}
                                className="bg-blue-600 px-8 py-3 rounded-full text-xl font-bold text-white shadow-lg"
                            >
                                Login
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
