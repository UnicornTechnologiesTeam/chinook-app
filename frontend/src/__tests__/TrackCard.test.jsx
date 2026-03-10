import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TrackCard from '../components/TrackCard';

const mockTrack = {
  TrackId: 1,
  Name: 'Bohemian Rhapsody',
  artist_name: 'Queen',
  genre_name: 'Rock',
  UnitPrice: '0.99'
};

describe('TrackCard', () => {
  test('renders track information', () => {
    render(<TrackCard track={mockTrack} onBuy={() => {}} />);
    expect(screen.getByTestId('track-name')).toHaveTextContent('Bohemian Rhapsody');
    expect(screen.getByTestId('track-artist')).toHaveTextContent('Queen');
    expect(screen.getByTestId('track-price')).toHaveTextContent('$0.99');
  });

  test('calls onBuy when buy button clicked', () => {
    const mockBuy = jest.fn();
    render(<TrackCard track={mockTrack} onBuy={mockBuy} />);
    fireEvent.click(screen.getByTestId('buy-button'));
    expect(mockBuy).toHaveBeenCalledWith(mockTrack);
  });

  test('renders genre name', () => {
    render(<TrackCard track={mockTrack} onBuy={() => {}} />);
    expect(screen.getByTestId('track-genre')).toHaveTextContent('Rock');
  });
});