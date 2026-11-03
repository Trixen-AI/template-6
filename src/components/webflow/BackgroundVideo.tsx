import { useEffect, useRef, type VideoHTMLAttributes } from 'react'
import type { WfProps } from './types'

// Webflow `w-background-video`: a wrapper div holding a muted, looping, inline autoplay video.
export function BackgroundVideo({ className, children, ...rest }: WfProps) {
  return (
    <div {...rest} className={className}>
      {children}
    </div>
  )
}

// React sets `muted` as a property after insertion, so make sure autoplay actually starts.
export function AutoVideo({ children, ...rest }: VideoHTMLAttributes<HTMLVideoElement>) {
  const ref = useRef<HTMLVideoElement>(null)
  useEffect(() => {
    const video = ref.current
    if (!video) return
    video.muted = true
    video.play().catch(() => {})
  }, [])
  return (
    <video {...rest} ref={ref}>
      {children}
    </video>
  )
}
