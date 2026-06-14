import React, { useState } from 'react';
import { Trophy, Plus, X } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { cn } from '../components/Layout';

export default function Puntos() {
  const { teams, points, isAdmin, addPointEntry } = useAppContext();
  const [isAddingPoints, setIsAddingPoints] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState('');
  const [eventName, setEventName] = useState('');
  const [eventPoints, setEventPoints] = useState('');

  // Calculate totals
  const leaderboard = teams.map(team => {
    const totalPoints = points
      .filter(p => p.teamId === team.id)
      .reduce((sum, p) => sum + p.points, 0);
    return { ...team, totalPoints };
  }).sort((a, b) => b.totalPoints - a.totalPoints);

  const handleAddPoints = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeam || !eventName || !eventPoints) return;
    
    addPointEntry({
      teamId: selectedTeam,
      eventName,
      points: Number(eventPoints),
      date: Date.now()
    });

    setIsAddingPoints(false);
    setSelectedTeam('');
    setEventName('');
    setEventPoints('');
  };

  return (
    <div className="flex flex-col space-y-6 max-w-4xl mx-auto pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800 uppercase italic">Tabla de Posiciones</h2>
          <p className="text-xs sm:text-sm text-slate-500 font-bold">Resultados y puntos por pruebas</p>
        </div>
        {isAdmin && (
          <button 
            onClick={() => setIsAddingPoints(true)}
            className="flex items-center space-x-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-full font-black text-xs sm:text-sm uppercase shadow-lg transition-transform hover:scale-105"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">Añadir Puntos</span>
            <span className="sm:hidden">Añadir</span>
          </button>
        )}
      </div>

      <div className="flex-1 bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[300px]">
            <thead className="bg-blue-700 text-white text-[10px] sm:text-xs uppercase tracking-wider">
              <tr>
                <th className="p-3 sm:p-4 text-center w-16">POS</th>
                <th className="p-3 sm:p-4">EQUIPO</th>
                <th className="p-3 sm:p-4 text-center w-24">PTS</th>
              </tr>
            </thead>
            <tbody className="text-sm sm:text-base">
              {leaderboard.map((team, index) => (
                <tr key={team.id} className={cn("border-b border-slate-100 transition-colors hover:bg-slate-50", index === 0 ? "bg-yellow-50" : "")}>
                  <td className={cn("p-3 sm:p-4 text-center font-black", index === 0 ? "text-blue-700 text-lg" : "text-slate-400")}>
                    {index + 1}º
                  </td>
                  <td className="p-3 sm:p-4 font-bold flex items-center space-x-3">
                    <span className={cn("w-3 h-3 sm:w-4 sm:h-4 rounded-full shadow-sm", team.color)}></span>
                    <span>{team.name}</span>
                    {index === 0 && <Trophy className="w-4 h-4 text-yellow-500 fill-yellow-500 ml-2" />}
                  </td>
                  <td className="p-3 sm:p-4 text-center font-black text-blue-900 border-l border-slate-100">
                    {team.totalPoints}
                  </td>
                </tr>
              ))}
              {leaderboard.length === 0 && (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-slate-400 font-bold">No hay equipos registrados aún.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <p className="text-[10px] text-slate-400 uppercase font-bold italic">Última actualización: Ahora</p>
        </div>
      </div>

      {isAdmin && (
        <div className="mt-8 bg-slate-100 rounded-3xl p-6 border-2 border-dashed border-slate-300">
          <h3 className="text-slate-500 font-black uppercase text-sm mb-4">Registro de Pruebas Recientes</h3>
          <div className="space-y-2">
            {points.sort((a,b) => b.date - a.date).map(p => {
              const team = teams.find(t => t.id === p.teamId);
              return (
                <div key={p.id} className="flex justify-between items-center bg-white p-3 rounded-xl shadow-sm text-sm">
                  <div>
                    <span className="font-bold text-slate-800">{p.eventName}</span>
                    <span className="text-slate-500 text-xs ml-2">({team?.name})</span>
                  </div>
                  <div className="font-black text-blue-600">+{p.points}</div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {isAddingPoints && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-black text-slate-800 uppercase italic">Asignar Puntos</h3>
              <button onClick={() => setIsAddingPoints(false)} className="text-slate-400 hover:text-slate-600 bg-white rounded-full p-1 shadow-sm">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddPoints} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Equipo</label>
                <select 
                  value={selectedTeam}
                  onChange={(e) => setSelectedTeam(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="" disabled>Selecciona un equipo...</option>
                  {teams.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Prueba / Evento</label>
                <input 
                  type="text"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  placeholder="Ej. Tiro al blanco"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Puntos a otorgar</label>
                <input 
                  type="number"
                  value={eventPoints}
                  onChange={(e) => setEventPoints(e.target.value)}
                  placeholder="Ej. 50"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <button 
                type="submit"
                disabled={!selectedTeam || !eventName || !eventPoints}
                className="w-full py-3 bg-green-500 text-white rounded-xl font-black uppercase text-sm shadow-md hover:bg-green-600 transition-colors disabled:opacity-50"
              >
                Guardar Puntos
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
