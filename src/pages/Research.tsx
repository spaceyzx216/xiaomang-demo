import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "motion/react"
import {
  ArrowLeft,
  ArrowRight,
  Sparkle,
  Check,
  Compass,
  Star,
  Target,
  ChartLineUp,
  Users,
  Cpu,
  FileText,
  Download,
} from "@phosphor-icons/react"
import { analysisFor, PRODUCTS, type AnalysisStep, type BriefSection } from "../lib/data"
import {
  Magnetic,
  Reveal,
  SPRING,
  useAutoSteps,
  useStreamLines,
  useTypewriter,
} from "../lib/motion"
import { useSelection } from "../App"
import { Eyebrow } from "../components/FlowShell"

// Resolve a step's phosphor icon by name
const ICONS: Record<string, typeof Compass> = {
  Compass,
  Star,
  Target,
  ChartLineUp,
  Users,
  Sparkle,
}

// Timing budget per step (ms): think → stream result → settle gap
const TIMINGS = { thinking: 3200, result: 2600, gap: 500 }

export default function Research() {
  const { product } = useSelection()
  const nav = useNavigate()
  const active = product ?? PRODUCTS[0]
  const payload = analysisFor(active.id)

  const { stepIndex, phase, progress } = useAutoSteps(
    payload.steps.length,
    TIMINGS,
    true // auto-start immediately on mount
  )

  const finished = stepIndex >= payload.steps.length

  return (
    <div className="relative max-w-[1200px] mx-auto px-6 pt-32 pb-10">
      {/* breadcrumb / header */}
      <Reveal>
        <div className="flex items-center gap-2 text-[13px] text-[var(--color-ink-mute)]">
          <button onClick={() => nav("/")} className="inline-flex items-center gap-1 hover:text-[var(--color-ink)] transition-colors">
            <ArrowLeft size={14} weight="bold" />
            重选产品
          </button>
          <span className="opacity-40">/</span>
          <span className="text-[var(--color-ink)] font-medium">市场分析</span>
        </div>

        <div className="mt-5 flex items-end justify-between gap-6 flex-wrap">
          <div className="max-w-[760px]">
            <Eyebrow index="01">市场分析 · 自动进行中</Eyebrow>
            <h1 className="mt-4 text-3xl md:text-[44px] leading-[1.04] tracking-tight-display font-semibold text-balance">
              系统正在围绕
              <span className="inline-flex items-center gap-2 mx-1.5 align-middle">
                <span className="text-[26px]">{active.emoji}</span>
                <span className="text-[var(--color-accent)]">{active.name}</span>
              </span>
              分析市场
            </h1>
          </div>
          <PhasePill finished={finished} />
        </div>
      </Reveal>

      {/* ===== Global progress bar ===== */}
      <Reveal>
        <div className="mt-9">
          <div className="flex items-center justify-between text-[12.5px] mb-2.5">
            <span className="font-medium text-[var(--color-ink-soft)]">
              {finished ? "全部分析完成" : `正在执行第 ${Math.min(stepIndex + 1, payload.steps.length)} / ${payload.steps.length} 步`}
            </span>
            <span className="font-mono font-semibold text-[var(--color-ink)]">{Math.round(progress * 100)}%</span>
          </div>
          <div className="h-2 rounded-full bg-[var(--color-fog)] overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-[var(--color-accent)] via-[#3d8bff] to-[#5aa6ff]"
              animate={{ width: `${progress * 100}%` }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
          {/* step dots */}
          <div className="mt-4 flex items-center gap-2 flex-wrap">
            {payload.steps.map((s, i) => {
              const done = i < stepIndex || finished
              const current = i === stepIndex && !finished
              return (
                <div
                  key={s.kind}
                  className={`inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] px-2.5 py-1 text-[11.5px] font-medium transition-colors ${
                    done
                      ? "bg-[var(--color-accent-soft)] text-[var(--color-accent)]"
                      : current
                        ? "bg-[var(--color-ink)] text-white"
                        : "bg-[var(--color-fog)] text-[var(--color-ink-mute)]"
                  }`}
                >
                  {done ? (
                    <Check size={11} weight="bold" />
                  ) : current ? (
                    <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                      <Cpu size={11} weight="fill" />
                    </motion.span>
                  ) : (
                    <span className="w-[11px] text-center font-mono">{i + 1}</span>
                  )}
                  <span className="hidden sm:inline">{s.title}</span>
                  <span className="sm:hidden">{s.index}</span>
                </div>
              )
            })}
          </div>
        </div>
      </Reveal>

      {/* ===== Steps timeline (live) ===== */}
      <div className="mt-10 space-y-4">
        {payload.steps.map((step, i) => {
          const reached = i <= stepIndex || finished
          const isCurrent = i === stepIndex && !finished
          return (
            <AnimatePresence key={step.kind}>
              {reached && (
                <StepCard
                  step={step}
                  active={isCurrent}
                  phase={isCurrent ? phase : "settled"}
                  done={i < stepIndex || finished}
                />
              )}
            </AnimatePresence>
          )
        })}
      </div>

      {/* ===== Brief summary (appears when finished) ===== */}
      <AnimatePresence>
        {finished && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={SPRING}
            className="mt-10"
          >
            <BriefSummary brief={payload.brief} productName={active.name} />

            {/* confirm CTA */}
            <Reveal>
              <div className="mt-8 rounded-[var(--radius-card)] bg-gradient-to-br from-[var(--color-ink)] to-[#2a2a2e] text-white p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
                <div className="absolute -right-10 -top-10 w-56 h-56 rounded-full bg-[var(--color-accent)]/30 blur-3xl" />
                <div className="relative max-w-[600px]">
                  <h3 className="text-[22px] md:text-[26px] font-semibold tracking-tight-display text-balance">
                    市场分析已完成，确认后进入「选题 · 二创」
                  </h3>
                  <p className="mt-2 text-[14.5px] text-white/70 leading-relaxed">
                    下方简报可下载。确认无误后，系统将基于这份 Brief 自动拆解对标账号、生成选题与二创文案。
                  </p>
                </div>
                <div className="relative flex items-center gap-3 shrink-0">
                  <button className="inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] bg-white/10 hover:bg-white/20 px-5 py-3.5 text-[14px] font-semibold transition-colors">
                    <Download size={16} />
                    下载简报
                  </button>
                  <Magnetic
                    onClick={() => nav("/remake")}
                    className="group inline-flex items-center gap-2 rounded-[var(--radius-pill)] bg-[var(--color-accent)] px-6 py-3.5 text-[15px] font-semibold text-white shadow-float hover:bg-[var(--color-accent-hover)] transition-colors"
                  >
                    确认，进入下一步
                    <ArrowRight size={18} weight="bold" className="transition-transform group-hover:translate-x-0.5" />
                  </Magnetic>
                </div>
              </div>
            </Reveal>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ---------- Phase pill (top-right status) ----------
function PhasePill({ finished }: { finished: boolean }) {
  return (
    <div
      className={`inline-flex items-center gap-2 rounded-[var(--radius-pill)] px-3.5 py-2 text-[12.5px] font-semibold transition-colors ${
        finished
          ? "bg-emerald-50 text-emerald-600"
          : "bg-[var(--color-accent-soft)] text-[var(--color-accent)]"
      }`}
    >
      {finished ? (
        <>
          <Check size={13} weight="bold" /> 分析完成
        </>
      ) : (
        <>
          <motion.span animate={{ rotate: 360 }} transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}>
            <Cpu size={13} weight="fill" />
          </motion.span>
          系统思考中
          <span className="flex gap-0.5">
            {[0, 1, 2].map((d) => (
              <motion.span
                key={d}
                className="w-1 h-1 rounded-full bg-current"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1, repeat: Infinity, delay: d * 0.2 }}
              />
            ))}
          </span>
        </>
      )}
    </div>
  )
}

// ---------- Single step card: thinking veil → streaming result ----------
function StepCard({
  step,
  active,
  phase,
  done,
}: {
  step: AnalysisStep
  active: boolean
  phase: "thinking" | "result" | "settled"
  done: boolean
}) {
  const Icon = ICONS[step.icon] ?? Compass
  const showThinking = active && phase === "thinking"
  const showResult = (active && (phase === "result" || phase === "settled")) || done

  // stream the thinking lines while in thinking phase
  const thinking = useStreamLines(step.thinking, { ms: 600, active: showThinking })

  return (
    <motion.div
      initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0 }}
      transition={SPRING}
      className={`rounded-[var(--radius-card)] bg-[var(--color-paper)] ring-1 shadow-soft overflow-hidden transition-colors ${
        done ? "ring-black/[0.06]" : active ? "ring-[var(--color-accent)]/25" : "ring-black/[0.07]"
      }`}
    >
      {/* header */}
      <div className="flex items-center gap-3.5 px-6 py-5 border-b border-black/[0.05]">
        <div
          className={`grid place-items-center w-10 h-10 rounded-xl shrink-0 transition-colors ${
            done
              ? "bg-[var(--color-accent)] text-white"
              : active
                ? "bg-[var(--color-accent-soft)] text-[var(--color-accent)]"
                : "bg-[var(--color-fog)] text-[var(--color-ink-mute)]"
          }`}
        >
          {done ? (
            <Check size={17} weight="bold" />
          ) : active ? (
            <motion.span animate={{ rotate: 360 }} transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}>
              <Icon size={17} weight="fill" />
            </motion.span>
          ) : (
            <Icon size={17} />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11.5px] text-[var(--color-ink-mute)]">STEP {step.index}</span>
            {active && phase === "thinking" && (
              <span className="rounded-[var(--radius-pill)] bg-[var(--color-accent-soft)] text-[var(--color-accent)] px-2 py-0.5 text-[10.5px] font-semibold">
                思考中…
              </span>
            )}
            {active && phase === "result" && (
              <span className="rounded-[var(--radius-pill)] bg-violet-50 text-violet-600 px-2 py-0.5 text-[10.5px] font-semibold">
                输出结果…
              </span>
            )}
            {done && (
              <span className="rounded-[var(--radius-pill)] bg-emerald-50 text-emerald-600 px-2 py-0.5 text-[10.5px] font-semibold">
                已完成
              </span>
            )}
          </div>
          <h3 className="mt-0.5 text-[17px] font-semibold tracking-tight-display">{step.title}</h3>
        </div>
      </div>

      {/* body: thinking veil OR streaming result */}
      <div className="px-6 py-5 min-h-[96px]">
        <AnimatePresence mode="wait">
          {showThinking ? (
            <ThinkingVeil key="thinking" lines={thinking.visible} current={thinking.current} />
          ) : showResult ? (
            <ResultStream key="result" step={step} active={active && phase === "result"} done={done} />
          ) : (
            <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[13.5px] text-[var(--color-ink-mute)] py-3">
              等待执行…
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

// ---------- Blurred reasoning text behind a frosted veil ----------
function ThinkingVeil({
  lines,
  current,
}: {
  lines: string[]
  current: string | null
}) {
  return (
    <div className="relative rounded-2xl bg-[var(--color-fog)]/60 overflow-hidden">
      {/* the blurred "thought" text */}
      <div className="px-5 py-4 thinking-text">
        {lines.map((l, i) => (
          <div key={i} className="text-[13.5px] leading-relaxed font-medium text-[var(--color-ink)] mb-1.5">
            <span className="text-[var(--color-accent)] mr-1.5">›</span>
            {l}
          </div>
        ))}
        {current && (
          <div className="text-[13.5px] leading-relaxed font-medium text-[var(--color-ink)]">
            <span className="text-[var(--color-accent)] mr-1.5">›</span>
            {current}
          </div>
        )}
      </div>
      {/* frosted glass overlay — makes it read as "occluded thinking" */}
      <div className="absolute inset-0 glass-veil grid place-items-center">
        <div className="flex items-center gap-2 text-[13px] font-semibold text-[var(--color-ink-soft)]">
          <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
            <Cpu size={15} weight="fill" className="text-[var(--color-accent)]" />
          </motion.span>
          AI 正在推理…
        </div>
      </div>
    </div>
  )
}

// ---------- Streaming clear result rows ----------
function ResultStream({
  step,
  active,
  done,
}: {
  step: AnalysisStep
  active: boolean
  done: boolean
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-3"
    >
      {step.result.map((r, i) => (
        <ResultRow key={i} label={r.label} value={r.value} active={active} delay={i * 0.35} done={done} />
      ))}
    </motion.div>
  )
}

function ResultRow({
  label,
  value,
  active,
  delay,
  done,
}: {
  label: string
  value: string
  active: boolean
  delay: number
  done: boolean
}) {
  // typewriter runs while this step is in "result" phase; once done, show full text
  const { out, done: typed } = useTypewriter(value, { cps: 70, active: active })
  const text = done ? value : out
  const showCaret = active && !typed

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...SPRING, delay }}
      className="rounded-2xl bg-[var(--color-fog)] px-4 py-3"
    >
      <div className="text-[11.5px] font-semibold uppercase tracking-[0.1em] text-[var(--color-accent)] mb-1">
        {label}
      </div>
      <p className={`text-[14px] leading-relaxed text-[var(--color-ink)] ${showCaret ? "stream-caret" : ""}`}>
        {text}
      </p>
    </motion.div>
  )
}

