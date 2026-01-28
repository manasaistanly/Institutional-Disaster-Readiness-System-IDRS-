import { useAlerts } from '../context/AlertContext';
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

    if (!visibleAlert) return null;

    const getSeverityColor = (sev) => {
        switch (sev) {
            case 'emergency': return 'bg-red-600';
            case 'warning': return 'bg-orange-500';
            default: return 'bg-blue-600';
        }
    };

    return (
        <div className={`fixed top-0 left-0 w-full z-50 text-white shadow-lg animate-pulse-slow ${getSeverityColor(visibleAlert.severity)}`}>
            {/* Reliable Siren Sound Source */}
            <audio ref={audioRef} src="https://media.geeksforgeeks.org/wp-content/uploads/20190531135120/beep.mp3" loop />

            <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <FaExclamationTriangle className="text-2xl animate-bounce" />
                    <div>
                        <h3 className="font-bold text-lg uppercase tracking-wider">
                            {visibleAlert.severity === 'emergency' ? '🚨 EMERGENCY ALERT 🚨' : visibleAlert.title}
                        </h3>
                        <p className="text-sm md:text-base font-medium">
                            {visibleAlert.description}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {/* Audio Controls */}
                    {visibleAlert.severity === 'emergency' && (
                        <>
                            {audioBlocked && !isPlaying && (
                                <button
                                    onClick={playAudio}
                                    className="bg-white text-red-600 px-4 py-1.5 rounded-full font-bold animate-pulse hover:bg-gray-100 transition shadow-lg"
                                >
                                    <FaVolumeUp className="inline mr-2" /> ENABLE SOUND
                                </button>
                            )}

                            {isPlaying && (
                                <button
                                    onClick={stopAudio}
                                    className="bg-black/20 hover:bg-black/30 p-2 rounded-full transition text-white flex items-center gap-2"
                                >
                                    <FaVolumeMute />
                                    <span className="text-xs font-bold">SILENCE</span>
                                </button>
                            )}
                        </>
                    )}

                    <button
                        onClick={() => setVisibleAlert(null)} // Dismiss locally only
                        className="text-white/80 hover:text-white"
                        title="Dismiss Banner"
                    >
                        <FaTimes size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AlertBanner;
