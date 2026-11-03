import { useEffect, useRef } from 'react'
import Swiper from 'swiper'
import { Navigation } from 'swiper/modules'
import type { WfProps } from './types'

// "Strategic initiatives" carousel. Mirrors the site's inline script: Swiper 11 on the CMS list with
// custom wrapper/slide classes, prev/next arrows dimmed to 0.3 at the ends, and cards revealed
// (`is-visible`, 100ms stagger) once 20% of the carousel is on screen and on every slide change.
export function StrategicSwiper({ className, children, ...rest }: WfProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const cards = [...el.querySelectorAll<HTMLElement>('.hero-banner_card')]
    cards.forEach((card) => card.classList.add('swiper-slide'))

    const updateButtons = (swiper: Swiper) => {
      const prevBtn = document.querySelector<HTMLElement>('.slide-left-arrow.strategic')
      const nextBtn = document.querySelector<HTMLElement>('.slide-right-arrow.strategic')
      if (!prevBtn || !nextBtn) return
      prevBtn.style.opacity = swiper.isBeginning ? '0.3' : '1'
      prevBtn.style.pointerEvents = swiper.isBeginning ? 'none' : 'auto'
      nextBtn.style.opacity = swiper.isEnd ? '0.3' : '1'
      nextBtn.style.pointerEvents = swiper.isEnd ? 'none' : 'auto'
    }
    const timers: number[] = []
    const revealVisibleSlides = (swiper: Swiper) => {
      const perView = Number(swiper.params.slidesPerView) || 1
      cards.forEach((slide, i) => {
        if (i >= swiper.activeIndex && i < swiper.activeIndex + perView) {
          timers.push(window.setTimeout(() => slide.classList.add('is-visible'), (i - swiper.activeIndex) * 100))
        }
      })
    }

    const swiper = new Swiper(el, {
      modules: [Navigation],
      wrapperClass: 'hero-banner_list',
      slideClass: 'hero-banner_card',
      slidesPerView: 1,
      spaceBetween: 16,
      loop: false,
      navigation: {
        nextEl: '.slide-right-arrow.strategic',
        prevEl: '.slide-left-arrow.strategic',
      },
      on: {
        init: (s) => updateButtons(s),
        slideChange: (s) => {
          updateButtons(s)
          revealVisibleSlides(s)
        },
      },
      breakpoints: {
        0: { slidesPerView: 1, spaceBetween: 6 },
        600: { slidesPerView: 1, spaceBetween: 12 },
        992: { slidesPerView: 1, spaceBetween: 16 },
      },
    })

    if (cards.length <= 1) {
      const pagination = document.querySelector<HTMLElement>('.pagination-slider.strategic')
      if (pagination) pagination.style.display = 'none'
      const strategic = document.getElementById('strategic')
      if (strategic) strategic.style.display = 'none'
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          revealVisibleSlides(swiper)
          observer.disconnect()
        }
      },
      { threshold: 0.2 },
    )
    observer.observe(el)

    return () => {
      observer.disconnect()
      timers.forEach(clearTimeout)
      swiper.destroy(true, true)
    }
  }, [])

  return (
    <div {...rest} ref={ref} className={className}>
      {children}
    </div>
  )
}
