import { NavLink, useLocation } from "react-router-dom"
import { motion } from "motion/react"
import { Sparkle, Package, ChartLine, MagicWand, FilmStrip } from "@phosphor-icons/react"
import { SPRING } from "../lib/motion"

const links = [
  { to: "/", label: "智能选品", icon: Package, step: "01" },
  { to: "/research", label: "市场分析", icon: ChartLine, step: "02" },
  { to: "/remake", label: "选题 · 二创", icon: MagicWand, step: "03" },
  { to: "/video", label: "视频生成", icon: FilmStrip, step: "04" },
]

export default function Nav() {
  const loc = useLocation()
  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={SPRING}
      className="fixed top-0 inset-x-0 z-50"
    >
      <nav className="glass mx-auto mt-3 flex items-center gap-1 rounded-[var(--radius-pill)] border border-black/5 px-2 py-2 shadow-soft max-w-[920px] w-[calc(100%-1.5rem)]">
        {/* Brand */}
        <div className="flex items-center gap-2 pl-3 pr-4 py-1">
          <div className="grid place-items-center w-8 h-8 rounded-full bg-[var(--color-accent)] text-white shadow-float">
            <Sparkle size={16} weight="fill" />
          </div>
          <span className="font-semibold tracking-tight-display text-[15px]">
            Creator&nbsp;Suite
          </span>
        </div>

        <div className="hidden sm:block w-px h-5 bg-black/10 mx-1" />

        {/* Links */}
        <div className="flex items-center gap-1 flex-1">
          {links.map((l) => {
            const active = loc.pathname === l.to
            const Icon = l.icon
            return (
              <NavLink key={l.to} to={l.to} className="relative block">
                <div
                  className={`relative flex items-center gap-2 rounded-[var(--radius-pill)] px-3.5 py-2 text-[13.5px] font-medium transition-colors ${
                    active ? "text-[var(--color-ink)]" : "text-[var(--color-ink-mute)] hover:text-[var(--color-ink)]"
                  }`}
                >
                  {active && (
                    <motion.div
                      layoutId="nav-pill"
                      transition={SPRING}
                      className="absolute inset-0 rounded-[var(--radius-pill)] bg-[var(--color-fog)] ring-1 ring-black/[0.04]"
                    />
                  )}
                  <Icon
                    size={16}
                    weight={active ? "fill" : "regular"}
                    className="relative z-10"
                  />
                  <span className="relative z-10 hidden md:inline">{l.label}</span>
                  <span className="relative z-10 text-[10px] font-mono opacity-50 hidden lg:inline">
                    {l.step}
                  </span>
                </div>
              </NavLink>
            )
          })}
        </div>

        <div className="hidden sm:flex items-center gap-2 pr-2">
          <div className="flex items-center gap-1.5 text-[12px] text-[var(--color-ink-mute)] font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            已连接
          </div>
        </div>
      </nav>
    </motion.header>
  )
}
