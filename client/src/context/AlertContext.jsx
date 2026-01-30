import { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const AlertContext = createContext();

export const useAlerts = () => useContext(AlertContext);

export const AlertProvider = ({ children }) => {
    const [alerts, setAlerts] = useState([]);
    const { user } = useAuth();

    const fetchAlerts = async () => {
        // Only fetch if user is authenticated
        if (!user) {
            return;
        }

        try {
            const { data } = await api.get('/alerts');
            setAlerts(data);
        } catch (error) {
            // Silently handle 401 errors (user logged out or token expired)
            if (error.response?.status !== 401) {
                console.error("Failed to fetch alerts", error);
            }
        }
    };

    useEffect(() => {
        fetchAlerts();
        // Poll every 5 seconds for new alerts (Faster for emergencies)
        const interval = setInterval(fetchAlerts, 5000);
        return () => clearInterval(interval);
    }, [user]); // Re-run when user changes (login/logout)

    return (
        <AlertContext.Provider value={{ alerts, fetchAlerts }}>
            {children}
        </AlertContext.Provider>
    );
};
