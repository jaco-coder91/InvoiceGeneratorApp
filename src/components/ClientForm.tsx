import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { ClientDetails } from "@/types/invoice";

interface ClientFormProps {
  client: ClientDetails;
  onChange: (client: ClientDetails) => void;
}

export const ClientForm = ({ client, onChange }: ClientFormProps) => {
  return (
    <Card className="p-6 space-y-4">
      <h2 className="text-xl font-semibold">Client Details</h2>
      
      <div className="space-y-2">
        <Label htmlFor="clientName">Client Name</Label>
        <Input
          id="clientName"
          value={client.name}
          onChange={(e) => onChange({ ...client, name: e.target.value })}
          placeholder="John Doe"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="clientCompany">Company</Label>
        <Input
          id="clientCompany"
          value={client.company}
          onChange={(e) => onChange({ ...client, company: e.target.value })}
          placeholder="Client Corp"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="clientAddress">Address</Label>
        <Input
          id="clientAddress"
          value={client.address}
          onChange={(e) => onChange({ ...client, address: e.target.value })}
          placeholder="456 Oak Ave, City, State 67890"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="clientContact">Contact Info</Label>
        <Input
          id="clientContact"
          value={client.contactInfo}
          onChange={(e) => onChange({ ...client, contactInfo: e.target.value })}
          placeholder="client@example.com | +1 987 654 3210"
        />
      </div>
    </Card>
  );
};
