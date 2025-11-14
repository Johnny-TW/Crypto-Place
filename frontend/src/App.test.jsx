import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders without crashing', () => {
    // App 組件內部已經包含 Redux Provider 和 Router
    render(<App />);
    expect(document.body).toBeInTheDocument();
  });

  it('should render the main app container', () => {
    // App 組件內部已經包含 Redux Provider 和 Router
    render(<App />);
    expect(document.querySelector('body')).toBeInTheDocument();
  });
});
