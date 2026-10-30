# AchivRun

**Never miss an achievement again.** A gaming companion for tracking achievement goals without getting ahead of the story.

[GitHub repository](https://github.com/JoseMLuzu/achivrun)

AchivRun is currently a frontend prototype built with React, Vite, strict TypeScript, Tailwind CSS 4, customized shadcn/ui components backed by Radix, React Router, Lucide, and Motion. It has no backend, authentication, or Steam Web API integration. The current interface is in Spanish; project documentation is in English.

## Getting started

Use Node.js 22.12+ or Node.js 24 LTS and npm. Development has been verified with Node.js 24.

```sh
npm ci
npm run dev
```

Open the local URL printed by Vite, usually `http://127.0.0.1:5173`.

```sh
npm test          # Domain rules, persistence, filters, inference, and route rendering
npm run build    # TypeScript checks and a production build in dist/
npm run preview  # Preview the production build locally
```

A production host must serve `index.html` for application routes while preserving the requested URL. This allows React Router to resolve direct links such as `/games/persona-3/guide`.

## Features

- A dashboard for resuming Persona 3 Reload, updating the selected stage, and reviewing objectives.
- A six-game library with search, progress filters, sorting, and empty states.
- Game details with achievement progress, categories, and links to example guides.
- Four interactive example guides with search, overlapping categories, objective states, manual checklists, and optional hints.
- Three spoiler levels. Full-guide mode requires confirmation, and detailed instructions require a separate action for each achievement. Changing levels closes previously expanded content.
- Protected secret names and neutral achievement icons. Search uses the same spoiler-safe projection as the visible achievement list.
- Local persistence for narrative stage, checklist, and spoiler preferences, including schema validation and storage error messages.
- A progress inference engine in `src/features/progress/inferProgress.ts`. It uses mapped narrative milestones and unlock timestamps to estimate the minimum stage reached. It distinguishes account history from a specific playthrough and reports confidence in the evidence. It is not yet connected to Steam or the interface and does not change manual progress.
- Mobile navigation, focus-managed dialogs, accessible labels, a skip link, and reduced-motion support.

## Demo data and assets

**All achievement records, totals, progress, narrative stages, and rules are fictional.** They are not real guides for the represented games. Initially completed achievements are sample state rather than information imported from a Steam account. Demo stages do not represent actual Persona 3 Reload chapters or dates.

There are no verified completion-time or playthrough estimates, so the interface marks those fields as unavailable. No real achievement deadlines have been invented.

Game names and cover art identify the sample catalog. Images load from Steam's public CDN without using the Steam Web API. They require a network connection and have a visual fallback if loading fails. Downloaded game artwork is not included in this repository. Manrope is served locally through Fontsource. Game names, trademarks, and artwork belong to their respective owners.

## Project structure

```text
src/
  components/                 Shared presentation components and ui/ primitives
  data/                       Fictional games, achievements, and inference scenarios
  features/
    achievements/             Achievement rows and objective previews
    games/                    Game cards, catalog filtering, and progress selectors
    progress/                 Local state, persistence, demo rules, and inference
    spoiler-protection/       Spoiler-safe presentation and level controls
  layouts/                    Application shell, navigation, and footer
  pages/                      Screen composition
  styles/                     Shared tokens and styles grouped by area
  types/                      Domain contracts
  lib/                        Shared utilities
```

Rule evaluation, catalog filtering, spoiler-safe presentation, storage parsing, and progress inference are independent functions. They can be tested and connected to future data sources without rewriting the screens. See [DECISIONS.md](DECISIONS.md) for the architectural rationale.

## Local data

Progress and preferences are stored under `achivrun:v1` in `localStorage`. Existing valid state from the previous storage namespace is read as a fallback and saved under the new key. The previous key remains available as a backup.

Storage belongs to the current browser and origin. It is not account synchronization, and concurrent tabs are not synchronized yet. If storage is unavailable, the app continues in memory and displays a warning.

## Validation

- `npm test` covers narrative rule boundaries, storage validation and compatibility, catalog filtering, inference, route rendering, and the absence of protected content from initial HTML.
- `npm run build` checks TypeScript and generates the production bundle.
- Interactive browser, responsive layout, keyboard, and screen-reader verification remain pending. A successful build does not substitute for those checks.

Source code is hosted on GitHub. The application has not been deployed to a production host.

## Next steps

1. Review desktop and mobile layouts, keyboard navigation, and screen-reader behavior in a local browser.
2. Replace a small subset of fictional Persona 3 Reload objectives with sourced, reviewed data, including source dates and spoiler classifications.
3. Add an interface for reviewing and explicitly confirming inferred narrative progress.
4. Define verified rule contracts and an adapter before introducing Flask, PostgreSQL, and SQLAlchemy.
5. Add Steam OpenID and achievement synchronization later, keeping credentials and authenticated API requests on the server.

Deliberately deferred: real achievement data, Steam integration, accounts, synchronization, playthrough history, inference confirmation screens, and complex decision-dependent rules.
