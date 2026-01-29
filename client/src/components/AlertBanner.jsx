import { useAlerts } from '../context/AlertContext';
import { useAuth } from '../context/AuthContext';
import { useEffect, useRef, useState } from 'react';
import { FaExclamationTriangle, FaTimes, FaVolumeUp, FaVolumeMute } from 'react-icons/fa';

const AlertBanner = () => {
    const { alerts } = useAlerts();
    const [visibleAlert, setVisibleAlert] = useState(null);
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [audioBlocked, setAudioBlocked] = useState(false);

    // Filter for active alerts
    const activeAlerts = alerts.filter(a => a.active);

    useEffect(() => {
        if (activeAlerts.length > 0) {
            // Prioritize emergency alerts
            const emergency = activeAlerts.find(a => a.severity === 'emergency');
            const topAlert = emergency || activeAlerts[0];
            setVisibleAlert(topAlert);

            // Auto-play sound logic for EMERGENCY only
            if (topAlert.severity === 'emergency' && audioRef.current) {
                const playPromise = audioRef.current.play();

                if (playPromise !== undefined) {
                    playPromise.then(() => {
                        setIsPlaying(true);
                        setAudioBlocked(false);
                        console.log("Siren playing");
                    }).catch(error => {
                        console.warn("Autoplay prevented:", error);
                        setAudioBlocked(true); // Show button to user
                        setIsPlaying(false);
                    });
                }
            }
        } else {
            setVisibleAlert(null);
            stopAudio();
        }
    }, [alerts]);

    const playAudio = () => {
        if (audioRef.current) {
            audioRef.current.play();
            setIsPlaying(true);
            setAudioBlocked(false);
        }
    };

    const stopAudio = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            setIsPlaying(false);
        }
    };

    const { user } = useAuth();

    if (!visibleAlert || user?.role !== 'user') return null;

    const getSeverityColor = (sev) => {
        switch (sev) {
            case 'emergency': return 'bg-red-600';
            case 'warning': return 'bg-orange-500';
            default: return 'bg-blue-600';
        }
    };

    return (
        <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
            <div className={`pointer-events-auto max-w-2xl w-full rounded-2xl shadow-2xl overflow-hidden border border-white/10 backdrop-blur-xl animate-slide-down ${visibleAlert.severity === 'emergency'
                ? 'bg-gradient-to-r from-red-600/90 to-red-800/90'
                : visibleAlert.severity === 'warning'
                    ? 'bg-gradient-to-r from-orange-600/90 to-orange-800/90'
                    : 'bg-gradient-to-r from-blue-600/90 to-blue-800/90'
                }`}>
                {/* Reliable Siren Sound Source */}
                <audio ref={audioRef} src="https://media.geeksforgeeks.org/wp-content/uploads/20190531135120/beep.mp3" loop />

                {/* Pulse Effect Overlay */}
                {visibleAlert.severity === 'emergency' && (
                    <div className="absolute inset-0 bg-red-500/20 animate-pulse"></div>
                )}

                <div className="relative p-5 flex items-start gap-5">
                    {/* Icon Section */}
                    <div className="shrink-0 relative">
                        {visibleAlert.severity === 'emergency' && (
                            <div className="absolute inset-0 bg-white rounded-full animate-ping opacity-75"></div>
                        )}
                        <div className="relative z-10 w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20">
                            <FaExclamationTriangle className="text-2xl text-white" />
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="flex-1 pt-1">
                        <div className="flex justify-between items-start mb-1">
                            <h3 className="font-black text-lg uppercase tracking-wider text-white flex items-center gap-2">
                                {visibleAlert.severity === 'emergency' ? 'Critical Alert' : visibleAlert.title}
                                {visibleAlert.severity === 'emergency' && <span className="flex h-3 w-3 relative"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span></span>}
                            </h3>
                            <div className="flex gap-2">
                                {/* Audio Controls */}
                                {visibleAlert.severity === 'emergency' && (
                                    isPlaying ? (
                                        <button onClick={stopAudio} className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-white" title="Mute Siren">
                                            <FaVolumeMute />
                                        </button>
                                    ) : (
                                        <button onClick={playAudio} className="px-3 py-1 bg-white text-red-700 font-bold text-xs rounded-lg uppercase tracking-wider animate-pulse hover:bg-gray-100 transition-colors" title="Enable Siren">
                                            Enable Sound
                                        </button>
                                    )
                                )}
                                <button onClick={() => setVisibleAlert(null)} className="p-2 bg-black/20 hover:bg-black/40 rounded-lg transition-colors text-white/70 hover:text-white" title="Dismiss">
                                    <FaTimes />
                                </button>
                            </div>
                        </div>
                        <p className="text-white/90 font-medium leading-relaxed text-sm md:text-base">
                            {visibleAlert.description}
                        </p>

                        {/* Timestamp or Footer */}
                        <div className="mt-3 flex items-center gap-2 text-xs text-white/60 font-mono uppercase">
                            <span>ResQ AI Broadcast</span>
                            <span>•</span>
                            <span>Now</span>
                        </div>
                    </div>
                </div>

                {/* Progress Bar (Visual Flair) */}
                <div className="h-1 w-full bg-black/20">
                    <div className="h-full bg-white/50 w-full animate-progress-indeterminate"></div>
                </div>
            </div>
        </div>
    );
};

export default AlertBanner;
