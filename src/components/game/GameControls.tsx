import { useGameStore } from "@/store/gameStore";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  RotateCcw,
  Flag,
  HandshakeIcon,
  Undo2,
  Copy,
  RotateCw,
} from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function GameControls() {
  const {
    chess,
    gameOver,
    gameResult,
    aiThinking,
    resign,
    offerDraw,
    flipBoard,
    gameStarted,
  } = useGameStore();

  const handleCopyPGN = () => {
    const pgn = chess.pgn();
    navigator.clipboard.writeText(pgn);
    toast.success("PGN copied to clipboard");
  };

  const getStatusText = () => {
    if (!gameStarted) return "Start a new game";
    if (gameOver) return gameResult || "Game Over";
    if (aiThinking) return "AI thinking...";
    return chess.turn() === "w" ? "White to move" : "Black to move";
  };

  const getStatusVariant = () => {
    if (!gameStarted) return "secondary";
    if (gameOver) return "destructive";
    if (aiThinking) return "default";
    if (chess.isCheck()) return "destructive";
    return "default";
  };

  return (
    <Card className="p-4">
      <div className="space-y-4">
        {/* Status Badge */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex justify-center"
        >
          <Badge
            variant={getStatusVariant()}
            className={cn(
              "text-sm px-4 py-2",
              aiThinking && "animate-pulse-glow"
            )}
          >
            {getStatusText()}
          </Badge>
        </motion.div>

        {/* Game Controls */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={resign}
            disabled={!gameStarted || gameOver || aiThinking}
            className="gap-2"
          >
            <Flag className="w-4 h-4" />
            Resign
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={offerDraw}
            disabled={!gameStarted || gameOver || aiThinking}
            className="gap-2"
          >
            <HandshakeIcon className="w-4 h-4" />
            Draw
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={flipBoard}
            disabled={!gameStarted}
            className="gap-2"
          >
            <RotateCw className="w-4 h-4" />
            Flip Board
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyPGN}
            disabled={!gameStarted}
            className="gap-2"
          >
            <Copy className="w-4 h-4" />
            Copy PGN
          </Button>
        </div>

        {/* Evaluation Bar (Mocked) */}
        {gameStarted && (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground text-center">
              Evaluation (mocked)
            </p>
            <div className="h-4 bg-muted rounded-full overflow-hidden relative">
              <motion.div
                initial={{ width: "50%" }}
                animate={{
                  width: gameOver
                    ? gameResult?.includes("White")
                      ? "100%"
                      : gameResult?.includes("Black")
                      ? "0%"
                      : "50%"
                    : `${Math.random() * 40 + 30}%`,
                }}
                transition={{ duration: 0.5 }}
                className="h-full bg-primary"
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>White</span>
              <span>Black</span>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
