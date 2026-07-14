import { useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "motion/react"
import {
  ArrowLeft,
  ArrowRight,
  Sparkle,
  Check,
  Cpu,
  ListChecks,
  PaintBrush,
  VideoCamera,
  FilmStrip,
  Play,
  Pause,
  Download,
  Copy,
  Scissors,
  Image as ImageIcon,
  MusicNote,
  Monitor,
  Compass,
} from "@phosphor-icons/react"
import { PRODUCTS, videoGenFor, type Shot, type VideoGenStep } from "../lib/data"
import {
  Magnetic,
  Reveal,
  SPRING,
  useAutoFlow,
  useStreamLines,
  useTypewriter,
} from "../lib/motion"
import { useSelection } from "../App"
import { Eyebrow } from "../components/FlowShell"

const STEP_ICONS: Record<string, typeof Compass> = {
  ListChecks,
  PaintBrush,
  VideoCamera,
  FilmStrip,
}

export default function VideoGen() {
  const { product } = useSelection()
  const nav = useNavigate()
  const active = product ?? PRODUCTS[0]
  const payload = videoGenFor(active.id)

  const durations = payload.steps.map((_s, i) => ({
    thinking: 3000 + (i === 2 ? 1400 : 0), // shot generation step thinks longer
    result: 2200,
  }))
  const { stepIndex, phase, progress } = useAutoFlow(durations, true)
  const finished = stepIndex >= payload.steps.length

  return (
    <div className="relative max-w-[1200px] mx-auto px-6 pt-32 pb-10">
      <Reveal>
        <div className="flex items-center gap-2 text-[13px] text-[var(--color-ink-mute)]">
          <button onClick={() => nav("/remake")} className="inline-flex items-center gap-1 hover:text-[var(--color-ink)] transition-colors">
            <ArrowLeft size={14} weight="bold" />
            返回选题二创
          </button>
          <span className="opacity-40">/</span>
          <span className="text-[var(--color-ink)] font-medium">视频生成</span>
        </div>

        <div className="mt-5 flex items-end justify-between gap-6 flex-wrap">
          <div className="max-w-[820px]">
            <Eyebrow index="03">视频生成 · 最终阶段</Eyebrow>
            <h1 className="mt-4 text-3xl md:text-[44px] leading-[1.04] tracking-tight-display font-semibold text-balance">
              系统正在基于二创文案
              <span className="text-[var(--color-accent)]"> 生成视频</span>
            </h1>
            <p className="mt-3 text-[15px] text-[var(--color-ink-soft)]">
              文案分镜 → 画面风格 → 逐镜头生成 → 成片合成
            </p>
          </div>
          {!finished && (
            <div className="inline-flex items-center gap-2 rounded-[var(--radius-pill)] bg-[var(--color-accent-soft)] text-[var(--color-accent)] px-3.5 py-2 text-[12.5px] font-semibold">
              <motion.span animate={{ rotate: 360 }} transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}>
                <Cpu size={13} weight="fill" />
              </motion.span>
              视频生成中
              <span className="flex gap-0.5">
                {[0, 1, 2].map((d) => (
                  <motion.span key={d} className="w-1 h-1 rounded-full bg-current" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity, delay: d * 0.2 }} />
                ))}
              </span>
            </div>
          )}
          {finished && (
            <div className="inline-flex items-center gap-2 rounded-[var(--radius-pill)] bg-emerald-50 text-emerald-600 px-3.5 py-2 text-[12.5px] font-semibold">
              <Check size={13} weight="bold" /> 视频已生成
            </div>
          )}
        </div>
      </Reveal>

      {/* progress */}
      <Reveal>
        <div className="mt-9">
          <div className="flex items-center justify-between text-[12.5px] mb-2.5">
            <span className="font-medium text-[var(--color-ink-soft)]">
              {finished ? "视频生成完成" : `正在执行第 ${Math.min(stepIndex + 1, payload.steps.length)} / ${payload.steps.length} 步`}
            </span>
            <span className="font-mono font-semibold text-[var(--color-ink)]">{Math.round(progress * 100)}%</span>
          </div>
          <div className="h-2 rounded-full bg-[var(--color-fog)] overflow-hidden">
            <motion.div className="h-full rounded-full bg-gradient-to-r from-[var(--color-accent)] via-[#3d8bff] to-[#5aa6ff]" animate={{ width: `${progress * 100}%` }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} />
          </div>
          <div className="mt-4 flex items-center gap-2 flex-wrap">
            {payload.steps.map((s, i) => {
              const done = i < stepIndex || finished
              const current = i === stepIndex && !finished
              return (
                <div key={s.index} className={`inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] px-2.5 py-1 text-[11.5px] font-medium transition-colors ${done ? "bg-[var(--color-accent-soft)] text-[var(--color-accent)]" : current ? "bg-[var(--color-ink)] text-white" : "bg-[var(--color-fog)] text-[var(--color-ink-mute)]"}`}>
                  {done ? <Check size={11} weight="bold" /> : current ? <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}><Cpu size={11} weight="fill" /></motion.span> : <span className="w-[11px] text-center font-mono">{i + 1}</span>}
                  <span className="hidden sm:inline">{s.title}</span>
                </div>
              )
            })}
          </div>
        </div>
      </Reveal>

      {/* step cards */}
      <div className="mt-8 space-y-4">
        {payload.steps.map((step, i) => {
          const reached = i <= stepIndex || finished
          if (!reached) return null
          const isCurrent = i === stepIndex && !finished
          const done = i < stepIndex || finished
          return (
            <VideoStepCard key={step.index} step={step} active={isCurrent} phase={isCurrent ? phase : "settled"} done={done} />
          )
        })}
      </div>

      {/* final result */}
      <AnimatePresence>
        {finished && (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={SPRING} className="mt-10">
            <VideoResult payload={payload} productName={active.name} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ---------- Single step card ----------
function VideoStepCard({
  step,
  active,
  phase,
  done,
}: {
  step: VideoGenStep
  active: boolean
  phase: "thinking" | "result" | "settled"
  done: boolean
}) {
  const Icon = STEP_ICONS[step.icon] ?? Compass
  const showThinking = active && phase === "thinking"
  const showResult = (active && (phase === "result" || phase === "settled")) || done
  const stream = useStreamLines(step.thinking, { ms: 600, active: showThinking })

  return (
    <motion.div
      initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={SPRING}
      className={`rounded-[var(--radius-card)] bg-[var(--color-paper)] ring-1 shadow-soft overflow-hidden transition-colors ${done ? "ring-black/[0.06]" : active ? "ring-[var(--color-accent)]/25" : "ring-black/[0.07]"}`}
    >
      <div className="flex items-center gap-3.5 px-6 py-5 border-b border-black/[0.05]">
        <div className={`grid place-items-center w-10 h-10 rounded-xl shrink-0 transition-colors ${done ? "bg-[var(--color-accent)] text-white" : active ? "bg-[var(--color-accent-soft)] text-[var(--color-accent)]" : "bg-[var(--color-fog)] text-[var(--color-ink-mute)]"}`}>
          {done ? <Check size={17} weight="bold" /> : active ? <motion.span animate={{ rotate: 360 }} transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}><Icon size={17} weight="fill" /></motion.span> : <Icon size={17} />}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11.5px] text-[var(--color-ink-mute)]">STEP {step.index}</span>
            {active && phase === "thinking" && <span className="rounded-[var(--radius-pill)] bg-[var(--color-accent-soft)] text-[var(--color-accent)] px-2 py-0.5 text-[10.5px] font-semibold">渲染中…</span>}
            {active && phase === "result" && <span className="rounded-[var(--radius-pill)] bg-violet-50 text-violet-600 px-2 py-0.5 text-[10.5px] font-semibold">输出结果…</span>}
            {done && <span className="rounded-[var(--radius-pill)] bg-emerald-50 text-emerald-600 px-2 py-0.5 text-[10.5px] font-semibold">已完成</span>}
          </div>
          <h3 className="mt-0.5 text-[17px] font-semibold tracking-tight-display">{step.title}</h3>
        </div>
      </div>
      <div className="px-6 py-5 min-h-[96px]">
        <AnimatePresence mode="wait">
          {showThinking ? (
            <ThinkingVeil key="t" lines={stream.visible} current={stream.current} />
          ) : showResult ? (
            <motion.div key="r" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
              {step.result.map((r, i) => (
                <StreamRow key={i} label={r.label} value={r.value} active={active && phase === "result"} delay={i * 0.35} done={done} />
              ))}
            </motion.div>
          ) : (
            <motion.div key="i" className="text-[13.5px] text-[var(--color-ink-mute)] py-3">等待执行…</motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

// ---------- Final result: video player + element cards ----------
function VideoResult({
  payload,
  productName,
}: {
  payload: ReturnType<typeof videoGenFor>
  productName: string
}) {
  const [copied, setCopied] = useState<string | null>(null)
  const copy = (text: string, id: string) => {
    navigator.clipboard?.writeText(text).catch(() => {})
    setCopied(id)
    setTimeout(() => setCopied(null), 1400)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      {/* video player */}
      <div className="lg:col-span-2">
        <Reveal>
          <div className="rounded-[var(--radius-card)] bg-[var(--color-ink)] p-5 shadow-float sticky top-28">
            <div className="flex items-center gap-2 mb-3">
              <FilmStrip size={16} weight="fill" className="text-[var(--color-accent)]" />
              <span className="text-[13px] font-semibold text-white">成片预览</span>
              <span className="ml-auto text-[11px] text-white/50 font-mono">{payload.ratio} · {payload.duration}</span>
            </div>
            {payload.hasVideo && payload.videoSrc ? (
              <VideoPlayer src={payload.videoSrc} ratio={payload.ratio} />
            ) : (
              <PlaceholderVideo />
            )}
            <div className="mt-3 flex items-center gap-2">
              <button className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-[var(--radius-pill)] bg-[var(--color-accent)] text-white py-2.5 text-[13px] font-semibold hover:bg-[var(--color-accent-hover)] transition-colors">
                <Download size={14} /> 下载成片
              </button>
              <button onClick={() => copy(payload.shots.map((s) => `[${s.timecode}] ${s.scene}`).join("\n"), "shots")} className="inline-flex items-center justify-center gap-1.5 rounded-[var(--radius-pill)] bg-white/10 text-white py-2.5 px-3.5 text-[13px] font-semibold hover:bg-white/20 transition-colors">
                {copied === "shots" ? <Check size={14} weight="bold" /> : <Copy size={14} />}
              </button>
            </div>
          </div>
        </Reveal>
      </div>

      {/* element cards */}
      <div className="lg:col-span-3 space-y-5">
        {/* style card */}
        <Reveal>
          <ElementCard icon={PaintBrush} title="画面风格" accent>
            <div className="grid grid-cols-2 gap-3">
              <StyleTile label="色调" value={payload.style.tone} />
              <StyleTile label="节奏" value={payload.style.pacing} />
              <StyleTile label="光影" value={payload.style.lighting} />
              <StyleTile label="构图" value={payload.style.composition} />
            </div>
          </ElementCard>
        </Reveal>

        {/* shots timeline */}
        <Reveal>
          <ElementCard icon={Scissors} title="分镜脚本" count={payload.shots.length}>
            <div className="space-y-2">
              {payload.shots.map((shot, i) => (
                <ShotRow key={shot.index} shot={shot} delay={i * 0.1} />
              ))}
            </div>
          </ElementCard>
        </Reveal>

        {/* meta row */}
        <Reveal>
          <div className="grid grid-cols-3 gap-3">
            <MetaCard icon={Monitor} label="规格" value={payload.ratio} />
            <MetaCard icon={MusicNote} label="配乐" value={payload.music} />
            <MetaCard icon={ImageIcon} label="时长" value={payload.duration} />
          </div>
        </Reveal>

        {/* summary CTA */}
        <Reveal>
          <div className="rounded-[var(--radius-card)] bg-gradient-to-br from-[var(--color-ink)] to-[#2a2a2e] text-white p-7 relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-56 h-56 rounded-full bg-[var(--color-accent)]/30 blur-3xl" />
            <div className="relative">
              <div className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-white/60">
                <Sparkle size={13} weight="fill" className="text-[var(--color-accent)]" /> 全流程完成
              </div>
              <h3 className="mt-3 text-[22px] font-semibold tracking-tight-display text-balance">
                《{productName}》从选品到成片，全部生成完毕
              </h3>
              <p className="mt-2 text-[13.5px] text-white/70 leading-relaxed">
                选品 → 市场分析 → 选题二创 → 视频生成，AI 已跑完整条内容带货链路。
              </p>
              <div className="mt-5 flex flex-col sm:flex-row gap-3">
                <Magnetic onClick={() => (window.location.href = "/")} className="group inline-flex items-center justify-center gap-2 rounded-[var(--radius-pill)] bg-[var(--color-accent)] px-6 py-3 text-[14px] font-semibold text-white shadow-float hover:bg-[var(--color-accent-hover)] transition-colors">
                  <Sparkle size={15} weight="fill" /> 再做一个新品
                </Magnetic>
                <button onClick={() => (window.location.href = "/research")} className="inline-flex items-center justify-center gap-2 rounded-[var(--radius-pill)] bg-white/10 hover:bg-white/20 px-6 py-3 text-[14px] font-semibold transition-colors">
                  回看市场分析 <ArrowRight size={15} weight="bold" />
                </button>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  )
}

// ---------- Video player with custom controls ----------
function VideoPlayer({ src, ratio }: { src: string; ratio: string }) {
  const ref = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  // pick aspect class from ratio string; default 9:16 portrait
  const aspectClass = ratio.startsWith("16:9") ? "aspect-video" : "aspect-[9/16]"
  const maxHeight = ratio.startsWith("16:9") ? "max-h-[420px]" : "max-h-[520px]"

  const toggle = () => {
    const v = ref.current
    if (!v) return
    if (v.paused) {
      v.play()
      setPlaying(true)
    } else {
      v.pause()
      setPlaying(false)
    }
  }

  const onTime = () => {
    const v = ref.current
    if (!v || !v.duration) return
    setProgress((v.currentTime / v.duration) * 100)
  }

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const v = ref.current
    if (!v || !v.duration) return
    const r = e.currentTarget.getBoundingClientRect()
    v.currentTime = ((e.clientX - r.left) / r.width) * v.duration
  }

  return (
    <div className={`relative rounded-2xl overflow-hidden bg-black ${aspectClass} ${maxHeight} mx-auto`}>
      <video
        ref={ref}
        src={src}
        onTimeUpdate={onTime}
        onEnded={() => setPlaying(false)}
        onClick={toggle}
        playsInline
        className="w-full h-full object-cover cursor-pointer"
      />
      {/* center play/pause */}
      <button
        onClick={toggle}
        className="absolute inset-0 grid place-items-center group"
        aria-label="play/pause"
      >
        <motion.div
          animate={{ opacity: playing ? 0 : 1, scale: playing ? 0.8 : 1 }}
          transition={SPRING}
          className="grid place-items-center w-16 h-16 rounded-full bg-white/90 backdrop-blur shadow-float group-hover:scale-105 transition-transform"
        >
          {playing ? <Pause size={24} weight="fill" className="text-[var(--color-ink)]" /> : <Play size={26} weight="fill" className="text-[var(--color-accent)] ml-1" />}
        </motion.div>
      </button>
      {/* progress bar */}
      <div onClick={seek} className="absolute bottom-0 inset-x-0 h-1.5 bg-white/20 cursor-pointer">
        <div className="h-full bg-[var(--color-accent)]" style={{ width: `${progress}%` }} />
      </div>
    </div>
  )
}

function PlaceholderVideo({ ratio }: { ratio: string }) {
  const aspectClass = ratio.startsWith("16:9") ? "aspect-video" : "aspect-[9/16]"
  return (
    <div className={`relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#2a2a2e] to-[#1a1a1e] ${aspectClass} max-h-[520px] mx-auto grid place-items-center`}>
      <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.6, repeat: Infinity }} className="text-center">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="inline-grid place-items-center w-14 h-14 rounded-full bg-white/10 mb-3">
          <FilmStrip size={22} weight="fill" className="text-white/70" />
        </motion.div>
        <div className="text-[13px] text-white/60 font-medium">该产品暂未提供成片素材</div>
        <div className="text-[11px] text-white/40 mt-1">演示占位 · 可替换为真实视频</div>
      </motion.div>
    </div>
  )
}

// ---------- Element cards ----------
function ElementCard({
  icon: Icon,
  title,
  count,
  accent,
  children,
}: {
  icon: typeof Compass
  title: string
  count?: number
  accent?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="rounded-[var(--radius-card)] bg-[var(--color-paper)] ring-1 ring-black/[0.07] shadow-soft p-6">
      <div className="flex items-center gap-2.5 mb-4">
        <div className={`grid place-items-center w-9 h-9 rounded-xl ${accent ? "bg-[var(--color-accent)] text-white" : "bg-[var(--color-accent-soft)] text-[var(--color-accent)]"}`}>
          <Icon size={17} weight="fill" />
        </div>
        <div>
          <div className="text-[15px] font-semibold tracking-tight-display">{title}</div>
          {count !== undefined && <div className="text-[11px] text-[var(--color-ink-mute)]">共 {count} 个镜头</div>}
        </div>
      </div>
      {children}
    </div>
  )
}

function StyleTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-[var(--color-fog)] p-3">
      <div className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--color-ink-mute)] mb-1">{label}</div>
      <div className="text-[13px] font-medium leading-snug">{value}</div>
    </div>
  )
}

