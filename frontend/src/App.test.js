import { render, screen } from '@testing-library/react';
import App from './App';

test('renders EthioJobFinder application navbar and content', () => {
  render(<App />);
  const brandElements = screen.getAllByText(/EthioJobFinder/i);
  expect(brandElements.length).toBeGreaterThan(0);
});
