import { Children, createContext, use, useLayoutEffect, useRef, useState } from 'react'
import { cx, type WfProps } from './types'

// Webflow `w-slider` (data-duration="600", data-easing="ease", data-infinite="true", no autoplay).
// Slides sit side by side; every slide is translated by -index * 100%. When the move wraps around,
// the incoming slide is first placed next to the current one (no transition), then the current and
// incoming slides slide together, exactly as Webflow does. Slides not involved jump instantly.
const DURATION = 600
const EASING = 'ease'

type SliderState = {
  index: number
  count: number
  setCount: (n: number) => void
  go: (target: number, dir: 1 | -1) => void
  positions: number[]
  animating: number[]
}
const SliderContext = createContext<SliderState | null>(null)
const SlideIndex = createContext(0)

const finalPositions = (target: number, n: number) =>
  Array.from({ length: n }, (_, j) => {
    if (target === n - 1 && j === 0) return -target + n
    if (target === 0 && j === n - 1) return -target - n
    return -target
  })

export function Slider({ className, children, ...rest }: WfProps) {
  const [count, setCount] = useState(0)
  const [index, setIndex] = useState(0)
  const [positions, setPositions] = useState<number[]>([])
  const [animating, setAnimating] = useState<number[]>([])
  const busy = useRef(false)

  const go = (target: number, dir: 1 | -1) => {
    if (busy.current || count < 2 || target === index) return
    busy.current = true
    const current = index
    const start = positions.length === count ? [...positions] : Array<number>(count).fill(0)
    start[target] = dir - target
    setAnimating([])
    setPositions(start)
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        setAnimating([current, target])
        setPositions(finalPositions(target, count))
        setIndex(target)
        window.setTimeout(() => (busy.current = false), DURATION)
      }),
    )
  }

  return (
    <SliderContext value={{ index, count, setCount, go, positions, animating }}>
      <div {...rest} className={className} role="region" aria-label="carousel">
        {children}
      </div>
    </SliderContext>
  )
}

export function SliderMask({ className, children, ...rest }: WfProps) {
  const slider = use(SliderContext)
  const slides = Children.toArray(children)
  const setCount = slider?.setCount
  useLayoutEffect(() => setCount?.(slides.length), [setCount, slides.length])
  return (
    <div {...rest} className={className}>
      {slides.map((slide, i) => (
        <SlideIndex key={i} value={i}>
          {slide}
        </SlideIndex>
      ))}
    </div>
  )
}

export function Slide({ className, style, children, ...rest }: WfProps) {
  const slider = use(SliderContext)
  const i = use(SlideIndex)
  const x = slider?.positions[i] ?? 0
  const active = slider?.index === i
  return (
    <div
      {...rest}
      className={className}
      aria-roledescription="slide"
      aria-label={`${i + 1} of ${slider?.count ?? 0}`}
      aria-hidden={active ? undefined : true}
      style={{
        ...style,
        transform: `translateX(${x * 100}%)`,
        transition: slider?.animating.includes(i) ? `transform ${DURATION}ms ${EASING}` : 'none',
        opacity: 1,
      }}
    >
      {children}
    </div>
  )
}

export function SliderArrow({ className, children, dir, ...rest }: WfProps & { dir: 'prev' | 'next' }) {
  const slider = use(SliderContext)
  const move = () => {
    if (!slider || !slider.count) return
    const step = dir === 'next' ? 1 : -1
    slider.go((slider.index + step + slider.count) % slider.count, step)
  }
  return (
    <div
      {...rest}
      className={className}
      role="button"
      tabIndex={0}
      aria-label={dir === 'next' ? 'next slide' : 'previous slide'}
      onClick={move}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          move()
        }
      }}
    >
      {children}
    </div>
  )
}

export function SliderNav({ className, ...rest }: WfProps) {
  const slider = use(SliderContext)
  const count = slider?.count ?? 0
  return (
    <div {...rest} className={className}>
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          className={cx('w-slider-dot', slider?.index === i && 'w-active')}
          aria-label={`Show slide ${i + 1} of ${count}`}
          aria-pressed={slider?.index === i}
          role="button"
          tabIndex={slider?.index === i ? 0 : -1}
          style={{ marginLeft: 3, marginRight: 3 }}
          onClick={() => slider && slider.go(i, i > slider.index ? 1 : -1)}
        />
      ))}
    </div>
  )
}
