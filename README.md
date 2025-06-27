# The Secret Source

"the secret source" is a project dedicated to celebrating and supporting the artists whose music is often used in open-source datasets for research and development. It's a way to give back and discover the creators behind the data that powers so much innovation in the audio technology space.

## Supporting This Project

Even though there is a sponsor button on the side of this repo, this is meant to only cover the cost of hosting the website. Any additional proceeds (after applicable tax) will go directly to [Weathervane Music](https://weathervanemusic.org/donate). Updates will be posted here for full transparency.

If you would like to cover the long-term cost of hosting this website directly (i.e., be billed by GCP for this project instead of me), please contact me at kwatcharasupat [at] ieee.org. 

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
