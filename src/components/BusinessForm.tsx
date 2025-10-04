import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { BusinessDetails } from "@/types/invoice";

interface BusinessFormProps {
  business: BusinessDetails;
  onChange: (business: BusinessDetails) => void;
}

export const BusinessForm = ({ business, onChange }: BusinessFormProps) => {
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange({ ...business, logoUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Card className="p-6 space-y-4">
      <h2 className="text-xl font-semibold">Your Business Details</h2>
      
      <div className="space-y-2">
        <Label htmlFor="companyName">Company Name</Label>
        <Input
          id="companyName"
          value={business.companyName}
          onChange={(e) => onChange({ ...business, companyName: e.target.value })}
          placeholder="Acme Inc."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="logo">Logo</Label>
        <Input
          id="logo"
          type="file"
          accept="image/*"
          onChange={handleLogoUpload}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="businessAddress">Address</Label>
        <Input
          id="businessAddress"
          value={business.address}
          onChange={(e) => onChange({ ...business, address: e.target.value })}
          placeholder="123 Main St, City, State 12345"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="businessContact">Contact Info</Label>
        <Input
          id="businessContact"
          value={business.contactInfo}
          onChange={(e) => onChange({ ...business, contactInfo: e.target.value })}
          placeholder="email@example.com | +1 234 567 8900"
        />
      </div>
    </Card>
  );
};
