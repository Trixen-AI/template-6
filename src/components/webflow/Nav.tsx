import { createContext, use, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { cx, type WfProps } from './types'

// Webflow `w-nav` (data-collapse="medium", data-animation="default", data-duration="400", data-easing="ease",
// data-doc-height="1"): at <=991px the menu button moves the menu into `.w-nav-overlay` and slides it down
// from translateY(-100%) to 0 over 400ms; closing reverses the slide, then the overlay is hidden.
const COLLAPSE_QUERY = '(max-width: 991px)'
const DURATION = 400

type NavState = {
  collapsed: boolean
  mounted: boolean
  shown: boolean
  overlay: HTMLDivElement | null
  toggle: () => void
  close: () => void
}
const NavContext = createContext<NavState | null>(null)

export function Nav({ as: Tag = 'div', className, children, ...rest }: WfProps) {
  const [collapsed, setCollapsed] = useState(() => window.matchMedia(COLLAPSE_QUERY).matches)
  const [mounted, setMounted] = useState(false)
  const [shown, setShown] = useState(false)
  const [overlay, setOverlay] = useState<HTMLDivElement | null>(null)
  const [docHeight, setDocHeight] = useState(0)
  const rootRef = useRef<HTMLElement>(null)
  const timer = useRef<number>(0)

  const open = () => {
    window.clearTimeout(timer.current)
    setDocHeight(document.documentElement.scrollHeight)
    setMounted(true)
    requestAnimationFrame(() => requestAnimationFrame(() => setShown(true)))
  }
  const close = () => {
    setShown(false)
    timer.current = window.setTimeout(() => setMounted(false), DURATION)
  }
  const toggle = () => (shown ? close() : open())

  // Leaving the collapsed layout resets the menu; a click outside the nav closes it.
  useEffect(() => {
    const mq = window.matchMedia(COLLAPSE_QUERY)
    const onChange = () => {
      setCollapsed(mq.matches)
      if (!mq.matches) {
        setShown(false)
        setMounted(false)
      }
    }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  useEffect(() => {
    if (!mounted) return
    const onDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) close()
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  })

  return (
    <NavContext value={{ collapsed, mounted, shown, overlay, toggle, close }}>
      <Tag {...rest} ref={rootRef} className={className}>
        {children}
        <div
          ref={setOverlay}
          className="w-nav-overlay"
          data-wf-ignore=""
          style={mounted && collapsed ? { height: docHeight, display: 'block' } : undefined}
        />
      </Tag>
    </NavContext>
  )
}

export function NavMenu({ as: Tag = 'nav', className, children, ...rest }: WfProps) {
  const nav = use(NavContext)
  if (nav && nav.collapsed && nav.mounted && nav.overlay) {
    return createPortal(
      <Tag
        {...rest}
        className={className}
        data-nav-menu-open=""
        style={{
          transform: nav.shown ? 'translateY(0px)' : 'translateY(-100%)',
          transition: `transform ${DURATION}ms ease`,
        }}
        onClick={(e: React.MouseEvent) => {
          if ((e.target as HTMLElement).closest('a[href]')) nav.close()
        }}
      >
        {children}
      </Tag>,
      nav.overlay,
    )
  }
  return (
    <Tag {...rest} className={className}>
      {children}
    </Tag>
  )
}

export function NavButton({ as: Tag = 'div', className, children, ...rest }: WfProps) {
  const nav = use(NavContext)
  const open = !!nav?.shown
  return (
    <Tag
      {...rest}
      className={cx(className, open && 'w--open')}
      role="button"
      tabIndex={0}
      aria-label="menu"
      aria-haspopup="menu"
      aria-expanded={open}
      onClick={() => nav?.toggle()}
      onKeyDown={(e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          nav?.toggle()
        }
      }}
    >
      {children}
    </Tag>
  )
}
