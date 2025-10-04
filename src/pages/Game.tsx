import { useState } from "react";
import { ChessBoard } from "@/components/chess/ChessBoard";
import { GameHeader } from "@/components/game/GameHeader";
import { GameControls } from "@/components/game/GameControls";
import { MoveList } from "@/components/game/MoveList";
import { NewGameModal } from "@/components/modals/NewGameModal";
import { SettingsModal } from "@/components/modals/SettingsModal";
import { motion } from "framer-motion";

export default function Game() {
  const [newGameOpen, setNewGameOpen] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <GameHeader
        onNewGame={() => setNewGameOpen(true)}
        onSettings={() => setSettingsOpen(true)}
      />

      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-[1fr_400px] gap-8 items-start">
          {/* Chess Board */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <ChessBoard />
          </motion.div>

          {/* Side Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <GameControls />
            <div className="h-96">
              <MoveList />
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center text-sm text-muted-foreground"
        >
          <p>UI only — connect your engine to enable real AI</p>
          <p className="mt-2">
            Integration adapters ready at{" "}
            <code className="text-xs bg-muted px-2 py-1 rounded">
              src/lib/engineAdapters
            </code>
          </p>
        </motion.footer>
      </main>

      <NewGameModal open={newGameOpen} onOpenChange={setNewGameOpen} />
      <SettingsModal open={settingsOpen} onOpenChange={setSettingsOpen} />
    </div>
  );
}
