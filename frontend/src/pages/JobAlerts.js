import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useJobAlerts } from '../contexts/JobAlertsContext';
import { 
  Bell, 
  Plus, 
  Trash2, 
  ToggleLeft, 
  ToggleRight, 
  Search, 
  MapPin, 
  DollarSign, 
  Briefcase, 
  Calendar,
  ExternalLink,
  Clock,
  CheckCircle2,
  SlidersHorizontal,
  Mail
} from 'lucide-react';

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

const CATEGORIES = [
  'All Categories',
  'IT & Software',
  'Engineering',
  'Business',
  'Marketing',
  'Sales',
  'Finance',
  'Healthcare',
  'Education',
  'Hospitality'
];

const JobAlerts = () => {
  const { alerts, loading, createAlert, deleteAlert, toggleAlert } = useJobAlerts();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newAlert, setNewAlert] = useState({
    title: '',
    keywords: '',
    location: 'All Ethiopia',
    category: 'All Categories',
    minSalary: '',
    jobType: 'all',
    frequency: 'instant',
    emailNotification: true
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newAlert.title.trim() || !newAlert.keywords.trim()) return;

    try {
      setSubmitting(true);
      await createAlert({
        title: newAlert.title.trim(),
        keywords: newAlert.keywords.trim(),
        location: newAlert.location,
        category: newAlert.category,
        minSalary: newAlert.minSalary ? Number(newAlert.minSalary) : 0,
        jobType: newAlert.jobType,
        frequency: newAlert.frequency,
        emailNotification: newAlert.emailNotification
      });

      setNewAlert({
        title: '',
        keywords: '',
        location: 'All Ethiopia',
        category: 'All Categories',
        minSalary: '',
        jobType: 'all',
        frequency: 'instant',
        emailNotification: true
      });
      setShowCreateForm(false);
    } catch (err) {
      console.error('Error creating alert:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (alertId) => {
    if (window.confirm('Are you sure you want to remove this job alert subscription?')) {
      deleteAlert(alertId);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-950/40 text-orange-500 dark:text-orange-400 flex items-center justify-center">
                <Bell className="w-5 h-5" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
                Job Alerts & Subscriptions
              </h1>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Get notified immediately via in-app bell and email whenever Ethiopian employers post vacancies matching your profile.
            </p>
          </div>

          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm rounded-xl shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            {showCreateForm ? 'Close Form' : 'Create New Alert'}
          </button>
        </div>

        {/* Create Alert Form */}
        {showCreateForm && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sm:p-8 mb-8 transition">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100 dark:border-gray-700">
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  Configure New Alert Subscription
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Target specific Ethiopian cities, industries, salary minimums, and keywords.
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-orange-50 dark:bg-orange-950/30 text-orange-500 dark:text-orange-400 text-xs font-semibold">
                Instant Notification
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                    Alert Title *
                  </label>
                  <input
                    type="text"
                    value={newAlert.title}
                    onChange={(e) => setNewAlert({ ...newAlert, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                    placeholder="e.g. Senior Frontend Addis Ababa"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <Search className="w-3.5 h-3.5 text-gray-400" />
                    Keywords / Role Title *
                  </label>
                  <input
                    type="text"
                    value={newAlert.keywords}
                    onChange={(e) => setNewAlert({ ...newAlert, keywords: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                    placeholder="e.g. React, Node.js, Accounting, Sales"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-gray-400" />
                    Location
                  </label>
                  <select
                    value={newAlert.location}
                    onChange={(e) => setNewAlert({ ...newAlert, location: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                  >
                    {ETHIOPIAN_CITIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <Briefcase className="w-3.5 h-3.5 text-gray-400" />
                    Category
                  </label>
                  <select
                    value={newAlert.category}
                    onChange={(e) => setNewAlert({ ...newAlert, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <DollarSign className="w-3.5 h-3.5 text-gray-400" />
                    Min Salary (ETB)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    value={newAlert.minSalary}
                    onChange={(e) => setNewAlert({ ...newAlert, minSalary: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                    placeholder="e.g. 20000"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <SlidersHorizontal className="w-3.5 h-3.5 text-gray-400" />
                    Work Arrangement / Type
                  </label>
                  <select
                    value={newAlert.jobType}
                    onChange={(e) => setNewAlert({ ...newAlert, jobType: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                  >
                    <option value="all">All Arrangements</option>
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="contract">Contract</option>
                    <option value="internship">Internship</option>
                    <option value="remote">Remote</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-gray-400" />
                    Dispatch Frequency
                  </label>
                  <select
                    value={newAlert.frequency}
                    onChange={(e) => setNewAlert({ ...newAlert, frequency: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                  >
                    <option value="instant">Instant (Real-time in-app notification)</option>
                    <option value="daily">Daily Digest</option>
                    <option value="weekly">Weekly Summary</option>
                  </select>
                </div>
              </div>

              <div className="p-3.5 bg-gray-50 dark:bg-gray-700/50 rounded-xl flex items-center gap-3">
                <input
                  type="checkbox"
                  id="emailNotification"
                  checked={newAlert.emailNotification}
                  onChange={(e) => setNewAlert({ ...newAlert, emailNotification: e.target.checked })}
                  className="w-4 h-4 text-orange-500 rounded focus:ring-orange-500"
                />
                <label htmlFor="emailNotification" className="text-xs font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5 cursor-pointer">
                  <Mail className="w-3.5 h-3.5 text-gray-500" />
                  Also send email alert digests to my registered email address
                </label>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm rounded-xl shadow-sm transition disabled:opacity-50"
                >
                  {submitting ? 'Subscribing...' : 'Save & Activate Alert'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-5 py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-semibold text-sm rounded-xl transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="space-y-4 mb-6">
            {[1, 2].map(n => (
              <div key={n} className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 animate-pulse">
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        )}

        {/* Alerts List */}
        <div className="space-y-4">
          {!loading && alerts.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-10 text-center">
              <div className="w-16 h-16 rounded-full bg-orange-50 dark:bg-orange-950/30 text-orange-500 dark:text-orange-400 mx-auto mb-4 flex items-center justify-center">
                <Bell className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                No Active Job Alert Subscriptions
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
                Never miss an opening. Configure alerts with your target Ethiopian cities and professions to receive immediate notifications.
              </p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm rounded-xl transition shadow-sm"
              >
                <Plus className="w-4 h-4" />
                Create Your First Alert
              </button>
            </div>
          ) : (
            alerts.map(alert => {
              const alertId = alert._id || alert.id;
              const isActive = alert.isActive !== undefined ? alert.isActive : alert.active;
              const searchLocation = alert.location && alert.location !== 'All Ethiopia' ? alert.location : '';

              return (
                <div
                  key={alertId}
                  className={`bg-white dark:bg-gray-800 rounded-2xl shadow-sm border p-6 transition ${
                    isActive
                      ? 'border-gray-200 dark:border-gray-700'
                      : 'border-gray-200 dark:border-gray-700/60 opacity-70'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2.5 mb-2">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                          {alert.title}
                        </h3>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            isActive
                              ? 'bg-orange-100 dark:bg-orange-950/40 text-orange-500 dark:text-orange-300'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                          }`}
                        >
                          {isActive ? 'Active' : 'Paused'}
                        </span>
                        {alert.frequency && (
                          <span className="px-2 py-0.5 rounded-full text-[11px] bg-orange-50 dark:bg-orange-950/30 text-orange-600 dark:text-orange-300">
                            {alert.frequency}
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-600 dark:text-gray-300 mt-3">
                        <p className="flex items-center gap-1.5">
                          <Search className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          <span className="font-semibold text-gray-700 dark:text-gray-200">Keywords:</span> {alert.keywords}
                        </p>
                        <p className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          <span className="font-semibold text-gray-700 dark:text-gray-200">Location:</span> {alert.location || 'All Ethiopia'}
                        </p>
                        <p className="flex items-center gap-1.5">
                          <Briefcase className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          <span className="font-semibold text-gray-700 dark:text-gray-200">Category:</span> {alert.category || 'All Categories'}
                        </p>
                        {alert.minSalary > 0 && (
                          <p className="flex items-center gap-1.5">
                            <DollarSign className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                            <span className="font-semibold text-gray-700 dark:text-gray-200">Min Salary:</span> {alert.minSalary.toLocaleString()} ETB
                          </p>
                        )}
                        <p className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          <span className="font-semibold text-gray-700 dark:text-gray-200">Created:</span> {new Date(alert.createdAt).toLocaleDateString()}
                        </p>
                        {alert.lastNotifiedAt && (
                          <p className="flex items-center gap-1.5 text-orange-500 dark:text-orange-400 font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Last Match: {new Date(alert.lastNotifiedAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>

                      {/* Direct Explore Link */}
                      <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700/60 flex items-center gap-4">
                        <Link
                          to={`/jobs?search=${encodeURIComponent(alert.keywords)}${searchLocation ? `&location=${encodeURIComponent(searchLocation)}` : ''}`}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-500 dark:text-orange-400 hover:underline"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          Search matching vacancies right now
                        </Link>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex sm:flex-col items-center gap-2 shrink-0 pt-2 sm:pt-0">
                      <button
                        onClick={() => toggleAlert(alertId)}
                        className={`p-2 rounded-xl transition ${
                          isActive
                            ? 'text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-950/30'
                            : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                        title={isActive ? 'Pause Alert' : 'Activate Alert'}
                      >
                        {isActive ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
                      </button>

                      <button
                        onClick={() => handleDelete(alertId)}
                        className="p-2 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 transition"
                        title="Delete Alert Subscription"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
};

export default JobAlerts;
