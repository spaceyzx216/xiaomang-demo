import { AnimatePresence } from "motion/react"
import { Routes, Route, useLocation } from "react-router-dom"
import { createContext, useContext, useState, type ReactNode } from "react"
import Nav from "./components/Nav"
import { PageTransition } from "./components/FlowShell"
import Select from "./pages/Select"
import Research from "./pages/Research"
import Remake from "./pages/Remake"
import VideoGen from "./pages/VideoGen"
import { PRODUCTS, type Product } from "./lib/data"

// ---------- Global selection context ----------
type Ctx = {
  product: Product
  setProduct: (p: Product) => void
}
const SelectionCtx = createContext<Ctx>({ product: PRODUCTS[0], setProduct: () => {} })
export const useSelection = () => useContext(SelectionCtx)

function SelectionProvider({ children }: { children: ReactNode }) {
  const [product, setProduct] = useState<Product>(PRODUCTS[0])
  return (
    <SelectionCtx.Provider value={{ product, setProduct }}>
      {children}
    </SelectionCtx.Provider>
  )
}

export default function App() {
  const location = useLocation()
  return (
    <SelectionProvider>
      <div className="relative min-h-[100dvh] bg-[var(--color-paper)]">
        <Nav />
        <AnimatePresence mode="wait">
          <PageTransition key={location.pathname}>
            <Routes location={location}>
              <Route path="/" element={<Select />} />
              <Route path="/research" element={<Research />} />
              <Route path="/remake" element={<Remake />} />
              <Route path="/video" element={<VideoGen />} />
            </Routes>
          </PageTransition>
        </AnimatePresence>
        <Footer />
      </div>
    </SelectionProvider>
  )
}

function Footer() {
  return (
    <footer className="relative z-10 mt-24 border-t border-black/[0.06]">
      <div className="max-w-[1400px] mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4 text-[13px] text-[var(--color-ink-mute)]">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-[var(--color-ink)]">Creator Suite</span>
          <span>· 演示版本</span>
        </div>
        <div className="flex items-center gap-6">
          <span>Apple-grade UI Demo</span>
          <span className="font-mono">v0.1</span>
        </div>
      </div>
    </footer>
  )
}
