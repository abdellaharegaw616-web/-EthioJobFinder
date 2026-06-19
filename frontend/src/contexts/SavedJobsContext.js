import { createContext, useContext, useState, useEffect } from 'react';

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
    const saved = localStorage.getItem('savedJobs');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('savedJobs', JSON.stringify(savedJobs));
  }, [savedJobs]);

  const saveJob = (job) => {
    setSavedJobs(prev => {
      if (prev.some(saved => saved._id === job._id)) {
        return prev; // Already saved
      }
      return [...prev, job];
    });
  };

  const removeJob = (jobId) => {
    setSavedJobs(prev => prev.filter(job => job._id !== jobId));
  };

  const isJobSaved = (jobId) => {
    return savedJobs.some(job => job._id === jobId);
  };

  const value = {
    savedJobs,
    saveJob,
    removeJob,
    isJobSaved
  };

  return (
    <SavedJobsContext.Provider value={value}>
      {children}
    </SavedJobsContext.Provider>
  );
};
