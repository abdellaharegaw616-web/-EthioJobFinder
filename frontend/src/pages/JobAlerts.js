import { useState } from 'react';
import { useJobAlerts } from '../contexts/JobAlertsContext';
import { Bell, Plus, Trash2, ToggleLeft, ToggleRight, Search, MapPin, DollarSign, Briefcase, Calendar } from 'lucide-react';

const JobAlerts = () => {
  const { alerts, createAlert, deleteAlert, toggleAlert } = useJobAlerts();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newAlert, setNewAlert] = useState({
    title: '',
    keywords: '',
    location: '',
    category: '',
    minSalary: '',
    jobType: '',
    emailNotification: true
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newAlert.title && newAlert.keywords) {
      createAlert(newAlert);
      setNewAlert({
        title: '',
        keywords: '',
        location: '',
        category: '',
        minSalary: '',
        jobType: '',
        emailNotification: true
      });
      setShowCreateForm(false);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this alert?')) {
      deleteAlert(id);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Bell className="w-8 h-8 text-green-700" />
            <h1 className="text-3xl font-bold text-gray-900">Job Alerts</h1>
          </div>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create Alert
          </button>
        </div>

        {/* Create Alert Form */}
        {showCreateForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Create New Job Alert</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Alert Name</label>
                <input
                  type="text"
                  value={newAlert.title}
                  onChange={(e) => setNewAlert({ ...newAlert, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="My Job Alert"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                  <Search className="w-4 h-4" />
                  Keywords
                </label>
                <input
                  type="text"
                  value={newAlert.keywords}
                  onChange={(e) => setNewAlert({ ...newAlert, keywords: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Software Developer, Engineer, etc."
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    Location
                  </label>
                  <input
                    type="text"
                    value={newAlert.location}
                    onChange={(e) => setNewAlert({ ...newAlert, location: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Addis Ababa"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    Min Salary
                  </label>
                  <input
                    type="text"
                    value={newAlert.minSalary}
                    onChange={(e) => setNewAlert({ ...newAlert, minSalary: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="50000"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                    <Briefcase className="w-4 h-4" />
                    Category
                  </label>
                  <select
                    value={newAlert.category}
                    onChange={(e) => setNewAlert({ ...newAlert, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="">All Categories</option>
                    <option value="IT & Software">IT & Software</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Business">Business</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Sales">Sales</option>
                    <option value="Finance">Finance</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Education">Education</option>
                    <option value="Hospitality">Hospitality</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Job Type</label>
                  <select
                    value={newAlert.jobType}
                    onChange={(e) => setNewAlert({ ...newAlert, jobType: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="">All Types</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Remote">Remote</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="emailNotification"
                  checked={newAlert.emailNotification}
                  onChange={(e) => setNewAlert({ ...newAlert, emailNotification: e.target.checked })}
                  className="w-4 h-4 text-green-700 rounded"
                />
                <label htmlFor="emailNotification" className="text-sm text-gray-700">
                  Send email notifications for matching jobs
                </label>
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-700 text-white rounded-md hover:bg-green-800"
                >
                  Create Alert
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Alerts List */}
        <div className="space-y-4">
          {alerts.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">No Job Alerts Yet</h3>
              <p className="text-gray-500 mb-4">Create job alerts to get notified when new jobs match your criteria.</p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="px-4 py-2 bg-green-700 text-white rounded-md hover:bg-green-800"
              >
                Create Your First Alert
              </button>
            </div>
          ) : (
            alerts.map(alert => (
              <div key={alert.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{alert.title}</h3>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        alert.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {alert.active ? 'Active' : 'Paused'}
                      </span>
                    </div>
                    <div className="space-y-1 text-sm text-gray-600">
                      {alert.keywords && (
                        <p className="flex items-center gap-1">
                          <Search className="w-4 h-4" />
                          Keywords: {alert.keywords}
                        </p>
                      )}
                      {alert.location && (
                        <p className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          Location: {alert.location}
                        </p>
                      )}
                      {alert.category && (
                        <p className="flex items-center gap-1">
                          <Briefcase className="w-4 h-4" />
                          Category: {alert.category}
                        </p>
                      )}
                      {alert.minSalary && (
                        <p className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          Min Salary: {alert.minSalary}
                        </p>
                      )}
                      {alert.jobType && (
                        <p className="flex items-center gap-1">
                          <Briefcase className="w-4 h-4" />
                          Type: {alert.jobType}
                        </p>
                      )}
                      <p className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Created: {new Date(alert.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 ml-4">
                    <button
                      onClick={() => toggleAlert(alert.id)}
                      className={`p-2 rounded hover:bg-gray-100 transition ${
                        alert.active ? 'text-green-700' : 'text-gray-400'
                      }`}
                      title={alert.active ? 'Pause Alert' : 'Activate Alert'}
                    >
                      {alert.active ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                    </button>
                    <button
                      onClick={() => handleDelete(alert.id)}
                      className="p-2 rounded hover:bg-red-100 text-red-600 transition"
                      title="Delete Alert"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default JobAlerts;
