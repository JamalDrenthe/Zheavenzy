import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Copy, Check, Share2 } from 'lucide-react';
import type { Track } from '@/types';
import { TrackCover } from '@/components/TrackCover';
import { toast } from 'sonner';

interface ShareTrackModalProps {
  track: Track | null;
  onClose: () => void;
}

export function ShareTrackModal({ track, onClose }: ShareTrackModalProps) {
  const [copied, setCopied] = useState(false);

  if (!track) return null;

  const shareUrl = `${window.location.origin}/app/track/${track.id}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success('Link gekopieerd naar klembord');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={!!track} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-[#0e0e11]/98 backdrop-blur-2xl border border-white/10 text-white">
        <DialogHeader>
          <DialogTitle className="text-white text-lg font-semibold flex items-center gap-2">
            <Share2 className="w-5 h-5 text-[#D4AF37]" />
            Deel deze track
          </DialogTitle>
        </DialogHeader>

        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 my-2">
          <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
            <TrackCover track={track} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-white truncate">{track.title}</p>
            <p className="text-xs text-white/50 truncate">{track.userName || 'Zheavenzy'}</p>
          </div>
        </div>

        <div className="space-y-3 mt-2">
          <label className="text-xs font-medium text-white/60">Directe link</label>
          <div className="flex gap-2">
            <Input
              value={shareUrl}
              readOnly
              className="bg-white/5 border-white/10 text-white select-all text-xs"
            />
            <Button
              onClick={handleCopy}
              className="bg-[#D4AF37] hover:bg-[#F3E5AB] text-black font-semibold flex items-center gap-1.5"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Gekopieerd' : 'Kopieer'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
