import { motion } from "motion/react"
import { type ReactNode } from "react"
import { SPRING } from "../lib/motion"

// Page transition wrapper — smooth slide/fade between routes
export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <motion.main
      initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, y: -8, filter: "blur(6px)" }}
      transition={SPRING}
      className="relative z-10"
    >
      {children}
    </motion.main>
  )
}

// Eyebrow label — small uppercase tag above section headers
export function Eyebrow({
  children,
  index,
}: {
  children: ReactNode
  index?: string
}) {
  return (
    <div className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--color-accent)]">
      {index && <span className="font-mono opacity-60">{index}</span>}
      <span>{children}</span>
      <span className="h-px flex-1 max-w-[40px] bg-[var(--color-accent)]/30" />
    </div>
  )
}

// Section heading block
export function SectionHead({
  eyebrow,
  index,
  title,
  desc,
}: {
  eyebrow: string
  index?: string
  title: ReactNode
  desc?: string
}) {
  return (
    <div className="max-w-[680px]">
      <Eyebrow index={index}>{eyebrow}</Eyebrow>
      <h2 className="mt-4 text-3xl md:text-[40px] leading-[1.05] tracking-tight-display font-semibold text-balance">
        {title}
      </h2>
      {desc && (
        <p className="mt-4 text-[16px] leading-relaxed text-[var(--color-ink-soft)] max-w-[58ch]">
          {desc}
        </p>
      )}
    </div>
  )
}
