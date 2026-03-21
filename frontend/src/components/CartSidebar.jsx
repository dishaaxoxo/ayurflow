import { X, Minus, Plus, ShoppingBag } from 'lucide-react'

export default function CartSidebar({ isOpen, onClose, cart, updateCart, setCart }) {
  const total = cart.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0)

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      <aside 
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white/95 backdrop-blur-3xl border-l border-gray-100 shadow-[-10px_0_40px_rgba(0,0,0,0.05)] z-50 flex flex-col transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h2 className="font-['Outfit'] text-2xl font-bold flex items-center gap-3 text-gray-800">
            <ShoppingBag className="text-brand-accent w-6 h-6" />
            Wellness Cart
          </h2>
          <button onClick={onClose} className="p-2 bg-white hover:bg-gray-100 border border-gray-200 rounded-full text-gray-500 hover:text-gray-800 transition-colors shadow-sm">
            <X className="w-5 h-5"/>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 bg-gray-50/30 overscroll-contain" data-lenis-prevent="true">
          {cart.map(item => (
            <div key={item.name} className="flex flex-col bg-white border border-gray-100 rounded-2xl p-5 gap-4 group hover:border-brand-accent/30 hover:shadow-md transition-all">
              <div className="flex justify-between items-start">
                <span className="font-bold text-lg text-gray-800">{item.name}</span>
                <span className="text-brand-accent font-black text-lg">${item.price}</span>
              </div>
              <div className="flex items-center justify-between text-gray-500">
                <span className="text-sm font-semibold tracking-wide uppercase">Quantity</span>
                <div className="flex items-center gap-4 bg-gray-50 rounded-xl p-1.5 border border-gray-100">
                  <button onClick={() => updateCart(item.name, -1)} className="p-1.5 hover:bg-white border border-transparent hover:border-gray-200 rounded-lg transition-colors shadow-sm text-gray-700"><Minus className="w-4 h-4"/></button>
                  <span className="font-bold w-4 text-center text-gray-800">{item.quantity}</span>
                  <button onClick={() => updateCart(item.name, 1)} className="p-1.5 hover:bg-white border border-transparent hover:border-gray-200 rounded-lg transition-colors shadow-sm text-gray-700"><Plus className="w-4 h-4"/></button>
                </div>
              </div>
            </div>
          ))}
          {cart.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 flex-1 opacity-80 gap-5 mt-10">
              <ShoppingBag className="w-20 h-20 opacity-20 text-brand-accent" />
              <p className="text-lg font-medium">Your cart is gently empty.</p>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-100 bg-white shrink-0 shadow-[0_-10px_40px_rgba(0,0,0,0.02)]">
          <div className="flex justify-between items-end mb-6">
            <span className="text-gray-500 font-semibold uppercase tracking-wider text-sm">Total Balance</span>
            <span className="text-3xl font-black text-brand-accent">${total.toFixed(2)}</span>
          </div>
          <button 
            disabled={cart.length === 0}
            className="w-full py-4 rounded-2xl font-bold text-lg bg-brand-accent text-white shadow-lg hover:shadow-xl hover:bg-[#729b7a] disabled:opacity-50 disabled:shadow-none hover:scale-[1.02] disabled:hover:scale-100 transition-all"
            onClick={() => { alert('Harmony Achieved! Checkout complete.'); onClose(); setCart([]) }}
          >
            Complete Wellness Order
          </button>
        </div>
      </aside>
    </>
  )
}
