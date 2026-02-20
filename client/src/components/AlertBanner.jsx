import { useAlerts } from '../context/AlertContext';
import { useAuth } from '../context/AuthContext';
import { useEffect, useRef, useState, useCallback } from 'react';
import { FaExclamationTriangle, FaTimes, FaVolumeUp, FaVolumeMute } from 'react-icons/fa';

const AlertBanner = () => {
    const { alerts } = useAlerts();
    const [visibleAlert, setVisibleAlert] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [dismissedAlerts, setDismissedAlerts] = useState(new Set());

    // Web Audio API refs — no mp3 file needed
    const audioCtxRef = useRef(null);
    const gainRef = useRef(null);
    const intervalRef = useRef(null);

    // Filter for active alerts that haven't been dismissed
    const activeAlerts = alerts.filter(a => a.active && !dismissedAlerts.has(a._id));

    // Get or create AudioContext (must be created/resumed after a user gesture on some browsers)
    const getAudioCtx = useCallback(() => {
        if (!audioCtxRef.current) {
            audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtxRef.current.state === 'suspended') {
            audioCtxRef.current.resume();
        }
        return audioCtxRef.current;
    }, []);

    const stopSirenInternal = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        if (gainRef.current) {
            try { gainRef.current.disconnect(); } catch (e) { /* ignore */ }
            gainRef.current = null;
        }
    }, []);

    // Generates a pulsing two-tone siren using Web Audio API
    const startSiren = useCallback(() => {
        try {
            const ctx = getAudioCtx();
            stopSirenInternal();

            gainRef.current = ctx.createGain();
            gainRef.current.gain.setValueAtTime(0.4, ctx.currentTime);
            gainRef.current.connect(ctx.destination);

            let high = true;
            const beep = () => {
                if (!gainRef.current) return;
                const osc = ctx.createOscillator();
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(high ? 880 : 660, ctx.currentTime);
                osc.connect(gainRef.current);
                osc.start();
                osc.stop(ctx.currentTime + 0.4);
                high = !high;
            };

            beep();
            intervalRef.current = setInterval(beep, 500);
            setIsPlaying(true);
            setIsMuted(false);
            console.log('Emergency siren playing');
        } catch (err) {
            console.warn('Web Audio API siren failed:', err);
            setIsPlaying(false);
        }
    }, [getAudioCtx, stopSirenInternal]);

    const stopAudio = useCallback(() => {
        stopSirenInternal();
        setIsPlaying(false);
        setIsMuted(false);
        console.log('Siren stopped');
    }, [stopSirenInternal]);

    const playAudio = () => {
        setIsMuted(false);
        startSiren();
    };

    const toggleMute = () => {
        if (isMuted) {
            startSiren();
        } else {
            stopSirenInternal();
            setIsPlaying(false);
            setIsMuted(true);
            console.log('Siren muted');
        }
    };

    useEffect(() => {
        if (activeAlerts.length > 0) {
            const emergency = activeAlerts.find(a => a.severity === 'emergency');
            const topAlert = emergency || activeAlerts[0];
            setVisibleAlert(topAlert);

            // Auto-play for emergency alerts
            // Web Audio API has better autoplay support than <audio> tags
            if (topAlert.severity === 'emergency' && !isMuted) {
                startSiren();
            }
        } else {
            setVisibleAlert(null);
            stopAudio();
        }

        return () => {
            stopSirenInternal();
        };
    }, [activeAlerts.length, alerts, startSiren, stopAudio, stopSirenInternal]);

    const { user } = useAuth();

    if (!visibleAlert || user?.role !== 'user') return null;

    return (
        <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
            <div className={`pointer-events-auto max-w-2xl w-full rounded-2xl shadow-2xl overflow-hidden border border-white/10 backdrop-blur-xl animate-slide-down ${visibleAlert.severity === 'emergency'
                ? 'bg-gradient-to-r from-red-600/90 to-red-800/90'
                : visibleAlert.severity === 'warning'
                    ? 'bg-gradient-to-r from-orange-600/90 to-orange-800/90'
                    : 'bg-gradient-to-r from-blue-600/90 to-blue-800/90'
                }`}>

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
                                {visibleAlert.severity === 'emergency' && (
                                    <span className="flex h-3 w-3 relative">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                                    </span>
                                )}
                            </h3>

                            <div className="flex gap-2">
                                {/* Audio Controls — only shown for emergency alerts */}
                                {visibleAlert.severity === 'emergency' && (
                                    isPlaying ? (
                                        <button
                                            onClick={toggleMute}
                                            className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-white"
                                            title="Mute Siren"
                                        >
                                            <FaVolumeMute />
                                        </button>
                                    ) : isMuted ? (
                                        <button
                                            onClick={toggleMute}
                                            className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-white"
                                            title="Unmute Siren"
                                        >
                                            <FaVolumeUp />
                                        </button>
                                    ) : (
                                        <button
                                            onClick={playAudio}
                                            className="px-3 py-1 bg-white text-red-700 font-bold text-xs rounded-lg uppercase tracking-wider animate-pulse hover:bg-gray-100 transition-colors"
                                            title="Enable Siren"
                                        >
                                            Enable Sound
                                        </button>
                                    )
                                )}

                                {/* Dismiss Button */}
                                <button
                                    onClick={() => {
                                        stopAudio();
                                        if (visibleAlert) {
                                            setDismissedAlerts(prev => new Set([...prev, visibleAlert._id]));
                                        }
                                        setVisibleAlert(null);
                                    }}
                                    className="p-2 bg-black/20 hover:bg-black/40 rounded-lg transition-colors text-white/70 hover:text-white"
                                    title="Dismiss"
                                >
                                    <FaTimes />
                                </button>
                            </div>
                        </div>

                        <p className="text-white/90 font-medium leading-relaxed text-sm md:text-base">
                            {visibleAlert.description}
                        </p>

                        {/* Timestamp Footer */}
                        <div className="mt-3 flex items-center gap-2 text-xs text-white/60 font-mono uppercase">
                            <span>ResQ AI Broadcast</span>
                            <span>•</span>
                            <span>Now</span>
                        </div>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="h-1 w-full bg-black/20">
                    <div className="h-full bg-white/50 w-full animate-progress-indeterminate"></div>
                </div>
            </div>
        </div>
    );
};

export default AlertBanner;
