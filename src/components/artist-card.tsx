import type { Artist } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Globe, Youtube, Github, Disc, Apple, Music } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { Badge } from './ui/badge';
import { cn } from '@/lib/utils';

interface ArtistCardProps {
  artist: Artist;
}

type LinkType = 'direct' | 'streaming' | 'other';

const getLinkCategory = (key: string): LinkType => {
  const directKeys = ['bandcampUrl', 'discogsUrl'];
  const streamingKeys = ['spotifyUrl', 'appleMusicUrl'];
  if (directKeys.includes(key)) return 'direct';
  if (streamingKeys.includes(key)) return 'streaming';
  return 'other';
};

const SocialLink = ({ href, children, label, linkType }: { href: string; children: React.ReactNode, label: string; linkType: LinkType }) => {
  const colorClass = {
    direct: 'bg-accent',
    streaming: 'bg-chart-2',
    other: 'bg-chart-4'
  }[linkType];

  return (
    <div className="flex items-center gap-1.5">
      <div className={cn("h-2 w-2 shrink-0 rounded-full", colorClass)} />
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
    </div>
  )
};

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
      <CardFooter className="flex items-center justify-between pt-4 border-t">
        <div className="flex items-center gap-4 flex-wrap">
          {artist.discogsUrl && (
            <SocialLink href={artist.discogsUrl} label="Discogs" linkType={getLinkCategory('discogsUrl')}>
              <Disc className="h-6 w-6" />
            </SocialLink>
          )}
          {artist.spotifyUrl && (
            <SocialLink href={artist.spotifyUrl} label="Spotify" linkType={getLinkCategory('spotifyUrl')}>
              <Music className="h-6 w-6" />
            </SocialLink>
          )}
          {artist.appleMusicUrl && (
            <SocialLink href={artist.appleMusicUrl} label="Apple Music" linkType={getLinkCategory('appleMusicUrl')}>
              <Apple className="h-6 w-6" />
            </SocialLink>
          )}
          {artist.youtubeUrl && (
            <SocialLink href={artist.youtubeUrl} label="YouTube" linkType={getLinkCategory('youtubeUrl')}>
              <Youtube className="h-6 w-6" />
            </SocialLink>
          )}
          {artist.otherLinks?.map((link, index) => (
            <SocialLink key={index} href={link} label="their website" linkType={getLinkCategory('otherLinks')}>
              <Globe className="h-6 w-6" />
            </SocialLink>
          ))}
        </div>
        {artist.bandcampUrl ? (
          <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold shadow-md">
            <a href={artist.bandcampUrl} target="_blank" rel="noopener noreferrer">
              <div className="h-2 w-2 mr-2 shrink-0 rounded-full bg-background/70" />
              <Music className="mr-2 h-5 w-5" />
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
