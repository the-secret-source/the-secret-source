# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

## Contributing

We welcome contributions to expand the list of open-source artists!

### Adding a New Dataset

To add a new dataset of tracks, please follow these steps:

1.  **Create a Dataset File**:
    *   Navigate to the `src/data/datasets/` directory.
    *   Create a new TypeScript file for your dataset (e.g., `my-dataset.ts`).
    *   Inside this file, export your tracklist as a constant. The standard format is an array of tuples, where each tuple is `[trackTitle: string, artistName: string, genre: string]`.

    *Example (`src/data/datasets/my-dataset.ts`):*
    ```typescript
    export const myDatasetTracklist: [string, string, string][] = [
      ['Awesome Song', 'The Cool Band', 'Indie Rock'],
      ['Another Hit', 'The Cool Band', 'Indie Rock'],
      ['Synth Dreams', 'Digital Artist', 'Electronic'],
    ];
    ```

2.  **Register and Parse Your Dataset**:
    *   Open `src/data/artists.ts`.
    *   **Import** your new tracklist at the top of the file:
        ```typescript
        import { myDatasetTracklist } from './datasets/my-dataset';
        ```
    *   **Parse the data**. If your data follows the standard `[title, artist, genre]` format, you can reuse the existing `parseMusdb18Data` function. If your dataset has a different structure, you will need to write a new parsing function.
    *   **Add to the main list**. Call the parser with your new data and add the result to the `artists` array using the spread operator (`...`).

    *Example modification in `src/data/artists.ts`:*
    ```typescript
    // ... other imports
    import { musdb18Tracklist } from './datasets/musdb-18';
    import { myDatasetTracklist } from './datasets/my-dataset'; // Import new dataset

    // ... interfaces ...

    // ... parser function (e.g., parseMusdb18Data) ...

    // --- Dataset Registration ---
    const musdb18Artists = parseMusdb18Data(musdb18Tracklist);
    const myDatasetArtists = parseMusdb18Data(myDatasetTracklist); // Parse new dataset

    // Combine artists from all registered datasets.
    export const artists: Artist[] = [
      ...musdb18Artists,
      ...myDatasetArtists, // Add new artists to the list
    ];
    ```

3.  **Submit a Pull Request**:
    *   Once you've tested that your changes work, please submit a pull request for review.
