import { Square as ChessSquare, Piece } from "chess.js";
import { useGameStore } from "@/store/gameStore";
import { ChessPiece } from "./ChessPiece";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface SquareProps {
  square: ChessSquare;
  piece: Piece | null;
  isLight: boolean;
  showCoordinate?: boolean;
  coordinateText?: string;
}

export function Square({
  square,
  piece,
  isLight,
  showCoordinate,
  coordinateText,
}: SquareProps) {
  const {
    selectedSquare,
    legalMoves,
    lastMove,
    chess,
    selectSquare,
    aiThinking,
    gameOver,
  } = useGameStore();

  const isSelected = selectedSquare === square;
  const isLegalMove = legalMoves.includes(square);
  const isLastMove =
    lastMove && (lastMove.from === square || lastMove.to === square);
  const isCheck =
    chess.isCheck() &&
    piece &&
    piece.type === "k" &&
    piece.color === chess.turn();

  const handleClick = () => {
    if (!gameOver && !aiThinking) {
      selectSquare(square);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <motion.button
      onClick={handleClick}
      onKeyPress={handleKeyPress}
      className={cn(
        "relative w-full h-full focus:outline-none focus:ring-2 focus:ring-primary focus:z-10",
        isLight ? "bg-board-light" : "bg-board-dark",
        isSelected && "bg-board-selected",
        isLastMove && "bg-board-highlight",
        isCheck && "bg-board-check animate-pulse-glow",
        !gameOver && !aiThinking && "cursor-pointer hover:brightness-110",
        (gameOver || aiThinking) && "cursor-not-allowed"
      )}
      tabIndex={0}
      role="gridcell"
      aria-label={`${square}${piece ? ` ${piece.color} ${piece.type}` : " empty"}`}
      whileHover={!gameOver && !aiThinking ? { scale: 1.05 } : {}}
      whileTap={!gameOver && !aiThinking ? { scale: 0.95 } : {}}
    >
      {piece && <ChessPiece piece={piece} />}

      {isLegalMove && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className={cn(
            "absolute inset-0 flex items-center justify-center pointer-events-none",
          )}
        >
          <div
            className={cn(
              "rounded-full bg-board-legalMove",
              piece ? "w-3/4 h-3/4 opacity-30" : "w-1/3 h-1/3 opacity-70"
            )}
          />
        </motion.div>
      )}

      {showCoordinate && coordinateText && (
        <span
          className={cn(
            "absolute text-xs font-semibold pointer-events-none select-none",
            isLight ? "text-board-dark" : "text-board-light",
            coordinateText.length === 1
              ? "bottom-1 left-1"
              : "top-1 right-1"
          )}
        >
          {coordinateText}
        </span>
      )}
    </motion.button>
  );
}
