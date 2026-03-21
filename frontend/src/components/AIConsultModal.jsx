import { useState } from 'react'
import { X, Sparkles, Loader2 } from 'lucide-react'
import HerbCard from './HerbCard'

export default function AIConsultModal({ onClose, onAdd, translate, onSelectHerb }) {
  const [symptoms, setSymptoms] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!symptoms.trim()) return
    setLoading(true)
    try {
      const res = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symptoms })
      })
      const data = await res.json()
      setResults(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 shadow-2xl transition-opacity duration-300">
      <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl bg-white border border-gray-100 rounded-[2rem] shadow-[0_20px_60px_rgba(132,169,140,0.15)] flex flex-col max-h-[90vh] overflow-hidden" style={{ animation: "scaleUp 0.3s forwards" }}>
        <div className="p-8 border-b border-gray-100 relative shrink-0 bg-gray-50/50">
          <button onClick={onClose} className="absolute top-6 right-6 p-2.5 bg-white hover:bg-gray-100 border border-gray-200 rounded-full transition-colors z-10 text-gray-400 hover:text-gray-700 shadow-sm">
            <X className="w-5 h-5"/>
          </button>
          <div className="w-16 h-16 bg-brand-accent/10 rounded-2xl flex items-center justify-center mb-6 border border-brand-accent/20 shadow-sm">
            <Sparkles className="w-8 h-8 text-brand-accent" />
          </div>
          <h2 className="text-3xl font-black font-['Outfit'] mb-2 text-gray-800">AI Symptom Consult</h2>
          <p className="text-gray-500 text-lg">Describe your imbalances and let holistic intelligence guide your botanical choices.</p>
        </div>

        <div className="overflow-y-auto p-8 flex-1 bg-white overscroll-contain" data-lenis-prevent="true">
          {!results ? (
            <form onSubmit={handleSubmit} className="flex flex-col gap-6 h-full">
              <textarea 
                value={symptoms}
                onChange={e => setSymptoms(e.target.value)}
                placeholder="E.g., I have a dry cough, poor sleep, and feeling anxious and cold."
                className="w-full flex-1 min-h-[180px] bg-gray-50 border border-gray-200 rounded-2xl p-6 text-lg text-gray-700 outline-none focus:border-brand-accent focus:ring-4 focus:ring-brand-accent-glow transition-all resize-none shadow-sm hover:shadow-md"
                required
              />
              <button 
                type="submit" 
                disabled={loading || !symptoms.trim()}
                className="w-full py-4 rounded-xl flex justify-center items-center gap-3 font-bold text-lg bg-brand-accent text-white shadow-lg hover:shadow-xl hover:bg-[#729b7a] hover:scale-[1.02] disabled:opacity-50 disabled:shadow-none disabled:hover:scale-100 disabled:hover:bg-brand-accent transition-all mt-auto"
              >
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Sparkles className="w-6 h-6" />}
                {loading ? 'Consulting Ancient Texts...' : 'Analyze & Recommend'}
              </button>
            </form>
          ) : (
            <div className="flex flex-col gap-6 pb-6 pt-2">
              <div className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-2"><Sparkles className="w-5 h-5 text-brand-accent"/> Top Remedies Found</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {results.map((res, i) => (
                  res.herb && (
                    <div key={i} className="animate-stagger-enter flex h-full" style={{ animationDelay: `${i * 0.1}s` }}>
                      <div className="w-full flex-1">
                        <HerbCard 
                          herb={res.herb} 
                          index={i} 
                          translate={translate} 
                          onClick={() => onSelectHerb(res.herb)}
                          onAdd={(e) => onAdd(res.herb, e)}
                        />
                      </div>
                    </div>
                  )
                ))}
              </div>
              <div className="flex justify-center mt-8 pb-4">
                 <button onClick={() => setResults(null)} className="px-8 py-2.5 rounded-full border border-gray-200 bg-white text-gray-500 hover:text-gray-800 hover:border-gray-300 transition-all duration-300 text-sm font-bold shadow-sm hover:scale-105">Reset Consult</button>
              </div>
            </div>
          )}
        </div>
      </div>
      <style>{`
        @keyframes scaleUp { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
      `}</style>
    </div>
  )
}
