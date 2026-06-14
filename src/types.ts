export interface Team {
  id: string;
  name: string;
  color: string;
  members: TeamMember[];
}

export interface TeamMember {
  id: string;
  name: string;
  photoUrl: string;
}

export interface PointEntry {
  id: string;
  teamId: string;
  eventName: string;
  points: number;
  date: number;
}

export interface Comment {
  id: string;
  text: string;
  author: string;
  date: number;
}

export interface Moment {
  id: string;
  type: 'image' | 'video';
  url: string;
  caption: string;
  date: number;
  likes: number;
  comments: Comment[];
  isLikedByMe?: boolean;
}