function ShotRow({ shot, delay }: { shot: Shot; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ ...SPRING, delay }}
      className="flex items-start gap-3 rounded-xl bg-[var(--color-fog)] p-3"
    >
      <div className="grid place-items-center w-7 h-7 rounded-full bg-white text-[12px] font-mono font-semibold text-[var(--color-accent)] shrink-0 mt-0.5">
        {shot.index}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="font-mono text-[10.5px] font-semibold text-[var(--color-ink-soft)] bg-white rounded px-1.5 py-0.5">{shot.timecode}</span>
          <span className="text-[11px] text-[var(--color-ink-mute)]">{shot.shot} · {shot.duration}</span>
        </div>
        <p className="text-[13px] leading-relaxed text-[var(--color-ink)]">{shot.scene}</p>
      </div>
    </motion.div>
  )
}

function MetaCard({ icon: Icon, label, value }: { icon: typeof Compass; label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-[var(--color-paper)] ring-1 ring-black/[0.07] p-4">
      <Icon size={16} weight="regular" className="text-[var(--color-ink-mute)]" />
      <div className="mt-2 text-[13px] font-semibold tracking-tight-display leading-tight">{value}</div>
      <div className="text-[10.5px] text-[var(--color-ink-mute)] mt-0.5">{label}</div>
    </div>
  )
}

