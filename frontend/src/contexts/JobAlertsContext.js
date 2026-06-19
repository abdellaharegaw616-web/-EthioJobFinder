import { createContext, useContext, useState, useEffect } from 'react';

const JobAlertsContext = createContext();

export const useJobAlerts = () => {
  const context = useContext(JobAlertsContext);
  if (!context) {
    throw new Error('useJobAlerts must be used within a JobAlertsProvider');
  }
  return context;
};

export const JobAlertsProvider = ({ children }) => {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    // Load alerts from localStorage
    const savedAlerts = localStorage.getItem('jobAlerts');
    if (savedAlerts) {
      setAlerts(JSON.parse(savedAlerts));
    }
  }, []);

  useEffect(() => {
    // Save alerts to localStorage whenever they change
    localStorage.setItem('jobAlerts', JSON.stringify(alerts));
  }, [alerts]);

  const createAlert = (alertData) => {
    const newAlert = {
      id: Date.now(),
      ...alertData,
      createdAt: new Date().toISOString(),
      active: true
    };
    setAlerts([...alerts, newAlert]);
    return newAlert;
  };

  const updateAlert = (id, updates) => {
    setAlerts(alerts.map(alert => 
      alert.id === id ? { ...alert, ...updates } : alert
    ));
  };

  const deleteAlert = (id) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
  };

  const toggleAlert = (id) => {
    setAlerts(alerts.map(alert => 
      alert.id === id ? { ...alert, active: !alert.active } : alert
    ));
  };

  const getActiveAlerts = () => {
    return alerts.filter(alert => alert.active);
  };

  const value = {
    alerts,
    createAlert,
    updateAlert,
    deleteAlert,
    toggleAlert,
    getActiveAlerts
  };

  return (
    <JobAlertsContext.Provider value={value}>
      {children}
    </JobAlertsContext.Provider>
  );
};
