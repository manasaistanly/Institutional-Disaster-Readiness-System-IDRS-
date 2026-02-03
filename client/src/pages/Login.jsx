import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaUser, FaShieldAlt, FaMapMarkerAlt } from 'react-icons/fa';
import { indianStates, getDistrictsForState } from '../data/indianRegions';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isRegister, setIsRegister] = useState(false);
    const [name, setName] = useState(''); // For register

    // Location fields
    const [state, setState] = useState('Telangana');
    const [district, setDistrict] = useState('Hyderabad');
    const [city, setCity] = useState('');
    const [availableDistricts, setAvailableDistricts] = useState(getDistrictsForState('Telangana'));

    const { login, register } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleStateChange = (newState) => {
        setState(newState);
        const districts = getDistrictsForState(newState);
        setAvailableDistricts(districts);
        setDistrict(districts[0]); // Auto-select first district
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            if (isRegister) {
                await register({
                    name,
                    email,
                    password,
                    location: { state, district, city, country: 'India' }
                });
            } else {
                await login(email, password);
            }
            navigate('/dashboard');
        } catch (err) {
            console.error('Login Error:', err);
            setError(err.response?.data?.message || 'Authentication failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-[#111827]">
            {/* Background Decor */}
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/30 rounded-full blur-[128px]"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/30 rounded-full blur-[128px]"></div>

            <div className="w-full max-w-md backdrop-blur-xl bg-white/10 border border-white/10 p-8 rounded-3xl shadow-2xl relative z-10">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 mb-4 shadow-lg shadow-blue-500/30">
                        <FaShieldAlt className="text-3xl text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-2">{isRegister ? 'Create Account' : 'Welcome Back'}</h2>
                    <p className="text-gray-400 text-sm">
                        {isRegister ? 'Join the ResQ AI disaster response network' : 'Enter your credentials to access the system'}
                    </p>
                </div>

                {error && (
                    <div className="mb-6 p-4 rounded-xl bg-red-500/20 border border-red-500/30 text-red-200 text-sm text-center animate-pulse">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    {isRegister && (
                        <div className="relative group">
                            <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-400 transition-colors" />
                            <input
                                type="text"
                                placeholder="Full Name"
                                className="w-full bg-black/30 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-blue-500 focus:bg-black/50 transition-all placeholder-gray-500"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                    )}

                    {isRegister && (
                        <>
                            {/* State Selector */}
                            <div className="relative group">
                                <FaMapMarkerAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-400 transition-colors" />
                                <select
                                    value={state}
                                    onChange={(e) => handleStateChange(e.target.value)}
                                    className="w-full bg-black/30 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-blue-500 focus:bg-black/50 transition-all appearance-none cursor-pointer"
                                    required
                                >
                                    {indianStates.map(s => (
                                        <option key={s} value={s} className="bg-gray-900">{s}</option>
                                    ))}
                                </select>
                            </div>

                            {/* District Selector */}
                            <div className="relative group">
                                <FaMapMarkerAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-400 transition-colors" />
                                <select
                                    value={district}
                                    onChange={(e) => setDistrict(e.target.value)}
                                    className="w-full bg-black/30 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-blue-500 focus:bg-black/50 transition-all appearance-none cursor-pointer"
                                    required
                                >
                                    {availableDistricts.map(d => (
                                        <option key={d} value={d} className="bg-gray-900">{d}</option>
                                    ))}
                                </select>
                            </div>

                            {/* City Input (Optional) */}
                            <div className="relative group">
                                <FaMapMarkerAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-400 transition-colors" />
                                <input
                                    type="text"
                                    placeholder="City/Area (Optional)"
                                    className="w-full bg-black/30 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-blue-500 focus:bg-black/50 transition-all placeholder-gray-500"
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                />
                            </div>
                        </>
                    )}

                    <div className="relative group">
                        <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-400 transition-colors" />
                        <input
                            type="email"
                            placeholder="Email Address"
                            className="w-full bg-black/30 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-blue-500 focus:bg-black/50 transition-all placeholder-gray-500"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="relative group">
                        <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-400 transition-colors" />
                        <input
                            type="password"
                            placeholder="Password"
                            className="w-full bg-black/30 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-blue-500 focus:bg-black/50 transition-all placeholder-gray-500"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-3.5 rounded-xl transition-all transform hover:scale-[1.02] shadow-lg shadow-blue-900/40 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Processing...' : (isRegister ? 'Sign Up' : 'Login')}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-gray-400 text-sm">
                        {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
                        <button
                            type="button"
                            onClick={() => setIsRegister(!isRegister)}
                            className="text-blue-400 hover:text-blue-300 font-semibold ml-1 transition-colors outline-none"
                        >
                            {isRegister ? 'Login' : 'Register'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
