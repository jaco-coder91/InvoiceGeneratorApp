import { Moon, Sun, Volume2, VolumeX, Settings, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ThemeProvider";
import { useGameStore } from "@/store/gameStore";
import { motion } from "framer-motion";

interface GameHeaderProps {
  onNewGame: () => void;
  onSettings: () => void;
}

export function GameHeader({ onNewGame, onSettings }: GameHeaderProps) {
  const { theme, setTheme } = useTheme();
  const { settings, updateSettings } = useGameStore();

  const toggleSound = () => {
    updateSettings({ soundEnabled: !settings.soundEnabled });
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50"
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          ChessMind
        </h1>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={onNewGame}
            title="New Game"
          >
            <Plus className="h-5 w-5" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={toggleSound}
            title={settings.soundEnabled ? "Mute" : "Unmute"}
          >
            {settings.soundEnabled ? (
              <Volume2 className="h-5 w-5" />
            ) : (
              <VolumeX className="h-5 w-5" />
            )}
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            title="Toggle Theme"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={onSettings}
            title="Settings"
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </motion.header>
  );
}