// ---------- Shared bits (same pattern as Remake/Research) ----------
function ThinkingVeil({ lines, current }: { lines: string[]; current: string | null }) {
  return (
    <div className="relative rounded-2xl bg-[var(--color-fog)]/60 overflow-hidden">
      <div className="px-5 py-4 thinking-text">
        {lines.map((l, i) => (
          <div key={i} className="text-[13.5px] leading-relaxed font-medium text-[var(--color-ink)] mb-1.5">
            <span className="text-[var(--color-accent)] mr-1.5">›</span>{l}
          </div>
        ))}
        {current && (
          <div className="text-[13.5px] leading-relaxed font-medium text-[var(--color-ink)]">
            <span className="text-[var(--color-accent)] mr-1.5">›</span>{current}
          </div>
        )}
      </div>
      <div className="absolute inset-0 glass-veil grid place-items-center">
        <div className="flex items-center gap-2 text-[13px] font-semibold text-[var(--color-ink-soft)]">
          <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
            <Cpu size={15} weight="fill" className="text-[var(--color-accent)]" />
          </motion.span>
          AI 渲染中…
        </div>
      </div>
    </div>
  )
}

function StreamRow({ label, value, active, delay, done }: { label: string; value: string; active: boolean; delay: number; done: boolean }) {
  const { out, done: typed } = useTypewriter(value, { cps: 70, active })
  const text = done ? value : out
  const showCaret = active && !typed
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ ...SPRING, delay }} className="rounded-2xl bg-[var(--color-fog)] px-4 py-3">
      <div className="text-[11.5px] font-semibold uppercase tracking-[0.1em] text-[var(--color-accent)] mb-1">{label}</div>
      <p className={`text-[14px] leading-relaxed text-[var(--color-ink)] ${showCaret ? "stream-caret" : ""}`}>{text}</p>
    </motion.div>
  )
}
