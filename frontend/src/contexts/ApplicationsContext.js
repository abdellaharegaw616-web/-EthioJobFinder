import { createContext, useContext, useState, useEffect } from 'react';

const ApplicationsContext = createContext();

export const useApplications = () => {
  const context = useContext(ApplicationsContext);
  if (!context) {
    throw new Error('useApplications must be used within an ApplicationsProvider');
  }
  return context;
};

export const ApplicationsProvider = ({ children }) => {
  const [applications, setApplications] = useState(() => {
    const saved = localStorage.getItem('applications');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('applications', JSON.stringify(applications));
  }, [applications]);

  const applyToJob = (job) => {
    setApplications(prev => {
      if (prev.some(app => app.jobId === job._id)) {
        return prev; // Already applied
      }
      return [
        ...prev,
        {
          jobId: job._id,
          jobTitle: job.title,
          company: job.company,
          status: 'applied',
          appliedDate: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        }
      ];
    });
  };

  const updateApplicationStatus = (jobId, status) => {
    setApplications(prev =>
      prev.map(app =>
        app.jobId === jobId
          ? { ...app, status, lastUpdated: new Date().toISOString() }
          : app
      )
    );
  };

  const getApplicationStatus = (jobId) => {
    const application = applications.find(app => app.jobId === jobId);
    return application ? application.status : null;
  };

  const isJobApplied = (jobId) => {
    return applications.some(app => app.jobId === jobId);
  };

  const value = {
    applications,
    applyToJob,
    updateApplicationStatus,
    getApplicationStatus,
    isJobApplied
  };

  return (
    <ApplicationsContext.Provider value={value}>
      {children}
    </ApplicationsContext.Provider>
  );
};
