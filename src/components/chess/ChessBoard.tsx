import { Square as ChessSquare } from "chess.js";
import { Square } from "./Square";
import { useGameStore } from "@/store/gameStore";
import { motion } from "framer-motion";

export function ChessBoard() {
  const { chess, playerColor, settings } = useGameStore();
  const { showCoordinates } = settings;

  const files = ["a", "b", "c", "d", "e", "f", "g", "h"];
  const ranks = ["8", "7", "6", "5", "4", "3", "2", "1"];

  // Flip board if player is black
  const displayFiles = playerColor === "black" ? [...files].reverse() : files;
  const displayRanks = playerColor === "black" ? [...ranks].reverse() : ranks;

  const board = displayRanks.map((rank) =>
    displayFiles.map((file) => {
      const square = `${file}${rank}` as ChessSquare;
      const piece = chess.get(square);
      return {
        square,
        piece,
      };
    })
  );

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative w-full max-w-2xl mx-auto aspect-square"
    >
      <div 
        className="grid grid-cols-8 grid-rows-8 w-full h-full rounded-2xl overflow-hidden shadow-2xl border-4 border-border"
        role="grid"
        aria-label="Chess board"
      >
        {board.map((row, rankIndex) =>
          row.map((cell, fileIndex) => (
            <Square
              key={cell.square}
              square={cell.square}
              piece={cell.piece}
              isLight={(rankIndex + fileIndex) % 2 === 0}
              showCoordinate={
                showCoordinates &&
                (rankIndex === 7 || fileIndex === 0)
              }
              coordinateText={
                rankIndex === 7
                  ? displayFiles[fileIndex]
                  : fileIndex === 0
                  ? displayRanks[rankIndex]
                  : undefined
              }
            />
          ))
        )}
      </div>

      {/* Aria live region for announcing moves */}
      <div
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {chess.isCheck() && "Check!"}
        {chess.isCheckmate() && "Checkmate!"}
        {chess.isGameOver() && !chess.isCheckmate() && "Game Over"}
      </div>
    </motion.div>
  );
}
