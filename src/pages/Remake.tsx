import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "motion/react"
import {
  ArrowLeft,
  ArrowRight,
  Sparkle,
  Check,
  Compass,
  FileText,
  MagnifyingGlass,
  VideoCamera,
  Cpu,
  PlayCircle,
  Eye,
  Heart,
  ChatCircle,
  FireSimple,
  CaretRight,
  Quotes,
  Hash,
  Lightning,
  Copy,
  ClipboardText,
} from "@phosphor-icons/react"
import {
  pipelineFor,
  PRODUCTS,
  retrievalFor,
  type BenchmarkVideo,
  type CreativeAgent,
  type PipelineSubStep,
} from "../lib/data"
import {
  Magnetic,
  Reveal,
  SPRING,
  useAutoFlow,
  useStreamLines,
  useTypewriter,
  containerV,
  itemV,
} from "../lib/motion"
import { useSelection } from "../App"
import { Eyebrow } from "../components/FlowShell"

type Stage = "retrieval" | "select" | "pipeline" | "funnel"

export default function Remake() {
  const { product } = useSelection()
  const nav = useNavigate()
  const active = product ?? PRODUCTS[0]
  const retrieval = retrievalFor(active.id)
  const pipeline = pipelineFor(active.id)

  const [stage, setStage] = useState<Stage>("retrieval")
  const [selectedVideos, setSelectedVideos] = useState<string[]>([])

  const toggleVideo = (id: string) => {
    setSelectedVideos((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : prev.length >= 3 ? prev : [...prev, id]
    )
  }

  return (
    <div className="relative max-w-[1200px] mx-auto px-6 pt-32 pb-10">
      <Reveal>
        <div className="flex items-center gap-2 text-[13px] text-[var(--color-ink-mute)]">
          <button onClick={() => nav("/research")} className="inline-flex items-center gap-1 hover:text-[var(--color-ink)] transition-colors">
            <ArrowLeft size={14} weight="bold" />
            返回市场分析
          </button>
          <span className="opacity-40">/</span>
          <span className="text-[var(--color-ink)] font-medium">选题 · 二创</span>
        </div>
        <StageHeader stage={stage} productName={active.name} emoji={active.emoji} />
      </Reveal>

      <AnimatePresence mode="wait">
        {stage === "retrieval" && (
          <RetrievalRun key="retrieval" retrieval={retrieval} onDone={() => setStage("select")} />
        )}
        {stage === "select" && (
          <SelectVideos
            key="select"
            retrieval={retrieval}
            selected={selectedVideos}
            onToggle={toggleVideo}
            onConfirm={() => setStage("pipeline")}
          />
        )}
        {stage === "pipeline" && (
          <PipelineRun
            key="pipeline"
            videos={retrieval.videos.filter((v) => selectedVideos.includes(v.id))}
            pipeline={pipeline}
            onDone={() => setStage("funnel")}
          />
        )}
        {stage === "funnel" && (
          <FunnelSummary
            key="funnel"
            pipeline={pipeline}
            videos={retrieval.videos.filter((v) => selectedVideos.includes(v.id))}
            onRestart={() => {
              setSelectedVideos([])
              setStage("retrieval")
            }}
            onNext={() => nav("/video")}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

// ---------- Stage header ----------
function StageHeader({ stage, productName, emoji }: { stage: Stage; productName: string; emoji: string }) {
  const map: Record<Stage, { idx: string; title: React.ReactNode; sub: string }> = {
    retrieval: {
      idx: "02·a",
      title: (
        <>
          系统正在为
          <span className="inline-flex items-center gap-2 mx-1.5 align-middle">
            <span className="text-[26px]">{emoji}</span>
            <span className="text-[var(--color-accent)]">{productName}</span>
          </span>
          检索对标
        </>
      ),
      sub: "解析市场简报 → 全网检索对标账号 → 抓取爆款作品",
    },
    select: {
      idx: "02·b",
      title: (
        <>
          勾选要二创的
          <span className="text-[var(--color-accent)]"> 对标视频</span>
        </>
      ),
      sub: "AI 已筛出高潜对标视频，选 1-3 条进入二创流水线",
    },
    pipeline: {
      idx: "02·c",
      title: (
        <>
          系统正在对对标视频执行
          <span className="text-[var(--color-accent)]"> 二创流水线</span>
        </>
      ),
      sub: "解析视频 → 转写口播 → 并行调用 4 个创作 Agent",
    },
    funnel: {
      idx: "02·d",
      title: (
        <>
          二创完成，
          <span className="text-[var(--color-accent)]"> 成片方案</span>已生成
        </>
      ),
      sub: "标题 / 3 秒留存 / 二创文案 三栏结果，已自动汇总为简报",
    },
  }
  const m = map[stage]
  return (
    <div className="mt-5 flex items-end justify-between gap-6 flex-wrap">
      <div className="max-w-[820px]">
        <Eyebrow index={m.idx}>选题 · 二创</Eyebrow>
        <h1 className="mt-4 text-3xl md:text-[44px] leading-[1.04] tracking-tight-display font-semibold text-balance">
          {m.title}
        </h1>
        <p className="mt-3 text-[15px] text-[var(--color-ink-soft)]">{m.sub}</p>
      </div>
    </div>
  )
}

// ====================================================================
// STAGE A — Retrieval auto-run
// ====================================================================
function RetrievalRun({
  retrieval,
  onDone,
}: {
  retrieval: ReturnType<typeof retrievalFor>
  onDone: () => void
}) {
  const durations = retrieval.steps.map(() => ({ thinking: 3000, result: 2200 }))
  const { stepIndex, phase, progress } = useAutoFlow(durations, true)
  const finished = stepIndex >= retrieval.steps.length

  // auto-advance when done
  useEffect(() => {
    if (!finished) return
    const t = setTimeout(onDone, 900)
    return () => clearTimeout(t)
  }, [finished, onDone])

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={SPRING}
    >
      <ProgressBar
        progress={progress}
        label={finished ? "对标检索完成" : `正在执行第 ${Math.min(stepIndex + 1, retrieval.steps.length)} / ${retrieval.steps.length} 步`}
        steps={retrieval.steps.map((s) => s.title)}
        stepIndex={stepIndex}
        finished={finished}
      />

      <div className="mt-8 space-y-4">
        {retrieval.steps.map((step, i) => {
          const reached = i <= stepIndex || finished
          if (!reached) return null
          const isCurrent = i === stepIndex && !finished
          const done = i < stepIndex || finished
          return (
            <RetrievalStepCard
              key={step.index}
              index={step.index}
              title={step.title}
              icon={step.icon}
              thinking={step.thinking}
              result={step.result}
              active={isCurrent}
              phase={isCurrent ? phase : "settled"}
              done={done}
            />
          )
        })}
      </div>

      {/* preview accounts/videos appear once retrieval finished */}
      <AnimatePresence>
        {finished && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={SPRING} className="mt-8">
            <div className="rounded-[var(--radius-card)] bg-[var(--color-fog)] p-6 text-center">
              <div className="inline-flex items-center gap-2 text-[14px] font-semibold text-[var(--color-accent)]">
                <Check size={16} weight="bold" /> 已锁定 {retrieval.accounts.length} 个对标账号、{retrieval.videos.length} 条爆款视频，即将进入选择
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function RetrievalStepCard({
  index,
  title,
  icon,
  thinking,
  result,
  active,
  phase,
  done,
}: {
  index: string
  title: string
  icon: string
  thinking: string[]
  result: { label: string; value: string }[]
  active: boolean
  phase: "thinking" | "result" | "settled"
  done: boolean
}) {
  const Icon = RETRIEVAL_ICONS[icon] ?? Compass
  const showThinking = active && phase === "thinking"
  const showResult = (active && (phase === "result" || phase === "settled")) || done
  const stream = useStreamLines(thinking, { ms: 600, active: showThinking })

  return (
    <motion.div
      initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={SPRING}
      className={`rounded-[var(--radius-card)] bg-[var(--color-paper)] ring-1 shadow-soft overflow-hidden transition-colors ${
        done ? "ring-black/[0.06]" : active ? "ring-[var(--color-accent)]/25" : "ring-black/[0.07]"
      }`}
    >
      <div className="flex items-center gap-3.5 px-6 py-5 border-b border-black/[0.05]">
        <div className={`grid place-items-center w-10 h-10 rounded-xl shrink-0 transition-colors ${done ? "bg-[var(--color-accent)] text-white" : active ? "bg-[var(--color-accent-soft)] text-[var(--color-accent)]" : "bg-[var(--color-fog)] text-[var(--color-ink-mute)]"}`}>
          {done ? <Check size={17} weight="bold" /> : active ? <motion.span animate={{ rotate: 360 }} transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}><Icon size={17} weight="fill" /></motion.span> : <Icon size={17} />}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11.5px] text-[var(--color-ink-mute)]">STEP {index}</span>
            <PhaseTag active={active} phase={phase} done={done} />
          </div>
          <h3 className="mt-0.5 text-[17px] font-semibold tracking-tight-display">{title}</h3>
        </div>
      </div>
      <div className="px-6 py-5 min-h-[96px]">
        <AnimatePresence mode="wait">
          {showThinking ? (
            <ThinkingVeil key="t" lines={stream.visible} current={stream.current} />
          ) : showResult ? (
            <motion.div key="r" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
              {result.map((r, i) => (
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

// ====================================================================
// STAGE B-select — pick benchmark videos
// ====================================================================
function SelectVideos({
  retrieval,
  selected,
  onToggle,
  onConfirm,
}: {
  retrieval: ReturnType<typeof retrievalFor>
  selected: string[]
  onToggle: (id: string) => void
  onConfirm: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={SPRING}
    >
      {/* accounts strip */}
      <Reveal>
        <div className="mt-8">
          <div className="flex items-center gap-2 text-[12.5px] font-semibold uppercase tracking-[0.14em] text-[var(--color-ink-mute)] mb-3">
            <MagnifyingGlass size={13} weight="fill" /> 锁定的对标账号
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {retrieval.accounts.map((a) => (
              <div key={a.id} className="rounded-2xl bg-[var(--color-paper)] ring-1 ring-black/[0.07] shadow-soft p-4 flex items-center gap-3">
                <div className="grid place-items-center w-10 h-10 rounded-full bg-gradient-to-br from-[var(--color-accent)] to-[#5aa6ff] text-white font-semibold shrink-0">
                  {a.handle.replace("@", "").slice(0, 1)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[14px] font-semibold tracking-tight-display truncate">{a.handle}</div>
                  <div className="text-[11.5px] text-[var(--color-ink-mute)]">{a.platform} · {a.followers} · {a.niche}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-[15px] font-semibold text-[var(--color-accent)]">{a.matchScore}</div>
                  <div className="text-[10px] text-[var(--color-ink-mute)]">匹配</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      {/* videos grid */}
      <Reveal>
        <div className="mt-9 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2 text-[12.5px] font-semibold uppercase tracking-[0.14em] text-[var(--color-ink-mute)]">
            <VideoCamera size={13} weight="fill" /> 今日选题（爆款对标视频）
          </div>
          <div className="text-[13px] text-[var(--color-ink-mute)]">
            已选 <span className="font-semibold text-[var(--color-accent)]">{selected.length}</span> / 3
          </div>
        </div>
      </Reveal>

      <motion.div variants={containerV} initial="hidden" animate="show" className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {retrieval.videos.map((v) => {
          const sel = selected.includes(v.id)
          return (
            <motion.button
              key={v.id}
              variants={itemV}
              onClick={() => onToggle(v.id)}
              whileTap={{ scale: 0.985 }}
              className={`group text-left rounded-[var(--radius-card)] p-5 ring-1 transition-all ${sel ? "bg-white ring-[var(--color-accent)] shadow-float" : "bg-[var(--color-paper)] ring-black/[0.07] shadow-soft hover:ring-black/[0.12]"}`}
            >
              <div className="flex items-start gap-4">
                <div className="relative grid place-items-center w-20 h-28 rounded-xl bg-gradient-to-br from-[var(--color-fog)] to-[#eef0f4] shrink-0 overflow-hidden">
                  <PlayCircle size={28} weight="fill" className="text-[var(--color-accent)]" />
                  <div className="absolute bottom-1 right-1 text-[10px] font-mono bg-black/60 text-white rounded px-1">{v.duration}</div>
                  <div className="absolute top-1 left-1 inline-flex items-center gap-0.5 text-[9.5px] font-semibold bg-[var(--color-accent)] text-white rounded px-1 py-0.5">
                    <FireSimple size={8} weight="fill" /> {v.hotScore}
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11.5px] text-[var(--color-ink-mute)]">{v.platform} · {v.author}</span>
                    <span className="text-[11px] text-[var(--color-ink-mute)]">· {v.age}</span>
                  </div>
                  <h3 className="mt-1.5 text-[15px] font-semibold tracking-tight-display leading-snug line-clamp-2">{v.title}</h3>
                  <div className="mt-2 flex items-center gap-3.5 text-[12px] text-[var(--color-ink-mute)]">
                    <span className="inline-flex items-center gap-1"><Eye size={12} /> {v.views}</span>
                    <span className="inline-flex items-center gap-1"><Heart size={12} /> {v.likes}</span>
                    <span className="inline-flex items-center gap-1"><ChatCircle size={12} /> {v.comments}</span>
                  </div>
                </div>
                <div className={`grid place-items-center w-6 h-6 rounded-full transition-all shrink-0 ${sel ? "bg-[var(--color-accent)] text-white scale-100" : "bg-[var(--color-fog)] text-transparent scale-90"}`}>
                  <Check size={13} weight="bold" />
                </div>
              </div>
              <p className="mt-3 pt-3 border-t border-black/[0.06] text-[12.5px] leading-relaxed text-[var(--color-ink-soft)]">
                <span className="font-semibold text-[var(--color-accent)]">推荐理由：</span>{v.reason}
              </p>
            </motion.button>
          )
        })}
      </motion.div>

      {/* confirm bar */}
      <Reveal>
        <div className="mt-8 sticky bottom-6 z-20">
          <div className="glass rounded-[var(--radius-pill)] shadow-float px-5 py-3.5 flex items-center justify-between gap-4">
            <div className="text-[13.5px] text-[var(--color-ink-soft)]">
              {selected.length === 0 ? "选择 1-3 条对标视频" : `已选 ${selected.length} 条，系统将对每条执行二创流水线`}
            </div>
            <Magnetic
              onClick={onConfirm}
              className={`group inline-flex items-center gap-2 rounded-[var(--radius-pill)] px-5 py-2.5 text-[14px] font-semibold transition-all ${
                selected.length > 0 ? "bg-[var(--color-accent)] text-white shadow-float hover:bg-[var(--color-accent-hover)]" : "bg-[var(--color-fog)] text-[var(--color-ink-mute)] cursor-not-allowed"
              }`}
            >
              开始二创
              <ArrowRight size={16} weight="bold" className="transition-transform group-hover:translate-x-0.5" />
            </Magnetic>
          </div>
        </div>
      </Reveal>
    </motion.div>
  )
}

// ====================================================================
// STAGE C — Pipeline auto-run (per video: resolve → transcribe → 4 agents)
// ====================================================================
function PipelineRun({
  videos,
  pipeline,
  onDone,
}: {
  videos: BenchmarkVideo[]
  pipeline: ReturnType<typeof pipelineFor>
  onDone: () => void
}) {
  // Build a flat duration list: for each video → 3 sub-steps, then ONE merged "agents" step.
  // (the 4 agents run in parallel, so they animate as a single step with 4 sub-cards)
  const flow: { thinking: number; result: number }[] = []
  videos.forEach(() => {
    pipeline.subSteps.forEach((_s, i) => {
      flow.push({ thinking: 1800 + i * 200, result: 1400 })
    })
    flow.push({ thinking: 4200, result: 2000 }) // the 4 parallel agents
  })

  const { stepIndex, phase, progress } = useAutoFlow(flow, true)
  const finished = stepIndex >= flow.length

  useEffect(() => {
    if (!finished) return
    const t = setTimeout(onDone, 1000)
    return () => clearTimeout(t)
  }, [finished, onDone])

  // map flat stepIndex back to [videoIdx, subIdx]
  const perVideo = pipeline.subSteps.length + 1
  const currentVideoIdx = Math.min(Math.floor(stepIndex / perVideo), videos.length - 1)

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={SPRING}>
      <ProgressBar
        progress={progress}
        label={finished ? "全部视频二创完成" : `处理第 ${currentVideoIdx + 1} / ${videos.length} 条视频`}
        steps={videos.map((v) => v.title.length > 14 ? v.title.slice(0, 14) + "…" : v.title)}
        stepIndex={currentVideoIdx}
        finished={finished}
      />

      <div className="mt-8 space-y-8">
        {videos.map((video, vi) => {
          const videoStarted = stepIndex >= vi * perVideo || finished
          if (!videoStarted) return null
          const videoDone = stepIndex >= (vi + 1) * perVideo || finished
          const isCurrentVideo = currentVideoIdx === vi && !finished
          return (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={SPRING}
              className="rounded-[var(--radius-card)] bg-[var(--color-paper)] ring-1 ring-black/[0.07] shadow-soft overflow-hidden"
            >
              {/* video header */}
              <div className="flex items-center gap-3 px-6 py-4 bg-[var(--color-fog)]/60 border-b border-black/[0.05]">
                <div className="grid place-items-center w-9 h-9 rounded-lg bg-[var(--color-accent-soft)] text-[var(--color-accent)] font-mono font-semibold text-[13px] shrink-0">
                  {vi + 1}
                </div>
                <PlayCircle size={18} weight="fill" className="text-[var(--color-accent)] shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="text-[10.5px] font-semibold uppercase tracking-[0.12em] text-[var(--color-ink-mute)]">
                    对标视频 · {video.platform} · {video.duration}
                  </div>
                  <div className="text-[14.5px] font-semibold tracking-tight-display truncate">{video.title}</div>
                </div>
                {videoDone ? (
                  <span className="inline-flex items-center gap-1 rounded-[var(--radius-pill)] bg-emerald-50 text-emerald-600 px-2.5 py-1 text-[11px] font-semibold">
                    <Check size={11} weight="bold" /> 已完成
                  </span>
                ) : isCurrentVideo ? (
                  <span className="inline-flex items-center gap-1 rounded-[var(--radius-pill)] bg-[var(--color-accent-soft)] text-[var(--color-accent)] px-2.5 py-1 text-[11px] font-semibold">
                    <motion.span animate={{ rotate: 360 }} transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}><Cpu size={11} weight="fill" /></motion.span>
                    处理中
                  </span>
                ) : null}
              </div>

              {/* sub-steps */}
              <div className="p-5 space-y-3">
                {pipeline.subSteps.map((sub, si) => {
                  const flatIdx = vi * perVideo + si
                  const reached = stepIndex >= flatIdx || finished
                  if (!reached) return <Placeholder key={sub.id} label={sub.label} />
                  const isCurrent = flatIdx === stepIndex && !finished
                  const done = stepIndex > flatIdx || finished
                  return (
                    <PipelineSubCard
                      key={sub.id}
                      sub={sub}
                      active={isCurrent}
                      phase={isCurrent ? phase : "settled"}
                      done={done}
                    />
                  )
                })}

                {/* the 4 parallel agents */}
                {(() => {
                  const agentFlatIdx = vi * perVideo + (perVideo - 1)
                  const reached = stepIndex >= agentFlatIdx || finished
                  if (!reached) return <Placeholder label="并行调用 4 个创作 Agent" />
                  const isCurrent = agentFlatIdx === stepIndex && !finished
                  const done = stepIndex > agentFlatIdx || finished
                  return (
                    <AgentsCard
                      agents={pipeline.agents}
                      active={isCurrent}
                      phase={isCurrent ? phase : "settled"}
                      done={done}
                    />
                  )
                })()}
              </div>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}

function PipelineSubCard({
  sub,
  active,
  phase,
  done,
}: {
  sub: PipelineSubStep
  active: boolean
  phase: "thinking" | "result" | "settled"
  done: boolean
}) {
  const showThinking = active && phase === "thinking"
  const showResult = (active && (phase === "result" || phase === "settled")) || done
  const stream = useStreamLines(sub.thinking, { ms: 500, active: showThinking })

  return (
    <div className={`rounded-2xl ring-1 transition-colors ${done ? "ring-black/[0.05] bg-[var(--color-fog)]/40" : active ? "ring-[var(--color-accent)]/25 bg-[var(--color-paper)]" : "ring-black/[0.05] bg-[var(--color-paper)]"}`}>
      <div className="flex items-center gap-2.5 px-4 py-3">
        <div className={`grid place-items-center w-7 h-7 rounded-full shrink-0 transition-colors ${done ? "bg-[var(--color-accent)] text-white" : active ? "bg-[var(--color-accent-soft)] text-[var(--color-accent)]" : "bg-[var(--color-fog)] text-[var(--color-ink-mute)]"}`}>
          {done ? <Check size={12} weight="bold" /> : active ? <motion.span animate={{ rotate: 360 }} transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}><Cpu size={12} weight="fill" /></motion.span> : <Cpu size={12} />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10.5px] text-[var(--color-ink-mute)]">{sub.id}</span>
            <span className="text-[13.5px] font-semibold tracking-tight-display">{sub.label}</span>
          </div>
          {done && <div className="text-[12px] text-[var(--color-ink-soft)] truncate mt-0.5">{sub.detail}</div>}
        </div>
      </div>

      {/* thinking veil inline */}
      {showThinking && (
        <div className="px-4 pb-3">
          <div className="relative rounded-xl bg-[var(--color-fog)]/60 overflow-hidden">
            <div className="px-3.5 py-2.5 thinking-text">
              {stream.visible.map((l, i) => (
                <div key={i} className="text-[12.5px] leading-relaxed font-medium mb-1">
                  <span className="text-[var(--color-accent)] mr-1.5">›</span>{l}
                </div>
              ))}
            </div>
            <div className="absolute inset-0 glass-veil grid place-items-center">
              <div className="flex items-center gap-1.5 text-[12px] font-semibold text-[var(--color-ink-soft)]">
                <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}><Cpu size={13} weight="fill" className="text-[var(--color-accent)]" /></motion.span>
                {sub.label}…
              </div>
            </div>
          </div>
        </div>
      )}

      {showResult && !showThinking && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-4 pb-3">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-accent-soft)] text-[var(--color-accent)] px-2.5 py-1 text-[11.5px] font-semibold">
            <Check size={11} weight="bold" /> {sub.detail}
          </div>
        </motion.div>
      )}
    </div>
  )
}

function AgentsCard({
  agents,
  active,
  phase,
  done,
}: {
  agents: CreativeAgent[]
  active: boolean
  phase: "thinking" | "result" | "settled"
  done: boolean
}) {
  const showThinking = active && phase === "thinking"
  const showResult = (active && (phase === "result" || phase === "settled")) || done

  return (
    <div className={`rounded-2xl ring-1 transition-colors overflow-hidden ${done ? "ring-black/[0.05]" : active ? "ring-[var(--color-accent)]/30" : "ring-black/[0.05]"}`}>
      <div className="flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-[var(--color-accent-soft)] to-transparent">
        <div className={`grid place-items-center w-7 h-7 rounded-full shrink-0 transition-colors ${done ? "bg-[var(--color-accent)] text-white" : active ? "bg-[var(--color-accent)] text-white" : "bg-[var(--color-fog)] text-[var(--color-ink-mute)]"}`}>
          {done ? <Check size={12} weight="bold" /> : <motion.span animate={{ rotate: 360 }} transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}><Lightning size={12} weight="fill" /></motion.span>}
        </div>
        <div className="flex-1">
          <div className="text-[13.5px] font-semibold tracking-tight-display">并行调用 4 个 DeepSeek 创作 Agent</div>
          <div className="text-[11.5px] text-[var(--color-ink-mute)]">开头钩子 · 结尾钩子 · 标题 · 二创文案</div>
        </div>
        {done && <span className="text-[11px] font-semibold text-emerald-600">全部完成</span>}
      </div>

      {showThinking && (
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {agents.map((a, i) => (
            <AgentThinkingTile key={a.id} agent={a} delay={i * 0.15} />
          ))}
        </div>
      )}

      {showResult && !showThinking && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {agents.map((a) => (
            <div key={a.id} className="rounded-xl bg-[var(--color-fog)] p-3 flex items-center gap-2.5">
              <div className="grid place-items-center w-7 h-7 rounded-full bg-[var(--color-accent)] text-white shrink-0">
                <Check size={12} weight="bold" />
              </div>
              <div className="min-w-0">
                <div className="text-[13px] font-semibold tracking-tight-display">{a.name}</div>
                <div className="text-[11px] text-[var(--color-ink-mute)] truncate">{a.desc}</div>
              </div>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  )
}

function AgentThinkingTile({ agent, delay }: { agent: CreativeAgent; delay: number }) {
  const stream = useStreamLines(agent.thinking, { ms: 700, active: true })
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ ...SPRING, delay }}
      className="relative rounded-xl bg-[var(--color-fog)]/70 overflow-hidden"
    >
      <div className="px-3.5 py-3 thinking-text min-h-[88px]">
        <div className="text-[12px] font-semibold mb-1 text-[var(--color-ink)]">{agent.name}</div>
        {stream.visible.map((l, i) => (
          <div key={i} className="text-[11.5px] leading-relaxed mb-0.5">
            <span className="text-[var(--color-accent)] mr-1">›</span>{l}
          </div>
        ))}
      </div>
      <div className="absolute inset-0 glass-veil grid place-items-center">
        <div className="flex items-center gap-1.5 text-[11.5px] font-semibold text-[var(--color-ink-soft)]">
          <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}><Cpu size={12} weight="fill" className="text-[var(--color-accent)]" /></motion.span>
          {agent.name} 生成中…
        </div>
      </div>
    </motion.div>
  )
}

function Placeholder({ label }: { label: string }) {
  return (
    <div className="rounded-2xl ring-1 ring-dashed ring-black/[0.08] bg-[var(--color-fog)]/30 px-4 py-3 flex items-center gap-2.5">
      <div className="grid place-items-center w-7 h-7 rounded-full bg-[var(--color-fog)] text-[var(--color-ink-mute)]">
        <Cpu size={12} />
      </div>
      <span className="text-[12.5px] text-[var(--color-ink-mute)]">{label}</span>
      <span className="ml-auto text-[11px] text-[var(--color-ink-mute)]">等待执行</span>
    </div>
  )
}

// ====================================================================
// STAGE D — Funnel (titles / hooks / script) + auto brief
// ====================================================================
function FunnelSummary({
  pipeline,
  videos,
  onRestart,
  onNext,
}: {
  pipeline: ReturnType<typeof pipelineFor>
  videos: BenchmarkVideo[]
  onRestart: () => void
  onNext: () => void
}) {
  const [copied, setCopied] = useState<string | null>(null)
  const copy = (text: string, id: string) => {
    navigator.clipboard?.writeText(text).catch(() => {})
    setCopied(id)
    setTimeout(() => setCopied(null), 1400)
  }

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={SPRING}>
      {/* three-column funnel */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* titles */}
        <FunnelCol icon={ClipboardText} title="爆款标题" count={pipeline.output.titles.length} accent>
          <div className="space-y-2">
            {pipeline.output.titles.map((t, i) => (
              <motion.button
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ ...SPRING, delay: i * 0.06 }}
                onClick={() => copy(t.text, `title-${i}`)}
                className="group w-full text-left rounded-xl bg-[var(--color-fog)] hover:bg-[var(--color-accent-soft)] p-3 transition-colors"
              >
                <div className="flex items-start gap-2">
                  <span className="inline-flex items-center rounded-[var(--radius-pill)] bg-white text-[9.5px] font-semibold text-[var(--color-ink-mute)] px-1.5 py-0.5 mt-0.5 shrink-0">{t.type}</span>
                  <span className="text-[13.5px] font-medium tracking-tight-display leading-snug flex-1">{t.text}</span>
                  {copied === `title-${i}` ? <Check size={13} weight="bold" className="text-[var(--color-accent)] shrink-0 mt-1" /> : <Copy size={13} className="text-[var(--color-ink-mute)] opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-1" />}
                </div>
              </motion.button>
            ))}
          </div>
        </FunnelCol>

        {/* hooks (3秒留存) */}
        <FunnelCol icon={Quotes} title="3 秒留存 · 钩子" count={pipeline.output.openingHooks.length + pipeline.output.endingHooks.length}>
          <div className="space-y-3">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--color-accent)] mb-1.5">开头钩子</div>
              {pipeline.output.openingHooks.map((h, i) => (
                <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...SPRING, delay: i * 0.08 }} className="rounded-xl bg-[var(--color-fog)] p-3 mb-2">
                  <p className="text-[13px] leading-relaxed">{h}</p>
                </motion.div>
              ))}
            </div>
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--color-accent)] mb-1.5">结尾引导</div>
              {pipeline.output.endingHooks.map((h, i) => (
                <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...SPRING, delay: 0.2 + i * 0.08 }} className="rounded-xl bg-[var(--color-fog)] p-3 mb-2">
                  <p className="text-[13px] leading-relaxed">{h}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </FunnelCol>

        {/* script */}
        <FunnelCol icon={FileText} title="二创文案" count={1}>
          <div className="rounded-xl bg-[var(--color-fog)] p-4">
            <p className="text-[13px] leading-relaxed whitespace-pre-line text-[var(--color-ink)]">{pipeline.output.script}</p>
            <div className="mt-3 pt-3 border-t border-black/[0.06] flex flex-wrap gap-1.5">
              {pipeline.output.hashtags.map((h) => (
                <span key={h} className="inline-flex items-center gap-0.5 rounded-[var(--radius-pill)] bg-white px-2 py-0.5 text-[11px] font-medium text-[var(--color-accent)]">
                  <Hash size={9} weight="bold" />{h.replace("#", "")}
                </span>
              ))}
            </div>
          </div>
          <button
            onClick={() => copy(pipeline.output.script, "script")}
            className="mt-2.5 w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-[var(--color-ink)] text-white py-2 text-[12.5px] font-semibold hover:bg-black transition-colors"
          >
            {copied === "script" ? <><Check size={13} weight="bold" /> 已复制</> : <><Copy size={13} /> 复制文案</>}
          </button>
        </FunnelCol>
      </div>

      {/* consolidated brief */}
      <Reveal>
        <div className="mt-8 rounded-[var(--radius-card)] bg-gradient-to-br from-[var(--color-ink)] to-[#2a2a2e] text-white p-8 relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-56 h-56 rounded-full bg-[var(--color-accent)]/30 blur-3xl" />
          <div className="relative flex items-center gap-3 mb-5">
            <div className="grid place-items-center w-11 h-11 rounded-xl bg-[var(--color-accent)] text-white">
              <Sparkle size={20} weight="fill" />
            </div>
            <div>
              <div className="text-[12px] font-semibold uppercase tracking-[0.12em] text-white/60">二创成片简报</div>
              <div className="text-[18px] font-semibold tracking-tight-display">已为 {videos.length} 条对标视频生成完整二创方案</div>
            </div>
          </div>
          <div className="relative grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "标题候选", value: pipeline.output.titles.length },
              { label: "开头钩子", value: pipeline.output.openingHooks.length },
              { label: "结尾引导", value: pipeline.output.endingHooks.length },
              { label: "二创文案", value: pipeline.output.hashtags.length + " 标签" },
            ].map((s) => (
              <div key={s.label} className="rounded-xl bg-white/5 p-3">
                <div className="text-[20px] font-semibold tracking-tight-display">{s.value}</div>
                <div className="text-[11.5px] text-white/60 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      {/* actions */}
      <Reveal>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button onClick={onRestart} className="inline-flex items-center gap-2 rounded-[var(--radius-pill)] px-6 py-3.5 text-[14px] font-semibold text-[var(--color-ink)] hover:bg-[var(--color-fog)] transition-colors">
            <CaretRight size={15} weight="bold" /> 换视频重跑二创
          </button>
          <Magnetic
            onClick={onNext}
            className="group inline-flex items-center gap-2 rounded-[var(--radius-pill)] bg-[var(--color-accent)] px-7 py-3.5 text-[14px] font-semibold text-white shadow-float hover:bg-[var(--color-accent-hover)] transition-colors"
          >
            <ArrowRight size={16} weight="bold" className="transition-transform group-hover:translate-x-0.5" /> 生成视频
          </Magnetic>
        </div>
      </Reveal>
    </motion.div>
  )
}

function FunnelCol({
  icon: Icon,
  title,
  count,
  accent,
  children,
}: {
  icon: typeof Compass
  title: string
  count: number
  accent?: boolean
  children: React.ReactNode
}) {
  return (
    <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={SPRING} className="rounded-[var(--radius-card)] bg-[var(--color-paper)] ring-1 ring-black/[0.07] shadow-soft p-5">
      <div className="flex items-center gap-2.5 mb-4">
        <div className={`grid place-items-center w-9 h-9 rounded-xl ${accent ? "bg-[var(--color-accent)] text-white" : "bg-[var(--color-accent-soft)] text-[var(--color-accent)]"}`}>
          <Icon size={17} weight="fill" />
        </div>
        <div>
          <div className="text-[15px] font-semibold tracking-tight-display">{title}</div>
          <div className="text-[11px] text-[var(--color-ink-mute)]">共 {count} 项</div>
        </div>
      </div>
      {children}
    </motion.div>
  )
}

// ====================================================================
// Shared bits
// ====================================================================
const RETRIEVAL_ICONS: Record<string, typeof Compass> = {
  FileText,
  MagnifyingGlass,
  VideoCamera,
  Compass,
}

function ProgressBar({
  progress,
  label,
  steps,
  stepIndex,
  finished,
}: {
  progress: number
  label: string
  steps: string[]
  stepIndex: number
  finished: boolean
}) {
  return (
    <div>
      <div className="flex items-center justify-between text-[12.5px] mb-2.5">
        <span className="font-medium text-[var(--color-ink-soft)]">{label}</span>
        <span className="font-mono font-semibold text-[var(--color-ink)]">{Math.round(progress * 100)}%</span>
      </div>
      <div className="h-2 rounded-full bg-[var(--color-fog)] overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-[var(--color-accent)] via-[#3d8bff] to-[#5aa6ff]"
          animate={{ width: `${progress * 100}%` }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
      <div className="mt-4 flex items-center gap-2 flex-wrap">
        {steps.map((s, i) => {
          const done = i < stepIndex || finished
          const current = i === stepIndex && !finished
          return (
            <div
              key={i}
              className={`inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] px-2.5 py-1 text-[11px] font-medium transition-colors ${
                done ? "bg-[var(--color-accent-soft)] text-[var(--color-accent)]" : current ? "bg-[var(--color-ink)] text-white" : "bg-[var(--color-fog)] text-[var(--color-ink-mute)]"
              }`}
            >
              {done ? <Check size={11} weight="bold" /> : current ? <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}><Cpu size={11} weight="fill" /></motion.span> : <span className="w-[11px] text-center font-mono">{i + 1}</span>}
              <span className="hidden lg:inline max-w-[160px] truncate">{s}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function PhaseTag({ active, phase, done }: { active: boolean; phase: "thinking" | "result" | "settled"; done: boolean }) {
  if (done) return <span className="rounded-[var(--radius-pill)] bg-emerald-50 text-emerald-600 px-2 py-0.5 text-[10.5px] font-semibold">已完成</span>
  if (active && phase === "thinking") return <span className="rounded-[var(--radius-pill)] bg-[var(--color-accent-soft)] text-[var(--color-accent)] px-2 py-0.5 text-[10.5px] font-semibold">思考中…</span>
  if (active && phase === "result") return <span className="rounded-[var(--radius-pill)] bg-violet-50 text-violet-600 px-2 py-0.5 text-[10.5px] font-semibold">输出结果…</span>
  return null
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
          <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}><Cpu size={15} weight="fill" className="text-[var(--color-accent)]" /></motion.span>
          AI 正在推理…
        </div>
      </div>
    </div>
  )
}
