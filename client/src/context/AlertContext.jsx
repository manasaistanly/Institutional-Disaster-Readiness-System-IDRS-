import { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AlertContext = createContext();

export const useAlerts = () => useContext(AlertContext);

export const AlertProvider = ({ children }) => {
    const [alerts, setAlerts] = useState([]);

    const fetchAlerts = async () => {
        try {
            const { data } = await api.get('/alerts');
            setAlerts(data);
        } catch (error) {
            console.error("Failed to fetch alerts", error);
        }
    };

    useEffect(() => {
        fetchAlerts();
        // Poll every 5 seconds for new alerts (Faster for emergencies)
        const interval = setInterval(fetchAlerts, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <AlertContext.Provider value={{ alerts, fetchAlerts }}>
            {children}
        </AlertContext.Provider>
    );
};
