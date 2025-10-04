// src/store/gameStore.ts
import { create } from "zustand";
import { Chess, Square as ChessSquare } from "chess.js";

// NOTE: paths use the @ alias → src/
import { mockEngine } from "@/lib/engineAdapters/mockEngine";
import { mockLearning } from "@/lib/engineAdapters/mockLearning";
import { soundManager } from "@/lib/engineAdapters/soundManager";

export type PieceTheme = "classic" | "modern" | "minimal";
export type BoardTheme = "classic" | "blue" | "green" | "purple";
export type PlayerColor = "white" | "black";

interface GameSettings {
  pieceTheme: PieceTheme;
  boardTheme: BoardTheme;
  showCoordinates: boolean;
  animationSpeed: number; // seconds (0.25 = 250ms)
  soundEnabled: boolean;
  soundVolume: number; // 0..1
}

interface TimeControl {
  baseMinutes: number;
  incrementSeconds: number;
}

interface Clock {
  white: number; // ms remaining
  black: number; // ms remaining
  lastUpdate: number; // ts in ms
}

interface GameState {
  chess: Chess;
  selectedSquare: ChessSquare | null;
  legalMoves: ChessSquare[];
  lastMove: { from: ChessSquare; to: ChessSquare } | null;

  playerColor: PlayerColor;
  aiThinking: boolean;

  gameStarted: boolean;
  gameOver: boolean;
  gameResult: string | null;

  // Clocks / time
  timeControl: TimeControl | null;
  clock: Clock | null;
  activeColor: PlayerColor | null;

  // Settings
  settings: GameSettings;
  targetElo: number;

  // PGN/SAN history
  moveHistory: string[];
  currentMoveIndex: number;

  // Actions
  selectSquare: (square: ChessSquare) => void;
  makeMove: (from: ChessSquare, to: ChessSquare, promotion?: string) => Promise<void>;
  newGame: (opts: {
    playerColor: PlayerColor;
    timeControl?: TimeControl;
    targetElo?: number;
    startFEN?: string;
  }) => Promise<void>;
  resign: () => void;
  offerDraw: () => void;
  undo: () => void;
  flipBoard: () => void;
  updateSettings: (settings: Partial<GameSettings>) => void;
  goToMove: (index: number) => void;
  resetGame: () => void;
}

function nextPlayer(color: PlayerColor): PlayerColor {
  return color === "white" ? "black" : "white";
}

