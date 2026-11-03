// Webflow IX2 interaction data for the home page, read from the site's ix2 config (webflow.schunk.*.js).
import revealIds from './reveal-ids.json'

/** IX2 "easeInOut" / "ease" curves. */
export const EASE_IN_OUT = 'cubic-bezier(0.42, 0, 0.58, 1)'
export const EASE = 'ease'

/** a-16 "Scroll Into View": start hidden, then fade/unblur/rise over 700ms when the element enters the viewport. */
export const REVEAL = {
  ids: revealIds as string[],
  classes: ['.footer-wrapper', '.mechanics-card', '.partners-logo_border', '.blog-card', '.divider-horizontal', '.social-wrapper.in-footer'],
  from: { opacity: '0', filter: 'blur(10px)', transform: 'translate3d(0, 2rem, 0)' },
  to: { opacity: '1', filter: 'blur(0px)', transform: 'translate3d(0, 0rem, 0)' },
  duration: 700,
}

/** a-49 "Header BG": over the first 1% of page scroll the menu bar goes from transparent to green. */
export const HEADER_BG = {
  target: '[data-w-id="60c828bb-fcc2-031d-6cf8-37ca9e68f7cc"]',
  range: 0.01,
  background: [33, 68, 39, 1] as const,
  border: [255, 255, 255, 0.1607843137254902] as const,
}

/** a-17 / a-18 / a-19: lime glow (.blurred-color) fades in on hover and follows the pointer (desktop only). */
export const GLOW_CARDS = ['[data-w-id="4c5f9eef-4338-6d47-e6ef-5708bb2498ff"]', '.partners-logo_border', '.blog-img_wrapper-2']

/** a-79 … a-84: IX2 click triggers that open the social modals. */
export const MODAL_OPENERS: Record<string, string> = {
  '4821a9ba-02d4-d25f-591f-f88ecfe8ecac': 'x',
  '4821a9ba-02d4-d25f-591f-f88ecfe8ecae': 'facebook',
  '4821a9ba-02d4-d25f-591f-f88ecfe8ecb0': 'telegram',
}

/** IX2 desktop-only interactions run at the "main" breakpoint. */
export const DESKTOP_QUERY = '(min-width: 992px)'
