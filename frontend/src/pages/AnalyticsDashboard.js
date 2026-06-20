import { useState } from 'react';
import { BarChart3, TrendingUp, Users, Briefcase, Eye, CheckCircle, Clock, Calendar, ArrowUp, ArrowDown } from 'lucide-react';

const AnalyticsDashboard = () => {
  const [activeTab, setActiveTab] = useState('jobseeker');
  const [timeRange, setTimeRange] = useState('30days');

  // Mock data for job seekers
  const jobSeekerStats = {
    profileViews: 1247,
    applications: 45,
    interviews: 8,
    offers: 2,
    savedJobs: 23,
    profileCompleteness: 85
  };

  const jobSeekerTrends = [
    { label: 'Profile Views', value: 1247, change: 12, positive: true },
    { label: 'Applications', value: 45, change: 8, positive: true },
    { label: 'Interviews', value: 8, change: -2, positive: false },
    { label: 'Offers', value: 2, change: 1, positive: true }
  ];

  // Mock data for employers
  const employerStats = {
    totalJobs: 15,
    activeJobs: 12,
    totalApplications: 234,
    newApplications: 45,
    hired: 8,
    jobViews: 5678
  };

  const employerTrends = [
    { label: 'Total Applications', value: 234, change: 18, positive: true },
    { label: 'Job Views', value: 5678, change: 25, positive: true },
    { label: 'Hired', value: 8, change: 3, positive: true },
    { label: 'Active Jobs', value: 12, change: 0, positive: true }
  ];

  const renderStatCard = (icon, label, value, subtitle) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
          {icon}
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</span>
      </div>
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{value}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-300">{label}</p>
    </div>
  );

  const renderTrendCard = (trend) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border dark:border-gray-700">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-300">{trend.label}</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">{trend.value}</p>
        </div>
        <div className={`flex items-center gap-1 ${trend.positive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
          {trend.positive ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
          <span className="text-sm font-medium">{Math.abs(trend.change)}%</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-3 mb-8">
          <BarChart3 className="w-8 h-8 text-green-700" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h1>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md mb-6">
          <div className="flex border-b dark:border-gray-700">
            <button
              onClick={() => setActiveTab('jobseeker')}
              className={`flex-1 py-4 px-6 text-center font-medium ${
                activeTab === 'jobseeker'
                  ? 'border-b-2 border-green-700 text-green-700'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              Job Seeker Analytics
            </button>
            <button
              onClick={() => setActiveTab('employer')}
              className={`flex-1 py-4 px-6 text-center font-medium ${
                activeTab === 'employer'
                  ? 'border-b-2 border-green-700 text-green-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Employer Analytics
            </button>
          </div>

          <div className="p-6">
            {/* Time Range Selector */}
            <div className="flex items-center gap-2 mb-6">
              <Calendar className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md"
              >
                <option value="7days">Last 7 Days</option>
                <option value="30days">Last 30 Days</option>
                <option value="90days">Last 90 Days</option>
                <option value="1year">Last Year</option>
              </select>
            </div>

            {activeTab === 'jobseeker' ? (
              <div className="space-y-6">
                {/* Job Seeker Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {renderStatCard(
                    <Eye className="w-6 h-6 text-green-700" />,
                    'Profile Views',
                    jobSeekerStats.profileViews,
                    'Last 30 days'
                  )}
                  {renderStatCard(
                    <Briefcase className="w-6 h-6 text-green-700" />,
                    'Applications',
                    jobSeekerStats.applications,
                    'Total'
                  )}
                  {renderStatCard(
                    <CheckCircle className="w-6 h-6 text-green-700" />,
                    'Interviews',
                    jobSeekerStats.interviews,
                    'Scheduled'
                  )}
                  {renderStatCard(
                    <TrendingUp className="w-6 h-6 text-green-700" />,
                    'Offers',
                    jobSeekerStats.offers,
                    'Received'
                  )}
                  {renderStatCard(
                    <Users className="w-6 h-6 text-green-700" />,
                    'Saved Jobs',
                    jobSeekerStats.savedJobs,
                    'Bookmarked'
                  )}
                  {renderStatCard(
                    <Clock className="w-6 h-6 text-green-700" />,
                    'Profile Completeness',
                    `${jobSeekerStats.profileCompleteness}%`,
                    'Optimization'
                  )}
                </div>

                {/* Trends */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 dark:text-white">Performance Trends</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {jobSeekerTrends.map((trend, index) => (
                      <div key={index}>{renderTrendCard(trend)}</div>
                    ))}
                  </div>
                </div>

                {/* Activity Timeline */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border dark:border-gray-700">
                  <h3 className="text-lg font-semibold mb-4 dark:text-white">Recent Activity</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-700 rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium dark:text-white">Applied to Senior Software Engineer at TechCorp</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium dark:text-white">Profile viewed by 3 recruiters</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Yesterday</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-yellow-600 rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium dark:text-white">Interview scheduled with Data Solutions Inc</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">3 days ago</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Employer Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {renderStatCard(
                    <Briefcase className="w-6 h-6 text-green-700" />,
                    'Total Jobs',
                    employerStats.totalJobs,
                    'Posted'
                  )}
                  {renderStatCard(
                    <CheckCircle className="w-6 h-6 text-green-700" />,
                    'Active Jobs',
                    employerStats.activeJobs,
                    'Currently open'
                  )}
                  {renderStatCard(
                    <Users className="w-6 h-6 text-green-700" />,
                    'Total Applications',
                    employerStats.totalApplications,
                    'Received'
                  )}
                  {renderStatCard(
                    <TrendingUp className="w-6 h-6 text-green-700" />,
                    'New Applications',
                    employerStats.newApplications,
                    'This week'
                  )}
                  {renderStatCard(
                    <Eye className="w-6 h-6 text-green-700" />,
                    'Job Views',
                    employerStats.jobViews,
                    'Total views'
                  )}
                  {renderStatCard(
                    <CheckCircle className="w-6 h-6 text-green-700" />,
                    'Hired',
                    employerStats.hired,
                    'Successful hires'
                  )}
                </div>

                {/* Trends */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 dark:text-white">Performance Trends</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {employerTrends.map((trend, index) => (
                      <div key={index}>{renderTrendCard(trend)}</div>
                    ))}
                  </div>
                </div>

                {/* Top Performing Jobs */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border dark:border-gray-700">
                  <h3 className="text-lg font-semibold mb-4 dark:text-white">Top Performing Jobs</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div>
                        <p className="font-medium dark:text-white">Senior Software Engineer</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Posted 2 weeks ago</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold dark:text-white">89 applications</p>
                        <p className="text-sm text-green-600 dark:text-green-400">12 interviews</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div>
                        <p className="font-medium dark:text-white">Product Manager</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Posted 1 week ago</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold dark:text-white">67 applications</p>
                        <p className="text-sm text-green-600 dark:text-green-400">8 interviews</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div>
                        <p className="font-medium dark:text-white">Data Analyst</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Posted 5 days ago</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold dark:text-white">45 applications</p>
                        <p className="text-sm text-green-600 dark:text-green-400">5 interviews</p>
                      </div>
                    </div>
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

export default AnalyticsDashboard;
