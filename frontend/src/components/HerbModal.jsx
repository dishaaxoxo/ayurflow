import { useState, useEffect } from 'react'
import { X, ShoppingCart, TrendingUp, CheckCircle, AlertTriangle, ImageIcon } from 'lucide-react'

export default function HerbModal({ herb, onClose, translate, onAdd }) {
  const [imageUrl, setImageUrl] = useState(null)
  
  useEffect(() => {
    if (!herb) return
    const isValidHerbContext = (extract) => {
      if (!extract) return false
      const text = extract.toLowerCase()
      return text.includes('plant') || text.includes('herb') || text.includes('tree') || text.includes('ayurved') || text.includes('species') || text.includes('flower') || text.includes('leaf') || text.includes('medicine')
    }

    const fetchImage = async () => {
      try {
        let res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(herb.name)}`)
        let data = await res.json()
        if (data.type !== 'disambiguation' && data.thumbnail?.source && isValidHerbContext(data.extract)) {
          return setImageUrl(data.thumbnail.source)
        }

        res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(herb.name + ' (plant)')}`)
        data = await res.json()
        if (data.type !== 'disambiguation' && data.thumbnail?.source && isValidHerbContext(data.extract)) {
          return setImageUrl(data.thumbnail.source)
        }
        
        setImageUrl(null)
      } catch (err) {
        setImageUrl(null)
      }
    }
    setImageUrl(null)
    fetchImage()
  }, [herb])

  if (!herb) return null
  const getEng = (term) => translate[term] || term

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 opacity-0 animate-[fade-in-fast_0.2s_forwards]" style={{ animation: "fadeIn 0.2s forwards" }}>
      <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white border border-gray-200 rounded-3xl shadow-2xl p-6 md:p-10 overscroll-contain" data-lenis-prevent="true" style={{ animation: "scaleUp 0.3s forwards" }}>
        
        {/* Cover Image */}
        <div className="relative -mx-6 md:-mx-10 -mt-6 md:-mt-10 mb-8 h-[250px] bg-[#F4F1EA] overflow-hidden flex items-center justify-center shrink-0">
          {imageUrl ? (
            <>
              <img src={imageUrl} alt={herb.name} onError={() => setImageUrl(null)} className="w-full h-full object-cover object-center animate-[fadeIn_0.5s_forwards]" />
              <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-black/20" />
            </>
          ) : (
             <div className="absolute inset-0 bg-gradient-to-tr from-[#EFA683]/10 to-[#89C7AD]/10 flex flex-col items-center justify-center text-brand-accent/50">
               <ImageIcon className="w-12 h-12 mb-3 opacity-30" />
               <span className="text-xs font-bold tracking-widest uppercase opacity-50">Botanical Image</span>
             </div>
          )}
          <button onClick={onClose} className="absolute top-6 right-6 p-2.5 bg-white/70 backdrop-blur-md hover:bg-white rounded-full text-gray-700 hover:text-gray-900 transition-all duration-300 z-10 shadow-sm border border-gray-200 hover:scale-110">
            <X className="w-5 h-5"/>
          </button>
        </div>

        <div className="mb-8 pr-2 relative z-10">
          <div className="inline-block px-4 py-1.5 rounded-full bg-brand-accent/10 border border-brand-accent/30 text-brand-accent text-xs font-bold uppercase tracking-widest mb-4">
            Botanical Profile
          </div>
          <h2 className="font-['Outfit'] text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">{herb.name}</h2>
          <p className="text-gray-600 text-lg leading-relaxed font-light">{herb.preview}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
          {/* Dosha Effects */}
          <div className="col-span-1 sm:col-span-2 bg-[#Faf9f6] border border-gray-100 rounded-3xl p-6 shadow-sm">
            <h4 className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-brand-accent"/> Dosha Effects
            </h4>
            <div className="flex flex-wrap gap-3">
              {herb.tridosha ? (
                <span className="px-5 py-2.5 bg-[#D4B5B0]/20 border border-[#D4B5B0]/40 text-gray-800 rounded-2xl text-sm font-semibold flex items-center gap-2 shadow-sm">
                  <CheckCircle className="w-4 h-4 text-[#C5A39D]" /> Balances All Three Doshas
                </span>
              ) : (
                <>
                  {herb.pacify?.map(d => {
                    const bgMap = { 'Vata': 'bg-[#A0D2EB]/20 border-[#A0D2EB]/40', 'Pitta': 'bg-[#F6C8B1]/20 border-[#F6C8B1]/40', 'Kapha': 'bg-[#A7D7C5]/20 border-[#A7D7C5]/40' }
                    const iconMap = { 'Vata': 'text-[#8BC7E6]', 'Pitta': 'text-[#F3B79C]', 'Kapha': 'text-[#94CCB8]' }
                    return (
                      <span key={d} className={`px-5 py-2.5 ${bgMap[d] || 'bg-gray-100'} text-gray-800 rounded-2xl text-sm font-semibold flex items-center gap-2 shadow-sm`}>
                        <CheckCircle className={`w-4 h-4 ${iconMap[d]}`} /> Pacifies {d}
                      </span>
                    )
                  })}
                  {herb.aggravate?.map(d => (
                    <span key={d} className="px-5 py-2.5 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm font-semibold flex items-center gap-2 shadow-sm">
                      <AlertTriangle className="w-4 h-4 text-red-400" /> Increases {d}
                    </span>
                  ))}
                </>
              )}
            </div>
          </div>

          <PropCard icon="🍃" label="Rasa (Taste)" items={herb.rasa} getEng={getEng} />
          <PropCard icon="✨" label="Guna (Quality)" items={herb.guna} getEng={getEng} />
          
          <div className="bg-[#Faf9f6] border border-gray-100 rounded-3xl p-6 shadow-sm flex flex-col justify-center">
            <h4 className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-2 flex items-center gap-2">🌡 Virya (Potency)</h4>
            <span className="text-xl font-bold text-gray-800">{getEng(herb.virya)} <span className="text-gray-400 text-sm italic ml-1 font-normal">({herb.virya})</span></span>
          </div>
          
          <div className="bg-[#Faf9f6] border border-gray-100 rounded-3xl p-6 shadow-sm flex flex-col justify-center">
            <h4 className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-2 flex items-center gap-2">🔄 Vipaka (Post-Digestive)</h4>
            <span className="text-xl font-bold text-gray-800">{getEng(herb.vipaka)} <span className="text-gray-400 text-sm italic ml-1 font-normal">({herb.vipaka})</span></span>
          </div>

          {herb.prabhav && herb.prabhav.length > 0 && (
            <div className="col-span-1 sm:col-span-2 bg-[#Faf9f6] border border-gray-100 rounded-3xl p-6 shadow-sm">
              <h4 className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-4 flex items-center gap-2">💎 Prabhav (Special Action)</h4>
              <div className="flex flex-wrap gap-2.5">
                {herb.prabhav.map(p => (
                  <span key={p} className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-brand-accent shadow-sm flex flex-col items-start leading-tight">
                    <span className="font-bold text-sm text-gray-700">{getEng(p)}</span>
                    <span className="text-[10px] font-normal text-gray-400 italic mt-0.5">{p}</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-10 pt-8 border-t border-gray-100 flex items-center justify-between sticky bottom-0 bg-gradient-to-t from-white via-white to-transparent -mx-6 px-6 -mb-6 pb-6 pt-12">
          <span className="text-4xl font-black text-brand-accent">${herb.price}</span>
          <button 
            onClick={(e) => { onAdd(e); onClose() }}
            className="flex items-center gap-3 px-8 py-4 rounded-full font-bold bg-brand-accent text-white shadow-lg hover:bg-[#729b7a] hover:shadow-xl hover:scale-105 transition-all"
          >
            <ShoppingCart className="w-5 h-5" /> Add to Cart
          </button>
        </div>
      </div>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleUp { from { transform: scale(0.95); } to { transform: scale(1); } }
      `}</style>
    </div>
  )
}

function PropCard({ icon, label, items, getEng }) {
  if (!items || items.length === 0) return null
  return (
    <div className="bg-[#Faf9f6] border border-gray-100 rounded-3xl p-6 shadow-sm">
      <h4 className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-4 flex items-center gap-2">{icon} {label}</h4>
      <div className="flex flex-wrap gap-2.5">
        {items.map(i => (
          <span key={i} className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm flex flex-col items-start shadow-sm leading-tight text-gray-800">
            <span className="font-bold text-sm text-gray-700">{getEng(i)}</span>
            <span className="text-gray-400 text-[10px] italic mt-0.5 font-normal">{i}</span>
          </span>
        ))}
      </div>
    </div>
  )
}
