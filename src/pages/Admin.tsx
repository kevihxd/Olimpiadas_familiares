import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Trash2, Edit2, ShieldAlert, Check, X } from 'lucide-react';
import { cn } from '../components/Layout';
import { format } from 'date-fns';

export default function Admin() {
  const { isAdmin, points, moments, teams, removeMoment, removePointEntry, updatePointEntry, removeTeam } = useAppContext();

  const [editingPointId, setEditingPointId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center space-y-4 pt-20">
        <ShieldAlert className="w-16 h-16 text-red-500" />
        <h2 className="text-3xl font-black text-slate-800 uppercase italic">Acceso Denegado</h2>
        <p className="text-slate-500">Solo administradores pueden ver este panel de control.</p>
        <p className="text-sm font-bold bg-slate-200 py-1 px-3 rounded-full">Activa el modo admin arriba a la derecha.</p>
      </div>
    );
  }

  const startEditing = (p: any) => {
    setEditingPointId(p.id);
    setEditValue(p.points.toString());
  };

  const saveEdit = (id: string) => {
    updatePointEntry(id, Number(editValue));
    setEditingPointId(null);
  };

  return (
     <div className="flex flex-col space-y-8 max-w-4xl mx-auto pb-20 pt-4">
       <div className="text-center space-y-4">
         <h2 className="text-3xl font-black text-slate-800 uppercase italic">Panel de Control</h2>
         <p className="text-slate-500 font-bold">Gestión de datos de las Olimpiadas</p>
       </div>

       {/* EQUIPOS SECTION */}
       <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-200">
         <h3 className="font-black text-xl mb-4 text-slate-800 uppercase border-b pb-2">Gestionar Equipos</h3>
         <div className="space-y-3">
           {teams.length === 0 && <p className="text-slate-400 text-sm">No hay equipos registrados.</p>}
           {teams.map(t => (
             <div key={t.id} className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-100">
               <div className="flex items-center space-x-3">
                 <div className={cn("w-4 h-4 rounded-full shadow-sm", t.color)}></div>
                 <p className="font-bold text-sm text-slate-800">{t.name}</p>
               </div>
               <button onClick={() => removeTeam(t.id)} className="p-2 text-slate-500 hover:text-red-600 bg-slate-200 hover:bg-red-100 rounded-lg transition shadow-sm">
                 <Trash2 className="w-4 h-4" />
               </button>
             </div>
           ))}
         </div>
       </div>

       {/* PUNTOS SECTION */}
       <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-200 max-w-full overflow-hidden">
         <h3 className="font-black text-xl mb-4 text-slate-800 uppercase border-b pb-2">Gestionar Puntuaciones</h3>
         <div className="space-y-3">
           {points.length === 0 && <p className="text-slate-400 text-sm">No hay puntos registrados.</p>}
           {points.sort((a,b) => b.date - a.date).map(p => {
             const team = teams.find(t => t.id === p.teamId);
             const isEditing = editingPointId === p.id;
             return (
               <div key={p.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-50 p-4 rounded-xl border border-slate-100 gap-4">
                 <div className="flex-1 w-full text-left">
                   <p className="font-bold text-sm text-slate-800 max-w-full break-words">{p.eventName}</p>
                   <p className="text-xs text-slate-500 mt-1">{team?.name} • {format(p.date, 'dd MMM, HH:mm')}</p>
                 </div>
                 
                 <div className="flex items-center space-x-2 w-full sm:w-auto shrink-0 mt-2 sm:mt-0">
                   {isEditing ? (
                     <div className="flex items-center space-x-1 sm:space-x-2 border border-blue-200 bg-white p-1 rounded-lg shadow-sm">
                       <input 
                         type="number" 
                         value={editValue} 
                         onChange={e => setEditValue(e.target.value)}
                         className="w-16 sm:w-20 rounded px-2 py-1 text-sm font-bold text-blue-600 focus:outline-none"
                       />
                       <button onClick={() => saveEdit(p.id)} className="p-1.5 bg-green-500 text-white rounded hover:bg-green-600 shadow-sm"><Check className="w-4 h-4"/></button>
                       <button onClick={() => setEditingPointId(null)} className="p-1.5 bg-slate-200 text-slate-700 rounded hover:bg-slate-300 shadow-sm"><X className="w-4 h-4"/></button>
                     </div>
                   ) : (
                     <span className="font-black text-lg text-blue-600 bg-blue-100 px-3 py-1 rounded-lg min-w-[3rem] text-center shrink-0">{p.points}</span>
                   )}

                   {!isEditing && (
                     <>
                       <button onClick={() => startEditing(p)} className="p-2 text-slate-500 hover:text-blue-600 bg-slate-200 hover:bg-blue-100 rounded-lg transition shadow-sm">
                         <Edit2 className="w-4 h-4" />
                       </button>
                       <button onClick={() => removePointEntry(p.id)} className="p-2 text-slate-500 hover:text-red-600 bg-slate-200 hover:bg-red-100 rounded-lg transition shadow-sm">
                         <Trash2 className="w-4 h-4" />
                       </button>
                     </>
                   )}
                 </div>
               </div>
             )
           })}
         </div>
       </div>

       {/* MOMENTOS SECTION */}
       <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-200">
         <h3 className="font-black text-xl mb-4 text-slate-800 uppercase border-b pb-2">Gestionar Momentos (Galería)</h3>
         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {moments.length === 0 && <p className="text-slate-400 text-sm col-span-full">No hay momentos registrados.</p>}
            {moments.map(m => (
              <div key={m.id} className="relative group rounded-xl overflow-hidden shadow-sm border border-slate-200">
                <img src={m.url} alt="momento" className="w-full aspect-square object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/80 opacity-0 group-hover:opacity-100 transition duration-200 flex flex-col justify-between p-2">
                  <div className="flex justify-end">
                    <button onClick={() => removeMoment(m.id)} className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg shadow-lg transition transform hover:scale-110">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-white text-[10px] font-bold line-clamp-2 leading-tight">{m.caption}</p>
                </div>
              </div>
            ))}
         </div>
       </div>

     </div>
  );
}
