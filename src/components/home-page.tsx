'use client';

import { useState, useEffect, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { getRandomArtist } from '@/ai/flows/artist-randomizer';
import { type Artist } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { ArtistCard } from '@/components/artist-card';
import { ArtistCardSkeleton } from '@/components/artist-card-skeleton';
import { Loader2 } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import { SidebarTrigger } from '@/components/ui/sidebar';

interface HomePageProps {
  selectedDatasets: string[];
  selectedLinkTypes: string[];
}

export function HomePage({ selectedDatasets, selectedLinkTypes }: HomePageProps) {
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
      // Get a random artist from the local dataset, applying filters
      const artistData = await getRandomArtist({ datasets: selectedDatasets, linkTypes: selectedLinkTypes });

      if (!artistData) {
        if (selectedDatasets.length > 0 && selectedLinkTypes.length > 0) {
          throw new Error("No artists found for the selected filters. Try adjusting your filters.");
        }
        if (selectedDatasets.length === 0) {
          throw new Error("Please select at least one dataset to discover artists.");
        }
        if (selectedLinkTypes.length === 0) {
          throw new Error("Please select at least one link type to discover artists.");
        }
        throw new Error("No artist data could be loaded. The dataset might be empty or invalid.");
      }
      
      setArtist(artistData);
    } catch (e: any) {
      const errorMessage = e.message || "Failed to fetch artist. Please try again.";
      setError(errorMessage);
      if (!errorMessage.includes("filters") && !errorMessage.includes("dataset") && !errorMessage.includes("link type")) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Could not fetch a new artist. Please try again later.',
        });
      }
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedDatasets.length > 0 && selectedLinkTypes.length > 0) {
      fetchArtist();
    } else {
      setArtist(null);
      if (selectedDatasets.length === 0) {
        setError("Please select at least one dataset to discover artists.");
      } else if (selectedLinkTypes.length === 0) {
        setError("Please select at least one link type to discover artists.");
      }
      setIsLoading(false);
    }
  }, [selectedDatasets, selectedLinkTypes]);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  const handleNewArtist = () => {
    startTransition(() => {
      fetchArtist();
    });
  };

  const isDiscovering = isPending || isLoading;
  const canDiscover = selectedDatasets.length > 0 && selectedLinkTypes.length > 0;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 md:p-12">
      <div className="fixed bottom-5 right-5 z-10 md:hidden">
        <SidebarTrigger className="h-14 w-14 rounded-full shadow-lg" />
      </div>
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
          <Button onClick={handleNewArtist} disabled={isDiscovering || !canDiscover} size="lg" className="shadow-lg">
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
      <footer className="mt-auto flex flex-col items-center gap-4 py-6 text-center text-sm text-muted-foreground">
        {year && <p>&copy; {year} The Secret Source. All Rights Reserved.</p>}
        <Button asChild variant="outline" size="sm">
          <a href="https://github.com/kwatcharasupat/the-secret-source" target="_blank" rel="noopener noreferrer">
            <FaGithub />
            Contribute on GitHub
          </a>
        </Button>
      </footer>
    </div>
  );
}
