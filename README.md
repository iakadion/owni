# OWNI — Pro Max Gallery

A **Pro Max responsive web/mobile gallery component** with a high-end premium aesthetic, luxurious dark-mode design, innovative glassmorphism UI/UX, and polished platform-native interactions.

## Features

- **Sleek Dark-Mode Interface** — Deep blacks, graphite, charcoal, and subtle metallic silver highlights
- **Glassmorphism Design** — Refined glass panels, cards, and layers with backdrop blur effects
- **Grid & Masonry Layouts** — Adaptive responsive columns (1–4) based on viewport width
- **Media Type Filtering** — Filter by All, Sites, Apps, Tools, and Components with category counters
- **Video Cards** — Recorded app demos, site walkthroughs, and tool screen recordings with format badges, duration, dimensions, and file size metadata
- **Audio Cards** — Dynamic waveform visualization, animated waveform bars, progress bars with gradient fills, and playback state toggling
- **Image Cards** — Aspect ratio variants (tall, normal, wide), format badges, and lightbox zoom
- **Lightbox Modal** — Backdrop blur, keyboard Escape close, click-outside close, video preview, audio waveform player, and full image view
- **Drag-and-Drop Upload** — Dashed border zone with hover highlight, drop activation, and multi-format badge display
- **Microinteractions** — Hover scale effects, overlay gradients, play button overlays, staggered entry animations, toast notifications, like toggle with heart state, and smooth transitions

## Tech Stack

| Technology | Purpose |
|---|---|
| **TypeScript** | Type-safe development |
| **React 19** | UI component library |
| **Vite 6** | Build tool and dev server |
| **Framer Motion** | Animations and transitions |
| **Lucide React** | Icon system |
| **Biome** | Linting and formatting |

## Project Structure

```
owni/
├── index.html              # Entry HTML
├── vite.config.ts          # Vite configuration
├── tsconfig.json           # TypeScript config
├── tsconfig.node.json      # Node TypeScript config
├── biome.json              # Biome linter/formatter config
├── package.json            # Dependencies and scripts
└── src/
    ├── main.tsx            # App entry point
    ├── App.tsx             # Root component
    ├── components/
    │   ├── index.ts        # Barrel exports
    │   ├── Header.tsx      # Brand header with search
    │   ├── FilterBar.tsx   # Category filter pills
    │   ├── MasonryGrid.tsx # Responsive grid layout
    │   ├── VideoCard.tsx   # Video media card
    │   ├── AudioCard.tsx   # Audio card with waveform
    │   ├── ImageCard.tsx   # Image card with aspect ratios
    │   ├── Lightbox.tsx    # Fullscreen modal viewer
    │   ├── UploadZone.tsx  # Drag-and-drop upload
    │   └── Toast.tsx       # Toast notifications
    ├── hooks/
    │   └── useGallery.ts   # Gallery state management
    ├── types/
    │   ├── index.ts        # Type barrel exports
    │   └── gallery.ts      # Type definitions
    ├── data/
    │   └── galleryData.ts  # Mock gallery data
    ├── styles/
    │   └── globals.css     # Global styles and CSS variables
    └── utils/
        └── helpers.ts      # Utility functions
```

## Getting Started

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview

# Lint and format
pnpm lint
```

## License

Apache License 2.0