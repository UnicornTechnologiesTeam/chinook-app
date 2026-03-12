import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SearchBar from '../components/SearchBar';

describe('SearchBar', () => {
  test('renders search input', () => {
    render(<SearchBar query="" setQuery={() => {}} onSearch={() => {}} />);
    expect(screen.getByPlaceholderText(/buscar/i)).toBeInTheDocument();
  });

  test('renders search button', () => {
    render(<SearchBar query="" setQuery={() => {}} onSearch={() => {}} />);
    expect(screen.getByText(/buscar/i)).toBeInTheDocument();
  });

  test('calls onSearch when button clicked', () => {
    const mockSearch = jest.fn();
    render(<SearchBar query="" setQuery={() => {}} onSearch={mockSearch} />);
    fireEvent.click(screen.getByRole('button', { name: /buscar/i }));
    expect(mockSearch).toHaveBeenCalled();
  });
});
