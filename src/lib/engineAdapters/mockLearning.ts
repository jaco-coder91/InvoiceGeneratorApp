import { LearningAPI, GameResult } from "./types";

/**
 * Mock Learning API - Logs game data to console
 * Replace this with your actual learning/telemetry backend
 */
export class MockLearningAdapter implements LearningAPI {
  async recordGame(
    pgn: string,
    result: GameResult,
    meta?: Record<string, unknown>
  ): Promise<void> {
    console.log("Learning API: Recording game", {
      pgn,
      result,
      meta,
      timestamp: new Date().toISOString(),
    });

    // TODO: Send to your backend
    // await fetch('/api/games', { method: 'POST', body: JSON.stringify({ pgn, result, meta }) });
  }

  async recordPosition(
    fen: string,
    outcome?: GameResult
  ): Promise<void> {
    console.log("Learning API: Recording position", {
      fen,
      outcome,
      timestamp: new Date().toISOString(),
    });

    // TODO: Send to your backend
    // await fetch('/api/positions', { method: 'POST', body: JSON.stringify({ fen, outcome }) });
  }
}

export const mockLearning = new MockLearningAdapter();
