import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Header from './components/Header';

test('renders header with navigation links', () => {
  render(
    <MemoryRouter>
      <Header />
    </MemoryRouter>
  );

  const homeLink = screen.getByText(/Home/i);
  const botsLink = screen.getByText(/Bots/i);
  const submitLink = screen.getByText(/Submit Bot/i);

  expect(homeLink).toBeInTheDocument();
  expect(botsLink).toBeInTheDocument();
  expect(submitLink).toBeInTheDocument();
});
