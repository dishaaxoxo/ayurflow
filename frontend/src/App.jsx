import { useState, useEffect } from 'react'
import { ReactLenis } from 'lenis/react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Toolbar from './components/Toolbar'
import HerbCard from './components/HerbCard'
import CartSidebar from './components/CartSidebar'
import AIConsultModal from './components/AIConsultModal'
import HerbModal from './components/HerbModal'
import Cursor from './components/Cursor'

function App() {
  const [herbs, setHerbs] = useState([])
  const [metadata, setMetadata] = useState({ translate: {}, age_labels: {} })
  
  // Filters
  const [search, setSearch] = useState('')
  const [dosha, setDosha] = useState('all')
  const [age, setAge] = useState('all')
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8
  
  // State
  const [cart, setCart] = useState([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isAIOpen, setIsAIOpen] = useState(false)
  const [selectedHerb, setSelectedHerb] = useState(null)

  useEffect(() => {
    fetch('https://ayurflow-backend.onrender.com/api/metadata')
  }, [])

  useEffect(() => {
    const params = new URLSearchParams()
    if (search) params.append('search', search)
    if (dosha !== 'all') params.append('dosha', dosha)
    if (age !== 'all') params.append('age', age)
    
    fetch(`https://ayurflow-backend.onrender.com/api/herbs?${params.toString()}`)
      .then(r => r.json())
      .then(data => {
        setHerbs(data)
        setCurrentPage(1) // Reset page on filter change
      })
  }, [search, dosha, age])

  const addToCart = (herb, e) => {
    if (e) e.stopPropagation()
    setCart(prev => {
      const existing = prev.find(item => item.name === herb.name)
      if (existing) return prev.map(item => item.name === herb.name ? { ...item, quantity: item.quantity + 1 } : item)
      return [...prev, { name: herb.name, price: herb.price, quantity: 1 }]
    })
  }

  const updateCart = (name, delta) => {
    setCart(prev => prev.map(item => {
      if (item.name === name) return { ...item, quantity: item.quantity + delta }
      return item
    }).filter(item => item.quantity > 0))
  }

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = herbs.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(herbs.length / itemsPerPage)

  return (
    <ReactLenis root options={{ lerp: 0.08, duration: 1.2, smoothWheel: true, wheelMultiplier: 1.1 }}>
      <div className="min-h-screen relative font-sans text-brand-text bg-brand-bg transition-colors pb-10">
        <Cursor />
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
          {/* Animated pastel decorative blobs */}
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#A7D7C5]/40 blur-[120px] rounded-full animate-blob"></div>
          <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-[#F6C8B1]/40 blur-[100px] rounded-full animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-[-20%] left-[20%] w-[60%] h-[40%] bg-[#A0D2EB]/30 blur-[120px] rounded-full animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative z-10 flex flex-col items-center">
          <header className="text-center pt-20 pb-12 px-6 w-full max-w-4xl mx-auto animate-stagger-enter" style={{ animationDelay: '0.1s' }}>
            <div className="inline-block px-5 py-2 rounded-full bg-white shadow-sm text-brand-accent text-xs tracking-wider uppercase font-bold border border-brand-accent/20 mb-6">
              🍃 Natural Harmony
            </div>
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tighter mb-6 font-['Outfit'] text-gray-800 drop-shadow-sm">
              Ayur<span className="text-brand-accent">Flow</span>
            </h1>
            <p className="text-lg md:text-xl text-brand-text-dim max-w-2xl mx-auto font-normal leading-relaxed">
              Discover the ancient science of healing through nature's pharmacy. Seamlessly explore our curated botanical collection.
            </p>
          </header>

          <Toolbar 
            search={search} setSearch={setSearch}
            dosha={dosha} setDosha={setDosha}
            age={age} setAge={setAge}
            metadata={metadata}
            onOpenAI={() => setIsAIOpen(true)}
            onOpenCart={() => setIsCartOpen(true)}
            cartCount={cart.reduce((a, b) => a + b.quantity, 0)}
          />

          <main className="w-full max-w-7xl px-6 py-8 flex flex-col items-center min-h-[500px]">
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 shrink-0">
              {herbs.length === 0 ? (
                <div className="col-span-full text-center py-20 text-brand-text-dim italic text-xl font-light">
                  No harmonizing botanical found for these specific criteria.
                </div>
              ) : (
                currentItems.map((herb, index) => (
                  <HerbCard 
                    key={herb.name} 
                    herb={herb} 
                    index={index}
                    translate={metadata.translate}
                    onClick={() => setSelectedHerb(herb)} 
                    onAdd={(e) => addToCart(herb, e)}
                  />
                ))
              )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-14 flex items-center gap-4 bg-white/60 backdrop-blur-md px-6 py-3 rounded-full border border-black/5 shadow-sm animate-stagger-enter" style={{ animationDelay: '0.4s' }}>
                <button 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-full hover:scale-110 hover:bg-black/5 disabled:opacity-30 disabled:hover:bg-transparent transition-all duration-300 text-brand-text"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                
                <span className="font-semibold text-sm text-brand-text-dim tracking-wide">
                  Page <span className="text-brand-accent font-bold">{currentPage}</span> of {totalPages}
                </span>
                
                <button 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-full hover:scale-110 hover:bg-black/5 disabled:opacity-30 disabled:hover:bg-transparent transition-all duration-300 text-brand-text"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </main>
        </div>

        <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} cart={cart} updateCart={updateCart} setCart={setCart} />
        {isAIOpen && <AIConsultModal onClose={() => setIsAIOpen(false)} onAdd={addToCart} translate={metadata.translate} onSelectHerb={setSelectedHerb} />}
        {selectedHerb && <HerbModal herb={selectedHerb} onClose={() => setSelectedHerb(null)} translate={metadata.translate} onAdd={(e) => addToCart(selectedHerb, e)} />}
      </div>
    </ReactLenis>
  )
}
export default App
