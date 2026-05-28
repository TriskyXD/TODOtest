# Using AI to Code from a Figma Design

This guide explains how to use Claude Code with the Figma MCP integration to turn
Figma designs into real, reusable React components — no Pro plan required.

---

## How it works

> **Important:** Claude Code automatically reads `CLAUDE.md` at the root of your project
> every single session before you type anything. This means any context you put there —
> architecture, conventions, design rules, product description — is always available to Claude
> without you having to repeat it. Think of it as a permanent briefing file.

Claude Code connects to Figma through an **MCP (Model Context Protocol)** server.
This means Claude can read your Figma files directly — inspecting frames, components,
colours, spacing, and more — and use that information to generate matching code.

You stay in your editor the whole time. No copy-pasting CSS, no guessing hex values.

---

## Option A vs Option B — what's the difference?

There are two ways to bridge Figma and code. This project uses **Option A**.

### Option A — Design → Code ✅ used in this project

> A developer reads a Figma design and generates React components from it.

- **Direction:** Figma → your codebase
- **Who benefits:** Developers
- **Figma plan:** Free (Starter) — no paid plan needed
- **What you get:** Reusable React components generated from your designs

**Use this when:**
- You are building from a designer's mockup
- You are on a free or Starter Figma plan
- You want to own the components directly in your codebase

---

### Option B — Code → Figma

> A developer links existing React components back into Figma so designers see real code in Dev Mode.

- **Direction:** your codebase → Figma
- **Who benefits:** Designers inspecting in Figma Dev Mode
- **Figma plan:** Pro (Dev Mode is a paid feature)
- **What you get:** Your actual component code shown inside Figma instead of auto-generated snippets

**Use this when:**
- You have a larger team with a dedicated designer
- Designers need to inspect designs and see your real component code
- You are on a Pro Figma plan

---

## Prerequisites

- A [Figma](https://figma.com) account with at least **view access** to the file you want to use
- [Node.js](https://nodejs.org/) installed (needed for Claude Code)
- A React project set up and running locally

---

## Setup — first time only

If you are using this project, the Figma MCP is already configured. If you are
starting a new project from scratch, follow these steps once.

### 1. Install Claude Code

Claude Code is a CLI tool you run in your terminal alongside your editor.

```bash
npm install -g @anthropic-ai/claude-code
```

Then start it in your project folder:

```bash
claude
```

### 2. Add the Figma MCP

Inside Claude Code, run:

```bash
claude mcp add --transport http figma https://mcp.figma.com/mcp
```

This registers the Figma MCP server so Claude can read your Figma files.
You only need to do this once — it saves to your Claude Code config automatically.

> Official Figma MCP documentation
> For more details about authentication, permissions, troubleshooting, and supported features, see the official Figma guide:
> https://help.figma.com/hc/en-us/articles/32132100833559-Guide-to-the-Figma-MCP-server

### 3. Authenticate with Figma

The first time Claude tries to access a Figma file it will prompt you to log in.
Follow the browser flow and grant access. After that, authentication is automatic.

### 4. Verify it works

Ask Claude:

> "Who am I logged in as on Figma?"

If it returns your name and email, you are connected and ready to go.

---

## Step-by-step workflow

> **Before you start:** it helps to plan your app first — what screens it has, what each
> screen needs, and what components you will build. Use the
> [App development PRD guide](figma-ai-coding-principle.md) as a starting point.

### 1. Open your Figma file
Navigate to the frame or component you want to implement.

### 2. Copy the URL
Copy the full Figma URL from your browser. It looks like:
```
https://www.figma.com/design/XXXXXXXXXXXX/My-Design?node-id=1-2
```
The `node-id` parameter tells Claude exactly which frame to read.

To get the node-specific URL, right-click a frame in Figma and choose **Copy link**:

![Figma frame with Copy link highlighted](assets/image.png)

*The screenshot above shows the actual TODOTest frame used in this project — notice "Copy link" highlighted in the context menu. That URL is what you paste into Claude.*

### 3. Ask Claude to generate the component
Paste the URL into the Claude Code chat and describe what you want:

> "Read this Figma frame and generate a React + Tailwind component for it:
> https://www.figma.com/design/..."

Claude will:
1. Fetch the design from Figma
2. Inspect colours, typography, spacing, and layout
3. Generate a typed React component that matches

### 4. Review and save
The component lands in `src/components/`. Review it, adjust any details,
and it is ready to import and reuse anywhere in the app.

---

## Tips

- **Reuse, don't regenerate** — once a component exists in `src/components/` you
  never need to go back to Figma for it. Just import it.
- **Iterate in chat** — if the generated component doesn't look right, describe
  what's off ("make the button full width", "use a lighter shadow") and Claude will
  update it without touching Figma again.
- **Tailwind tokens** — if your project uses design tokens in `tailwind.config.js`,
  tell Claude about them. It will prefer token names over arbitrary values.
  
