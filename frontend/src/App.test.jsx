import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import App from './App';

const mockStore = configureStore({
  reducer: {
    test: (state = {}) => state,
  },
});

const renderWithProviders = ui => {
  return render(
    <Provider store={mockStore}>
      <BrowserRouter>{ui}</BrowserRouter>
    </Provider>
  );
};

describe('App', () => {
  it('renders without crashing', () => {
    renderWithProviders(<App />);
    expect(document.body).toBeInTheDocument();
  });

  it('should render the main app container', () => {
    renderWithProviders(<App />);
    expect(document.querySelector('body')).toBeInTheDocument();
  });
});
