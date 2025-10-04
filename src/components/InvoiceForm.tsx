import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BusinessForm } from "./BusinessForm";
import { ClientForm } from "./ClientForm";
import { LineItemsForm } from "./LineItemsForm";
import { InvoiceSettings } from "./InvoiceSettings";
import { InvoicePreview } from "./InvoicePreview";
import { Invoice, BusinessDetails, ClientDetails, LineItem } from "@/types/invoice";
import { exportToPDF } from "@/utils/pdfExport";
import { Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const InvoiceForm = () => {
  const { toast } = useToast();
  const [invoice, setInvoice] = useState<Invoice>({
    invoiceNumber: "INV-001",
    issueDate: new Date(),
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    businessDetails: {
      companyName: "",
      address: "",
      contactInfo: "",
    },
    clientDetails: {
      name: "",
      company: "",
      address: "",
      contactInfo: "",
    },
    lineItems: [],
    taxRate: 0,
    notes: "",
    terms: "",
    paymentInstructions: "",
  });

  const handleBusinessChange = (business: BusinessDetails) => {
    setInvoice({ ...invoice, businessDetails: business });
  };

  const handleClientChange = (client: ClientDetails) => {
    setInvoice({ ...invoice, clientDetails: client });
  };

  const handleLineItemsChange = (items: LineItem[]) => {
    setInvoice({ ...invoice, lineItems: items });
  };

  const handleSettingChange = (field: string, value: string | number | Date) => {
    setInvoice({ ...invoice, [field]: value });
  };

  const handleExportPDF = async () => {
    try {
      await exportToPDF(invoice.invoiceNumber);
      toast({
        title: "PDF exported successfully",
        description: `Invoice ${invoice.invoiceNumber} has been downloaded.`,
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "There was an error exporting the PDF. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2">Invoice Generator</h1>
          <p className="text-muted-foreground">Create professional invoices in seconds</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Forms Section */}
          <div className="space-y-6">
            <BusinessForm business={invoice.businessDetails} onChange={handleBusinessChange} />
            <ClientForm client={invoice.clientDetails} onChange={handleClientChange} />
            <LineItemsForm items={invoice.lineItems} onChange={handleLineItemsChange} />
            <InvoiceSettings
              invoiceNumber={invoice.invoiceNumber}
              issueDate={invoice.issueDate}
              dueDate={invoice.dueDate}
              taxRate={invoice.taxRate}
              notes={invoice.notes}
              terms={invoice.terms}
              paymentInstructions={invoice.paymentInstructions}
              onChange={handleSettingChange}
            />
          </div>

          {/* Preview Section */}
          <div className="space-y-4">
            <div className="sticky top-4">
              <InvoicePreview invoice={invoice} />
              <Button
                onClick={handleExportPDF}
                className="w-full mt-4"
                size="lg"
              >
                <Download className="w-4 h-4 mr-2" />
                Export to PDF
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
