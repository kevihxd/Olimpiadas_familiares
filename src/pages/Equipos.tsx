import React, { useState } from 'react';
import { Camera, ImagePlus, X } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { cn } from '../components/Layout';
import type { Team } from '../types';

export default function Equipos() {
  const { teams, isAdmin, addTeam } = useAppContext();
  const [isAddingTeam, setIsAddingTeam] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamColor, setNewTeamColor] = useState('bg-blue-600');

  const handleAddTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamName.trim()) return;
    addTeam({
      name: newTeamName,
      color: newTeamColor,
      members: [] // Placeholder for actual Panini photo later
    });
    setNewTeamName('');
    setIsAddingTeam(false);
  };

  const colors = ['bg-blue-600', 'bg-green-600', 'bg-red-600', 'bg-yellow-500', 'bg-purple-600', 'bg-pink-500'];

  return (
    <div className="flex flex-col space-y-6 max-w-4xl mx-auto pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800 uppercase italic">Álbum de Equipos</h2>
          <p className="text-xs sm:text-sm text-slate-500 font-bold">Colecciona las estampas de cada familia</p>
        </div>
        <div className="flex items-center space-x-4">
           {isAdmin && (
            <button 
              onClick={() => setIsAddingTeam(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-full font-black text-xs sm:text-sm uppercase shadow-lg"
            >
              Nuevo Equipo
            </button>
           )}
           <span className="hidden sm:inline-block text-[10px] bg-red-500 text-white px-2 py-1 rounded font-bold">
            {teams.length}/12 STICKERS
           </span>
        </div>
      </div>

      <div className="flex-1 bg-slate-200/50 border-2 border-dashed border-slate-300 rounded-3xl p-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {teams.map((team, idx) => {
          // Slight alternating rotation for Panini effect
          const rotation = idx % 2 === 0 ? 'rotate-2 hover:rotate-0' : '-rotate-2 hover:rotate-0';
          
          return (
            <div key={team.id} className={cn("bg-white p-2 rounded-lg shadow-md border-4 border-yellow-400 transform transition-all duration-300", rotation)}>
              <div className="aspect-[3/4] bg-slate-100 rounded overflow-hidden relative group cursor-pointer">
                <div className="absolute top-2 right-2 bg-yellow-400 text-[10px] font-bold px-1.5 rounded z-10">2026</div>
                
                {/* Simulated photo. In a real app, 'team.photoUrl' could be used. */}
                <div className="w-full h-full flex items-center justify-center relative bg-slate-200">
                   <UsersPattern />
                   {/* Admin overlay to "upload photo" */}
                   {isAdmin && (
                     <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <button className="bg-white text-blue-600 p-2 rounded-full shadow-lg">
                          <Camera className="w-5 h-5" />
                        </button>
                     </div>
                   )}
                </div>
                
                <div className={cn("absolute bottom-0 w-full text-white text-xs sm:text-sm text-center py-2 font-bold uppercase", team.color)}>
                  {team.name}
                </div>
              </div>
            </div>
          );
        })}

        {/* Empty Placeholders */}
        {Array.from({ length: Math.max(0, 12 - teams.length) }).map((_, i) => (
          <div key={`empty-${i}`} className="bg-slate-300/50 rounded-lg border-2 border-slate-400 flex items-center justify-center text-slate-400 text-xs sm:text-sm font-bold aspect-[3/4]">
            PRÓXIMO..
          </div>
        ))}
      </div>

      {isAddingTeam && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-black text-slate-800 uppercase italic">Añadir Equipo Público</h3>
              <button onClick={() => setIsAddingTeam(false)} className="text-slate-400 hover:text-slate-600 bg-white rounded-full p-1 shadow-sm">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddTeam} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Nombre del Equipo</label>
                <input 
                  type="text"
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Ej. Familia López"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Color del Uniforme</label>
                <div className="flex space-x-2">
                  {colors.map(c => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setNewTeamColor(c)}
                      className={cn("w-8 h-8 rounded-full border-2", c, newTeamColor === c ? "border-slate-800 scale-110" : "border-transparent opacity-50")}
                    />
                  ))}
                </div>
              </div>
              <button 
                type="submit"
                disabled={!newTeamName.trim()}
                className="w-full py-3 bg-blue-600 text-white rounded-xl font-black uppercase text-sm shadow-md hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                Crear Equipo
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Simple illustrative component
function UsersPattern() {
  return (
    <div className="absolute inset-0 opacity-10 flex flex-wrap content-start p-2 gap-2 overflow-hidden items-center justify-center">
      <span className="text-5xl">👤</span>
      <span className="text-5xl">👥</span>
    </div>
  );
}
