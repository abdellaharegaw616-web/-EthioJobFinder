const React = require('react');

const staticParams = new URLSearchParams();
const staticSetParams = () => {};

module.exports = {
  BrowserRouter: ({ children }) => React.createElement('div', { 'data-testid': 'router' }, children),
  MemoryRouter: ({ children }) => React.createElement('div', { 'data-testid': 'memory-router' }, children),
  Routes: ({ children }) => React.createElement('div', { 'data-testid': 'routes' }, children),
  Route: ({ element }) => element || null,
  Link: ({ to, children, ...props }) => React.createElement('a', { href: to, ...props }, children),
  NavLink: ({ to, children, ...props }) => React.createElement('a', { href: to, ...props }, children),
  Navigate: ({ to }) => React.createElement('div', { 'data-testid': 'navigate', 'data-to': to }),
  useNavigate: () => () => {},
  useLocation: () => ({ pathname: '/', search: '', hash: '', state: null }),
  useParams: () => ({ id: '1' }),
  useSearchParams: () => [staticParams, staticSetParams]
};
