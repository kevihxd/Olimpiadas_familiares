import React, { useState } from 'react';
import { format } from 'date-fns';
import { Heart, MessageCircle, Share2, ImagePlus, User, Send, X, Play, Camera } from 'lucide-react';
import type { Moment, Comment } from '../types';
import { cn } from '../components/Layout';
import { useAppContext } from '../context/AppContext';

export default function Momentos() {
  const { moments, addMoment, toggleLikeMoment, addCommentToMoment, isAdmin } = useAppContext();
  const [isUploading, setIsUploading] = useState(false);
  const [newCaption, setNewCaption] = useState('');
  const [activeCommentMoment, setActiveCommentMoment] = useState<string | null>(null);
  const [newCommentText, setNewCommentText] = useState('');

  const handleLike = (momentId: string) => {
    toggleLikeMoment(momentId);
  };

  const handleAddComment = (momentId: string, e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    addCommentToMoment(momentId, newCommentText);
    setNewCommentText('');
  };

  const handleShare = async (moment: Moment) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Olimpiadas Familiares 2026',
          text: moment.caption,
          url: moment.url,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      alert('Compartido en portapapeles (Simulación)');
    }
  };

  const handleMockUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCaption.trim()) return;

    // Simulate uploading a generic image for demonstration
    addMoment({
      type: 'image',
      url: 'https://images.unsplash.com/photo-1526676037777-05a232554f77?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // generic sports trophy or ball
      caption: newCaption,
      date: Date.now(),
      likes: 0,
      comments: [],
      isLikedByMe: false,
    });

    setIsUploading(false);
    setNewCaption('');
  };

  return (
    <div className="flex flex-col space-y-6 max-w-4xl mx-auto pb-20">
      
      {/* Header and Upload Action */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800 uppercase italic">Momentos</h2>
          <p className="text-xs sm:text-sm text-slate-500 font-bold">Revive los mejores momentos de la competencia</p>
        </div>
        {isAdmin && (
          <button 
            onClick={() => setIsUploading(true)}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-full font-black text-xs sm:text-sm uppercase shadow-lg transform transition-transform hover:scale-105"
          >
            <ImagePlus className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">Subir Momento</span>
            <span className="sm:hidden">Subir</span>
          </button>
        )}
      </div>

      {/* Upload Modal */}
      {isUploading && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-black text-slate-800 uppercase italic">Nuevo Momento</h3>
              <button onClick={() => setIsUploading(false)} className="text-slate-400 hover:text-slate-600 bg-white rounded-full p-1 shadow-sm">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleMockUpload} className="p-6 space-y-4">
              <div className="w-full aspect-video bg-slate-100 rounded-2xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 p-4 text-center hover:border-blue-400 hover:text-blue-500 transition-colors cursor-pointer relative">
                <ImagePlus className="w-10 h-10 mb-2" />
                <p className="font-bold text-sm">Haz clic o arrastra una foto/video</p>
                <div className="absolute top-2 right-2 flex space-x-1">
                   <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                   <div className="text-[8px] font-bold text-blue-500 uppercase tracking-widest">Simulación</div>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Descripción</label>
                <textarea 
                  value={newCaption}
                  onChange={(e) => setNewCaption(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                  rows={3}
                  placeholder="¡Escribe algo sobre este momento!..."
                  autoFocus
                />
              </div>
              <button 
                type="submit"
                disabled={!newCaption.trim()}
                className="w-full py-3 bg-green-500 text-white rounded-xl font-black uppercase text-sm shadow-md hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Publicar
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Gallery Feed */}
      <div className="space-y-8">
        {moments.map((moment) => (
          <div key={moment.id} className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden flex flex-col">
            
            {/* Header */}
            <div className="p-4 flex flex-row items-center justify-between border-b border-slate-50">
               <div className="flex items-center space-x-3">
                 <div className="w-10 h-10 bg-slate-100 border-2 border-yellow-400 rounded-full flex items-center justify-center overflow-hidden">
                    <User className="text-slate-400 w-5 h-5" />
                 </div>
                 <div>
                   <p className="text-sm font-bold text-slate-800">Admin</p>
                   <p className="text-[10px] uppercase font-semibold text-slate-400">
                     {format(moment.date, 'dd MMM, HH:mm')}
                   </p>
                 </div>
               </div>
               <div className="bg-slate-100 text-slate-500 text-[10px] px-2 py-1 rounded font-bold uppercase">
                 Actualización
               </div>
            </div>

            {/* Media */}
            <div className="w-full bg-slate-900 flex items-center justify-center relative max-h-[600px] overflow-hidden group">
              <img src={moment.url} alt={moment.caption} className="w-full h-auto object-cover" />
              {moment.type === 'video' && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <div className="w-16 h-16 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center">
                    <Play className="w-8 h-8 text-white fill-white ml-1" />
                  </div>
                </div>
              )}
            </div>

            {/* Interaction Bar */}
            <div className="p-4 bg-slate-50 border-y border-slate-100 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => handleLike(moment.id)}
                  className="flex items-center space-x-1 group"
                >
                  <Heart className={cn("w-6 h-6 transition-transform group-hover:scale-110", moment.isLikedByMe ? "text-red-500 fill-red-500" : "text-slate-500")} />
                  <span className={cn("font-bold text-sm", moment.isLikedByMe ? "text-red-500" : "text-slate-500")}>
                    {moment.likes > 0 && moment.likes}
                  </span>
                </button>
                <button 
                  onClick={() => setActiveCommentMoment(activeCommentMoment === moment.id ? null : moment.id)}
                  className="flex items-center space-x-1 text-slate-500 group-hover:text-slate-700 transition"
                >
                  <MessageCircle className="w-6 h-6 hover:scale-110 transition-transform" />
                  <span className="font-bold text-sm">{moment.comments.length > 0 && moment.comments.length}</span>
                </button>
              </div>
              <button 
                onClick={() => handleShare(moment)}
                className="text-slate-500 hover:text-blue-500 flex flex-row items-center space-x-1 text-xs font-bold uppercase transition"
              >
                <Share2 className="w-5 h-5 mb-0.5" />
              </button>
            </div>

            {/* Content & Comments Section */}
            <div className="p-4 space-y-3">
               <p className="text-sm text-slate-800 leading-relaxed">
                 <span className="font-bold mr-2">Admin</span>
                 {moment.caption}
               </p>

               {/* Existing Comments */}
               {moment.comments.length > 0 && (
                 <div className="space-y-1.5 mt-2">
                   {moment.comments.map(comment => (
                     <p key={comment.id} className="text-sm">
                       <span className="font-bold text-slate-800 mr-2">{comment.author}</span>
                       <span className="text-slate-600">{comment.text}</span>
                     </p>
                   ))}
                 </div>
               )}

               {/* New Comment Input */}
               {activeCommentMoment === moment.id && (
                 <form onSubmit={(e) => handleAddComment(moment.id, e)} className="mt-4 flex items-center space-x-2 animate-in slide-in-from-top-2 duration-200">
                   <div className="flex-1 relative">
                     <input 
                       type="text"
                       value={newCommentText}
                       onChange={(e) => setNewCommentText(e.target.value)}
                       placeholder="Añade un comentario..."
                       autoFocus
                       className="w-full bg-slate-100 border-none rounded-full py-2 px-4 text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none"
                     />
                   </div>
                   <button 
                     type="submit"
                     disabled={!newCommentText.trim()}
                     className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed hidden sm:flex shrink-0 items-center justify-center shadow-sm"
                   >
                     <Send className="w-4 h-4 ml-0.5" />
                   </button>
                 </form>
               )}
            </div>
          </div>
        ))}

        {moments.length === 0 && (
          <div className="text-center py-20 bg-white/50 rounded-3xl border-2 border-dashed border-slate-300">
             <Camera className="w-12 h-12 text-slate-300 mx-auto mb-3" />
             <p className="text-slate-500 font-bold">No hay momentos publicados aún.</p>
             <p className="text-xs text-slate-400 mt-1">¡Sé el primero en subir uno!</p>
          </div>
        )}
      </div>

    </div>
  );
}
