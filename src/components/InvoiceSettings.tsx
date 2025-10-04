import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";

interface InvoiceSettingsProps {
  invoiceNumber: string;
  issueDate: Date;
  dueDate: Date;
  taxRate: number;
  notes: string;
  terms: string;
  paymentInstructions: string;
  onChange: (field: string, value: string | number | Date) => void;
}

export const InvoiceSettings = ({
  invoiceNumber,
  issueDate,
  dueDate,
  taxRate,
  notes,
  terms,
  paymentInstructions,
  onChange,
}: InvoiceSettingsProps) => {
  return (
    <Card className="p-6 space-y-4">
      <h2 className="text-xl font-semibold">Invoice Settings</h2>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="invoiceNumber">Invoice #</Label>
          <Input
            id="invoiceNumber"
            value={invoiceNumber}
            onChange={(e) => onChange("invoiceNumber", e.target.value)}
            placeholder="INV-001"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="issueDate">Issue Date</Label>
          <Input
            id="issueDate"
            type="date"
            value={issueDate.toISOString().split("T")[0]}
            onChange={(e) => onChange("issueDate", new Date(e.target.value))}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="dueDate">Due Date</Label>
          <Input
            id="dueDate"
            type="date"
            value={dueDate.toISOString().split("T")[0]}
            onChange={(e) => onChange("dueDate", new Date(e.target.value))}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="taxRate">Tax Rate (%)</Label>
        <Input
          id="taxRate"
          type="number"
          value={taxRate}
          onChange={(e) => onChange("taxRate", parseFloat(e.target.value) || 0)}
          placeholder="10"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => onChange("notes", e.target.value)}
          placeholder="Additional notes..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="terms">Terms & Conditions</Label>
        <Textarea
          id="terms"
          value={terms}
          onChange={(e) => onChange("terms", e.target.value)}
          placeholder="Payment terms..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="paymentInstructions">Payment Instructions</Label>
        <Textarea
          id="paymentInstructions"
          value={paymentInstructions}
          onChange={(e) => onChange("paymentInstructions", e.target.value)}
          placeholder="Bank details or payment link..."
        />
      </div>
    </Card>
  );
};
