# kaia.io home page: React clone

React 19 + Vite + TypeScript rebuild of https://www.kaia.io/ (a Webflow site).

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build
npm run lint
```

## Layout

- `src/components/sections/`: one component per page section. Generated from the live HTML by
  `.clone/tools/convert.mjs` and keeping Webflow's exact class names.
- `src/components/webflow/`: React versions of the Webflow widgets the page uses: hover dropdowns, the
  collapsing mobile nav, the `w-slider` carousel, the Swiper "Strategic initiatives" carousel, Lottie, background
  video and the social modals.
- `src/hooks/useWebflowInteractions.ts`: the page's Webflow IX2 interactions (scroll reveal, header colour on
  scroll, pointer-following glow, modal triggers). The values come from `src/data/ix2.ts`.
- `src/hooks/useBentoBorder.ts`: the site's own inline script for the bento cards.
- `src/styles/webflow.css`: Webflow's shared stylesheet, copied as-is. `custom.css` holds the site's
  inline `<style>` blocks plus the hover states.
- `public/assets/`: images, videos, Lottie JSON and fonts downloaded from the Webflow CDN.

Links to other pages point to the live site. Fonts come from Google Fonts and the site's Adobe Fonts kit
(`cth4jsu`, the `owners-wide` headings).
