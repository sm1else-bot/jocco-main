# Jocco

A minimalist, themeable Kanban board with AI-assisted ticket authoring. No backend, no accounts - everything lives in your browser.

## Features

### Board
- Drag-and-drop tickets between columns to update status
- Switch to **column drag mode** to reorder the board itself
- Up to 7 columns - add, rename, recolor, or delete with safety confirmation
- Board name auto-generates ticket ID prefixes (e.g. "My Board" → `MB-001`)
- Live search across ticket title, description, and ID

### Tickets
- **Markdown descriptions** rendered inline
- **AI description generation** - give it a title, get a full user story + acceptance criteria
- Checklists with a live progress bar
- Links (right-click a link to rename it)
- Comments with timestamps
- Assignee, priority, story points, start/end dates, vibrant accent color
- Archive instead of delete - restore anytime from the Archive view

### Themes
Seven distinct visual modes, switchable at runtime:

| Theme | Vibe |
|---|---|
| **Classic** | Clean, neutral - light/dark mode supported |
| **Bento** | Bold borders, high contrast - light/dark mode supported |
| **Glass** | Frosted blur with floating animated shapes |
| **Terminal** | Green-on-black monospace hacker aesthetic |
| **Warm** | Soft amber tones, rounded corners |
| **Ocean** | Deep navy + cyan glow |
| **Brutalist** | Thick black borders, yellow accents, shadow offsets |

### AI Integration
Optional - enable in **Menu → AI Settings**. Supports:
- **Lava** (DeepSeek Chat) - routed through a dev proxy to avoid CORS
- **OpenAI** (GPT-4o mini)
- **Anthropic** (Claude Haiku)

API keys are stored in `localStorage` only. Nothing is sent anywhere other than the chosen AI provider.

## Stack

- **React 19** + Create React App
- **TailwindCSS 3**
- **react-markdown** for ticket description rendering
- **localStorage** for all persistence (no backend)

## Running Locally

```bash
cd jocco-app
npm install
npm start
```

Opens at `http://localhost:3000`.

## Notes

- The Lava API proxy is configured in `src/setupProxy.js` - required in dev to avoid CORS on Lava requests. In production, configure a reverse proxy or switch to OpenAI/Anthropic which support direct browser calls.
- Firebase is listed as a dependency but is not currently wired up.
- Click the Jocco logo 5 times for a surprise.
