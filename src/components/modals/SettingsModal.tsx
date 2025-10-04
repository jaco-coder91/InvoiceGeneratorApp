import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { useGameStore } from "@/store/gameStore";
import { motion } from "framer-motion";

interface SettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsModal({ open, onOpenChange }: SettingsModalProps) {
  const { settings, updateSettings } = useGameStore();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Customize your chess experience
          </DialogDescription>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6 py-4"
        >
          {/* Show Coordinates */}
          <div className="flex items-center justify-between">
            <Label htmlFor="coordinates">Show Coordinates</Label>
            <Switch
              id="coordinates"
              checked={settings.showCoordinates}
              onCheckedChange={(checked) =>
                updateSettings({ showCoordinates: checked })
              }
            />
          </div>

          {/* Sound */}
          <div className="flex items-center justify-between">
            <Label htmlFor="sound">Sound Effects</Label>
            <Switch
              id="sound"
              checked={settings.soundEnabled}
              onCheckedChange={(checked) =>
                updateSettings({ soundEnabled: checked })
              }
            />
          </div>

          {/* Sound Volume */}
          {settings.soundEnabled && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              className="space-y-3"
            >
              <div className="flex justify-between">
                <Label>Volume</Label>
                <span className="text-sm text-muted-foreground">
                  {Math.round(settings.soundVolume * 100)}%
                </span>
              </div>
              <Slider
                value={[settings.soundVolume]}
                onValueChange={(values) =>
                  updateSettings({ soundVolume: values[0] })
                }
                min={0}
                max={1}
                step={0.1}
                className="w-full"
              />
            </motion.div>
          )}

          {/* Animation Speed */}
          <div className="space-y-3">
            <div className="flex justify-between">
              <Label>Animation Speed</Label>
              <span className="text-sm text-muted-foreground">
                {settings.animationSpeed}s
              </span>
            </div>
            <Slider
              value={[settings.animationSpeed]}
              onValueChange={(values) =>
                updateSettings({ animationSpeed: values[0] })
              }
              min={0.1}
              max={1}
              step={0.05}
              className="w-full"
            />
          </div>

          {/* Theme Preferences */}
          <div className="pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              Piece themes and board colors coming soon...
            </p>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
