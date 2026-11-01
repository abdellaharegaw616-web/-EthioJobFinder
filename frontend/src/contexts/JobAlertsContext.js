import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import jobAlertService from '../services/jobAlertService';

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('token');

  const fetchAlerts = useCallback(async () => {
    if (!token) {
      const savedAlerts = localStorage.getItem('jobAlerts');
      if (savedAlerts) {
        try {
          setAlerts(JSON.parse(savedAlerts));
        } catch (e) {
          setAlerts([]);
        }
      }
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await jobAlertService.getMyAlerts();
      if (res.data) {
        setAlerts(res.data);
      }
    } catch (err) {
      console.warn('Could not sync job alerts from server, falling back to local cache', err.message);
      const savedAlerts = localStorage.getItem('jobAlerts');
      if (savedAlerts) {
        try {
          setAlerts(JSON.parse(savedAlerts));
        } catch (e) {
          setAlerts([]);
        }
      }
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  // Keep local backup updated
  useEffect(() => {
    if (alerts.length > 0) {
      localStorage.setItem('jobAlerts', JSON.stringify(alerts));
    }
  }, [alerts]);

  const createAlert = async (alertData) => {
    if (token) {
      try {
        const res = await jobAlertService.createAlert(alertData);
        if (res.data) {
          setAlerts(prev => [res.data, ...prev]);
          return res.data;
        }
      } catch (err) {
        console.error('Failed to create alert on server:', err);
      }
    }

    // Local fallback
    const newAlert = {
      _id: `local_${Date.now()}`,
      id: Date.now(),
      ...alertData,
      isActive: true,
      active: true,
      createdAt: new Date().toISOString()
    };
    setAlerts(prev => [newAlert, ...prev]);
    return newAlert;
  };

  const updateAlert = async (id, updates) => {
    if (token && !String(id).startsWith('local_')) {
      try {
        const res = await jobAlertService.updateAlert(id, updates);
        if (res.data) {
          setAlerts(prev => prev.map(a => (a._id === id ? res.data : a)));
          return res.data;
        }
      } catch (err) {
        console.error('Failed to update alert on server:', err);
      }
    }

    setAlerts(prev => prev.map(alert => 
      (alert._id === id || alert.id === id) ? { ...alert, ...updates } : alert
    ));
  };

  const deleteAlert = async (id) => {
    if (token && !String(id).startsWith('local_')) {
      try {
        await jobAlertService.deleteAlert(id);
      } catch (err) {
        console.error('Failed to delete alert on server:', err);
      }
    }

    setAlerts(prev => prev.filter(alert => alert._id !== id && alert.id !== id));
  };

  const toggleAlert = async (id) => {
    const target = alerts.find(a => a._id === id || a.id === id);
    if (!target) return;

    const nextState = !(target.isActive !== undefined ? target.isActive : target.active);

    if (token && !String(id).startsWith('local_')) {
      try {
        const res = await jobAlertService.updateAlert(id, { isActive: nextState });
        if (res.data) {
          setAlerts(prev => prev.map(a => (a._id === id ? res.data : a)));
          return;
        }
      } catch (err) {
        console.error('Failed to toggle alert status on server:', err);
      }
    }

    setAlerts(prev => prev.map(alert => 
      (alert._id === id || alert.id === id)
        ? { ...alert, isActive: nextState, active: nextState }
        : alert
    ));
  };

  const getActiveAlerts = () => {
    return alerts.filter(alert => (alert.isActive !== undefined ? alert.isActive : alert.active));
  };

  const value = {
    alerts,
    loading,
    error,
    refreshAlerts: fetchAlerts,
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
