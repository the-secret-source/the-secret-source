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

We encourage contributions! The easiest way to add artists is by providing a CSV file.

1.  **Create a CSV File**:
    *   Navigate to the `src/data/datasets/` directory.
    *   Create a new CSV file for your dataset (e.g., `my-dataset.csv`).
    *   The CSV must have the following header: `artist_name,track_title,genre,bandcamp_url,spotify_url`.
    *   Fill the CSV with your track data. Here's an example row:
      ```csv
      "The Cool Band","Awesome Song","Indie Rock","https://thecoolband.bandcamp.com/track/awesome-song",
      ```

2.  **Register Your Dataset**:
    *   Open `src/data/artists.ts`.
    *   Add a new entry to the `datasetsToParse` array. You'll need to provide a `name` and the `filePath` for your new CSV. The parser can usually be reused.

    *Example modification in `src/data/artists.ts`:*
    ```typescript
    // ...
    const datasetsToParse = [
      // ... existing datasets
      {
        name: 'My-Dataset',
        filePath: 'datasets/my-dataset.csv', // Relative path from src/data
        parser: (row: any) => ({
          title: row.track_title,
          artistName: row.artist_name,
          genre: row.genre,
          links: { bandcampUrl: row.bandcamp_url, spotifyUrl: row.spotify_url },
        }),
      }
    ];
    // ... the rest of the file processes this array automatically.
    ```

3.  **Submit a Pull Request**:
    *   Once you've tested that your changes work, please submit a pull request for review. Thank you for your contribution!
