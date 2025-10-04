export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface BusinessDetails {
  companyName: string;
  logoUrl?: string;
  address: string;
  contactInfo: string;
}

export interface ClientDetails {
  name: string;
  company: string;
  address: string;
  contactInfo: string;
}

export interface Invoice {
  invoiceNumber: string;
  issueDate: Date;
  dueDate: Date;
  businessDetails: BusinessDetails;
  clientDetails: ClientDetails;
  lineItems: LineItem[];
  taxRate: number;
  notes: string;
  terms: string;
  paymentInstructions: string;
}
