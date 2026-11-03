import { useSyncExternalStore } from 'react'
import { modalStore } from '@/lib/modalStore'
import type { WfProps } from './types'

// Social account pickers (X, Facebook, Telegram). Opened by `[data-modal-trigger]` links and the IX2 click
// triggers (see useWebflowInteractions); closed by the close button or a click on the backdrop.
export function SocialModal({ name, className, style, children, ...rest }: WfProps & { name: string }) {
  const current = useSyncExternalStore(modalStore.subscribe, modalStore.get)
  return (
    <div
      {...rest}
      className={className}
      data-modal={name}
      role="dialog"
      aria-modal="true"
      style={{ ...style, display: current === name ? 'flex' : 'none' }}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest('.close-button-wrapper, .modal-click-outside')) modalStore.close()
      }}
    >
      {children}
    </div>
  )
}
