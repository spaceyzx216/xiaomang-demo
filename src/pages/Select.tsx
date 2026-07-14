import { useNavigate } from "react-router-dom"
import { motion } from "motion/react"
import {
  ArrowRight,
  Sparkle,
  TrendUp,
  FireSimple,
  Check,
} from "@phosphor-icons/react"
import { PRODUCTS, type Product, type Trend } from "../lib/data"
import { Reveal, SPRING, Tilt, containerV, itemV } from "../lib/motion"
import { useSelection } from "../App"
import { Eyebrow } from "../components/FlowShell"

export default function Select() {
  const { product, setProduct } = useSelection()
  const nav = useNavigate()

  const pick = (p: Product) => {
    setProduct(p)
    // small delay so the selection state visibly lands, then auto-advance
    setTimeout(() => nav("/research"), 420)
  }

  return (
    <div className="relative">
      <div className="aurora" />

      {/* ===================== HERO ===================== */}
      <section className="relative max-w-[1400px] mx-auto px-6 pt-36 md:pt-40 pb-14">
        <div className="max-w-[900px]">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={SPRING}
            className="inline-flex items-center gap-2 rounded-[var(--radius-pill)] bg-[var(--color-accent-soft)] px-3.5 py-1.5 text-[12.5px] font-semibold text-[var(--color-accent)]"
          >
            <Sparkle size={14} weight="fill" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 22, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ ...SPRING, delay: 0.06 }}
            className="mt-6 text-[44px] md:text-[72px] lg:text-[84px] leading-[0.98] tracking-tight-display font-semibold text-balance"
          >
            选一个品，
            <br />
            <span className="text-[var(--color-accent)]">剩下的</span>交给系统。
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING, delay: 0.14 }}
            className="mt-6 text-[18px] md:text-[20px] leading-relaxed text-[var(--color-ink-soft)] max-w-[54ch]"
          >
            从下面选一个候选品，系统会自动跑完市场分析、对标拆解、选题二创——
            你只需在每个大阶段结束时确认。
          </motion.p>
        </div>
      </section>

      {/* ===================== SELECTION CARDS ===================== */}
      <section className="relative max-w-[1400px] mx-auto px-6 pb-20">
        <Reveal>
          <Eyebrow index="00">第 0 步 · 选择推广产品</Eyebrow>
          <h2 className="mt-4 text-2xl md:text-[34px] leading-[1.1] tracking-tight-display font-semibold text-balance max-w-[640px]">
            选定后，系统自动开始全链路分析
          </h2>
        </Reveal>

        <motion.div
          variants={containerV}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-10%" }}
          className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5"
        >
          {PRODUCTS.map((p, i) => {
            const isCurrent = product?.id === p.id
            return (
              <motion.div key={p.id} variants={itemV}>
                <Tilt max={5}>
                  <button
                    onClick={() => pick(p)}
                    className={`group relative block w-full text-left h-full rounded-[var(--radius-card)] bg-[var(--color-paper)] ring-1 shadow-soft p-7 overflow-hidden transition-all hover:shadow-float ${
                      isCurrent ? "ring-[var(--color-accent)]" : "ring-black/[0.07] hover:ring-black/[0.12]"
                    }`}
                  >
                    {/* accent wash */}
                    <div
                      aria-hidden
                      className="pointer-events-none absolute -inset-px rounded-[var(--radius-card)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                      style={{
                        background:
                          "radial-gradient(420px circle at 50% 0%, rgba(0,113,227,0.10), transparent 60%)",
                      }}
                    />

                    <div className="relative flex items-start justify-between gap-3">
                      <div className="grid place-items-center w-14 h-14 rounded-2xl bg-[var(--color-fog)] text-[28px]">
                        {p.emoji}
                      </div>
                      <TrendBadge trend={p.trend} />
                    </div>

                    <h3 className="relative mt-5 text-[22px] font-semibold tracking-tight-display leading-snug">
                      {p.name}
                    </h3>
                    <div className="relative text-[13px] text-[var(--color-ink-mute)] mt-1">
                      {p.category}
                    </div>

                    {/* metric row */}
                    <div className="relative mt-5 grid grid-cols-3 gap-3">
                      <Metric label="客单价" value={p.price} />
                      <Metric label="佣金" value={p.commission} accent />
                      <Metric label="竞争度" value={p.competition} />
                    </div>

                    {/* heat meter */}
                    <div className="relative mt-5">
                      <div className="flex items-center justify-between text-[12px] mb-1.5">
                        <span className="text-[var(--color-ink-mute)]">热度指数</span>
                        <span className="font-semibold font-mono text-[var(--color-ink)]">{p.trendScore}</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-[var(--color-fog)] overflow-hidden">
                        <motion.div
                          className="h-full rounded-full bg-gradient-to-r from-[var(--color-accent)] to-[#5aa6ff]"
                          initial={{ width: 0 }}
                          whileInView={{ width: `${p.trendScore}%` }}
                          viewport={{ once: true }}
                          transition={{ ...SPRING, delay: 0.2 + i * 0.1 }}
                        />
                      </div>
                    </div>

                    {/* tagline */}
                    <p className="relative mt-5 text-[13.5px] leading-relaxed text-[var(--color-ink-soft)] min-h-[3.5em]">
                      {p.tagline}
                    </p>

                    {/* CTA */}
                    <div className="relative mt-6 flex items-center justify-between pt-5 border-t border-black/[0.06]">
                      <div className="flex flex-wrap gap-1.5">
                        {p.tags.slice(0, 3).map((t) => (
                          <span key={t} className="rounded-[var(--radius-pill)] bg-[var(--color-fog)] px-2 py-0.5 text-[11px] font-medium text-[var(--color-ink-soft)]">
                            {t}
                          </span>
                        ))}
                      </div>
                      <span className="inline-flex items-center gap-1 text-[13px] font-semibold text-[var(--color-accent)]">
                        选这个
                        <ArrowRight size={14} weight="bold" className="transition-transform group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </button>
                </Tilt>
              </motion.div>
            )
          })}
        </motion.div>

        {/* hint */}
        <Reveal>
          <div className="mt-8 flex items-center justify-center gap-2 text-[13px] text-[var(--color-ink-mute)]">
            <Check size={14} weight="bold" className="text-[var(--color-accent)]" />
            选定后无需任何操作，系统将自动推进到市场分析
          </div>
        </Reveal>
      </section>
    </div>
  )
}

function TrendBadge({ trend }: { trend: Trend }) {
  const map = {
    hot: { Icon: FireSimple, text: "热门", color: "text-rose-500 bg-rose-50" },
    up: { Icon: TrendUp, text: "上升", color: "text-[var(--color-accent)] bg-[var(--color-accent-soft)]" },
    new: { Icon: Sparkle, text: "新品", color: "text-violet-600 bg-violet-50" },
  }[trend]
  const { Icon } = map
  return (
    <span className={`inline-flex items-center gap-1 rounded-[var(--radius-pill)] px-2 py-0.5 text-[11px] font-semibold ${map.color}`}>
      <Icon size={11} weight="fill" />
      {map.text}
    </span>
  )
}

function Metric({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-xl bg-[var(--color-fog)] px-2.5 py-2">
      <div className={`text-[15px] font-semibold tracking-tight-display ${accent ? "text-[var(--color-accent)]" : ""}`}>
        {value}
      </div>
      <div className="text-[10.5px] text-[var(--color-ink-mute)] mt-0.5">{label}</div>
    </div>
  )
}