export const useGameStore = create<GameState>((set, get) => ({
  chess: new Chess(),
  selectedSquare: null,
  legalMoves: [],
  lastMove: null,

  playerColor: "white",
  aiThinking: false,

  gameStarted: false,
  gameOver: false,
  gameResult: null,

  timeControl: null,
  clock: null,
  activeColor: null,

  settings: {
    pieceTheme: "classic",
    boardTheme: "classic",
    showCoordinates: true,
    animationSpeed: 0.25,
    soundEnabled: true,
    soundVolume: 0.5,
  },
  targetElo: 2600,

  moveHistory: [],
  currentMoveIndex: -1,

  selectSquare: (square: ChessSquare) => {
    const state = get();
    if (state.gameOver || state.aiThinking) return;

    const chess = state.chess;
    const piece = chess.get(square);

    // Select own piece → show legal moves
    if (piece && piece.color === (state.playerColor === "white" ? "w" : "b")) {
      const moves = chess
        .moves({ square, verbose: true })
        .map((m) => m.to as ChessSquare);

      set({
        selectedSquare: square,
        legalMoves: moves,
      });
      return;
    }

    // If already selected, try to make that move
    if (state.selectedSquare) {
      get().makeMove(state.selectedSquare, square);
    }
  },

  makeMove: async (from: ChessSquare, to: ChessSquare, promotion?: string) => {
    const state = get();
    if (state.gameOver || state.aiThinking) return;

    // Use a working copy to validate & apply
    const chess = new Chess(state.chess.fen());

    try {
      const move = chess.move({
        from,
        to,
        promotion: promotion || "q",
      });

      if (!move) {
        soundManager.play("illegal");
        return;
      }

      // Sounds for player move
      if (chess.isCheckmate()) {
        soundManager.play("checkmate");
      } else if (chess.isCheck()) {
        soundManager.play("check");
      } else if (move.captured) {
        soundManager.play("capture");
      } else {
        soundManager.play("move");
      }

      const newHistory = [...state.moveHistory, move.san];

      set({
        chess,
        selectedSquare: null,
        legalMoves: [],
        lastMove: { from, to },
        moveHistory: newHistory,
        currentMoveIndex: newHistory.length - 1,
        gameOver: chess.isGameOver(),
        gameResult: chess.isGameOver()
          ? chess.isCheckmate()
            ? `${chess.turn() === "w" ? "Black" : "White"} wins by checkmate`
            : chess.isDraw()
            ? "Draw"
            : "Game over"
          : null,
      });

      // Learning hooks
      await mockLearning.recordPosition(chess.fen());

      // If game ended after player's move
      if (chess.isGameOver()) {
        soundManager.play("gameEnd");
        const result =
          chess.isCheckmate()
            ? chess.turn() === "w"
              ? "black"
              : "white"
            : "draw";
        await mockLearning.recordGame(chess.pgn(), result);
        return;
      }

      // AI's turn?
      const playerIsWhite = state.playerColor === "white";
      const aiToMove = chess.turn() === (playerIsWhite ? "b" : "w");
      if (aiToMove) {
        set({ aiThinking: true });

        try {
          const aiMove = await mockEngine.getBestMove(
            chess.fen(),
            newHistory,
            state.targetElo
          );

          const aiChess = new Chess(chess.fen());
          aiChess.move(aiMove.move);

          // Sound for AI move
          if (aiChess.isCheckmate()) {
            soundManager.play("checkmate");
          } else if (aiChess.isCheck()) {
            soundManager.play("check");
          } else if (aiMove.move.from && aiChess.get(aiMove.move.to as ChessSquare)) {
            // This heuristic will often be "capture"
            const last = aiChess.history({ verbose: true }).slice(-1)[0];
            if (last?.captured) soundManager.play("capture");
            else soundManager.play("move");
          } else {
            soundManager.play("move");
          }

          const aiMoves = aiChess.history({ verbose: true });
          const lastAiMove = aiMoves[aiMoves.length - 1];
          const updatedHistory = [...newHistory, lastAiMove.san];

          set({
            chess: aiChess,
            aiThinking: false,
            lastMove: {
              from: aiMove.move.from as ChessSquare,
              to: aiMove.move.to as ChessSquare,
            },
            moveHistory: updatedHistory,
            currentMoveIndex: updatedHistory.length - 1,
            gameOver: aiChess.isGameOver(),
            gameResult: aiChess.isGameOver()
              ? aiChess.isCheckmate()
                ? `${aiChess.turn() === "w" ? "Black" : "White"} wins by checkmate`
                : aiChess.isDraw()
                ? "Draw"
                : "Game over"
              : null,
          });

          await mockLearning.recordPosition(aiChess.fen());

          if (aiChess.isGameOver()) {
            soundManager.play("gameEnd");
            const result =
              aiChess.isCheckmate()
                ? aiChess.turn() === "w"
                  ? "black"
                  : "white"
                : "draw";
            await mockLearning.recordGame(aiChess.pgn(), result);
          }
        } catch (err) {
          console.error("AI move error:", err);
          set({ aiThinking: false });
        }
      }
    } catch (err) {
      console.error("Move error:", err);
      soundManager.play("illegal");
    }
  },

  newGame: async (opts) => {
    const chess = opts.startFEN ? new Chess(opts.startFEN) : new Chess();

    set({
      chess,
      selectedSquare: null,
      legalMoves: [],
      lastMove: null,
      playerColor: opts.playerColor,
      aiThinking: false,
      gameStarted: true,
      gameOver: false,
      gameResult: null,
      timeControl: opts.timeControl || null,
      targetElo: opts.targetElo ?? 2600,
      moveHistory: [],
      currentMoveIndex: -1,
      activeColor: "white",
    });

    soundManager.play("gameStart");

    await mockEngine.newGame({
      whiteIsHuman: opts.playerColor === "white",
      blackIsHuman: opts.playerColor === "black",
      startFEN: opts.startFEN,
      time: opts.timeControl
        ? {
            baseMin: opts.timeControl.baseMinutes,
            incrementSec: opts.timeControl.incrementSeconds,
          }
        : undefined,
      targetElo: opts.targetElo,
    });

    // If AI plays first
    if (opts.playerColor === "black") {
      set({ aiThinking: true });

      try {
        const aiMove = await mockEngine.getBestMove(chess.fen(), [], opts.targetElo);
        const aiChess = new Chess(chess.fen());
        aiChess.move(aiMove.move);

        const last = aiChess.history({ verbose: true }).slice(-1)[0];
        if (last?.captured) soundManager.play("capture");
        else soundManager.play("move");

        set({
          chess: aiChess,
          aiThinking: false,
          lastMove: {
            from: aiMove.move.from as ChessSquare,
            to: aiMove.move.to as ChessSquare,
          },
          moveHistory: aiChess.history({ verbose: true }).map((m) => m.san),
          currentMoveIndex: 0,
          activeColor: "white",
        });
      } catch (err) {
        console.error("AI first move error:", err);
        set({ aiThinking: false });
      }
    }
  },

  resign: () => {
    const state = get();
    const winner = nextPlayer(state.playerColor);

    set({
      gameOver: true,
      gameResult: `${winner[0].toUpperCase()}${winner.slice(1)} wins by resignation`,
    });

    soundManager.play("gameEnd");
    mockLearning.recordGame(state.chess.pgn(), winner);
  },

  offerDraw: () => {
    // For now: auto-accept draw
    set({
      gameOver: true,
      gameResult: "Draw by agreement",
    });

    soundManager.play("gameEnd");
    mockLearning.recordGame(get().chess.pgn(), "draw");
  },

  undo: () => {
    // Disabled in AI mode; implement if desired.
  },

  flipBoard: () => {
    const state = get();
    set({ playerColor: nextPlayer(state.playerColor) });
  },

  updateSettings: (settings: Partial<GameSettings>) => {
    const merged = { ...get().settings, ...settings };
    set({ settings: merged });

    if (settings.soundEnabled !== undefined) {
      soundManager.setEnabled(settings.soundEnabled);
    }
    if (settings.soundVolume !== undefined) {
      soundManager.setVolume(settings.soundVolume);
    }
  },

  goToMove: (index: number) => {
    const state = get();
    const chess = new Chess();

    // Replay SANs up to index
    for (let i = 0; i <= index && i < state.moveHistory.length; i++) {
      chess.move(state.moveHistory[i]);
    }

    set({
      chess,
      currentMoveIndex: Math.max(-1, Math.min(index, state.moveHistory.length - 1)),
    });
  },

  resetGame: () => {
    set({
      chess: new Chess(),
      selectedSquare: null,
      legalMoves: [],
      lastMove: null,
      aiThinking: false,
      gameStarted: false,
      gameOver: false,
      gameResult: null,
      moveHistory: [],
      currentMoveIndex: -1,
      activeColor: null,
    });
  },
}));
