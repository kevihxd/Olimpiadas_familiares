import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { Team, PointEntry, Moment, Comment } from '../types';

interface AppContextType {
  isAdmin: boolean;
  toggleAdmin: () => void;
  
  teams: Team[];
  addTeam: (team: Omit<Team, 'id'>) => void;
  removeTeam: (id: string) => void;
  
  points: PointEntry[];
  addPointEntry: (entry: Omit<PointEntry, 'id'>) => void;
  
  moments: Moment[];
  addMoment: (moment: Omit<Moment, 'id'>) => void;
  toggleLikeMoment: (momentId: string) => void;
  addCommentToMoment: (momentId: string, text: string) => void;
  removeMoment: (id: string) => void;
  removePointEntry: (id: string) => void;
  updatePointEntry: (id: string, newPoints: number) => void;
}

// Initial mock data
const INITIAL_TEAMS: Team[] = [
  {
    id: 't1',
    name: 'Los García',
    color: 'bg-blue-600',
    members: []
  },
  {
    id: 't2',
    name: 'Primos FC',
    color: 'bg-green-600',
    members: []
  },
  {
    id: 't3',
    name: 'Abuelos United',
    color: 'bg-red-600',
    members: []
  }
];

const INITIAL_POINTS: PointEntry[] = [
  { id: 'p1', teamId: 't1', eventName: 'Fútbol Ciego', points: 50, date: Date.now() },
  { id: 'p2', teamId: 't1', eventName: 'Carrera de Costales', points: 95, date: Date.now() },
  { id: 'p3', teamId: 't2', eventName: 'Fútbol Ciego', points: 120, date: Date.now() },
  { id: 'p4', teamId: 't3', eventName: 'Jalar Cuerda', points: 95, date: Date.now() },
];

const INITIAL_MOMENTS: Moment[] = [
  {
    id: 'm1',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1511886929837-354d827aae26?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    caption: '¡Inauguración de las Olimpiadas! Encendido de la Antorcha. 🔥⚽',
    date: Date.now() - 3600000 * 2, // 2 hours ago
    likes: 12,
    comments: [
      { id: 'c1', text: '¡Qué emoción!', author: 'Marta', date: Date.now() - 3000000 },
    ],
    isLikedByMe: false,
  },
  {
    id: 'm2',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1553778263-73a83bab9b0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    caption: 'Nuestra primera prueba de fútbol superada. ¡Vamos PRIMOS FC! 🥅',
    date: Date.now() - 3600000 * 5, // 5 hours ago
    likes: 24,
    comments: [],
    isLikedByMe: true,
  }
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [teams, setTeams] = useState<Team[]>(INITIAL_TEAMS);
  const [points, setPoints] = useState<PointEntry[]>(INITIAL_POINTS);
  const [moments, setMoments] = useState<Moment[]>(INITIAL_MOMENTS);

  const toggleAdmin = () => setIsAdmin(prev => !prev);

  const addTeam = (teamData: Omit<Team, 'id'>) => {
    const newTeam = { ...teamData, id: Math.random().toString(36).substring(7) };
    setTeams(prev => [...prev, newTeam]);
  };

  const addPointEntry = (entryData: Omit<PointEntry, 'id'>) => {
    const newEntry = { ...entryData, id: Math.random().toString(36).substring(7) };
    setPoints(prev => [...prev, newEntry]);
  };

  const addMoment = (momentData: Omit<Moment, 'id'>) => {
    const newMoment = { ...momentData, id: Math.random().toString(36).substring(7) };
    setMoments(prev => [newMoment, ...prev]);
  };

  const toggleLikeMoment = (momentId: string) => {
    setMoments(prev => prev.map(m => {
      if (m.id === momentId) {
        return {
          ...m,
          likes: m.isLikedByMe ? m.likes - 1 : m.likes + 1,
          isLikedByMe: !m.isLikedByMe
        };
      }
      return m;
    }));
  };

  const addCommentToMoment = (momentId: string, text: string) => {
    const newComment: Comment = {
      id: Math.random().toString(36).substring(7),
      text,
      author: isAdmin ? 'Admin' : 'Usuario',
      date: Date.now(),
    };
    setMoments(prev => prev.map(m => {
      if (m.id === momentId) {
        return { ...m, comments: [...m.comments, newComment] };
      }
      return m;
    }));
  };

  const removeMoment = (id: string) => setMoments(prev => prev.filter(m => m.id !== id));
  const removePointEntry = (id: string) => setPoints(prev => prev.filter(p => p.id !== id));
  const updatePointEntry = (id: string, newPoints: number) => setPoints(prev => prev.map(p => p.id === id ? { ...p, points: newPoints } : p));
  const removeTeam = (id: string) => setTeams(prev => prev.filter(t => t.id !== id));

  return (
    <AppContext.Provider value={{
      isAdmin, toggleAdmin,
      teams, addTeam, removeTeam,
      points, addPointEntry, removePointEntry, updatePointEntry,
      moments, addMoment, toggleLikeMoment, addCommentToMoment, removeMoment
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
