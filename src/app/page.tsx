'use client';

import { useState, useEffect, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { getRandomArtist, type RandomArtistOutput } from '@/ai/flows/artist-randomizer';
import { useToast } from '@/hooks/use-toast';
import { ArtistCard } from '@/components/artist-card';
import { ArtistCardSkeleton } from '@/components/artist-card-skeleton';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const [artist, setArtist] = useState<RandomArtistOutput | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const fetchArtist = async () => {
    setIsLoading(true);
    setError(null);
    setArtist(null);
    try {
      const artistData = await getRandomArtist();
      setArtist(artistData);
    } catch (e) {
      const errorMessage = "Failed to fetch artist. Please try again.";
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
  }, []);

  const handleNewArtist = () => {
    startTransition(() => {
      fetchArtist();
    });
  };

  const isDiscovering = isPending || isLoading;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 md:p-12 bg-background text-foreground">
      <div className="w-full max-w-2xl space-y-8">
        <header className="text-center">
          <h1 className="text-4xl sm:text-5xl font-bold font-headline text-primary">Echo Artist Discovery</h1>
          <p className="mt-2 text-lg text-muted-foreground">Find your next favorite artist from open-source music.</p>
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
        
        <div className="flex justify-center">
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
        </div>
      </div>
    </main>
  );
}
