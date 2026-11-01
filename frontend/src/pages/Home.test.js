import { render, screen } from '@testing-library/react';
import Home from './Home';
import { JobProvider } from '../contexts/JobContext';
import { SavedJobsProvider } from '../contexts/SavedJobsContext';
import { ApplicationsProvider } from '../contexts/ApplicationsContext';
import { AuthProvider } from '../contexts/AuthContext';

const renderHome = () => {
  return render(
    <AuthProvider>
      <SavedJobsProvider>
        <ApplicationsProvider>
          <JobProvider>
            <Home />
          </JobProvider>
        </ApplicationsProvider>
      </SavedJobsProvider>
    </AuthProvider>
  );
};

test('renders Home discovery search inputs and Ethiopian city filters', () => {
  renderHome();

  // Verify main search input
  const searchInput = screen.getByPlaceholderText(/Job title, keywords, skills, or employer/i);
  expect(searchInput).toBeInTheDocument();

  // Verify Ethiopian location search input
  const locationInput = screen.getByPlaceholderText(/City or region/i);
  expect(locationInput).toBeInTheDocument();

  // Verify popular Ethiopian cities are displayed
  expect(screen.getByText('Addis Ababa')).toBeInTheDocument();
  expect(screen.getByText('Hawassa')).toBeInTheDocument();
  expect(screen.getByText('Dire Dawa')).toBeInTheDocument();

  // Verify search button
  expect(screen.getByRole('button', { name: /Search Vacancies/i })).toBeInTheDocument();
});
