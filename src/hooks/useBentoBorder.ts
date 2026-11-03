import { useEffect } from 'react'

// From the site's inline script: `.bento-border` cards get `is-visible` once 20% is on screen
// (CSS handles the fade/unblur/rise), and on desktop the card's glow follows the pointer (lerp 0.7).
export function useBentoBorder() {
  useEffect(() => {
    const cardObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            cardObserver.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.2 },
    )
    const observeCards = () =>
      document.querySelectorAll('.bento-border:not(.is-visible)').forEach((card) => cardObserver.observe(card))
    observeCards()
    const mutationObserver = new MutationObserver(observeCards)
    mutationObserver.observe(document.body, { childList: true, subtree: true })

    let onMove: ((e: MouseEvent) => void) | undefined
    if (window.innerWidth >= 992) {
      const state = new WeakMap<HTMLElement, { x: number; y: number; tx: number; ty: number; animating: boolean }>()
      const animate = (blur: HTMLElement, s: { x: number; y: number; tx: number; ty: number; animating: boolean }) => {
        s.x += (s.tx - s.x) * 0.7
        s.y += (s.ty - s.y) * 0.7
        blur.style.left = s.x + 'px'
        blur.style.top = s.y + 'px'
        blur.style.transform = 'translate(-50%, -50%)'
        if (Math.abs(s.tx - s.x) > 0.1 || Math.abs(s.ty - s.y) > 0.1) requestAnimationFrame(() => animate(blur, s))
        else s.animating = false
      }
      onMove = (e: MouseEvent) => {
        const card = (e.target as HTMLElement).closest<HTMLElement>('.bento-border')
        const blur = card?.querySelector<HTMLElement>('.blurred-color')
        if (!card || !blur) return
        const rect = card.getBoundingClientRect()
        let s = state.get(card)
        if (!s) state.set(card, (s = { x: rect.width / 2, y: rect.height / 2, tx: 0, ty: 0, animating: false }))
        s.tx = e.clientX - rect.left
        s.ty = e.clientY - rect.top
        if (!s.animating) {
          s.animating = true
          animate(blur, s)
        }
      }
      document.addEventListener('mousemove', onMove)
    }

    return () => {
      cardObserver.disconnect()
      mutationObserver.disconnect()
      if (onMove) document.removeEventListener('mousemove', onMove)
    }
  }, [])
}
