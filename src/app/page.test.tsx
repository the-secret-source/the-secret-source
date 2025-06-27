import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Home from './page'
import { getArtists, getDatasetNames } from '@/data/artists';

// Mock the data layer
jest.mock('@/data/artists', () => ({
  getArtists: jest.fn(),
  getDatasetNames: jest.fn(),
}));

describe('Home Page', () => {
  beforeEach(() => {
    // Provide mock data for each test
    (getArtists as jest.Mock).mockReturnValue([
      { 
        artistName: 'Test Artist', 
        tracks: [
          { title: 'Test Track', dataset: 'Test Dataset', bandcampUrl: 'http://test.com' }
        ],
        bandcampUrl: 'http://test.com'
      }
    ]);
    (getDatasetNames as jest.Mock).mockReturnValue(['Test Dataset']);
  });

  it('renders the main heading', () => {
    render(<Home />);
 
    const heading = screen.getByRole('heading', {
      name: /the secret source/i,
    })
 
    expect(heading).toBeInTheDocument();
  });
});
