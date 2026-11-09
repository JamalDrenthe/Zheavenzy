export interface UserSocials {
  tiktok?: string;
  youtube?: string;
  instagram?: string;
  x?: string;
}

export interface User {
  id: string;
  email: string;
  username: string;
  displayName: string;
  bio: string;
  avatarUrl: string;
  bannerUrl: string;
  role: 'user' | 'moderator' | 'admin';
  plan?: 'gebruiker' | 'artiest' | 'label';
  credits?: number;
  monthlyUploadsCount?: number;
  monthlyUploadsLimit?: number;
  createdAt: string;
  updatedAt: string;
  followersCount: number;
  followingCount: number;
  tracksCount: number;
  isFollowing?: boolean;
  socials?: UserSocials;
  reposts?: string[];
  likes?: string[];
  labelId?: string;
  labelName?: string;
  signedArtistIds?: string[];
  genre?: string;
  location?: string;
  website?: string;
  logoUrl?: string;
  verified?: boolean;
  verificationStatus?: 'unverified' | 'pending' | 'verified' | 'rejected';
}

export interface Track {
  id: string;
  userId: string;
  userEmail?: string;
  userName?: string;
  title: string;
  description: string;
  genre: string;
  tags: string[];
  duration: number;
  durationFormatted: string;
  waveformData?: number[];
  audioUrl: string;
  coverUrl: string;
  coverVideoUrl?: string;
  coverType?: 'image' | 'video';
  isMastered?: boolean;
  albumId?: string;
  albumTitle?: string;
  isPrivate: boolean;
  isExplicit: boolean;
  license: 'all-rights-reserved' | 'cc-by' | 'cc-by-sa' | 'cc-by-nc' | 'cc-by-nd' | 'public-domain';
  playsCount: number;
  likesCount: number;
  repostsCount: number;
  commentsCount: number;
  createdAt: string;
  updatedAt: string;
  user?: User;
  isLiked?: boolean;
  isReposted?: boolean;
  bpm?: number;
  musicalKey?: string;
}

export interface Playlist {
  id: string;
  userId: string;
  title: string;
  description: string;
  isPublic: boolean;
  coverUrl: string;
  coverVideoUrl?: string;
  coverType?: 'image' | 'video';
  type?: 'playlist' | 'album';
  tracksCount: number;
  trackIds?: string[];
  createdAt: string;
  updatedAt: string;
  user?: User;
  tracks?: Track[];
}

export interface Comment {
  id: string;
  userId: string;
  trackId: string;
  parentId: string | null;
  content: string;
  likesCount: number;
  createdAt: string;
  updatedAt?: string;
  user?: User;
}

export interface PlayerState {
  currentTrack: Track | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  queue: Track[];
  queueIndex: number;
  isShuffled: boolean;
  repeatMode: 'none' | 'one' | 'all';
}
