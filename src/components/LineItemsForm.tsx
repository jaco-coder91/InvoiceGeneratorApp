import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { LineItem } from "@/types/invoice";
import { Plus, Trash2 } from "lucide-react";

interface LineItemsFormProps {
  items: LineItem[];
  onChange: (items: LineItem[]) => void;
}

export const LineItemsForm = ({ items, onChange }: LineItemsFormProps) => {
  const addItem = () => {
    onChange([
      ...items,
      { id: crypto.randomUUID(), description: "", quantity: 1, unitPrice: 0 },
    ]);
  };

  const updateItem = (id: string, field: keyof LineItem, value: string | number) => {
    onChange(
      items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const removeItem = (id: string) => {
    onChange(items.filter((item) => item.id !== id));
  };

  return (
    <Card className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Line Items</h2>
        <Button onClick={addItem} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Item
        </Button>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="grid grid-cols-12 gap-3 items-center">
            <Input
              className="col-span-5"
              placeholder="Description"
              value={item.description}
              onChange={(e) => updateItem(item.id, "description", e.target.value)}
            />
            <Input
              className="col-span-2"
              type="number"
              placeholder="Qty"
              value={item.quantity}
              onChange={(e) => updateItem(item.id, "quantity", parseFloat(e.target.value) || 0)}
            />
            <Input
              className="col-span-2"
              type="number"
              placeholder="Price"
              value={item.unitPrice}
              onChange={(e) => updateItem(item.id, "unitPrice", parseFloat(e.target.value) || 0)}
            />
            <div className="col-span-2 text-right font-medium">
              ${(item.quantity * item.unitPrice).toFixed(2)}
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="col-span-1"
              onClick={() => removeItem(item.id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    </Card>
  );
};