// ---------- Brief summary card (consolidated output) ----------
function BriefSummary({
  brief,
  productName,
}: {
  brief: BriefSection[]
  productName: string
}) {
  return (
    <div className="rounded-[var(--radius-card)] bg-[var(--color-paper)] ring-1 ring-black/[0.07] shadow-soft overflow-hidden">
      <div className="flex items-center gap-3 px-7 py-5 bg-gradient-to-r from-[var(--color-accent-soft)] to-transparent border-b border-black/[0.05]">
        <div className="grid place-items-center w-10 h-10 rounded-xl bg-[var(--color-accent)] text-white">
          <FileText size={18} weight="fill" />
        </div>
        <div>
          <div className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--color-accent)]">
            创意简报 · Creative Brief
          </div>
          <div className="text-[18px] font-semibold tracking-tight-display">
            《{productName}》市场分析总览
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1 p-7">
        {brief.map((section) => (
          <div key={section.id} className="py-3 md:border-r md:last:border-r-0 border-black/[0.05] md:pr-6 last:pr-0">
            <div className="text-[11.5px] font-semibold uppercase tracking-[0.12em] text-[var(--color-ink-mute)] mb-2.5">
              {section.title}
            </div>
            <dl className="space-y-2.5">
              {section.rows.map((row) => (
                <div key={row.k} className="grid grid-cols-[88px_1fr] gap-3 text-[13px] leading-relaxed">
                  <dt className="text-[var(--color-ink-mute)] font-medium pt-0.5">{row.k}</dt>
                  <dd className="text-[var(--color-ink)]">{row.v}</dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>
    </div>
  )
}
