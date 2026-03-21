import { Search, Sparkles, ShoppingCart, Filter } from 'lucide-react'

export default function Toolbar({ search, setSearch, dosha, setDosha, age, setAge, metadata, onOpenAI, onOpenCart, cartCount }) {
  const doshas = [
    { id: 'all', label: 'All Doshas' },
    { id: 'Kapha', label: '💧 Kapha' },
    { id: 'Pitta', label: '🔥 Pitta' },
    { id: 'tridosha', label: '☯ Tridosha' },
    { id: 'Vata', label: '🌬 Vata' },
  ]
  const doshaColors = {
    'Vata': 'bg-[#A0D2EB] text-gray-800 border-[#8BC7E6]',
    'Pitta': 'bg-[#F6C8B1] text-gray-800 border-[#F3B79C]',
    'Kapha': 'bg-[#A7D7C5] text-gray-800 border-[#94CCB8]',
    'tridosha': 'bg-[#D4B5B0] text-gray-800 border-[#C5A39D]',
  }

  const ageGroups = ['all', ...Object.keys(metadata.age_labels || {}).sort((a, b) => (parseInt(a) || 0) - (parseInt(b) || 0))]

  return (
    <div className="w-full max-w-7xl px-6 sticky top-0 z-40 mb-6 py-4">
      <div className="glass-panel w-full rounded-[2rem] p-5 md:p-6 shadow-[0_10px_40px_rgba(132,169,140,0.1)] flex flex-col gap-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center w-full">
          {/* Search */}
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-brand-accent transition-colors" />
            <input 
              type="text" 
              placeholder="Search by name, property, or taste..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-white/70 border border-gray-200 rounded-full py-3.5 pl-14 pr-6 text-brand-text placeholder-gray-400 outline-none focus:border-brand-accent focus:ring-4 focus:ring-brand-accent-glow transition-all font-medium shadow-sm hover:shadow-md"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 w-full md:w-auto shrink-0">
            <button 
              onClick={onOpenAI}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-brand-surface border border-gray-200 text-brand-accent font-bold hover:bg-brand-accent hover:text-white transition-all shadow-sm hover:shadow-lg hover:scale-105"
            >
              <Sparkles className="w-5 h-5" />
              <span>AI Consult</span>
            </button>
            <button 
              onClick={onOpenCart}
              className="flex-1 md:flex-none relative flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all font-bold shadow-sm hover:shadow-lg hover:scale-105"
            >
              <ShoppingCart className="w-5 h-5" />
              <span>Cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#F6C8B1] border border-white text-gray-800 text-xs font-black w-6 h-6 flex items-center justify-center rounded-full shadow-sm">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 pt-4 border-t border-gray-100">
          <div className="flex flex-col gap-3">
            <span className="text-xs font-bold tracking-widest text-gray-400 uppercase flex items-center gap-2"><Filter className="w-3.5 h-3.5"/> Dosha</span>
            <div className="flex flex-wrap gap-2.5">
              {doshas.map(d => (
                <button
                  key={d.id}
                  onClick={() => setDosha(d.id)}
                  className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 border shadow-sm hover:scale-105 hover:shadow-md ${dosha === d.id ? (doshaColors[d.id] || 'bg-brand-accent border-brand-accent text-white') : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700'}`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex flex-col gap-3">
            <span className="text-xs font-bold tracking-widest text-gray-400 uppercase">Age Group</span>
            <div className="flex flex-wrap gap-2.5">
              {ageGroups.map(a => (
                <button
                  key={a}
                  onClick={() => setAge(a)}
                  className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 border shadow-sm hover:scale-105 hover:shadow-md ${age === a ? 'bg-[#D4B5B0] border-[#D4B5B0] text-gray-900' : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700'}`}
                >
                  {a === 'all' ? 'All Ages' : metadata.age_labels[a]?.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
