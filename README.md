# ChessMind - Advanced Chess UI

A production-ready, responsive chess interface built with React, TypeScript, and modern web technologies. This is a **UI-only** implementation with clean integration points for connecting your AI backend.

## 🎯 Features

- **Modern Chess Interface**: Smooth drag-and-drop gameplay with visual feedback
- **AI-Ready Architecture**: Clean adapter interfaces for engine integration
- **Accessibility First**: WCAG AA compliant with keyboard navigation
- **Theme Support**: Beautiful light/dark themes
- **Sound System**: Contextual audio feedback for moves
- **Time Controls**: Configurable time limits with increment support
- **Move History**: Full game notation with navigation
- **Responsive Design**: Works seamlessly on desktop and mobile

## 🏗️ Tech Stack

- **React 18** + **TypeScript** - Type-safe UI components
- **Vite** - Lightning-fast development
- **Tailwind CSS** - Utility-first styling with custom design system
- **shadcn/ui** - Accessible component library
- **Zustand** - Lightweight state management
- **chess.js** - Move validation (client-side only)
- **Framer Motion** - Smooth animations
- **Lucide React** - Beautiful icons

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 🔌 Backend Integration

The UI provides clean integration points in `src/lib/engineAdapters/`:

### Engine API
Connect your chess engine to provide moves:

```typescript
// src/lib/engineAdapters/types.ts
interface EngineAPI {
  getBestMove(fen: string, moveHistory: string[], targetElo?: number): Promise<AIMoveResponse>;
  newGame(opts: GameOptions): Promise<void>;
  abort(): Promise<void>;
}
```

### Learning API
Record games and positions for training:

```typescript
interface LearningAPI {
  recordGame(pgn: string, result: GameResult, meta?: Record<string, unknown>): Promise<void>;
  recordPosition(fen: string, outcome?: GameResult): Promise<void>;
}
```

### Implementation Steps

1. Replace `MockEngineAdapter` in `src/lib/engineAdapters/mockEngine.ts` with your AI backend
2. Replace `MockLearningAdapter` in `src/lib/engineAdapters/mockLearning.ts` with your telemetry system
3. Update the store at `src/store/gameStore.ts` to use your adapters

Example:
```typescript
// Replace mock with your implementation
import { myRealEngine } from './myEngineAdapter';
// Use in store instead of mockEngine
```

## 🎨 Design System

The project uses a semantic design system defined in:
- `src/index.css` - CSS custom properties
- `tailwind.config.ts` - Tailwind configuration

Key design tokens:
- Primary: Deep blue (#2563eb) - Chess sophistication
- Secondary: Purple (#7c3aed) - Premium feel  
- Accent: Amber (#f59e0b) - Active elements
- Board colors, highlights, and semantic states

## 🎵 Sound System

Sound files are located in `public/sounds/`. Replace placeholder comments with actual audio files:

- `move.mp3` - Regular move
- `capture.mp3` - Piece captured
- `check.mp3` - King in check
- `checkmate.mp3` - Game-ending checkmate
- `illegal.mp3` - Invalid move attempt
- `game-start.mp3` - New game
- `game-end.mp3` - Game conclusion
- `notify.mp3` - General notification

## ⌨️ Keyboard Navigation

- **Tab/Shift+Tab**: Navigate between squares
- **Enter/Space**: Select piece or make move
- **Arrow Keys**: Navigate squares
- **Escape**: Deselect piece

## 🎯 Target Elo Configuration

The UI includes a slider for "Target Elo" (1000-3000). This is currently UI-only and will be passed to your engine adapter when you connect your backend.

## 📝 Game State

Game state is managed with Zustand in `src/store/gameStore.ts`:

```typescript
const { chess, makeMove, newGame, resign } = useGameStore();
```

## 🔧 Customization

### Themes
Modify design tokens in `src/index.css` to match your brand

### Piece Sets
Extend `PieceTheme` type in `src/store/gameStore.ts` and implement rendering in `ChessPiece.tsx`

### Board Themes  
Add themes in store and apply via CSS custom properties

## 🚢 Deployment

```bash
npm run build
# Deploy the 'dist' folder to your hosting service
```

## 📄 License

MIT License - See LICENSE file for details

## 🤝 Contributing

Contributions welcome! This is a UI-only implementation, so focus on:
- Accessibility improvements
- Visual enhancements
- Animation refinements
- Additional themes
- Bug fixes

## 📞 Support

For issues or questions, please open a GitHub issue.

---

**Note**: This is a UI-only implementation. Connect your chess engine and learning backend to enable full functionality.
