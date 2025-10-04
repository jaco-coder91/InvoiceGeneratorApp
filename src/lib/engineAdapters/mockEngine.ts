import { Chess } from "chess.js";
import { EngineAPI, AIMoveResponse } from "./types";

/**
 * Mock Engine Adapter - Returns random legal moves
 * Replace this with your actual AI backend integration
 */
export class MockEngineAdapter implements EngineAPI {
  private aborted = false;

  async getBestMove(
    fen: string,
    moveHistorySAN: string[],
    targetElo?: number,
    timeMs?: number
  ): Promise<AIMoveResponse> {
    this.aborted = false;

    // Simulate thinking time
    const thinkTime = Math.random() * 1000 + 500;
    await new Promise((resolve) => setTimeout(resolve, thinkTime));

    if (this.aborted) {
      throw new Error("Move calculation aborted");
    }

    // Get random legal move using chess.js
    const chess = new Chess(fen);
    const moves = chess.moves({ verbose: true });
    
    if (moves.length === 0) {
      throw new Error("No legal moves available");
    }

    const randomMove = moves[Math.floor(Math.random() * moves.length)];

    return {
      move: {
        from: randomMove.from,
        to: randomMove.to,
        promotion: randomMove.promotion as "q" | "r" | "b" | "n" | undefined,
      },
      thinkingTimeMs: thinkTime,
      evaluationCp: Math.floor(Math.random() * 200 - 100), // Random eval
      pv: [randomMove.san],
    };
  }

  async newGame(opts: { 
    whiteIsHuman: boolean; 
    blackIsHuman: boolean; 
    startFEN?: string; 
    time?: { baseMin: number; incrementSec: number }; 
    targetElo?: number 
  }): Promise<void> {
    console.log("MockEngine: New game started", opts);
  }

  async abort(): Promise<void> {
    this.aborted = true;
    console.log("MockEngine: Move calculation aborted");
  }
}

export const mockEngine = new MockEngineAdapter();
