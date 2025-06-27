import type { SVGProps } from 'react';
import type { RandomArtistOutput } from '@/ai/flows/random-artist-selection';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Globe, Youtube } from 'lucide-react';
import { BandcampIcon, SpotifyIcon } from '@/components/icons';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

interface ArtistCardProps {
  artist: RandomArtistOutput;
}

const SocialLink = ({ href, children, label }: { href: string; children: React.ReactNode, label: string }) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-foreground transition-colors"
          aria-label={`Visit artist on ${label}`}
        >
          {children}
        </a>
      </TooltipTrigger>
      <TooltipContent>
        <p>Visit on {label}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

export function ArtistCard({ artist }: ArtistCardProps) {
  return (
    <Card className="w-full max-w-2xl animate-in fade-in-0 duration-700 shadow-xl">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-headline">{artist.artistName}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-center text-muted-foreground text-lg leading-relaxed">{artist.bio}</p>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6">
        <div className="flex items-center gap-4">
          {artist.youtubeUrl && (
            <SocialLink href={artist.youtubeUrl} label="YouTube">
              <Youtube className="h-6 w-6" />
            </SocialLink>
          )}
          {artist.spotifyUrl && (
            <SocialLink href={artist.spotifyUrl} label="Spotify">
              <SpotifyIcon className="h-6 w-6" />
            </SocialLink>
          )}
          {artist.otherLinks?.map((link, index) => (
            <SocialLink key={index} href={link} label="their website">
              <Globe className="h-6 w-6" />
            </SocialLink>
          ))}
        </div>
        {artist.bandcampUrl ? (
          <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold shadow-md">
            <a href={artist.bandcampUrl} target="_blank" rel="noopener noreferrer">
              <BandcampIcon className="mr-2 h-5 w-5" />
              Support on Bandcamp
            </a>
          </Button>
        ) : (
          <div className="h-10"></div> // Placeholder for spacing if no Bandcamp link
        )}
      </CardFooter>
    </Card>
  );
}
