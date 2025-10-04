export type Move = { 
  from: string; 
  to: string; 
  promotion?: "q" | "r" | "b" | "n" 
};

export type AIMoveResponse = { 
  move: Move; 
  thinkingTimeMs?: number; 
  evaluationCp?: number; 
  pv?: string[] 
};

export type GameResult = "white" | "black" | "draw";

export interface EngineAPI {
  getBestMove(
    fen: string, 
    moveHistorySAN: string[], 
    targetElo?: number, 
    timeMs?: number
  ): Promise<AIMoveResponse>;
  
  newGame(opts: { 
    whiteIsHuman: boolean; 
    blackIsHuman: boolean; 
    startFEN?: string; 
    time?: { baseMin: number; incrementSec: number }; 
    targetElo?: number 
  }): Promise<void>;
  
  abort(): Promise<void>;
}

export interface LearningAPI {
  recordGame(pgn: string, result: GameResult, meta?: Record<string, unknown>): Promise<void>;
  recordPosition(fen: string, outcome?: GameResult): Promise<void>;
}
