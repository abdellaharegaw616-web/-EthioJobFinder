import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import jobService from '../services/jobService';
import { useAuth } from './AuthContext';

const ApplicationsContext = createContext();

export const useApplications = () => {
  const context = useContext(ApplicationsContext);
  if (!context) {
    throw new Error('useApplications must be used within an ApplicationsProvider');
  }
  return context;
};

export const ApplicationsProvider = ({ children }) => {
  const { user } = useAuth();
  const [applications, setApplications] = useState(() => {
    try {
      const saved = localStorage.getItem('applications');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Sync user applications with backend
  const fetchMyApplications = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      setLoading(true);
      const serverApps = await jobService.getMyApplications();
      if (Array.isArray(serverApps)) {
        setApplications(serverApps);
        localStorage.setItem('applications', JSON.stringify(serverApps));
      }
      setError(null);
    } catch (err) {
      console.log('Applications server sync (using local cache):', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Sync whenever authenticated user changes
  useEffect(() => {
    if (user) {
      fetchMyApplications();
    } else {
      const token = localStorage.getItem('token');
      if (!token) {
        setApplications([]);
        localStorage.removeItem('applications');
      }
    }
  }, [user, fetchMyApplications]);

  // Persist locally for offline support
  useEffect(() => {
    try {
      localStorage.setItem('applications', JSON.stringify(applications));
    } catch (e) {
      console.error('Failed to cache applications', e);
    }
  }, [applications]);

  const applyToJob = async (job, applicationPayload = {}) => {
    const token = localStorage.getItem('token');
    const jobId = job._id || job.id;

    if (token) {
      try {
        const payload = {
          job: jobId,
          resume: applicationPayload.resume || 'Default Profile CV',
          coverLetter: applicationPayload.coverLetter || '',
          answers: applicationPayload.answers || []
        };
        const createdApp = await jobService.applyForJob(payload);
        setApplications(prev => [createdApp, ...prev]);
        return createdApp;
      } catch (err) {
        const errMsg = err.response?.data?.message || err.message || '';
        if (errMsg.toLowerCase().includes('already applied')) {
          setApplications(prev => {
            const exists = prev.some(a => (a.job?._id === jobId || a.job === jobId || a.jobId === jobId));
            if (!exists) {
              return [
                {
                  _id: 'app_' + jobId,
                  job: {
                    _id: jobId,
                    title: job.title,
                    company: job.company,
                    location: job.location,
                    type: job.type,
                    salary: job.salary
                  },
                  jobId,
                  status: 'pending',
                  createdAt: new Date().toISOString()
                },
                ...prev
              ];
            }
            return prev;
          });
          fetchMyApplications();
        }
        console.error('API apply error:', err);
        throw err;
      }
    } else {
      // Local tracking for unauthenticated/demo mode
      const localApp = {
        _id: 'local_' + Date.now(),
        job: {
          _id: jobId,
          title: job.title,
          company: job.company,
          location: job.location,
          type: job.type,
          salary: job.salary
        },
        jobId,
        jobTitle: job.title,
        company: job.company,
        status: 'applied',
        createdAt: new Date().toISOString()
      };
      setApplications(prev => [localApp, ...prev]);
      return localApp;
    }
  };

  const withdrawApplication = async (applicationId) => {
    try {
      const token = localStorage.getItem('token');
      if (token && !applicationId.startsWith('local_')) {
        await jobService.withdrawApplication(applicationId);
      }
      setApplications(prev => prev.filter(app => app._id !== applicationId));
    } catch (err) {
      console.error('Failed to withdraw application:', err);
      throw err;
    }
  };

  const getApplicationStatus = (jobId) => {
    const app = applications.find(a => 
      (a.job?._id === jobId) || (a.job === jobId) || (a.jobId === jobId) || (a._id === jobId)
    );
    return app ? app.status : null;
  };

  const isJobApplied = (jobId) => {
    return applications.some(a => 
      (a.job?._id === jobId) || (a.job === jobId) || (a.jobId === jobId)
    );
  };

  const value = {
    applications,
    loading,
    error,
    fetchMyApplications,
    applyToJob,
    withdrawApplication,
    getApplicationStatus,
    isJobApplied
  };

  return (
    <ApplicationsContext.Provider value={value}>
      {children}
    </ApplicationsContext.Provider>
  );
};
