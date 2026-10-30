# AchivRun architecture decisions

## Visual identity

The interface uses charcoal surfaces, a neutral silver accent, and the Manrope variable font. The accent is shared by buttons, progress indicators, navigation, and branding. Warning states retain their semantic colors. Game artwork provides the main visual focus, while secondary panels help players choose what to do next without turning the dashboard into a statistics board. Styles are grouped by area and share Tailwind-compatible tokens.

The application name is **AchivRun**, and the npm package is named `achivrun`. The existing Spanish interface remains in Spanish; repository Markdown documentation is maintained in English.

Customized shadcn/ui primitives live in `components/ui`, using CVA for variants and Radix for accessible dialog behavior. This keeps component code editable without adding a large component framework. `components.json` configures registry conventions and import aliases.

Typography uses rem-based tokens: 16 px for primary content, 14 px for controls and secondary text, 12 px for metadata, and 18 px for section headings at the browser's default font size. Mobile layouts retain readable type sizes and reorganize columns and controls to make space.

## Domain and presentation boundaries

`Game`, `Achievement`, `PlayerProgress`, and `AchievementWarning` are React-independent interfaces. `AchievementCategory`, `SpoilerLevel`, and objective states use closed unions to prevent invalid values. An achievement can belong to multiple categories.

Components consume fixtures from `data/` rather than embedding real game conditions. The demo evaluator returns an objective state and a safe message; a future backend adapter can provide the same contract. Missing rules produce an unknown state rather than a guarantee that an objective is safe.

## Shared spoiler policy

`presentAchievement` determines which information can be displayed and searched at each spoiler level. Secret identities remain hidden at levels 1 and 2. Achievement artwork is not used; neutral icons avoid revealing visual spoilers.

Level 3 requires explicit confirmation, and each instruction block requires an additional reveal action. Collapsed content is not inserted into the HTML. Achievement rows remount when the level changes, closing previous reveals. This protects the visible experience rather than enforcing data access: frontend fixtures are included in the application bundle.

## Small, versioned local state

React Context shares the selected stage, checklist, and spoiler level. Percentages are derived from the checklist instead of stored separately. There is no additional global state manager or server cache while data remains local.

The `achivrun:v1` schema validates types, narrative stages, and achievement identifiers on read. Foreign IDs and duplicates are discarded. Invalid state falls back to the initial demo scenario with a warning. If the browser blocks writes, the session continues in memory and reports the limitation.

For compatibility with existing players, reads fall back to the previous storage key only when the new key is absent. Valid legacy state is subsequently written to the new namespace by the provider. The old key is retained as a backup. Corrupt current state does not silently fall back to potentially outdated legacy preferences.

The app does not yet listen for cross-tab `storage` events. Browser persistence does not provide synchronization or replace a user account.

## Inferring progress from unlocked achievements

`inferProgress` accepts timestamped unlock events and a curated map of narrative milestones. It selects the most advanced known milestone; a newer optional achievement does not erase that evidence. Missing achievements do not establish an upper bound, and the linear estimator does not handle nonlinear progression.

A result means that the player reached at least the identified stage, rather than establishing an exact current location. Confidence describes the milestone evidence: it is high when that milestone is the latest unlock and is explicitly associated with the selected playthrough. Account history, newer non-narrative unlocks, and simultaneous unlocks produce medium confidence. Without valid evidence, the result is unknown.

Events without an explicit playthrough association represent account history. They do not establish the current save's position, especially when replaying a game. Estimates always require confirmation and never update `PlayerProgress` or independently trigger expiration warnings.

Results contain stage indices and reason codes rather than achievement names, icons, or descriptions. A future interface must use stage labels appropriate for the selected spoiler level. Demo mappings are kept separate from verified mappings. The sample uses an entirely fictional game and does not attribute real milestones to Persona 3 Reload.

The estimator is implemented and tested as a domain function. Steam event ingestion and a suggestion confirmation panel are not connected yet. The current checklist records neither unlock timestamps nor playthrough identity, so it is not used to fabricate an unlock history.

## Incremental scope and validation

The dashboard and library form the first stage's core. Game details and guides provide basic flows for exercising the models and navigation, without verified game content or advanced narrative rules. Unverified time and playthrough estimates are omitted.

Tests cover behavior that affects the product: fictional objective windows, corrupt persisted state, compatibility with existing storage, catalog filtering, inference boundaries, and the absence of spoilers from initial HTML. The production build checks TypeScript. Interactive visual and accessibility verification remain pending.

Flask, PostgreSQL with SQLAlchemy, Steam OpenID, and the Steam Web API are future integration points. No backend or authentication flow is simulated in this stage.
