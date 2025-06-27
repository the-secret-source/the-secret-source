import type { Artist } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { Badge } from './ui/badge';
import { FaBandcamp, FaSpotify, FaApple, FaYoutube, FaSoundcloud, FaGithub, FaLink } from 'react-icons/fa';
import { SiDiscogs } from 'react-icons/si';

interface ArtistCardProps {
  artist: Artist;
}

const linkLabels: Record<string, string> = {
  bandcampUrl: 'Bandcamp',
  spotifyUrl: 'Spotify',
  appleMusicUrl: 'Apple Music',
  discogsUrl: 'Discogs',
  youtubeUrl: 'YouTube',
  soundcloudUrl: 'SoundCloud',
  weathervaneUrl: 'Weathervane Music',
  mixRescueUrl: 'Mix Rescue',
};

const iconMap: Record<string, React.ElementType> = {
  bandcampUrl: FaBandcamp,
  spotifyUrl: FaSpotify,
  appleMusicUrl: FaApple,
  discogsUrl: SiDiscogs,
  youtubeUrl: FaYoutube,
  soundcloudUrl: FaSoundcloud,
  weathervaneUrl: FaLink,
  mixRescueUrl: FaLink,
};

export function ArtistCard({ artist }: ArtistCardProps) {
  const renderLink = (url: string, key: string) => {
    const label = linkLabels[key] || 'Listen';
    const IconComponent = iconMap[key] || FaLink;

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <a href={url} target="_blank" rel="noopener noreferrer" aria-label={`Listen on ${label}`}>
              <IconComponent className="h-6 w-6" />
            </a>
          </TooltipTrigger>
          <TooltipContent>
            <p>{label}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };
  
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
                      <div className="flex items-center gap-3">
                        <span className="text-muted-foreground">{track.title}</span>
                        <div className="flex items-center gap-3">
                          {track.bandcampUrl && renderLink(track.bandcampUrl, 'bandcampUrl')}
                          {track.spotifyUrl && renderLink(track.spotifyUrl, 'spotifyUrl')}
                          {track.appleMusicUrl && renderLink(track.appleMusicUrl, 'appleMusicUrl')}
                          {track.discogsUrl && renderLink(track.discogsUrl, 'discogsUrl')}
                          {track.youtubeUrl && renderLink(track.youtubeUrl, 'youtubeUrl')}
                          {track.soundcloudUrl && renderLink(track.soundcloudUrl, 'soundcloudUrl')}
                        </div>
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
              <FaGithub />
              Know this artist? Contribute
            </a>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
