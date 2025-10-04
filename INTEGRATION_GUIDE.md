# Backend Integration Guide

This guide explains how to connect your chess AI backend to the UI.

## 🔌 Integration Points

All adapter interfaces are located in `src/lib/engineAdapters/`.

### 1. Engine Adapter

Replace `MockEngineAdapter` in `src/lib/engineAdapters/mockEngine.ts` with your AI implementation.

#### Example: REST API Backend

```typescript
import { Chess } from "chess.js";
import { EngineAPI, AIMoveResponse } from "./types";

export class MyEngineAdapter implements EngineAPI {
  private apiUrl = "https://your-api.com";
  private abortController: AbortController | null = null;

  async getBestMove(
    fen: string,
    moveHistorySAN: string[],
    targetElo?: number,
    timeMs?: number
  ): Promise<AIMoveResponse> {
    this.abortController = new AbortController();

    const response = await fetch(`${this.apiUrl}/get-move`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fen, moveHistory: moveHistorySAN, targetElo, timeMs }),
      signal: this.abortController.signal,
    });

    if (!response.ok) {
      throw new Error(`Engine API error: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      move: data.move, // { from: "e2", to: "e4", promotion?: "q" }
      thinkingTimeMs: data.thinkingTime,
      evaluationCp: data.evaluation, // centipawns (100 = 1 pawn advantage)
      pv: data.principalVariation, // ["e4", "e5", "Nf3"]
    };
  }

  async newGame(opts): Promise<void> {
    await fetch(`${this.apiUrl}/new-game`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(opts),
    });
  }

  async abort(): Promise<void> {
    if (this.abortController) {
      this.abortController.abort();
    }
  }
}

export const myEngine = new MyEngineAdapter();
```

#### Example: WebSocket Backend

```typescript
export class WebSocketEngineAdapter implements EngineAPI {
  private ws: WebSocket;
  private movePromise: Promise<AIMoveResponse> | null = null;
  private moveResolve: ((move: AIMoveResponse) => void) | null = null;

  constructor() {
    this.ws = new WebSocket("wss://your-api.com/chess");
    
    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (data.type === "move" && this.moveResolve) {
        this.moveResolve({
          move: data.move,
          thinkingTimeMs: data.thinkingTime,
          evaluationCp: data.evaluation,
          pv: data.pv,
        });
      }
    };
  }

  async getBestMove(
    fen: string,
    moveHistorySAN: string[],
    targetElo?: number,
    timeMs?: number
  ): Promise<AIMoveResponse> {
    return new Promise((resolve) => {
      this.moveResolve = resolve;
      this.ws.send(JSON.stringify({
        type: "get-move",
        fen,
        moveHistory: moveHistorySAN,
        targetElo,
        timeMs,
      }));
    });
  }

  async newGame(opts): Promise<void> {
    this.ws.send(JSON.stringify({ type: "new-game", ...opts }));
  }

  async abort(): Promise<void> {
    this.ws.send(JSON.stringify({ type: "abort" }));
  }
}
```

### 2. Learning Adapter

Replace `MockLearningAdapter` in `src/lib/engineAdapters/mockLearning.ts`.

#### Example Implementation

```typescript
import { LearningAPI, GameResult } from "./types";

export class MyLearningAdapter implements LearningAPI {
  private apiUrl = "https://your-api.com";

