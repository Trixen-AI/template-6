import { createContext, use, useState } from 'react'
import { cx, type WfProps } from './types'

// Webflow `w-dropdown` with data-hover="true" and data-delay="0": opens on hover (and on click for touch),
// toggles `w--open` on the toggle and the list, and lifts the dropdown with z-index 901 while open.
const DropdownContext = createContext<{ open: boolean; setOpen: (open: boolean) => void }>({
  open: false,
  setOpen: () => {},
})

export function Dropdown({ as: Tag = 'div', className, style, children, ...rest }: WfProps) {
  const [open, setOpen] = useState(false)
  const hover = (rest as Record<string, unknown>)['data-hover'] === 'true'
  return (
    <DropdownContext value={{ open, setOpen }}>
      <Tag
        {...rest}
        className={className}
        style={open ? { ...style, zIndex: 901 } : style}
        onMouseEnter={hover ? () => setOpen(true) : undefined}
        onMouseLeave={hover ? () => setOpen(false) : undefined}
      >
        {children}
      </Tag>
    </DropdownContext>
  )
}

export function DropdownToggle({ as: Tag = 'div', className, children, ...rest }: WfProps) {
  const { open, setOpen } = use(DropdownContext)
  return (
    <Tag
      {...rest}
      className={cx(className, open && 'w--open')}
      role="button"
      tabIndex={0}
      aria-haspopup="menu"
      aria-expanded={open}
      onClick={() => setOpen(!open)}
      onKeyDown={(e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          setOpen(!open)
        }
        if (e.key === 'Escape') setOpen(false)
      }}
    >
      {children}
    </Tag>
  )
}

export function DropdownList({ as: Tag = 'nav', className, children, ...rest }: WfProps) {
  const { open } = use(DropdownContext)
  return (
    <Tag {...rest} className={cx(className, open && 'w--open')}>
      {children}
    </Tag>
  )
}
