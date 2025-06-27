'use client';

import { useState, useEffect, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { getRandomArtist } from '@/ai/flows/artist-randomizer';
import { findArtistLinks } from '@/ai/flows/find-artist-links';
import { type Artist } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { ArtistCard } from '@/components/artist-card';
import { ArtistCardSkeleton } from '@/components/artist-card-skeleton';
import { Loader2, Github } from 'lucide-react';

export function HomePage() {
  const [artist, setArtist] = useState<Artist | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const [year, setYear] = useState<number | null>(null);

  const fetchArtist = async () => {
    setIsLoading(true);
    setError(null);
    setArtist(null);
    try {
      // First, get a random artist from the local dataset
      let artistData = await getRandomArtist();

      if (!artistData) {
        throw new Error("No artist data could be loaded. The dataset might be empty or invalid.");
      }

      // If the artist data from the file doesn't have links, search for them.
      const hasLinks = artistData.bandcampUrl || artistData.spotifyUrl || artistData.youtubeUrl || (artistData.otherLinks && artistData.otherLinks.length > 0);

      if (!hasLinks) {
        try {
          const links = await findArtistLinks({
            artistName: artistData.artistName,
          });
          // Merge the newly found links into the artist data
          artistData = { ...artistData, ...links };
        } catch (linkError) {
            console.error("Failed to fetch artist links, continuing without them.", linkError);
            // We can proceed without links, the card will show the "contribute" button.
        }
      }
      
      setArtist(artistData);
    } catch (e: any) {
      const errorMessage = e.message || "Failed to fetch artist. Please try again.";
      setError(errorMessage);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not fetch a new artist. Please try again later.',
      });
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchArtist();
    setYear(new Date().getFullYear());
  }, []);

  const handleNewArtist = () => {
    startTransition(() => {
      fetchArtist();
    });
  };

  const isDiscovering = isPending || isLoading;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 md:p-12">
      <div className="w-full max-w-2xl space-y-8">
        <header className="text-center">
          <h1 className="text-4xl sm:text-5xl font-bold font-code text-primary">the secret source</h1>
          <p className="mt-2 text-lg font-code text-muted-foreground">supporting the artists whose works have made our works possible</p>
        </header>

        <div className="w-full min-h-[300px] flex items-center justify-center">
          {isDiscovering ? (
            <ArtistCardSkeleton />
          ) : artist ? (
            <ArtistCard key={artist.artistName} artist={artist} />
          ) : error ? (
            <div className="text-center text-destructive-foreground bg-destructive/80 p-4 rounded-md">
              <p className="font-semibold">An Error Occurred</p>
              <p>{error}</p>
            </div>
          ) : null}
        </div>
        
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Button onClick={handleNewArtist} disabled={isDiscovering} size="lg" className="shadow-lg">
            {isDiscovering ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Summoning...
              </>
            ) : (
              "Discover New Artist"
            )}
          </Button>
          <Button asChild variant="outline" size="lg">
            <a href="https://github.com/kwatcharasupat/the-secret-source" target="_blank" rel="noopener noreferrer">
              <Github className="mr-2 h-5 w-5" />
              Contribute on GitHub
            </a>
          </Button>
        </div>
      </div>
      <footer className="mt-auto py-6 text-center text-sm text-muted-foreground">
        {year && <p>&copy; {year} The Secret Source. All Rights Reserved.</p>}
      </footer>
    </div>
  );
}
