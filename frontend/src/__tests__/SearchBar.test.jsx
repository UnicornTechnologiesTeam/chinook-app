import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SearchBar from '../components/SearchBar';

describe('SearchBar', () => {
  test('renders search input', () => {
    render(<SearchBar onSearch={() => {}} />);
    expect(screen.getByTestId('search-input')).toBeInTheDocument();
  });

  test('renders search button', () => {
    render(<SearchBar onSearch={() => {}} />);
    expect(screen.getByTestId('search-button')).toBeInTheDocument();
  });

  test('calls onSearch when form submitted', () => {
    const mockSearch = jest.fn();
    render(<SearchBar onSearch={mockSearch} />);
    fireEvent.change(screen.getByTestId('search-input'), { target: { value: 'rock' } });
    fireEvent.submit(screen.getByTestId('search-form'));
    expect(mockSearch).toHaveBeenCalledWith('rock');
  });
});
