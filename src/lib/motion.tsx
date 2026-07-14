import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
  type Variants,
} from "motion/react"
import { useEffect, useRef, useState, type ReactNode } from "react"

// Spring presets — Apple-style snappy but soft
export const SPRING = { type: "spring", stiffness: 220, damping: 28, mass: 0.7 } as const
export const SPRING_SOFT = { type: "spring", stiffness: 140, damping: 22, mass: 0.9 } as const

// Container + child stagger variants
export const containerV: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
}
export const itemV: Variants = {
  hidden: { opacity: 0, y: 18, filter: "blur(6px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: SPRING },
}

// Reveal-on-scroll wrapper
export function Reveal({
  children,
  delay = 0,
  y = 24,
  className,
}: {
  children: ReactNode
  delay?: number
  y?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-12% 0px -12% 0px" })
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y, filter: "blur(8px)" }}
      animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
      transition={{ ...SPRING, delay }}
    >
      {children}
    </motion.div>
  )
}

// Count-up number that animates when scrolled into view
export function AnimatedNumber({
  value,
  decimals = 0,
  suffix = "",
  prefix = "",
  duration = 1.4,
}: {
  value: number
  decimals?: number
  suffix?: string
  prefix?: string
  duration?: number
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: "-20%" })
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!inView) return
    let raf = 0
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min((now - start) / (duration * 1000), 1)
      // easeOutExpo
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
      setDisplay(value * eased)
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, value, duration])

  return (
    <span ref={ref}>
      {prefix}
      {display.toFixed(decimals)}
      {suffix}
    </span>
  )
}

// Magnetic button — pointer physics drive translate (taste-skill §3.B: useMotionValue, not useState)
export function Magnetic({
  children,
  className,
  strength = 0.35,
  onClick,
}: {
  children: ReactNode
  className?: string
  strength?: number
  onClick?: () => void
}) {
  const ref = useRef<HTMLButtonElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, SPRING)
  const sy = useSpring(y, SPRING)

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    x.set((e.clientX - (r.left + r.width / 2)) * strength)
    y.set((e.clientY - (r.top + r.height / 2)) * strength)
  }
  const reset = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.button
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      onClick={onClick}
      style={{ x: sx, y: sy }}
      whileTap={{ scale: 0.97 }}
      className={className}
    >
      {children}
    </motion.button>
  )
}

