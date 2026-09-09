# Dalia Achouri — Portfolio

A single-page portfolio built with React + Vite, combining six sections
(Navbar/Hero, About, Projects, Experience, Journey, Contact) that were
originally built as standalone previews.

## Getting started

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually `http://localhost:5173`).

To build a production bundle:

```bash
npm run build
npm run preview   # optional: preview the production build locally
```

The build output goes to `dist/` — you can deploy that folder as-is to
Netlify, Vercel, GitHub Pages, or any static host.

## Project structure

```
src/
  components/     One file per section (Navbar, Hero, About, Projects,
                   Experience, Journey, Contact)
  data/
    portfolio.js  Single source of truth for all text, links and content
  styles/
    global.css    All section styles merged into one stylesheet
  App.jsx         Composes every section in order
  main.jsx        React entry point
public/
  profile.jpg          Your photo for the hero section (add this file)
  projects/            Project screenshots referenced in data/portfolio.js
  experience/          Experience photos referenced in data/portfolio.js
  cv/
    Dalia_Achouri_CV.pdf   Your downloadable CV
```

## What you need to fill in

Everything content-related lives in **`src/data/portfolio.js`**. Search
that file for these placeholders and replace them:

- `[ADD LINK]` — LinkedIn and GitHub URLs (appear twice: `SOCIALS` and
  `CONTACT_SOCIALS`)
- `[ADD EMAIL]` — your email address (appears in `SOCIALS`,
  `CONTACT_SOCIALS`, and directly inside `src/components/Contact.jsx`'s
  "Start a conversation" button)
- `[ADD DESCRIPTION]` — a few Journey entries (Algérie Télécom, Mobilis,
  Cybears, Algérie Poste) have placeholder descriptions

## Images and the CV

Sections reference images that aren't included in this zip (since they're
personal files). Drop them into `public/` at these paths and they'll show
up automatically — if a file is missing, most images fail gracefully
(e.g. the hero shows a placeholder silhouette instead of a broken image):

- `public/profile.jpg` — hero portrait
- `public/projects/capygoo.jpg`, `vyroniq.jpg`, `ar-game.jpg`
- `public/experience/steam-mentor.jpg`, `formatech.jpg`
- `public/cv/Dalia_Achouri_CV.pdf` — used by the "Download CV" button

## Notes

- The hero's 3D network background is built with plain Three.js — no
  extra scene-graph library needed beyond the `three` package.
- Framer Motion is used for the scroll-reveal and hover animations in
  Projects and Journey.
- All colors, spacing tokens, and design variables live at the top of
  `src/styles/global.css` under `:root` — change them once and the whole
  site updates.
