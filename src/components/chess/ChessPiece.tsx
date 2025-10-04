import { Piece } from "chess.js";
import { motion } from "framer-motion";

interface ChessPieceProps {
  piece: Piece;
}

// Unicode chess pieces
const pieceUnicode: Record<string, Record<string, string>> = {
  w: {
    k: "♔",
    q: "♕",
    r: "♖",
    b: "♗",
    n: "♘",
    p: "♙",
  },
  b: {
    k: "♚",
    q: "♛",
    r: "♜",
    b: "♝",
    n: "♞",
    p: "♟",
  },
};

export function ChessPiece({ piece }: ChessPieceProps) {
  const symbol = pieceUnicode[piece.color][piece.type];

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="absolute inset-0 flex items-center justify-center text-6xl pointer-events-none select-none"
      style={{
        filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))",
      }}
    >
      {symbol}
    </motion.div>
  );
}
