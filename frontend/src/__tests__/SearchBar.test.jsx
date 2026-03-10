import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SearchBar from '../components/SearchBar';

describe('SearchBar', () => {
  test('renders search input and button', () => {
    render(<SearchBar onSearch={() => {}} />);
    expect(screen.getByTestId('search-input')).toBeInTheDocument();
    expect(screen.getByTestId('search-button')).toBeInTheDocument();
  });

  test('calls onSearch with query on submit', () => {
    const mockSearch = jest.fn();
    render(<SearchBar onSearch={mockSearch} />);
    const input = screen.getByTestId('search-input');
    fireEvent.change(input, { target: { value: 'rock' } });
    fireEvent.submit(screen.getByTestId('search-form'));
    expect(mockSearch).toHaveBeenCalledWith('rock');
  });

  test('does not search with empty query', () => {
    const mockSearch = jest.fn();
    render(<SearchBar onSearch={mockSearch} />);
    fireEvent.submit(screen.getByTestId('search-form'));
    expect(mockSearch).not.toHaveBeenCalled();
  });
});