import { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Briefcase, FileText, CheckCircle, Shield, Trash2, Ban, XCircle, Building2, Activity, Clock } from 'lucide-react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [pendingVerifications, setPendingVerifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
    fetchUsers();
    fetchJobs();
    fetchPendingVerifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getAuthHeaders = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${API_URL}/admin/stats`, getAuthHeaders());
      setStats(res.data);
    } catch (err) {
      setError('Failed to load stats');
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_URL}/admin/users`, getAuthHeaders());
      setUsers(res.data);
    } catch (err) {
      console.error('Failed to load users');
    }
  };

  const fetchJobs = async () => {
    try {
      const res = await axios.get(`${API_URL}/admin/jobs`, getAuthHeaders());
      setJobs(res.data);
    } catch (err) {
      console.error('Failed to load jobs');
    }
  };

  const fetchPendingVerifications = async () => {
    try {
      const res = await axios.get(`${API_URL}/admin/pending-verifications`, getAuthHeaders());
      setPendingVerifications(res.data);
    } catch (err) {
      console.error('Failed to load verifications');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (id, verified) => {
    try {
      await axios.put(`${API_URL}/admin/verify-employer/${id}`, 
        { isVerified: verified, notes: verified ? 'Verified' : 'Rejected' },
        getAuthHeaders()
      );
      fetchPendingVerifications();
      fetchUsers();
    } catch (err) {
      setError('Failed to update');
    }
  };

  const handleBan = async (id) => {
    if (!window.confirm('Toggle user ban status?')) return;
    try {
      await axios.put(`${API_URL}/admin/ban-user/${id}`, {}, getAuthHeaders());
      fetchUsers();
    } catch (err) {
      setError('Failed to ban user');
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Delete user and all their data?')) return;
    try {
      await axios.delete(`${API_URL}/admin/users/${id}`, getAuthHeaders());
      fetchUsers();
    } catch (err) {
      setError('Failed to delete user');
    }
  };

  const handleDeleteJob = async (id) => {
    if (!window.confirm('Delete this job?')) return;
    try {
      await axios.delete(`${API_URL}/admin/jobs/${id}`, getAuthHeaders());
      fetchJobs();
    } catch (err) {
      setError('Failed to delete job');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-3 mb-8">
          <Shield className="w-8 h-8 text-green-700" />
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <div className="flex items-center gap-3 mb-2">
                <Users className="w-5 h-5 text-green-700" />
                <p className="text-sm text-gray-500">Users</p>
              </div>
              <p className="text-2xl font-bold text-green-700">{stats.totalUsers}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <div className="flex items-center gap-3 mb-2">
                <Briefcase className="w-5 h-5 text-green-700" />
                <p className="text-sm text-gray-500">Jobs</p>
              </div>
              <p className="text-2xl font-bold text-green-700">{stats.totalJobs}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <div className="flex items-center gap-3 mb-2">
                <FileText className="w-5 h-5 text-green-700" />
                <p className="text-sm text-gray-500">Applications</p>
              </div>
              <p className="text-2xl font-bold text-green-700">{stats.totalApplications}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle className="w-5 h-5 text-green-700" />
                <p className="text-sm text-gray-500">Active Jobs</p>
              </div>
              <p className="text-2xl font-bold text-green-700">{stats.activeJobs}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <div className="flex items-center gap-3 mb-2">
                <Clock className="w-5 h-5 text-yellow-600" />
                <p className="text-sm text-gray-500">Pending</p>
              </div>
              <p className="text-2xl font-bold text-yellow-600">{stats.pendingVerifications}</p>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex border-b mb-6 bg-white rounded-t-lg">
          {['dashboard', 'verifications', 'users', 'jobs'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-medium capitalize flex items-center gap-2 ${
                activeTab === tab
                  ? 'border-b-2 border-green-700 text-green-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab === 'dashboard' && <Activity className="w-4 h-4" />}
              {tab === 'verifications' && <CheckCircle className="w-4 h-4" />}
              {tab === 'users' && <Users className="w-4 h-4" />}
              {tab === 'jobs' && <Briefcase className="w-4 h-4" />}
              {tab}
            </button>
          ))}
        </div>

        {/* Verifications Tab */}
        {activeTab === 'verifications' && (
          <div className="bg-white rounded-lg shadow-md border border-gray-200">
            <h2 className="text-xl font-semibold p-6 border-b flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-700" />
              Pending Employer Verifications
            </h2>
            {pendingVerifications.length === 0 ? (
              <p className="p-6 text-gray-500">No pending verifications</p>
            ) : (
              <div className="divide-y">
                {pendingVerifications.map(emp => (
                  <div key={emp._id} className="p-6 flex items-center justify-between">
                    <div>
                      <p className="font-semibold">{emp.companyName || 'No company name'}</p>
                      <p className="text-sm text-gray-500">{emp.name} ({emp.email})</p>
                      {emp.companyWebsite && (
                        <a href={emp.companyWebsite} target="_blank" rel="noopener noreferrer" 
                           className="text-sm text-green-700 hover:underline flex items-center gap-1">
                          <Building2 className="w-4 h-4" />
                          {emp.companyWebsite}
                        </a>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleVerify(emp._id, true)}
                        className="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800 flex items-center gap-1"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleVerify(emp._id, false)}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 flex items-center gap-1"
                      >
                        <XCircle className="w-4 h-4" />
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-lg shadow-md border border-gray-200">
            <h2 className="text-xl font-semibold p-6 border-b flex items-center gap-2">
              <Users className="w-5 h-5 text-green-700" />
              All Users ({users.length})
            </h2>
            <div className="divide-y">
              {users.map(u => (
                <div key={u._id} className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{u.name}</p>
                    <p className="text-sm text-gray-500">{u.email} | Role: {u.role}</p>
                    <p className="text-xs text-gray-400">
                      {u.isActive ? 'Active' : 'Banned'} | 
                      {u.role === 'employer' && (u.isVerified ? ' Verified' : ' Not Verified')}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleBan(u._id)}
                      className={`px-3 py-1 rounded text-sm flex items-center gap-1 ${
                        u.isActive ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {u.isActive ? <Ban className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                      {u.isActive ? 'Ban' : 'Unban'}
                    </button>
                    <button
                      onClick={() => handleDeleteUser(u._id)}
                      className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 flex items-center gap-1"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Jobs Tab */}
        {activeTab === 'jobs' && (
          <div className="bg-white rounded-lg shadow-md border border-gray-200">
            <h2 className="text-xl font-semibold p-6 border-b flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-green-700" />
              All Jobs ({jobs.length})
            </h2>
            <div className="divide-y">
              {jobs.map(job => (
                <div key={job._id} className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{job.title}</p>
                    <p className="text-sm text-gray-500">
                      {job.company} | Posted by: {job.postedBy?.name || 'Unknown'}
                    </p>
                    <p className="text-xs text-gray-400">Status: {job.status}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteJob(job._id)}
                    className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 flex items-center gap-1"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