  async recordGame(
    pgn: string,
    result: GameResult,
    meta?: Record<string, unknown>
  ): Promise<void> {
    await fetch(`${this.apiUrl}/games`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pgn,
        result,
        meta: {
          ...meta,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
        },
      }),
    });
  }

  async recordPosition(
    fen: string,
    outcome?: GameResult
  ): Promise<void> {
    // Batch positions to reduce API calls
    await fetch(`${this.apiUrl}/positions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fen, outcome }),
    });
  }
}

export const myLearning = new MyLearningAdapter();
```

### 3. Update the Store

In `src/store/gameStore.ts`, replace the mock imports:

```typescript
// Replace these lines:
import { mockEngine } from "@/lib/engineAdapters/mockEngine";
import { mockLearning } from "@/lib/engineAdapters/mockLearning";

// With:
import { myEngine } from "@/lib/engineAdapters/myEngine";
import { myLearning } from "@/lib/engineAdapters/myLearning";

// Then replace all instances of `mockEngine` with `myEngine`
// and `mockLearning` with `myLearning` in the file
```

## 🎯 Expected API Responses

### Get Best Move Response

```json
{
  "move": {
    "from": "e2",
    "to": "e4",
    "promotion": null  // or "q", "r", "b", "n" for pawn promotion
  },
  "thinkingTimeMs": 1250,
  "evaluationCp": 35,  // centipawns (positive = white advantage)
  "pv": ["e4", "e5", "Nf3", "Nc6"]  // principal variation
}
```

### Error Handling

Your backend should return appropriate HTTP status codes:

- `200 OK` - Success
- `400 Bad Request` - Invalid FEN, illegal move, etc.
- `408 Request Timeout` - Engine took too long
- `500 Internal Server Error` - Engine crashed

## 🔒 Security Considerations

### API Keys

Store sensitive data in environment variables:

```typescript
const API_KEY = import.meta.env.VITE_CHESS_API_KEY;

const response = await fetch(apiUrl, {
  headers: {
    "Authorization": `Bearer ${API_KEY}`,
    "Content-Type": "application/json"
  }
});
```

### Rate Limiting

Implement client-side rate limiting to avoid overwhelming your backend:

```typescript
class RateLimitedEngine implements EngineAPI {
  private lastCallTime = 0;
  private minInterval = 100; // ms between calls

  async getBestMove(...args) {
    const now = Date.now();
    const timeSinceLastCall = now - this.lastCallTime;
    
    if (timeSinceLastCall < this.minInterval) {
      await new Promise(resolve => 
        setTimeout(resolve, this.minInterval - timeSinceLastCall)
      );
    }
    
    this.lastCallTime = Date.now();
    return this.actualGetBestMove(...args);
  }
}
```

## 📊 Telemetry Examples

### Game Metadata

When recording games, include useful metadata:

```typescript
await myLearning.recordGame(chess.pgn(), result, {
  targetElo: 2600,
  playerColor: "white",
  timeControl: "10+0",
  openingPlayed: detectOpening(moveHistory),
  averageMoveTime: calculateAverageMoveTime(),
  browserInfo: navigator.userAgent,
  timestamp: new Date().toISOString(),
});
```

### Position Analysis

Record interesting positions for training:

```typescript
// Record positions where the player made a blunder
if (evaluationDroppedBy(300)) { // 3 pawns worse
  await myLearning.recordPosition(fen, outcome);
}

// Record tactical positions
if (isTacticalPosition(fen)) {
  await myLearning.recordPosition(fen);
}
```

## 🧪 Testing

Test your adapters independently:

```typescript
// test/engineAdapter.test.ts
import { myEngine } from "@/lib/engineAdapters/myEngine";

describe("Engine Adapter", () => {
  it("should return a legal move", async () => {
    const response = await myEngine.getBestMove(
      "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
      [],
      2600
    );
    
    expect(response.move).toBeDefined();
    expect(response.move.from).toMatch(/^[a-h][1-8]$/);
    expect(response.move.to).toMatch(/^[a-h][1-8]$/);
  });
});
```

## 🚀 Going to Production

1. **Replace mock adapters** with your implementations
2. **Add error boundaries** to handle API failures gracefully
3. **Implement retry logic** for transient failures
4. **Add loading states** for better UX
5. **Monitor API performance** and adjust timeouts
6. **Set up analytics** to track usage patterns

## 📚 Additional Resources

- [chess.js Documentation](https://github.com/jhlywa/chess.js)
- [UCI Protocol](https://www.chessprogramming.org/UCI) (if using a UCI engine)
- [Stockfish](https://stockfishchess.org/) (open-source chess engine)
- [Python-chess](https://python-chess.readthedocs.io/) (for Python backends)

## 🆘 Troubleshooting

### Common Issues

**"Illegal move" errors**
- Ensure your backend validates moves using a proper chess library
- Check that FEN strings are correctly formatted

**Slow response times**
- Implement move caching for repeated positions
- Use iterative deepening to return moves faster
- Consider using opening books for early game

**WebSocket disconnects**
- Implement automatic reconnection
- Add heartbeat/ping-pong mechanism
- Handle connection errors gracefully

---

Need help? Check the main README.md or open an issue on GitHub.
