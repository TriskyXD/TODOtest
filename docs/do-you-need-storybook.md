# Storybook vs Untitled UI — Explained

---

## Why you probably don't need Storybook if you use Untitled UI

This project uses **Untitled UI** — a comprehensive, production-ready Figma UI kit that
comes with a fully documented design system out of the box. Every component, variant,
state, colour token, and spacing rule is already defined and browsable inside Figma.

That is exactly what Storybook is normally used for — and since Untitled UI already covers it on the design side, adding Storybook on top would mostly be duplicating work
that already exists.

When you use Claude + Figma MCP to generate React components from Untitled UI frames,
you are implementing a system that is already designed and documented. You don't need
a second tool to document it again in code.

**In short: Untitled UI is your design system. You don't need Storybook to replace it.**

---

## When Storybook does make sense alongside Untitled UI

The moment you start building **custom components that go beyond what Untitled UI provides**,
the situation changes. If your app needs something Untitled UI doesn't have — a specialised
chart, a unique input pattern, a project-specific card layout — those custom components
have no Figma documentation backing them up.

That's where Storybook becomes useful again:

- Your custom components are documented and browsable in one place
- All their states (loading, error, empty, etc.) are explicitly defined
- Other developers can see what exists before building something new
- Designers can review the implementation without running the app

So the rule of thumb is: **use Untitled UI as your foundation, and reach for Storybook
only when you start building significantly beyond it.**

---

## What Storybook is

[storybook.js.org](https://storybook.js.org/)

Storybook is an open-source tool for building and documenting UI components in isolation —
outside of your actual app. Each component gets its own "stories" — small files that render
the component in a specific state (default, disabled, loading, error, etc.). Storybook
collects all these stories and presents them in a browsable interface, separate from the
rest of your app.

Think of it as a living style guide for your code components — the equivalent of what
Untitled UI is for your Figma designs.

---

## How it would fit into a Claude + Figma MCP workflow

If you do reach the point of building custom components, the workflow with Storybook looks like this:

1. Claude reads a Figma frame and generates the custom component
2. You add a story file covering the component's key states
3. The component is visible and reviewable in Storybook before it touches any screen
4. Designers can verify it matches the design without running the app

This makes the handoff loop — Figma → Claude → Storybook → app — much tighter
and easier to catch problems early.
