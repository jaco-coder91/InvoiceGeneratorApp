import { Card } from "@/components/ui/card";
import { Invoice } from "@/types/invoice";

interface InvoicePreviewProps {
  invoice: Invoice;
}

export const InvoicePreview = ({ invoice }: InvoicePreviewProps) => {
  const subtotal = invoice.lineItems.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );
  const tax = subtotal * (invoice.taxRate / 100);
  const total = subtotal + tax;

  return (
    <Card id="invoice-preview" className="p-8 space-y-8 bg-card">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          {invoice.businessDetails.logoUrl && (
            <img
              src={invoice.businessDetails.logoUrl}
              alt="Logo"
              className="h-16 mb-4 object-contain"
            />
          )}
          <h1 className="text-3xl font-bold">{invoice.businessDetails.companyName}</h1>
          <p className="text-sm text-muted-foreground mt-2">{invoice.businessDetails.address}</p>
          <p className="text-sm text-muted-foreground">{invoice.businessDetails.contactInfo}</p>
        </div>
        <div className="text-right">
          <h2 className="text-4xl font-bold text-primary">INVOICE</h2>
          <p className="text-lg font-semibold mt-2">#{invoice.invoiceNumber}</p>
        </div>
      </div>

      {/* Dates and Client Info */}
      <div className="grid grid-cols-2 gap-8">
        <div>
          <h3 className="font-semibold text-sm mb-2">Bill To:</h3>
          <p className="font-medium">{invoice.clientDetails.name}</p>
          <p className="text-sm text-muted-foreground">{invoice.clientDetails.company}</p>
          <p className="text-sm text-muted-foreground">{invoice.clientDetails.address}</p>
          <p className="text-sm text-muted-foreground">{invoice.clientDetails.contactInfo}</p>
        </div>
        <div className="text-right">
          <div className="mb-2">
            <span className="text-sm font-semibold">Issue Date: </span>
            <span className="text-sm">{invoice.issueDate.toLocaleDateString()}</span>
          </div>
          <div>
            <span className="text-sm font-semibold">Due Date: </span>
            <span className="text-sm">{invoice.dueDate.toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Line Items */}
      <div>
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-border">
              <th className="text-left py-3 font-semibold">Description</th>
              <th className="text-right py-3 font-semibold">Qty</th>
              <th className="text-right py-3 font-semibold">Unit Price</th>
              <th className="text-right py-3 font-semibold">Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoice.lineItems.map((item) => (
              <tr key={item.id} className="border-b border-border">
                <td className="py-3">{item.description}</td>
                <td className="text-right py-3">{item.quantity}</td>
                <td className="text-right py-3">${item.unitPrice.toFixed(2)}</td>
                <td className="text-right py-3">${(item.quantity * item.unitPrice).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div className="mt-6 space-y-2 ml-auto w-64">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span className="font-medium">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax ({invoice.taxRate}%):</span>
            <span className="font-medium">${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-xl font-bold border-t-2 border-border pt-2">
            <span>Total:</span>
            <span className="text-primary">${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      {(invoice.notes || invoice.terms || invoice.paymentInstructions) && (
        <div className="space-y-4 border-t border-border pt-6">
          {invoice.notes && (
            <div>
              <h4 className="font-semibold mb-1">Notes:</h4>
              <p className="text-sm text-muted-foreground">{invoice.notes}</p>
            </div>
          )}
          {invoice.terms && (
            <div>
              <h4 className="font-semibold mb-1">Terms & Conditions:</h4>
              <p className="text-sm text-muted-foreground">{invoice.terms}</p>
            </div>
          )}
          {invoice.paymentInstructions && (
            <div>
              <h4 className="font-semibold mb-1">Payment Instructions:</h4>
              <p className="text-sm text-muted-foreground">{invoice.paymentInstructions}</p>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};
