import type { ElementType, HTMLAttributes, ReactNode } from 'react'

/** Props shared by the Webflow widget wrappers: any HTML attribute plus the tag to render. */
export type WfProps = HTMLAttributes<HTMLElement> & {
  as?: ElementType
  children?: ReactNode
}

export const cx = (...parts: (string | false | null | undefined)[]) => parts.filter(Boolean).join(' ')
