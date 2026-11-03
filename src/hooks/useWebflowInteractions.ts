import { useEffect, useLayoutEffect } from 'react'
import { modalStore } from '@/lib/modalStore'
import { DESKTOP_QUERY, EASE_IN_OUT, GLOW_CARDS, HEADER_BG, MODAL_OPENERS, REVEAL } from '@/data/ix2'
import { cubicBezier } from '@/lib/easing'

const easeInOut = cubicBezier(0.42, 0, 0.58, 1)
const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Recreates the Webflow IX2 interactions the home page uses. */
export function useWebflowInteractions() {
  useScrollReveal()
  useHeaderBackground()
  useGlowCards()
  useModalTriggers()
}

// a-16: like IX2, only the vertical position counts, so content inside off-screen slides is revealed
// together with the rest of its section.
function useScrollReveal() {
  useLayoutEffect(() => {
    const selector = [...REVEAL.ids.map((id) => `[data-w-id="${id}"]`), ...REVEAL.classes].join(',')
    const pending = new Set(document.querySelectorAll<HTMLElement>(selector))
    if (reducedMotion()) return
    pending.forEach((el) => Object.assign(el.style, REVEAL.from))

    let frame = 0
    const check = () => {
      frame = 0
      const vh = window.innerHeight
      for (const el of pending) {
        const r = el.getBoundingClientRect()
        if (r.top < vh && r.bottom > 0 && (r.width || r.height)) {
          pending.delete(el)
          el.style.transition = ['opacity', 'filter', 'transform'].map((p) => `${p} ${REVEAL.duration}ms ${EASE_IN_OUT}`).join(', ')
          Object.assign(el.style, REVEAL.to)
        }
      }
    }
    const schedule = () => (frame ||= requestAnimationFrame(check))
    // Wait one frame so the hidden start state is painted before the first transition starts.
    requestAnimationFrame(schedule)
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    // Slider moves and late layout (fonts, images) can bring elements into view without a scroll.
    const interval = window.setInterval(schedule, 500)
    return () => {
      cancelAnimationFrame(frame)
      window.clearInterval(interval)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [])
}

// a-49: scroll progress 0 -> 1% of the page drives the menu bar colour (IX2 smoothing 10).
function useHeaderBackground() {
  useEffect(() => {
    const el = document.querySelector<HTMLElement>(HEADER_BG.target)
    if (!el) return
    let current = -1
    let frame = 0
    const [br, bg, bb, ba] = HEADER_BG.background
    const [or, og, ob, oa] = HEADER_BG.border
    const paint = (p: number) => {
      const e = easeInOut(p)
      el.style.willChange = 'background'
      el.style.backgroundColor = `rgba(${Math.round(br * e)}, ${Math.round(bg * e)}, ${Math.round(bb * e)}, ${ba * e})`
      el.style.borderColor = `rgba(${Math.round(or * e)}, ${Math.round(og * e)}, ${Math.round(ob * e)}, ${oa * e})`
    }
    const target = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      return Math.min(1, Math.max(0, window.scrollY / (max * HEADER_BG.range || 1)))
    }
    const tick = () => {
      const t = target()
      current = current < 0 ? t : current + (t - current) * 0.9
      if (Math.abs(t - current) < 0.001) current = t
      paint(current)
      frame = current === t ? 0 : requestAnimationFrame(tick)
    }
    const onScroll = () => (frame ||= requestAnimationFrame(tick))
    tick()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])
}

// a-17 / a-18 / a-19: glow fades in (700ms) on hover, out (400ms) on leave, and follows the pointer
// from -50% to 50% of the card with IX2 smoothing 93; it rests at the centre.
function useGlowCards() {
  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_QUERY)
    if (!mq.matches) return
    const cards = [...document.querySelectorAll<HTMLElement>(GLOW_CARDS.join(','))]
    const cleanups = cards.map((card) => {
      const glow = card.querySelector<HTMLElement>(':scope > .blurred-color, .blurred-color')
      if (!glow) return () => {}
      const pos = { x: 0, y: 0, tx: 0, ty: 0 }
      let frame = 0
      glow.style.opacity = '0'
      glow.style.willChange = 'transform'
      const step = () => {
        pos.x += (pos.tx - pos.x) * 0.07
        pos.y += (pos.ty - pos.y) * 0.07
        glow.style.transform = `translate3d(${pos.x}%, ${pos.y}%, 0)`
        frame = Math.abs(pos.tx - pos.x) + Math.abs(pos.ty - pos.y) > 0.05 ? requestAnimationFrame(step) : 0
      }
      const run = () => (frame ||= requestAnimationFrame(step))
      const enter = () => {
        glow.style.transition = 'opacity 700ms ease'
        glow.style.opacity = '1'
      }
      const leave = () => {
        glow.style.transition = 'opacity 400ms ease'
        glow.style.opacity = '0'
        pos.tx = 0
        pos.ty = 0
        run()
      }
      const move = (e: MouseEvent) => {
        const r = card.getBoundingClientRect()
        pos.tx = -50 + (100 * (e.clientX - r.left)) / r.width
        pos.ty = -50 + (100 * (e.clientY - r.top)) / r.height
        run()
      }
      card.addEventListener('mouseenter', enter)
      card.addEventListener('mouseleave', leave)
      card.addEventListener('mousemove', move)
      return () => {
        cancelAnimationFrame(frame)
        card.removeEventListener('mouseenter', enter)
        card.removeEventListener('mouseleave', leave)
        card.removeEventListener('mousemove', move)
      }
    })
    return () => cleanups.forEach((c) => c())
  }, [])
}

function useModalTriggers() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const trigger = target.closest<HTMLElement>('[data-modal-trigger]')
      if (trigger) {
        e.preventDefault()
        modalStore.open(trigger.dataset.modalTrigger!)
        return
      }
      const ix = target.closest<HTMLElement>('[data-w-id]')
      const name = ix && MODAL_OPENERS[ix.dataset.wId!]
      if (name) modalStore.open(name)
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])
}
