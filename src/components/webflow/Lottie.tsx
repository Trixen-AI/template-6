import { useEffect, useRef } from 'react'
import type { WfProps } from './types'

// Webflow Lottie element: SVG renderer, loops and autoplays (light player, as the animations use no expressions).
// A non-zero data-duration (seconds) sets the playback speed so one loop lasts that long, as Webflow does.
export function Lottie({ className, ...rest }: WfProps) {
  const ref = useRef<HTMLDivElement>(null)
  const attrs = rest as Record<string, string | undefined>
  const src = attrs['data-src']
  const loop = attrs['data-loop'] !== '0'
  const autoplay = attrs['data-autoplay'] !== '0'
  const duration = Number(attrs['data-duration'] ?? 0)
  const direction = attrs['data-direction'] === '-1' ? -1 : 1

  useEffect(() => {
    const container = ref.current
    if (!container || !src) return
    let cancelled = false
    let destroy = () => {}
    import('lottie-web/build/player/lottie_light').then(({ default: lottie }) => {
      if (cancelled) return
      const anim = lottie.loadAnimation({ container, renderer: 'svg', loop, autoplay, path: src })
      anim.setDirection(direction)
      anim.addEventListener('DOMLoaded', () => {
        if (duration > 0) anim.setSpeed(anim.getDuration(false) / duration)
      })
      destroy = () => anim.destroy()
    })
    return () => {
      cancelled = true
      destroy()
    }
  }, [src, loop, autoplay, duration, direction])

  return <div {...rest} ref={ref} className={className} />
}
