import { useGameStore } from "@/store/gameStore";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function MoveList() {
  const { moveHistory, currentMoveIndex, goToMove } = useGameStore();

  // Group moves into pairs (white + black)
  const movePairs: Array<{ moveNumber: number; white: string; black?: string }> = [];
  for (let i = 0; i < moveHistory.length; i += 2) {
    movePairs.push({
      moveNumber: Math.floor(i / 2) + 1,
      white: moveHistory[i],
      black: moveHistory[i + 1],
    });
  }

  return (
    <Card className="p-4 h-full">
      <h3 className="text-lg font-semibold mb-3">Moves</h3>
      <ScrollArea className="h-[calc(100%-2rem)]">
        {movePairs.length === 0 ? (
          <p className="text-muted-foreground text-sm text-center py-8">
            No moves yet
          </p>
        ) : (
          <div className="space-y-1">
            {movePairs.map((pair, pairIndex) => (
              <motion.div
                key={pairIndex}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: pairIndex * 0.05 }}
                className="flex items-center gap-2 text-sm"
              >
                <span className="text-muted-foreground w-8 shrink-0">
                  {pair.moveNumber}.
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "h-7 px-2 hover:bg-primary/10",
                    currentMoveIndex === pairIndex * 2 && "bg-primary text-primary-foreground"
                  )}
                  onClick={() => goToMove(pairIndex * 2)}
                >
                  {pair.white}
                </Button>
                {pair.black && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "h-7 px-2 hover:bg-primary/10",
                      currentMoveIndex === pairIndex * 2 + 1 && "bg-primary text-primary-foreground"
                    )}
                    onClick={() => goToMove(pairIndex * 2 + 1)}
                  >
                    {pair.black}
                  </Button>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </ScrollArea>
    </Card>
  );
}
