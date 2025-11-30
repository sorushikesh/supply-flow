import { useState } from "react";
import { PageBackground } from "@/components/PageBackground";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2, Mail, Phone, MapPin, FileText, Pencil, Save, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function CompanyOverview() {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);

  // Company details state
  const [companyName, setCompanyName] = useState("SupplyFlow Inc.");
  const [companyEmail, setCompanyEmail] = useState("contact@supplyflow.com");
  const [companyPhone, setCompanyPhone] = useState("+1 (555) 123-4567");
  const [companyAddress, setCompanyAddress] = useState("123 Business Street, Tech City");
  const [companyTaxId, setCompanyTaxId] = useState("TAX-123456");

  // Original values for cancel
  const [originalValues, setOriginalValues] = useState({
    name: companyName,
    email: companyEmail,
    phone: companyPhone,
    address: companyAddress,
    taxId: companyTaxId,
  });

  const handleEdit = () => {
    setOriginalValues({
      name: companyName,
      email: companyEmail,
      phone: companyPhone,
      address: companyAddress,
      taxId: companyTaxId,
    });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setCompanyName(originalValues.name);
    setCompanyEmail(originalValues.email);
    setCompanyPhone(originalValues.phone);
    setCompanyAddress(originalValues.address);
    setCompanyTaxId(originalValues.taxId);
    setIsEditing(false);
  };

  const handleSave = () => {
    toast({
      title: "Company Details Updated",
      description: "Your company information has been saved successfully.",
    });
    setIsEditing(false);
  };

  return (
    <PageBackground>
      <div className="p-4 lg:p-6 max-w-[1600px] mx-auto space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-blue-500 to-purple-500 bg-clip-text text-transparent">
              Company Overview
            </h1>
            <p className="text-muted-foreground mt-1">View and manage your company information</p>
          </div>
          {!isEditing ? (
            <Button onClick={handleEdit} className="gap-2">
              <Pencil className="h-4 w-4" />
              Edit Details
            </Button>
          ) : (
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={handleCancel} className="gap-2">
                <X className="h-4 w-4" />
                Cancel
              </Button>
              <Button onClick={handleSave} className="gap-2">
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
            </div>
          )}
        </div>

        {/* Company Details Card */}
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              Company Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {!isEditing ? (
              // View Mode
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors">
                    <Building2 className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Company Name</p>
                      <p className="text-base font-semibold">{companyName}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors">
                    <Mail className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Email Address</p>
                      <p className="text-base font-semibold">{companyEmail}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors">
                    <Phone className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Phone Number</p>
                      <p className="text-base font-semibold">{companyPhone}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors">
                    <MapPin className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Address</p>
                      <p className="text-base font-semibold">{companyAddress}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors">
                    <FileText className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Tax ID / Registration Number</p>
                      <p className="text-base font-semibold">{companyTaxId}</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // Edit Mode
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="company-name" className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-primary" />
                      Company Name *
                    </Label>
                    <Input
                      id="company-name"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="Enter company name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company-email" className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-primary" />
                      Email Address
                    </Label>
                    <Input
                      id="company-email"
                      type="email"
                      value={companyEmail}
                      onChange={(e) => setCompanyEmail(e.target.value)}
                      placeholder="Enter email address"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company-phone" className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-primary" />
                      Phone Number
                    </Label>
                    <Input
                      id="company-phone"
                      value={companyPhone}
                      onChange={(e) => setCompanyPhone(e.target.value)}
                      placeholder="Enter phone number"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="company-address" className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      Address
                    </Label>
                    <Input
                      id="company-address"
                      value={companyAddress}
                      onChange={(e) => setCompanyAddress(e.target.value)}
                      placeholder="Enter company address"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company-tax-id" className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-primary" />
                      Tax ID / Registration Number
                    </Label>
                    <Input
                      id="company-tax-id"
                      value={companyTaxId}
                      onChange={(e) => setCompanyTaxId(e.target.value)}
                      placeholder="Enter tax ID"
                    />
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Additional Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Company Status</p>
                  <p className="text-lg font-semibold">Active</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-blue-500/10">
                  <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Registration Date</p>
                  <p className="text-lg font-semibold">Jan 15, 2024</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-purple-500/10">
                  <Mail className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Verified Status</p>
                  <p className="text-lg font-semibold">Verified ✓</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageBackground>
  );
}
