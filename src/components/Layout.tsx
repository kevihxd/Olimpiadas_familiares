import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Trophy, Users, Camera, Home, ShieldAlert, Settings, X, Lock } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useAppContext } from '../context/AppContext';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Layout() {
  const { isAdmin, toggleAdmin } = useAppContext();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  
  const navItems = [
    { name: 'Inicio', path: '/', icon: Home },
    { name: 'Equipos', path: '/equipos', icon: Users },
    { name: 'Puntos', path: '/puntos', icon: Trophy },
    { name: 'Momentos', path: '/momentos', icon: Camera },
  ];

  if (isAdmin) {
    navItems.push({ name: 'Admin', path: '/admin', icon: Settings });
  }

  const handleAdminClick = () => {
    if (isAdmin) {
      toggleAdmin();
    } else {
      setShowAuthModal(true);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin2026') {
      toggleAdmin();
      setShowAuthModal(false);
      setPassword('');
      setError(false);
    } else {
      setError(true);
    }
  };

  return (
    <div className="w-full h-screen bg-slate-50 flex flex-col overflow-hidden font-sans">
      {/* Header Section */}
      <header className="h-24 bg-gradient-to-r from-blue-700 via-blue-600 to-green-500 flex items-center justify-between px-4 sm:px-8 shadow-lg z-10 shrink-0">
        <div className="flex items-center space-x-3 sm:space-x-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full flex items-center justify-center shadow-md shrink-0">
            <span className="text-xl sm:text-2xl">⚽</span>
          </div>
          <div>
            <h1 className="text-lg sm:text-2xl font-black text-white tracking-tighter uppercase leading-none">Olimpiadas Familiares</h1>
            <p className="text-[10px] sm:text-xs font-bold text-yellow-300 uppercase tracking-widest">Edición Mundial 2026</p>
          </div>
        </div>
        
        <nav className="hidden md:flex space-x-1 bg-black/20 p-1 rounded-xl">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "px-4 py-2 rounded-lg text-sm font-bold transition-colors uppercase",
                  isActive
                    ? "bg-white text-blue-700 shadow-sm"
                    : "text-white hover:bg-white/10"
                )
              }
            >
              {item.name}
            </NavLink>
          ))}
        </nav>

        <button 
          onClick={handleAdminClick}
          className={cn(
            "hidden sm:flex items-center space-x-1 px-4 py-2 rounded-full font-black text-xs uppercase shadow-lg transform transition-transform",
            isAdmin ? "bg-red-500 hover:bg-red-600 text-white" : "bg-yellow-400 hover:bg-yellow-300 text-blue-900"
          )}
        >
          <ShieldAlert className="w-3 h-3" />
          <span>{isAdmin ? 'Admin Mode (ON)' : 'Admin'}</span>
        </button>
      </header>

      {/* Main Layout Grid */}
      <main className="flex-1 overflow-y-auto bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px]">
        <div className="max-w-7xl mx-auto p-4 sm:p-6 w-full h-full">
          <Outlet />
        </div>
      </main>

      {/* Mobile Navigation */}
      <nav className="md:hidden flex bg-white border-t border-slate-200 shrink-0 pb-safe relative">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex-1 py-3 flex flex-col items-center space-y-1 transition-colors",
                isActive ? "text-blue-600" : "text-slate-500 hover:text-slate-900 justify-center"
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon className={cn("w-5 h-5", isActive ? "stroke-2" : "stroke-[1.5]")} />
                <span className={cn("text-[10px] uppercase font-bold", isActive ? "" : "font-semibold")}>
                  {item.name}
                </span>
              </>
            )}
          </NavLink>
        ))}
        {/* Mobile Admin Icon */}
        <button 
          onClick={handleAdminClick}
          className={cn(
            "absolute bottom-full right-4 mb-4 p-3 rounded-full shadow-xl sm:hidden flex items-center justify-center",
            isAdmin ? "bg-red-500 text-white" : "bg-yellow-400 text-blue-900"
          )}
        >
          <ShieldAlert className="w-5 h-5" />
        </button>
      </nav>

      {/* Global Stats Footer (Hidden on very small screens) */}
      <footer className="hidden sm:flex shrink-0 h-10 bg-slate-900 items-center justify-between px-8 text-white">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] uppercase text-slate-400 font-bold">Sede:</span>
            <span className="text-xs font-bold">Jardín de la Abuela (CDMX)</span>
          </div>
          <div className="flex items-center space-x-2 border-l border-slate-700 pl-6">
            <span className="text-[10px] uppercase text-slate-400 font-bold">Próxima Prueba:</span>
            <span className="text-xs font-bold text-yellow-400 italic">Fútbol Ciego (14:00h)</span>
          </div>
        </div>
        <div className="text-[10px] font-mono text-green-400">
          CONNECTED TO OLYMPIC_DB_2026 // SYSTEM STABLE
        </div>
      </footer>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center space-x-2">
                <Lock className="w-5 h-5 text-slate-700" />
                <h3 className="font-black text-slate-800 uppercase italic">Acceso Administrador</h3>
              </div>
              <button onClick={() => { setShowAuthModal(false); setError(false); setPassword(''); }} className="text-slate-400 hover:text-slate-600 bg-white rounded-full p-1 shadow-sm">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleLogin} className="p-6 space-y-4">
              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm font-bold text-center border border-red-100">
                  Contraseña incorrecta
                </div>
              )}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Contraseña</label>
                <input 
                  type="password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(false); }}
                  className={cn(
                    "w-full bg-slate-50 border rounded-xl p-3 text-sm focus:ring-2 focus:outline-none transition-colors",
                    error ? "border-red-300 focus:ring-red-500" : "border-slate-200 focus:ring-blue-500"
                  )}
                  placeholder="Introduce la clave de acceso"
                  autoFocus
                />
              </div>
              <button 
                type="submit"
                disabled={!password}
                className="w-full py-3 bg-blue-600 text-white rounded-xl font-black uppercase text-sm shadow-md hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                Entrar
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