// Tilt card — subtle 3D parallax on hover
export function Tilt({
  children,
  className,
  max = 6,
}: {
  children: ReactNode
  className?: string
  max?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const rx = useMotionValue(0)
  const ry = useMotionValue(0)
  const srx = useSpring(rx, SPRING_SOFT)
  const sry = useSpring(ry, SPRING_SOFT)
  const transform = useTransform(
    [srx, sry],
    ([rxx, ryy]) => `perspective(900px) rotateX(${rxx}deg) rotateY(${ryy}deg)`
  )

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width - 0.5
    const py = (e.clientY - r.top) / r.height - 0.5
    ry.set(px * max)
    rx.set(-py * max)
  }
  const reset = () => {
    rx.set(0)
    ry.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={{ transform }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ====================================================================
// Streaming primitives for the "AI is thinking / outputting" auto-run flow.
// All timer-driven, deterministic, and cleaned up on unmount / advance.
// ====================================================================

// Reveal an array of lines one-by-one on a fixed cadence.
// Used for the BLURRED reasoning stream behind the frosted panel.
export function useStreamLines(lines: string[], opts?: { ms?: number; active?: boolean }) {
  const ms = opts?.ms ?? 520
  const active = opts?.active ?? true
  const [count, setCount] = useState(0)

  useEffect(() => {
    setCount(0)
    if (!active || lines.length === 0) return
    const timers: number[] = []
    lines.forEach((_, i) => {
      timers.push(window.setTimeout(() => setCount(i + 1), ms * (i + 1)))
    })
    return () => timers.forEach(clearTimeout)
  }, [active, lines, ms])

  return {
    visible: lines.slice(0, count),
    done: count >= lines.length,
    current: count < lines.length ? lines[count] : null,
  }
}

// Typewriter effect for a single string — reveals ~N chars per tick.
// Used for the CLEAR result text streaming out after thinking.
export function useTypewriter(text: string, opts?: { cps?: number; active?: boolean }) {
  const cps = opts?.cps ?? 60 // chars per second
  const active = opts?.active ?? true
  const [out, setOut] = useState("")

  useEffect(() => {
    setOut("")
    if (!active || !text) return
    const interval = 1000 / cps
    let i = 0
    const id = window.setInterval(() => {
      i += 1
      setOut(text.slice(0, i))
      if (i >= text.length) window.clearInterval(id)
    }, interval)
    return () => window.clearInterval(id)
  }, [active, text, cps])

  return { out, done: out.length >= text.length }
}

// Orchestrator: runs through a list of step ids one at a time, each with
// three phases — "thinking" → "result" → (pause) → next.
// Returns the current step index, phase, and overall progress 0..1.
export type StepPhase = "thinking" | "result" | "settled"
export type RunState = {
  stepIndex: number // -1 = not started, len = finished
  phase: StepPhase
  progress: number // 0..1 across all steps
  running: boolean
}

export function useAutoSteps(
  total: number,
  timings: { thinking: number; result: number; gap: number },
  start: boolean
) {
  const [state, setState] = useState<RunState>({
    stepIndex: -1,
    phase: "thinking",
    progress: 0,
    running: false,
  })

  useEffect(() => {
    if (!start) return
    setState({ stepIndex: -1, phase: "thinking", progress: 0, running: true })

    let t = 0
    const timers: number[] = []
    const perStep = timings.thinking + timings.result + timings.gap

    const schedule = (fn: () => void, at: number) =>
      timers.push(window.setTimeout(fn, at))

    for (let i = 0; i < total; i++) {
      const base = i * perStep
      // enter step — thinking phase
      schedule(() => {
        setState({
          stepIndex: i,
          phase: "thinking",
          progress: (i + 0.05) / total,
          running: true,
        })
      }, t + base)
      // switch to result phase
      schedule(() => {
        setState((s) => ({ ...s, phase: "result", progress: (i + 0.5) / total }))
      }, t + base + timings.thinking)
      // mark settled (progress full for this step)
      schedule(() => {
        setState((s) => ({ ...s, phase: "settled", progress: (i + 1) / total }))
      }, t + base + timings.thinking + timings.result)
    }

    // finish
    schedule(() => {
      setState({ stepIndex: total, phase: "settled", progress: 1, running: false })
    }, t + total * perStep)

    return () => timers.forEach(clearTimeout)
  }, [start, total, timings.thinking, timings.result, timings.gap])

  return state
}

// Flexible orchestrator: each step can have its OWN thinking/result duration.
// Used by the remake stage where retrieval steps and pipeline sub-steps vary.
// `durations[i]` = { thinking, result } in ms; gap is shared.
export function useAutoFlow(
  durations: { thinking: number; result: number }[],
  start: boolean,
  gap = 400
) {
  const total = durations.length
  const [state, setState] = useState<RunState>({
    stepIndex: -1,
    phase: "thinking",
    progress: 0,
    running: false,
  })

  useEffect(() => {
    if (!start || total === 0) return
    setState({ stepIndex: -1, phase: "thinking", progress: 0, running: true })

    const timers: number[] = []
    const schedule = (fn: () => void, at: number) =>
      timers.push(window.setTimeout(fn, at))

    // precompute cumulative end times for progress normalization
    const ends: number[] = []
    let acc = 0
    for (let i = 0; i < total; i++) {
      acc += durations[i].thinking + durations[i].result + gap
      ends.push(acc)
    }
    const totalMs = acc

    let cursor = 0
    for (let i = 0; i < total; i++) {
      const d = durations[i]
      // enter step — thinking
      schedule(() => {
        setState({
          stepIndex: i,
          phase: "thinking",
          progress: cursor / totalMs,
          running: true,
        })
      }, cursor)
      // switch to result
      schedule(() => {
        setState((s) => ({ ...s, phase: "result", progress: (cursor + d.thinking) / totalMs }))
      }, cursor + d.thinking)
      // settled
      cursor += d.thinking + d.result
      schedule(() => {
        setState((s) => ({ ...s, phase: "settled", progress: cursor / totalMs }))
      }, cursor)
      cursor += gap
    }

    // finish
    schedule(() => {
      setState({ stepIndex: total, phase: "settled", progress: 1, running: false })
    }, totalMs)

    return () => timers.forEach(clearTimeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [start, total, gap, JSON.stringify(durations)])

  return state
}
