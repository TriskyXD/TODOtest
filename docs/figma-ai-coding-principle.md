# App Development with Claude + Figma MCP — PRD Guide

This document is a **general template** for planning and building an app using
Claude Code and Figma MCP. Fill in each section before you start coding —
the more detail you put in here, the better Claude can help you build it.

> This is not specific to any one project. It is a reusable guide for any app.

> **How Claude reads this:** Claude Code automatically reads `CLAUDE.md` every session.
> In this project, `CLAUDE.md` contains a link to this file — so Claude reads it too,
> automatically, every time. That means your product context, target user, features and
> tech stack are always loaded without you having to mention them.

---

## 1. Overview

A short introduction to the app — what it does, why it exists, and what problem it solves at a high level. Think of this as the elevator pitch.

> Example: "A task management app that lets users create, organise, and track
> their daily to-dos with a clean, minimal interface."

---

## 2. Target User

Who will use this app? Describe the primary user persona.

- **Role / background** — e.g. student, freelancer, small business owner
- **Technical level** — e.g. non-technical, comfortable with web apps
- **Main goal** — what does the user want to achieve?
- **Pain points** — what frustrates them with existing solutions?

---

## 3. Problem Statement

What specific problem are we solving? Why does this problem need an app?
Keep it to 2–3 sentences — if you can't explain the problem clearly, the
solution will be unclear too.

---

## 4. Core Features

What must the app do? These are the non-negotiables — the features that make
the app useful. Keep this list short and focused.

- Feature 1
- Feature 2
- Feature 3

---

## 5. Out of Scope

What will **not** be built in this version? Being explicit prevents scope creep and helps Claude know what not to implement.

- Not building X
- No Y functionality
- Z is a future consideration

---

## 6. Tech Stack

What technologies will be used? Fill this in before starting — Claude will use this context when generating code.

| Layer | Technology |
|-------|------------|
| Frontend | e.g. React + Vite + TypeScript |
| Styling | e.g. Tailwind CSS + Untitled UI |
| Backend | e.g. Go / Node.js / Python |
| Database | e.g. PostgreSQL / MS SQL / SQLite |
| Design | Figma |
| AI coding | Claude Code + Figma MCP |

---

## 7. Screens

List all screens the app will have. Each screen has its own detailed doc
that describes its purpose, user flows, layout, components, states, and edge cases.

When working with Claude + Figma MCP, each screen doc becomes your briefing before you ask Claude to generate the components for that screen.

List your screens here and link each one to its own doc. Use [`screens/_template.md`](screens/_template.md)
as the starting point for every new screen.

---

Once this document is filled in, head back to the [workflow guide](figma-ai-coding-intro.md)
and start generating components from your Figma design.
