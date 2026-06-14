import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Users, Camera } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function Home() {
  const navigate = useNavigate();
  const { teams, points, moments } = useAppContext();

  // Basic stats
  const leadingTeamId = points.length > 0 
    ? points.reduce((acc, curr) => {
        const tPoints = points.filter(p => p.teamId === curr.teamId).reduce((s, p) => s + p.points, 0);
        return tPoints > acc.points ? { id: curr.teamId, points: tPoints } : acc;
      }, { id: '', points: 0 }).id
    : '';
  
  const leadingTeam = teams.find(t => t.id === leadingTeamId);

  return (
    <div className="flex flex-col space-y-8 max-w-4xl mx-auto pb-20 pt-4">
      
      {/* Hero Welcome */}
      <div className="text-center space-y-4">
        <h2 className="text-4xl sm:text-5xl font-black text-slate-800 uppercase italic tracking-tighter">
          OLIMPIADAS FAMILIARES 2026
        </h2>
        <p className="text-slate-500 max-w-lg mx-auto font-medium">
          Sigue cada detalle de las Olimpiadas Familiares 2026. Sube tus momentos, colecciona el álbum y mantente al tanto de los resultados.
        </p>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        
        {/* Card: Equipos */}
        <div 
          onClick={() => navigate('/equipos')}
          className="bg-white rounded-3xl p-6 shadow-xl border border-slate-200 cursor-pointer hover:border-blue-400 hover:shadow-2xl transition-all group flex flex-col items-center justify-center text-center space-y-4"
        >
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
            <Users className="w-8 h-8" />
          </div>
          <div>
            <h3 className="font-black text-xl uppercase italic">Álbum</h3>
            <p className="text-sm font-bold text-slate-500 mt-1">{teams.length} Equipos registrados</p>
          </div>
        </div>

        {/* Card: Puntos */}
        <div 
          onClick={() => navigate('/puntos')}
          className="bg-white rounded-3xl p-6 shadow-xl border border-slate-200 cursor-pointer hover:border-green-400 hover:shadow-2xl transition-all group flex flex-col items-center justify-center text-center space-y-4"
        >
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
            <Trophy className="w-8 h-8" />
          </div>
          <div>
            <h3 className="font-black text-xl uppercase italic">Líder Actual</h3>
             <p className="text-sm font-bold text-slate-500 mt-1">
               {leadingTeam ? (
                 <span className="flex flex-col items-center">
                   <span className="text-green-600 truncate max-w-[150px]">{leadingTeam.name}</span>
                 </span>
               ) : 'Aún no hay puntos'}
             </p>
          </div>
        </div>

        {/* Card: Momentos */}
        <div 
          onClick={() => navigate('/momentos')}
          className="bg-white rounded-3xl p-6 shadow-xl border border-slate-200 cursor-pointer hover:border-pink-400 hover:shadow-2xl transition-all group flex flex-col items-center justify-center text-center space-y-4"
        >
          <div className="w-16 h-16 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
            <Camera className="w-8 h-8" />
          </div>
          <div>
            <h3 className="font-black text-xl uppercase italic">Momentos</h3>
             <p className="text-sm font-bold text-slate-500 mt-1">{moments.length} Fotos / Videos</p>
          </div>
        </div>

      </div>

    </div>
  );
}
