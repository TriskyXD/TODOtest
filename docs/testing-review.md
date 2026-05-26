# Testing & Code Review

There are three main ways to verify your code quality when building with Claude.
Each works at a different level — they complement each other rather than replace each other.

---

## 1. Playwright — end-to-end testing

[playwright.dev](https://playwright.dev/)

Playwright is an automated testing framework that controls a real browser and simulates
user interactions. You write tests that describe what a user does — click a button, fill
a form, navigate to a page — and Playwright checks that the app responds correctly.

### How it works

1. You write a test file describing a user flow:
```ts
test('user can create a task', async ({ page }) => {
  await page.goto('http://localhost:3000')
  await page.fill('[placeholder="Task title"]', 'Buy groceries')
  await page.click('button:has-text("Add Task")')
  await expect(page.getByText('Buy groceries')).toBeVisible()
})
```
2. Playwright opens a real browser (Chromium, Firefox, or WebKit)
3. It executes every step and checks the assertions
4. If anything fails, it reports exactly which step broke and why — with a screenshot

### What it catches
- Broken user flows (clicking a button does nothing)
- API integration issues (data not saving or loading)
- Navigation bugs (wrong page after an action)
- Regressions (a change broke something that used to work)

### What it does NOT catch
- Code quality or structure issues
- Accessibility problems in the source
- Missing edge case handling in components
- Hardcoded values or bad patterns

### When to use it
Playwright is most valuable once your app has stable, defined user flows.
Add it when you find yourself manually clicking through the same steps
after every change to make sure nothing broke.

---

## 2. `/review` — Claude code review

The `/review`  command asks Claude to review the current git diff
as a senior engineer looking for correctness bugs.

### How to use it

Just type in the Claude Code chat:
```
/review
```

You can also control the effort level:
```
/review --effort low      # fewer, high-confidence findings only
/review --effort high     # broader coverage, may include uncertain findings
```

And post findings directly as inline PR comments:
```
/review --comment
```

### What it catches
- Logic bugs and incorrect behaviour
- Unsafe or broken patterns introduced in the diff
- Issues with the specific changes you just made

### What it does NOT catch
- Existing issues in code you didn't touch
- Runtime behaviour (use Playwright for that)

### When to use it
Run `/review` before opening a pull request or committing a significant change.
It's the fastest way to get a second pair of eyes on what you just wrote.

---

## 3. Custom rule files — optional deep audit

This project does not include custom rule files, but it is worth knowing they exist as an option.

You can create a markdown checklist file anywhere in your project — for example
`.claude/rules/refactor-component.md` — and ask Claude to run it against a specific file:

```
Run `.claude/rules/refactor-component.md` on src/components/TodoItem.tsx
```

Claude will read the checklist and go through every point, returning findings with priorities.

### What they are good for
- Accessibility issues (missing labels, wrong ARIA roles)
- Design token usage vs hardcoded values
- Component structure and single responsibility
- Edge cases and missing states

### When to consider adding them
Custom rules make the most sense on larger projects where you want a consistent,
repeatable audit process across multiple developers. For day-to-day work,
`/review` is usually enough.

---

## When to use what

| | Playwright | `/review` | Rule files |
|---|---|---|---|
| Catches broken behaviour | ✅ | ✗ | ✗ |
| Catches code quality issues | ✗ | ✅ | ✅ |
| Catches accessibility issues | partial | partial | ✅ |
| Runs automatically | ✅ (CI) | on demand | on demand |
| Best used | after building a feature | before committing | before a refactor |
