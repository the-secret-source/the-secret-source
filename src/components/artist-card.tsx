import type { Artist } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Github, Music, Apple, Disc } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { Badge } from './ui/badge';

interface ArtistCardProps {
  artist: Artist;
}

export function ArtistCard({ artist }: ArtistCardProps) {
  return (
    <Card className="w-full max-w-2xl animate-in fade-in-0 duration-700 shadow-xl">
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-3xl font-headline">{artist.artistName}</CardTitle>
      </CardHeader>
      <CardContent>
        {artist.tracks && artist.tracks.length > 0 && (
          <Accordion type="single" collapsible className="w-full" defaultValue="item-1">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-base">Featured Tracks</AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-2 text-left">
                  {artist.tracks.map((track, index) => (
                    <li key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">{track.title}</span>
                        {track.bandcampUrl && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <a href={track.bandcampUrl} target="_blank" rel="noopener noreferrer" aria-label={`Listen to ${track.title} on Bandcamp`}>
                                  <Music className="h-4 w-4 text-muted-foreground transition-colors hover:text-foreground" />
                                </a>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Listen on Bandcamp</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                        {track.spotifyUrl && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <a href={track.spotifyUrl} target="_blank" rel="noopener noreferrer" aria-label={`Listen to ${track.title} on Spotify`}>
                                  <Music className="h-4 w-4 text-muted-foreground transition-colors hover:text-foreground" />
                                </a>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Listen on Spotify</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                        {track.appleMusicUrl && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <a href={track.appleMusicUrl} target="_blank" rel="noopener noreferrer" aria-label={`Listen to ${track.title} on Apple Music`}>
                                  <Apple className="h-4 w-4 text-muted-foreground transition-colors hover:text-foreground" />
                                </a>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Listen on Apple Music</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                        {track.discogsUrl && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <a href={track.discogsUrl} target="_blank" rel="noopener noreferrer" aria-label={`View ${track.title} on Discogs`}>
                                  <Disc className="h-4 w-4 text-muted-foreground transition-colors hover:text-foreground" />
                                </a>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>View on Discogs</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{track.dataset}</Badge>
                        {track.source && <Badge variant="outline">{track.source}</Badge>}
                      </div>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
      </CardContent>
      <CardFooter className="flex items-center justify-end pt-4 border-t">
        {artist.bandcampUrl ? (
          <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold shadow-md">
            <a href={artist.bandcampUrl} target="_blank" rel="noopener noreferrer">
              Support on Bandcamp
            </a>
          </Button>
        ) : (
          <Button asChild variant="outline">
            <a href="https://github.com/kwatcharasupat/the-secret-source" target="_blank" rel="noopener noreferrer">
              <Github className="mr-2 h-4 w-4" />
              Know this artist? Contribute
            </a>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
