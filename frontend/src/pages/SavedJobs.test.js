import { render, screen } from '@testing-library/react';
import SavedJobs from './SavedJobs';
import { AuthProvider } from '../contexts/AuthContext';
import { SavedJobsProvider } from '../contexts/SavedJobsContext';
import { ApplicationsProvider } from '../contexts/ApplicationsContext';

const renderSavedJobs = () => {
  return render(
    <AuthProvider>
      <SavedJobsProvider>
        <ApplicationsProvider>
          <SavedJobs />
        </ApplicationsProvider>
      </SavedJobsProvider>
    </AuthProvider>
  );
};

test('renders Saved Jobs page header and empty state when no jobs saved', () => {
  localStorage.clear();
  renderSavedJobs();

  expect(screen.getByText(/Saved Vacancies/i)).toBeInTheDocument();
  expect(screen.getByText(/No saved jobs yet/i)).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /Browse Open Vacancies/i })).toBeInTheDocument();
});
