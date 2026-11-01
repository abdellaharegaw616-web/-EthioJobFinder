import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import jobService from '../services/jobService';

const SavedJobsContext = createContext();

export const useSavedJobs = () => {
  const context = useContext(SavedJobsContext);
  if (!context) {
    throw new Error('useSavedJobs must be used within a SavedJobsProvider');
  }
  return context;
};

export const SavedJobsProvider = ({ children }) => {
  const [savedJobs, setSavedJobs] = useState(() => {
    try {
      const saved = localStorage.getItem('savedJobs');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [loading, setLoading] = useState(false);

  // Sync with backend when authenticated
  const syncWithServer = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      setLoading(true);
      const res = await jobService.getSavedJobs();
      if (res?.savedJobs && Array.isArray(res.savedJobs)) {
        setSavedJobs(res.savedJobs);
        localStorage.setItem('savedJobs', JSON.stringify(res.savedJobs));
      }
    } catch (err) {
      console.log('Saved jobs server sync (fallback to local):', err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    syncWithServer();
  }, [syncWithServer]);

  // Save to localStorage whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem('savedJobs', JSON.stringify(savedJobs));
    } catch (e) {
      console.error('Failed to cache saved jobs to localStorage', e);
    }
  }, [savedJobs]);

  const saveJob = async (job) => {
    setSavedJobs(prev => {
      if (prev.some(saved => saved._id === job._id)) {
        return prev;
      }
      return [...prev, job];
    });

    const token = localStorage.getItem('token');
    if (token) {
      try {
        await jobService.saveJob(job._id);
      } catch (err) {
        console.error('Failed to save job to server:', err.message);
      }
    }
  };

  const removeJob = async (jobId) => {
    setSavedJobs(prev => prev.filter(job => job._id !== jobId));

    const token = localStorage.getItem('token');
    if (token) {
      try {
        await jobService.unsaveJob(jobId);
      } catch (err) {
        console.error('Failed to unsave job from server:', err.message);
      }
    }
  };

  const isJobSaved = (jobId) => {
    return savedJobs.some(job => job._id === jobId || job.jobId === jobId);
  };

  const value = {
    savedJobs,
    loading,
    saveJob,
    removeJob,
    isJobSaved,
    syncWithServer
  };

  return (
    <SavedJobsContext.Provider value={value}>
      {children}
    </SavedJobsContext.Provider>
  );
};
