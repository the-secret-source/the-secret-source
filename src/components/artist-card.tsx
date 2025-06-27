import type { RandomArtistOutput } from '@/ai/flows/artist-randomizer';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Globe, Youtube } from 'lucide-react';
import { BandcampIcon, SpotifyIcon } from '@/components/icons';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { Badge } from './ui/badge';

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
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-3xl font-headline">{artist.artistName}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-center text-muted-foreground text-lg leading-relaxed">{artist.bio}</p>

        {artist.tracks && artist.tracks.length > 0 && (
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-base">Featured Tracks</AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-2 text-left">
                  {artist.tracks.map((track, index) => (
                    <li key={index} className="flex items-center justify-between">
                      <span className="text-muted-foreground">{track.title}</span>
                      <Badge variant="secondary">{track.dataset}</Badge>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
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
