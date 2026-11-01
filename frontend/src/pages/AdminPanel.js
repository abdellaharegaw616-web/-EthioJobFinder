import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { 
  Users, 
  Briefcase, 
  FileText, 
  CheckCircle, 
  Shield, 
  Trash2, 
  Ban, 
  XCircle, 
  Activity, 
  Clock, 
  Flag, 
  AlertTriangle, 
  ExternalLink, 
  ShieldCheck,
  Check,
  Star,
  Search,
  History,
  MapPin,
  Tag
} from 'lucide-react';

const API_URL = process.env.REACT_APP_API_URL || (process.env.NODE_ENV === 'production' ? 'https://ethio-jobs-finder.onrender.com/api' : 'http://localhost:5000/api');

const ETHIOPIAN_CITIES = [
  'All Ethiopia',
  'Addis Ababa',
  'Hawassa',
  'Dire Dawa',
  'Bahir Dar',
  'Mekelle',
  'Adama (Nazret)',
  'Gondar',
  'Jimma',
  'Dessie',
  'Bishoftu (Debre Zeyit)',
  'Remote (Ethiopia)'
];

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [pendingVerifications, setPendingVerifications] = useState([]);
  const [reports, setReports] = useState([]);
  const [reportFilter, setReportFilter] = useState('all');
  const [auditLogs, setAuditLogs] = useState([]);
  const [auditFilter, setAuditFilter] = useState('all');
  
  // Filters for user accounts
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('all');
  const [userStatusFilter, setUserStatusFilter] = useState('all');

  // Filters for vacancies
  const [jobSearch, setJobSearch] = useState('');
  const [jobStatusFilter, setJobStatusFilter] = useState('all');
  const [jobCityFilter, setJobCityFilter] = useState('All Ethiopia');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const getAuthHeaders = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${API_URL}/admin/stats`, getAuthHeaders());
      setStats(res.data);
    } catch (err) {
      setError('Failed to load platform stats');
    }
  };

  const fetchUsers = useCallback(async () => {
    try {
      const params = {};
      if (userRoleFilter !== 'all') params.role = userRoleFilter;
      if (userStatusFilter !== 'all') params.status = userStatusFilter;
      if (userSearch.trim()) params.search = userSearch.trim();

      const res = await axios.get(`${API_URL}/admin/users`, {
        ...getAuthHeaders(),
        params
      });
      setUsers(res.data);
    } catch (err) {
      console.error('Failed to load users');
    }
  }, [userRoleFilter, userStatusFilter, userSearch]);

  const fetchJobs = useCallback(async () => {
    try {
      const params = {};
      if (jobStatusFilter !== 'all') params.status = jobStatusFilter;
      if (jobCityFilter !== 'All Ethiopia') params.location = jobCityFilter;
      if (jobSearch.trim()) params.search = jobSearch.trim();

      const res = await axios.get(`${API_URL}/admin/jobs`, {
        ...getAuthHeaders(),
        params
      });
      setJobs(res.data);
    } catch (err) {
      console.error('Failed to load jobs');
    }
  }, [jobStatusFilter, jobCityFilter, jobSearch]);

  const fetchPendingVerifications = async () => {
    try {
      const res = await axios.get(`${API_URL}/admin/pending-verifications`, getAuthHeaders());
      setPendingVerifications(res.data);
    } catch (err) {
      console.error('Failed to load verifications');
    }
  };

  const fetchReports = async () => {
    try {
      const res = await axios.get(`${API_URL}/admin/reports`, getAuthHeaders());
      setReports(res.data);
    } catch (err) {
      console.error('Failed to load reports');
    }
  };

  const fetchAuditLogs = useCallback(async () => {
    try {
      const params = {};
      if (auditFilter !== 'all') params.action = auditFilter;
      const res = await axios.get(`${API_URL}/admin/audit-logs`, {
        ...getAuthHeaders(),
        params
      });
      setAuditLogs(res.data.data || []);
    } catch (err) {
      console.error('Failed to load audit logs');
    }
  }, [auditFilter]);

  const loadAll = async () => {
    setLoading(true);
    await Promise.all([
      fetchStats(),
      fetchUsers(),
      fetchJobs(),
      fetchPendingVerifications(),
      fetchReports(),
      fetchAuditLogs()
    ]);
    setLoading(false);
  };

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  useEffect(() => {
    fetchAuditLogs();
  }, [fetchAuditLogs]);

  const handleVerify = async (id, verified) => {
    setError('');
    setSuccess('');
    try {
      await axios.put(`${API_URL}/admin/verify-employer/${id}`, 
        { 
          isVerified: verified, 
          notes: verified ? 'Approved by administrator' : 'Rejected by administrator' 
        },
        getAuthHeaders()
      );
      setSuccess(`Employer verification ${verified ? 'approved' : 'rejected'}.`);
      fetchPendingVerifications();
      fetchUsers();
      fetchStats();
      fetchAuditLogs();
    } catch (err) {
      setError('Failed to update verification status');
    }
  };

  const handleBan = async (user) => {
    const isCurrentlyActive = user.isActive;
    const promptMessage = isCurrentlyActive 
      ? `Enter administrative reason for suspending ${user.name} (${user.email}):`
      : `Enter administrative note for restoring ${user.name}:`;
    
    const reason = window.prompt(promptMessage, isCurrentlyActive ? 'Policy violation / suspicious activity' : 'Account restored after audit');
    if (reason === null) return; // user cancelled

    try {
      await axios.put(`${API_URL}/admin/ban-user/${user._id}`, { reason }, getAuthHeaders());
      setSuccess(`User ${isCurrentlyActive ? 'suspended' : 'reactivated'} successfully.`);
      fetchUsers();
      fetchStats();
      fetchAuditLogs();
    } catch (err) {
      setError('Failed to update user ban state');
    }
  };

  const handleDeleteUser = async (id, name) => {
    const reason = window.prompt(`Confirm permanent deletion of ${name}. Enter audit reason:`, 'Administrative account purge');
    if (reason === null) return;

    try {
      await axios.delete(`${API_URL}/admin/users/${id}`, {
        ...getAuthHeaders(),
        data: { reason }
      });
      setSuccess('User and associated data permanently purged.');
      fetchUsers();
      fetchJobs();
      fetchStats();
      fetchAuditLogs();
    } catch (err) {
      setError('Failed to delete user');
    }
  };

  const handleToggleFeatureJob = async (jobId) => {
    try {
      const res = await axios.put(`${API_URL}/admin/jobs/${jobId}/feature`, {}, getAuthHeaders());
      setSuccess(res.data.message || 'Job feature status updated');
      fetchJobs();
      fetchAuditLogs();
    } catch (err) {
      setError('Failed to toggle featured status');
    }
  };

  const handleDeleteJob = async (id, title) => {
    const reason = window.prompt(`Confirm deletion of vacancy "${title}". Enter audit reason:`, 'Policy non-compliance or expired vacancy');
    if (reason === null) return;

    try {
      await axios.delete(`${API_URL}/admin/jobs/${id}`, {
        ...getAuthHeaders(),
        data: { reason }
      });
      setSuccess('Vacancy removed from portal.');
      fetchJobs();
      fetchStats();
      fetchAuditLogs();
    } catch (err) {
      setError('Failed to delete job');
    }
  };

  const handleUpdateReport = async (reportId, newStatus, notes) => {
    try {
      await axios.put(`${API_URL}/admin/reports/${reportId}`, {
        status: newStatus,
        adminNotes: notes
      }, getAuthHeaders());
      setSuccess(`Report marked as ${newStatus}`);
      fetchReports();
      fetchStats();
      fetchAuditLogs();
    } catch (err) {
      setError('Failed to update report');
    }
  };

  const handleResolveAndRemoveJob = async (reportId, jobId) => {
    if (!window.confirm('Delete this fraudulent job and mark report as resolved?')) return;
    try {
      if (jobId) {
        await axios.delete(`${API_URL}/admin/jobs/${jobId}`, {
          ...getAuthHeaders(),
          data: { reason: 'Confirmed recruitment scam / fraudulent listing' }
        });
      }
      await axios.put(`${API_URL}/admin/reports/${reportId}`, {
        status: 'resolved',
        adminNotes: 'Fraudulent vacancy deleted and report resolved by administrator.'
      }, getAuthHeaders());
      setSuccess('Vacancy removed and report marked as resolved.');
      fetchReports();
      fetchJobs();
      fetchStats();
      fetchAuditLogs();
    } catch (err) {
      setError('Failed to remove job and resolve report');
    }
  };

  const getReasonLabel = (reason) => {
    const labels = {
      fee_scam_asking_for_money: 'Fee Scam / Demanding Money',
      fraudulent_job_offer: 'Fake / Fraudulent Offer',
      misleading_information: 'Misleading Terms / Salary',
      inappropriate_offensive_content: 'Inappropriate Content',
      expired_position: 'Expired Position',
      other: 'Other Violation'
    };
    return labels[reason] || reason;
  };

  const getActionBadgeClass = (action) => {
    switch (action) {
      case 'user_banned':
      case 'job_deleted':
      case 'user_deleted':
        return 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300';
      case 'employer_verified':
      case 'report_resolved':
      case 'job_featured_toggled':
        return 'bg-orange-100 text-orange-600 dark:bg-orange-950/40 dark:text-orange-300';
      case 'user_unbanned':
      case 'report_investigating':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const filteredReports = reports.filter(r => {
    if (reportFilter === 'all') return true;
    return r.status === reportFilter;
  });

  const pendingReportsCount = reports.filter(r => r.status === 'pending').length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 pb-16 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-950/40 text-orange-500 dark:text-orange-400 flex items-center justify-center">
              <Shield className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                Platform Admin Command Center
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                EthioJob Finder Telemetry, Moderation Pipeline, Audit Logs, and User Management
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300 text-xs sm:text-sm flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 rounded-xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800/60 text-orange-600 dark:text-orange-300 text-xs sm:text-sm flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Stats Grid - 6 Key Telemetry Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="flex items-center gap-2 mb-1 text-gray-500 text-xs font-semibold">
                <Users className="w-4 h-4 text-orange-500" />
                <span>Total Users</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalUsers}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">{stats.employersCount || 0} employers • {stats.jobseekersCount || 0} seekers</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="flex items-center gap-2 mb-1 text-gray-500 text-xs font-semibold">
                <Briefcase className="w-4 h-4 text-orange-500" />
                <span>Total Jobs</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalJobs}</p>
              <p className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-0.5 font-medium">{stats.activeJobs} active vacancies</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="flex items-center gap-2 mb-1 text-gray-500 text-xs font-semibold">
                <FileText className="w-4 h-4 text-orange-500" />
                <span>Applications</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalApplications}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">Platform total</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="flex items-center gap-2 mb-1 text-yellow-600 text-xs font-semibold">
                <Clock className="w-4 h-4" />
                <span>Pending Verif.</span>
              </div>
              <p className="text-2xl font-bold text-yellow-600">{pendingVerifications.length}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">Require review</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="flex items-center gap-2 mb-1 text-red-600 text-xs font-semibold">
                <Flag className="w-4 h-4" />
                <span>Pending Reports</span>
              </div>
              <p className="text-2xl font-bold text-red-600">{pendingReportsCount}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">{reports.length} total reports</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="flex items-center gap-2 mb-1 text-gray-500 text-xs font-semibold">
                <Ban className="w-4 h-4 text-red-500" />
                <span>Suspended Users</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.bannedUsersCount || 0}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">Under restriction</p>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden mb-8">
          <div className="flex border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-2 py-4 px-6 text-sm font-semibold whitespace-nowrap border-b-2 transition ${
                activeTab === 'dashboard'
                  ? 'border-orange-500 text-orange-500 dark:border-orange-400 dark:text-orange-400 bg-orange-50/50 dark:bg-orange-950/20'
                  : 'border-transparent text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
              }`}
            >
              <Activity className="w-4 h-4" />
              Overview & Analytics
            </button>

            <button
              onClick={() => setActiveTab('verifications')}
              className={`flex items-center gap-2 py-4 px-6 text-sm font-semibold whitespace-nowrap border-b-2 transition ${
                activeTab === 'verifications'
                  ? 'border-orange-500 text-orange-500 dark:border-orange-400 dark:text-orange-400 bg-orange-50/50 dark:bg-orange-950/20'
                  : 'border-transparent text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              Employer Verifications ({pendingVerifications.length})
            </button>

            <button
              onClick={() => setActiveTab('reports')}
              className={`flex items-center gap-2 py-4 px-6 text-sm font-semibold whitespace-nowrap border-b-2 transition ${
                activeTab === 'reports'
                  ? 'border-orange-500 text-orange-500 dark:border-orange-400 dark:text-orange-400 bg-orange-50/50 dark:bg-orange-950/20'
                  : 'border-transparent text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
              }`}
            >
              <Flag className="w-4 h-4" />
              Reported Vacancies ({reports.length})
              {pendingReportsCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-xs bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 font-bold">
                  {pendingReportsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('users')}
              className={`flex items-center gap-2 py-4 px-6 text-sm font-semibold whitespace-nowrap border-b-2 transition ${
                activeTab === 'users'
                  ? 'border-orange-500 text-orange-500 dark:border-orange-400 dark:text-orange-400 bg-orange-50/50 dark:bg-orange-950/20'
                  : 'border-transparent text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
              }`}
            >
              <Users className="w-4 h-4" />
              User Accounts ({users.length})
            </button>

            <button
              onClick={() => setActiveTab('jobs')}
              className={`flex items-center gap-2 py-4 px-6 text-sm font-semibold whitespace-nowrap border-b-2 transition ${
                activeTab === 'jobs'
                  ? 'border-orange-500 text-orange-500 dark:border-orange-400 dark:text-orange-400 bg-orange-50/50 dark:bg-orange-950/20'
                  : 'border-transparent text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              Vacancies ({jobs.length})
            </button>

            <button
              onClick={() => setActiveTab('audit')}
              className={`flex items-center gap-2 py-4 px-6 text-sm font-semibold whitespace-nowrap border-b-2 transition ${
                activeTab === 'audit'
                  ? 'border-orange-500 text-orange-500 dark:border-orange-400 dark:text-orange-400 bg-orange-50/50 dark:bg-orange-950/20'
                  : 'border-transparent text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
              }`}
            >
              <History className="w-4 h-4" />
              Audit Logs ({auditLogs.length})
            </button>
          </div>

          <div className="p-6 sm:p-8">

            {/* TAB: Overview & Analytics */}
            {activeTab === 'dashboard' && stats && (
              <div className="space-y-8">
                {/* Distribution Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Ethiopian City Distribution */}
                  <div className="p-5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/60">
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-orange-500" />
                      Active Vacancy Distribution across Ethiopian Hubs
                    </h4>
                    {stats.cityDistribution && stats.cityDistribution.length > 0 ? (
                      <div className="space-y-3">
                        {stats.cityDistribution.map((item) => {
                          const percentage = Math.min(100, Math.round((item.count / (stats.activeJobs || 1)) * 100));
                          return (
                            <div key={item._id || 'Unspecified'} className="space-y-1">
                              <div className="flex justify-between text-xs font-semibold text-gray-700 dark:text-gray-300">
                                <span>{item._id || 'Unspecified Location'}</span>
                                <span>{item.count} vacancies ({percentage}%)</span>
                              </div>
                              <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-orange-500 dark:bg-orange-500 rounded-full"
                                  style={{ width: `${percentage}%` }}
                                ></div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-xs text-gray-500">No active vacancies to distribute.</p>
                    )}
                  </div>

                  {/* Category Breakdown */}
                  <div className="p-5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/60">
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <Tag className="w-4 h-4 text-orange-500" />
                      Top Industry Categories
                    </h4>
                    {stats.categoryDistribution && stats.categoryDistribution.length > 0 ? (
                      <div className="grid grid-cols-2 gap-3">
                        {stats.categoryDistribution.map((cat) => (
                          <div key={cat._id} className="p-3 bg-white dark:bg-gray-700/60 rounded-xl border border-gray-200/80 dark:border-gray-600 flex items-center justify-between">
                            <span className="text-xs font-semibold text-gray-700 dark:text-gray-200 truncate">{cat._id}</span>
                            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-600 dark:bg-orange-950/40 dark:text-orange-300">
                              {cat.count}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-gray-500">No category breakdown available.</p>
                    )}
                  </div>
                </div>

                {/* Recent Users & Recent Audit Snapshot */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">Recent User Signups</h3>
                    <div className="divide-y divide-gray-100 dark:divide-gray-700 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-white dark:bg-gray-800">
                      {stats.recentUsers?.map(u => (
                        <div key={u._id} className="p-3.5 flex items-center justify-between text-xs">
                          <div>
                            <p className="font-bold text-gray-900 dark:text-white">{u.name}</p>
                            <p className="text-gray-500">{u.email}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded-full capitalize font-semibold bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                              {u.role}
                            </span>
                            <span className="text-gray-400">
                              {new Date(u.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">Recent Administrative Actions</h3>
                    <div className="divide-y divide-gray-100 dark:divide-gray-700 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-white dark:bg-gray-800">
                      {stats.recentAuditLogs && stats.recentAuditLogs.length > 0 ? (
                        stats.recentAuditLogs.map(log => (
                          <div key={log._id} className="p-3.5 flex items-center justify-between text-xs">
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-2">
                                <span className={`px-2 py-0.5 rounded-full font-bold ${getActionBadgeClass(log.action)}`}>
                                  {log.action}
                                </span>
                                <span className="font-semibold text-gray-900 dark:text-white truncate max-w-[180px]">
                                  {log.targetName}
                                </span>
                              </div>
                              <p className="text-gray-500 line-clamp-1">{log.reason}</p>
                            </div>
                            <span className="text-gray-400 text-[10px] shrink-0 ml-2">
                              {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="p-6 text-center text-xs text-gray-500">
                          No administrative actions logged yet.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: Employer Verifications */}
            {activeTab === 'verifications' && (
              <div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4">
                  Pending Employer Verification Requests
                </h3>
                {pendingVerifications.length === 0 ? (
                  <div className="text-center py-12 border border-dashed border-gray-300 dark:border-gray-700 rounded-2xl p-8">
                    <ShieldCheck className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      All employer verification requests have been audited.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingVerifications.map(emp => (
                      <div key={emp._id} className="p-5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-base text-gray-900 dark:text-white">
                              {emp.companyName || emp.name}
                            </span>
                            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
                              {emp.verificationStatus || 'unverified'}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Representative: {emp.name} ({emp.email}) {emp.phone ? `• ${emp.phone}` : ''}
                          </p>
                          {emp.companyCity && (
                            <p className="text-xs text-gray-500">City: {emp.companyCity} • Size: {emp.companySize || '1-10'}</p>
                          )}
                          {emp.taxIdNumber && (
                            <p className="text-xs font-mono font-semibold text-orange-500 dark:text-orange-400">
                              TIN: {emp.taxIdNumber}
                            </p>
                          )}
                          {emp.verificationNotes && (
                            <p className="text-xs text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 p-2 rounded-lg">
                              Notes / Applicant Input: {emp.verificationNotes}
                            </p>
                          )}
                          {(emp.businessLicenseUrl || emp.verificationDocument) && (
                            <a
                              href={emp.businessLicenseUrl || emp.verificationDocument}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-xs font-semibold text-orange-500 dark:text-orange-400 hover:underline pt-1"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              View Business License / Registration Document
                            </a>
                          )}
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleVerify(emp._id, true)}
                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-orange-500 text-white rounded-xl text-xs font-semibold hover:bg-orange-600 transition shadow-sm"
                          >
                            <Check className="w-3.5 h-3.5" />
                            Approve Verification
                          </button>
                          <button
                            type="button"
                            onClick={() => handleVerify(emp._id, false)}
                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-xl text-xs font-semibold transition"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            Reject
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB: Reported Vacancies */}
            {activeTab === 'reports' && (
              <div>
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    {['all', 'pending', 'investigating', 'resolved', 'dismissed'].map(status => (
                      <button
                        key={status}
                        onClick={() => setReportFilter(status)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition ${
                          reportFilter === status
                            ? 'bg-orange-500 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>

                  <span className="text-xs text-gray-500">
                    Showing {filteredReports.length} {filteredReports.length === 1 ? 'report' : 'reports'}
                  </span>
                </div>

                {filteredReports.length === 0 ? (
                  <div className="text-center py-12 border border-dashed border-gray-300 dark:border-gray-700 rounded-2xl p-8">
                    <Flag className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      No reports match the selected status filter.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredReports.map(rep => (
                      <div
                        key={rep._id}
                        className="p-5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 space-y-3"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-gray-900 dark:text-white">
                              {rep.job?.title || 'Unknown Vacancy'}
                            </span>
                            <span className="text-xs text-gray-500">
                              at {rep.job?.company || 'Unknown Company'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${
                              rep.status === 'pending'
                                ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
                                : rep.status === 'resolved'
                                ? 'bg-orange-100 text-orange-600 dark:bg-orange-950/40 dark:text-orange-300'
                                : rep.status === 'investigating'
                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300'
                                : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                            }`}>
                              {rep.status}
                            </span>
                            <span className="text-xs text-gray-400">
                              {new Date(rep.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-100 dark:border-red-900/30 text-xs">
                          <p className="font-bold text-red-900 dark:text-red-300 mb-1">
                            Reason: {getReasonLabel(rep.reason)}
                          </p>
                          {rep.details && (
                            <p className="text-red-800 dark:text-red-400">
                              Reporter Statement: "{rep.details}"
                            </p>
                          )}
                          <p className="text-gray-500 text-[11px] mt-1">
                            Reported by: {rep.reportedBy?.name || 'User'} ({rep.reportedBy?.email || 'N/A'})
                          </p>
                        </div>

                        {rep.adminNotes && (
                          <p className="text-xs text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 p-2 rounded-lg">
                            Moderator Notes: {rep.adminNotes}
                          </p>
                        )}

                        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                          {rep.job?._id && (
                            <a
                              href={`/jobs/${rep.job._id}`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-xs font-semibold text-orange-500 dark:text-orange-400 hover:underline mr-2"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              Inspect Vacancy Page
                            </a>
                          )}

                          {rep.status !== 'resolved' && (
                            <button
                              type="button"
                              onClick={() => handleResolveAndRemoveJob(rep._id, rep.job?._id)}
                              className="px-3 py-1.5 rounded-lg bg-red-700 hover:bg-red-800 text-white text-xs font-semibold transition"
                            >
                              Resolve & Remove Vacancy
                            </button>
                          )}

                          {rep.status === 'pending' && (
                            <button
                              type="button"
                              onClick={() => handleUpdateReport(rep._id, 'investigating', 'Moderator is investigating this report.')}
                              className="px-3 py-1.5 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 text-xs font-semibold transition"
                            >
                              Mark Investigating
                            </button>
                          )}

                          {rep.status !== 'dismissed' && rep.status !== 'resolved' && (
                            <button
                              type="button"
                              onClick={() => handleUpdateReport(rep._id, 'dismissed', 'Report dismissed by moderator upon review.')}
                              className="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 text-xs font-semibold transition"
                            >
                              Dismiss Report
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB: User Accounts */}
            {activeTab === 'users' && (
              <div className="space-y-4">
                {/* Search & Filters */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      placeholder="Search users by name, email, or company..."
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 text-xs border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={userRoleFilter}
                      onChange={(e) => setUserRoleFilter(e.target.value)}
                      className="px-3 py-2 text-xs border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none"
                    >
                      <option value="all">All Roles</option>
                      <option value="jobseeker">Job Seekers</option>
                      <option value="employer">Employers</option>
                      <option value="admin">Administrators</option>
                    </select>

                    <select
                      value={userStatusFilter}
                      onChange={(e) => setUserStatusFilter(e.target.value)}
                      className="px-3 py-2 text-xs border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none"
                    >
                      <option value="all">All Statuses</option>
                      <option value="active">Active Only</option>
                      <option value="banned">Suspended / Banned</option>
                    </select>
                  </div>
                </div>

                <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-white dark:bg-gray-800">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 uppercase font-semibold">
                        <tr>
                          <th className="p-3">User</th>
                          <th className="p-3">Role</th>
                          <th className="p-3">Verified</th>
                          <th className="p-3">Status</th>
                          <th className="p-3">Joined</th>
                          <th className="p-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {users.map(u => (
                          <tr key={u._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/30">
                            <td className="p-3">
                              <p className="font-bold text-gray-900 dark:text-white">{u.name}</p>
                              <p className="text-gray-500">{u.email}</p>
                              {u.companyName && (
                                <p className="text-[11px] text-orange-500 dark:text-orange-400 font-medium">Company: {u.companyName}</p>
                              )}
                            </td>
                            <td className="p-3">
                              <span className="px-2 py-0.5 rounded-full capitalize font-semibold bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                                {u.role}
                              </span>
                            </td>
                            <td className="p-3">
                              {u.isVerified ? (
                                <span className="inline-flex items-center gap-1 text-orange-500 dark:text-orange-400 font-semibold">
                                  <Check className="w-3.5 h-3.5" /> Verified
                                </span>
                              ) : (
                                <span className="text-gray-400">Unverified</span>
                              )}
                            </td>
                            <td className="p-3">
                              <span className={`px-2 py-0.5 rounded-full font-bold ${
                                u.isActive
                                  ? 'bg-orange-100 text-orange-600 dark:bg-orange-950/40 dark:text-orange-300'
                                  : 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300'
                              }`}>
                                {u.isActive ? 'Active' : 'Suspended'}
                              </span>
                            </td>
                            <td className="p-3 text-gray-400">
                              {new Date(u.createdAt).toLocaleDateString()}
                            </td>
                            <td className="p-3 text-right space-x-1">
                              <button
                                onClick={() => handleBan(u)}
                                className={`p-1.5 rounded-lg transition ${
                                  u.isActive 
                                    ? 'text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/30' 
                                    : 'text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-950/30'
                                }`}
                                title={u.isActive ? 'Suspend User' : 'Restore User'}
                              >
                                <Ban className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteUser(u._id, u.name)}
                                className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition"
                                title="Delete User Permanently"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: Vacancies */}
            {activeTab === 'jobs' && (
              <div className="space-y-4">
                {/* Search & Location Filter */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      placeholder="Search vacancies by title or company..."
                      value={jobSearch}
                      onChange={(e) => setJobSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 text-xs border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <select
                    value={jobCityFilter}
                    onChange={(e) => setJobCityFilter(e.target.value)}
                    className="px-3 py-2 text-xs border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none"
                  >
                    {ETHIOPIAN_CITIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>

                  <select
                    value={jobStatusFilter}
                    onChange={(e) => setJobStatusFilter(e.target.value)}
                    className="px-3 py-2 text-xs border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none"
                  >
                    <option value="all">All Statuses</option>
                    <option value="active">Active Only</option>
                    <option value="closed">Closed</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>

                <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-white dark:bg-gray-800">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 uppercase font-semibold">
                        <tr>
                          <th className="p-3">Vacancy</th>
                          <th className="p-3">Location</th>
                          <th className="p-3">Category</th>
                          <th className="p-3">Status</th>
                          <th className="p-3">Featured</th>
                          <th className="p-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {jobs.map(j => (
                          <tr key={j._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/30">
                            <td className="p-3">
                              <p className="font-bold text-gray-900 dark:text-white">{j.title}</p>
                              <p className="text-gray-500">{j.company} • Posted by {j.postedBy?.name || 'N/A'}</p>
                            </td>
                            <td className="p-3 text-gray-700 dark:text-gray-300">{j.location}</td>
                            <td className="p-3 text-gray-700 dark:text-gray-300">{j.category}</td>
                            <td className="p-3">
                              <span className={`px-2 py-0.5 rounded-full font-bold capitalize ${
                                j.status === 'active'
                                  ? 'bg-orange-100 text-orange-600 dark:bg-orange-950/40 dark:text-orange-300'
                                  : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                              }`}>
                                {j.status}
                              </span>
                            </td>
                            <td className="p-3">
                              <button
                                onClick={() => handleToggleFeatureJob(j._id)}
                                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-semibold transition ${
                                  j.isFeatured
                                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
                                    : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400 hover:text-amber-600'
                                }`}
                                title={j.isFeatured ? 'Remove featured status' : 'Feature vacancy'}
                              >
                                <Star className={`w-3.5 h-3.5 ${j.isFeatured ? 'fill-current' : ''}`} />
                                {j.isFeatured ? 'Featured' : 'Standard'}
                              </button>
                            </td>
                            <td className="p-3 text-right space-x-1">
                              <a
                                href={`/jobs/${j._id}`}
                                target="_blank"
                                rel="noreferrer"
                                className="p-1.5 text-gray-500 hover:text-orange-500 rounded-lg inline-block transition"
                                title="View Vacancy Page"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </a>
                              <button
                                onClick={() => handleDeleteJob(j._id, j.title)}
                                className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition"
                                title="Delete Vacancy"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: Audit Logs */}
            {activeTab === 'audit' && (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    {['all', 'user_banned', 'user_unbanned', 'employer_verified', 'employer_rejected', 'job_deleted', 'job_featured_toggled', 'report_resolved'].map(act => (
                      <button
                        key={act}
                        onClick={() => setAuditFilter(act)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition ${
                          auditFilter === act
                            ? 'bg-orange-500 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
                        }`}
                      >
                        {act.replace(/_/g, ' ')}
                      </button>
                    ))}
                  </div>

                  <span className="text-xs text-gray-500">
                    Showing {auditLogs.length} audit entries
                  </span>
                </div>

                <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-white dark:bg-gray-800">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 uppercase font-semibold">
                        <tr>
                          <th className="p-3">Timestamp</th>
                          <th className="p-3">Admin</th>
                          <th className="p-3">Action</th>
                          <th className="p-3">Target</th>
                          <th className="p-3">Audit Reason / Details</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {auditLogs.length === 0 ? (
                          <tr>
                            <td colSpan="5" className="p-8 text-center text-gray-500">
                              No administrative audit entries found matching filter.
                            </td>
                          </tr>
                        ) : (
                          auditLogs.map(log => (
                            <tr key={log._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/30">
                              <td className="p-3 text-gray-400 whitespace-nowrap">
                                {new Date(log.createdAt).toLocaleString(undefined, {
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </td>
                              <td className="p-3">
                                <span className="font-bold text-gray-900 dark:text-white">
                                  {log.admin?.name || 'Administrator'}
                                </span>
                                <p className="text-[10px] text-gray-400">{log.admin?.email}</p>
                              </td>
                              <td className="p-3">
                                <span className={`px-2 py-0.5 rounded-full font-bold whitespace-nowrap ${getActionBadgeClass(log.action)}`}>
                                  {log.action}
                                </span>
                              </td>
                              <td className="p-3 font-semibold text-gray-800 dark:text-gray-200">
                                {log.targetName || log.targetType}
                              </td>
                              <td className="p-3 text-gray-600 dark:text-gray-300">
                                <p>{log.reason}</p>
                                {log.ipAddress && (
                                  <span className="text-[10px] text-gray-400 font-mono">IP: {log.ipAddress}</span>
                                )}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminPanel;
