<!-- Generated: concise, actionable instructions for AI coding agents working on this repo -->

# Copilot instructions — nextjs-vercel-template

This file gives focused, actionable knowledge to AI coding agents so they can be productive immediately in this repository.

Summary

- Project: Next.js (App Router) + Tailwind starter template created with create-next-app.
- Language: TypeScript + React (JSX/TSX). Next version pinned in package.json ("next": "16.0.0").
- Key dirs: `app/` (pages/layout), `public/`, `config/` (guidelines).

Quick workflow (commands)

- Dev server: `npm run dev` (runs `next dev`).
- Build: `npm run build` (runs `next build`).
- Start production server: `npm run start` (runs `next start`).
- Lint: `npm run lint` (runs `eslint`).
- Format: `npm run format` (runs `prettier --write .`).

Big-picture architecture notes

- App Router: the project uses Next.js App Router (`app/` directory). Root layout is at `app/layout.tsx` and the top-level page at `app/page.tsx`.
- Styling: Tailwind CSS is used (see `app/globals.css` and `postcss.config.mjs`). Global fonts are loaded via `next/font/google` in `app/layout.tsx`.
- Types & TS config: `tsconfig.json` enables strict mode and maps `@/*` to `./*`. Treat TypeScript as authoritative for public APIs.

Project-specific conventions (do not invent practices)

- Font variables: `app/layout.tsx` defines CSS variables `--font-geist-sans` and `--font-geist-mono`. Preserve this pattern when adding global styles.
- CSS theme tokens: `app/globals.css` defines `--background` / `--foreground` and uses `@theme inline`. When changing colors, update these tokens instead of sprinkling literals.
- ESLint: `eslint.config.mjs` composes Next.js rules and overrides global ignores. Use project's ESLint config; do not add duplicate ignore patterns.
- Paths: Use `@/*` import alias per `tsconfig.json` when adding same-repo imports.

Code patterns & examples

- Root layout: prefer server components for layout-level code. Example: `app/layout.tsx` exports `metadata` and a default `RootLayout` that returns `<html><body>{children}</body></html>`.
- Pages: `app/page.tsx` is a client-rendered page with React components and `next/image` usage. Keep image `width`/`height` and `priority` props consistent with existing patterns.
- Global CSS import: `app/layout.tsx` imports `./globals.css`. Add any global style changes there.

Integration & external dependencies

- Vercel: README references Vercel deployment as the intended deployment platform. Keep serverless-friendly patterns and avoid adding long-running processes to server code.
- Fonts: `next/font/google` is used (Geist family). When adding other fonts, prefer `next/font` where possible.

Developer workflows & expectations

- Preserve small, incremental changes. The repo's `config/GUIDELINES.md` emphasizes minimal, well-scoped commits and clear commit messages (conventional commit prefixes like `feat:, fix:, docs:, test:, refactor:, chore:`).
- Security: secrets and API keys must be handled via environment variables — assume runtime environment (Vercel) provides them.

What to do when making changes

- Update `README.md` for any user-facing commands or setup steps you alter.
- If you change global styles, update `app/globals.css` tokens and mention the change in the commit message.
- If adding dependencies, ensure package manager lockfiles are updated and include reasoning in the commit message per `config/GUIDELINES.md`.

Files to inspect first for most tasks

- `app/layout.tsx` — root layout, global font usage, and metadata.
- `app/page.tsx` — example page, component patterns, Tailwind classes.
- `app/globals.css` — theme tokens and Tailwind import.
- `tsconfig.json` — path aliases and strict settings.
- `eslint.config.mjs` — linting rules and ignores.
- `config/GUIDELINES.md` — repo-specific development guidelines.

Examples of small edits

- Add a new page route: create `app/about/page.tsx` exporting a default React component. Follow `app/page.tsx` conventions and import global styles via layout.
- Add a small UI component: create `components/ExampleButton.tsx` using TypeScript props, export as default, and consume it in `app/page.tsx`.

Edge cases & limitations

- This repository is a minimal starter. It may not include tests or CI config. Do not assume existing test harnesses.
- Do not modify `next.config.ts` unless addressing a clear requirement — it's currently empty and may be intentionally minimal.

If you need more context

- Open `config/GUIDELINES.md` for developer expectations and commit rules.
- Check `package.json` for pinned dependency versions.

Feedback
Please review these instructions and tell me if you want more detail about build/CI, testing, or deployment-specific steps. I'll iterate accordingly.
