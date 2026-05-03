import { createContext, useState, useContext, useCallback } from 'react';
import jobService from '../services/jobService';

const JobContext = createContext(null);

export const JobProvider = ({ children }) => {
  const [jobs, setJobs] = useState([]);
  const [job, setJob] = useState(null);
  const [myJobs, setMyJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [receivedApplications, setReceivedApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
    currentPage: 1
  });

  const fetchJobs = useCallback(async (filters = {}) => {
    setLoading(true);
    try {
      const data = await jobService.getJobs(filters);
      setJobs(data.jobs);
      setPagination({
        total: data.total,
        totalPages: data.totalPages,
        currentPage: data.currentPage
      });
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchJob = useCallback(async (id) => {
    setLoading(true);
    try {
      const data = await jobService.getJob(id);
      setJob(data);
      setError(null);
      return data;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMyJobs = useCallback(async () => {
    setLoading(true);
    try {
      const data = await jobService.getMyJobs();
      setMyJobs(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createJob = async (jobData) => {
    setLoading(true);
    try {
      const data = await jobService.createJob(jobData);
      setMyJobs([data, ...myJobs]);
      setError(null);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateJob = async (id, jobData) => {
    setLoading(true);
    try {
      const data = await jobService.updateJob(id, jobData);
      setMyJobs(myJobs.map(job => job._id === id ? data : job));
      if (job && job._id === id) setJob(data);
      setError(null);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteJob = async (id) => {
    setLoading(true);
    try {
      await jobService.deleteJob(id);
      setMyJobs(myJobs.filter(job => job._id !== id));
      setError(null);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const applyForJob = async (applicationData) => {
    setLoading(true);
    try {
      const data = await jobService.applyForJob(applicationData);
      setError(null);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchMyApplications = useCallback(async () => {
    setLoading(true);
    try {
      const data = await jobService.getMyApplications();
      setApplications(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchReceivedApplications = useCallback(async () => {
    setLoading(true);
    try {
      const data = await jobService.getReceivedApplications();
      setReceivedApplications(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateApplicationStatus = async (id, status, notes) => {
    setLoading(true);
    try {
      const data = await jobService.updateApplicationStatus(id, status, notes);
      setReceivedApplications(receivedApplications.map(app => app._id === id ? data : app));
      setError(null);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    jobs,
    job,
    myJobs,
    applications,
    receivedApplications,
    loading,
    error,
    pagination,
    fetchJobs,
    fetchJob,
    fetchMyJobs,
    createJob,
    updateJob,
    deleteJob,
    applyForJob,
    fetchMyApplications,
    fetchReceivedApplications,
    updateApplicationStatus
  };

  return (
    <JobContext.Provider value={value}>
      {children}
    </JobContext.Provider>
  );
};

export const useJobs = () => useContext(JobContext);
export default JobContext;
