# The Secret Source

"the secret source" is a project dedicated to celebrating and supporting the artists whose music is often used in open-source datasets for research and development. It's a way to give back and discover the creators behind the data that powers so much innovation in the audio technology space.

This application randomly selects an artist from a curated list, displays their featured tracks, and uses AI to find links to their music on platforms like Bandcamp, Spotify, and YouTube, making it easy to support them directly.

## Getting Started

To get the project running on your local machine, follow these steps:

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Run the Development Server**:
    ```bash
    npm run dev
    ```

    The application will be available at [http://localhost:9002](http://localhost:9002).

## Contributing

We welcome contributions to expand the list of open-source artists! If you know of a dataset and want to add its artists to our app, please follow these steps.

### Adding a New Dataset

1.  **Create a Dataset File**:
    *   Navigate to the `src/data/datasets/` directory.
    *   Create a new TypeScript file for your dataset (e.g., `my-dataset.ts`).
    *   Inside this file, export your tracklist as a constant. The standard format is an array of tuples, where each tuple is `[trackTitle: string, artistName: string, genre: string, links?: { bandcampUrl?: string; spotifyUrl?: string }]`.

    *Example (`src/data/datasets/my-dataset.ts`):*
    ```typescript
    export const myDatasetTracklist: [string, string, string, { bandcampUrl?: string; spotifyUrl?: string }?][] = [
      ['Awesome Song', 'The Cool Band', 'Indie Rock'],
      ['Another Hit', 'The Cool Band', 'Indie Rock'],
      ['Synth Dreams', 'Digital Artist', 'Electronic', { bandcampUrl: 'https://digitalartist.bandcamp.com/track/synth-dreams' }],
    ];
    ```

2.  **Register and Parse Your Dataset**:
    *   Open `src/data/artists.ts`.
    *   **Import** your new tracklist at the top of the file:
        ```typescript
        import { myDatasetTracklist } from './datasets/my-dataset';
        ```
    *   **Register the dataset**. Add a new entry to the `datasetsToParse` array. You'll need to provide a `name`, the `tracklist` data you just imported, and a `parser` function. If your data follows the standard format, you can reuse the existing parser logic.

    *Example modification in `src/data/artists.ts`:*
    ```typescript
    // ... other imports

    const datasetsToParse = [
      {
        name: 'MUSDB-18',
        tracklist: musdb18Tracklist,
        parser: (track: any[]) => ({ title: track[0], artistName: track[1], genre: track[2], links: track[3] }),
      },
      // Add your new dataset here
      {
        name: 'My-Dataset',
        tracklist: myDatasetTracklist,
        parser: (track: any[]) => ({ title: track[0], artistName: track[1], genre: track[2], links: track[3] }),
      }
    ];

    // ... the rest of the file processes this array automatically.
    ```

3.  **Submit a Pull Request**:
    *   Once you've tested that your changes work, please submit a pull request for review. Thank you for your contribution!
