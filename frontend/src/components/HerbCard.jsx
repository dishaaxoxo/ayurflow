import { ShoppingCart } from 'lucide-react'

export default function HerbCard({ herb, index = 0, translate, onClick, onAdd }) {
  const getEng = (term) => translate[term] || term

  return (
    <div 
      className="animate-stagger-enter group relative flex flex-col bg-white border border-gray-100 rounded-3xl p-6 cursor-none card-hover overflow-hidden shadow-sm hover:shadow-2xl hover:scale-[1.02] transition-all duration-500 ease-out"
      style={{ animationDelay: `${index * 0.06}s` }}
      onClick={onClick}
      data-cursor-hover="true"
    >
      <div className="absolute -right-10 -top-10 w-32 h-32 bg-brand-accent/5 rounded-full blur-2xl group-hover:bg-brand-accent/15 transition-all duration-500"></div>

      <div className="flex justify-between items-start mb-4">
        <h3 className="font-['Outfit'] text-2xl font-black tracking-tight text-gray-800 mb-1 group-hover:text-brand-accent transition-colors relative z-10">{herb.name}</h3>
        {herb.tridosha && (
          <span className="shrink-0 px-3 py-1 bg-[#D4B5B0]/20 text-gray-700 border border-[#D4B5B0]/40 rounded-full text-[0.65rem] font-bold tracking-wider uppercase">
            Tridosha
          </span>
        )}
      </div>
      
      <div 
        className="text-sm text-gray-500 mb-6 h-[4.5rem] overflow-y-auto leading-relaxed relative z-10 font-normal pr-2 overscroll-contain"
        data-lenis-prevent="true"
      >
        {herb.preview}
      </div>
      
      <div className="flex flex-wrap gap-2 mb-6 relative z-10">
        <span className="px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-lg text-xs font-semibold text-gray-600 flex items-center gap-1.5">
          <span className="text-[10px] opacity-70">👅</span>
          {herb.rasa.slice(0, 2).map(r => getEng(r)).join(', ')}{herb.rasa.length > 2 && '...'}
        </span>
        <span className="px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-lg text-xs font-semibold text-gray-600 flex items-center gap-1.5">
          <span className="text-[10px] opacity-70">🌡</span> 
          {getEng(herb.virya)}
        </span>
      </div>

      <div className="mt-auto pt-5 border-t border-gray-100 flex items-center justify-between relative z-10">
        <span className="text-xl font-extrabold text-brand-accent">${herb.price}</span>
        <button 
          onClick={onAdd}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-50 hover:bg-brand-accent hover:text-white border border-gray-200 hover:border-brand-accent font-bold text-sm text-gray-700 transition-all duration-300 shadow-sm hover:shadow-lg hover:scale-110"
        >
          <ShoppingCart className="w-4 h-4" />
          <span>Add</span>
        </button>
      </div>
    </div>
  )
}
