# Nano-canvas

A playground for generating images built on top of the tldraw canvas.

## Routes

`/` - marketing landing page
`/dashboard` - the root of the user's logged in experience
`/dashboard/projects`- list all the user's projects
`/dashboard/projects/:id` - the "Project" view for a given project
`/dashboard/generations` - list of all the user's generations

## Project View

The "Project" view is the main view for creating, composed of a three-panel layout:

```
+------------------+-------------------------+------------------+
|   Generations    |        Canvas           |     Generate     |
|   (Left Panel)   |       (tldraw)          |   (Right Panel)  |
|                  |                         |                  |
|  - Image list    |  - Full tldraw editor   |  [No frame]      |
|  - Download btn  |  - Built-in frame tool  |  "Select a frame"|
|  - Add to canvas |  - Auto-save to DB      |                  |
|                  |                         |  [Frame selected]|
|                  |                         |  - Frame preview |
|                  |                         |  - Prompt input  |
|                  |                         |  - Generate btn  |
+------------------+-------------------------+------------------+
```

### Left Panel - Generations

A list of past generations (images). Generations can be downloaded or added back to the canvas.

### Main Panel - Canvas

The tldraw instance. Users compose their generations within "frames" using tldraw's built-in frame tool with predefined aspect ratios.

### Right Panel - Generate (Contextual)

**Contextual to selected frame:**
- No frame selected: Empty state prompting user to select or create a frame
- Frame selected: Shows generation controls with live preview of frame contents

## Generation Workflow

1. User creates a frame and composes content inside it (sketches, shapes, images, text)
2. User selects the frame - right panel shows generation controls
3. Frame contents exported as image via tldraw's `editor.toImage()`
4. Exported image sent to Replicate Flux as reference (img2img)
5. Generated image stored in Vercel Blob, added to Generations
6. User can drag generation back onto canvas

## Aspect Ratio Presets

- 1:1 (1024x1024) - Square
- 16:9 (1344x768) - Landscape
- 9:16 (768x1344) - Portrait
- 4:3 (1152x896) - Standard
- 3:2 (1216x832) - Photo

## Architecture

- **Auth**: Clerk
- **Database**: PostgreSQL via Prisma
- **Canvas**: tldraw with database persistence
- **Image Generation**: Replicate Flux (img2img)
- **File Storage**: Vercel Blob
- **API**: tRPC

### Data Model

- Users can have multiple Projects
- Projects store tldraw snapshots (JSON) and have many Generations
- Generations track prompt, status, dimensions, and image URL
