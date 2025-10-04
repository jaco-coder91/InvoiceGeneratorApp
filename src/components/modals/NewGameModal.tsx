import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { useGameStore, PlayerColor } from "@/store/gameStore";
import { motion } from "framer-motion";

interface NewGameModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewGameModal({ open, onOpenChange }: NewGameModalProps) {
  const { newGame } = useGameStore();
  const [playerColor, setPlayerColor] = useState<PlayerColor>("white");
  const [targetElo, setTargetElo] = useState(2600);
  const [timeControl, setTimeControl] = useState<"none" | "5|0" | "10|0" | "custom">("none");
  const [customMinutes, setCustomMinutes] = useState(10);
  const [customIncrement, setCustomIncrement] = useState(0);

  const handleStart = () => {
    const timeControlConfig = (() => {
      switch (timeControl) {
        case "5|0":
          return { baseMinutes: 5, incrementSeconds: 0 };
        case "10|0":
          return { baseMinutes: 10, incrementSeconds: 0 };
        case "custom":
          return { baseMinutes: customMinutes, incrementSeconds: customIncrement };
        default:
          return undefined;
      }
    })();

    newGame({
      playerColor,
      timeControl: timeControlConfig,
      targetElo,
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New Game</DialogTitle>
          <DialogDescription>
            Configure your game settings and start playing
          </DialogDescription>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6 py-4"
        >
          {/* Player Color */}
          <div className="space-y-3">
            <Label>Play as</Label>
            <RadioGroup
              value={playerColor}
              onValueChange={(value) => setPlayerColor(value as PlayerColor)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="white" id="white" />
                <Label htmlFor="white" className="cursor-pointer">
                  White
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="black" id="black" />
                <Label htmlFor="black" className="cursor-pointer">
                  Black
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* AI Strength */}
          <div className="space-y-3">
            <div className="flex justify-between">
              <Label>Target Elo</Label>
              <span className="text-sm text-muted-foreground">{targetElo}</span>
            </div>
            <Slider
              value={[targetElo]}
              onValueChange={(values) => setTargetElo(values[0])}
              min={1000}
              max={3000}
              step={100}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Higher Elo = Stronger opponent (UI only for now)
            </p>
          </div>

          {/* Time Control */}
          <div className="space-y-3">
            <Label>Time Control</Label>
            <RadioGroup
              value={timeControl}
              onValueChange={(value) => setTimeControl(value as typeof timeControl)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="none" id="none" />
                <Label htmlFor="none" className="cursor-pointer">
                  No time limit
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="5|0" id="5|0" />
                <Label htmlFor="5|0" className="cursor-pointer">
                  5 minutes
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="10|0" id="10|0" />
                <Label htmlFor="10|0" className="cursor-pointer">
                  10 minutes
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="custom" id="custom" />
                <Label htmlFor="custom" className="cursor-pointer">
                  Custom
                </Label>
              </div>
            </RadioGroup>

            {timeControl === "custom" && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                className="grid grid-cols-2 gap-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="minutes">Minutes</Label>
                  <Input
                    id="minutes"
                    type="number"
                    min={1}
                    max={180}
                    value={customMinutes}
                    onChange={(e) => setCustomMinutes(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="increment">Increment (s)</Label>
                  <Input
                    id="increment"
                    type="number"
                    min={0}
                    max={60}
                    value={customIncrement}
                    onChange={(e) => setCustomIncrement(Number(e.target.value))}
                  />
                </div>
              </motion.div>
            )}
          </div>

          <Button onClick={handleStart} className="w-full" size="lg">
            Start Game
          </Button>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
