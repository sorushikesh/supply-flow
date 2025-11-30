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
      <div className="p-6 max-w-[1600px] mx-auto">
        {/* Page Header */}
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Company Overview</h1>
            <p className="text-muted-foreground">View and manage your company information</p>
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
        <Card className="border-primary/20 hover:border-primary/30 transition-all duration-200">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 rounded-lg bg-primary/10">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
              Company Information
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-2">Your business details and contact information</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {!isEditing ? (
              // View Mode
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-gradient-to-br from-primary/5 to-transparent border border-primary/10 hover:border-primary/20 hover:shadow-sm transition-all duration-200">
                    <div className="p-2 rounded-md bg-primary/10 flex-shrink-0">
                      <Building2 className="h-5 w-5 text-primary mt-0.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Company Name</p>
                      <p className="text-base font-semibold mt-1">{companyName}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-lg bg-gradient-to-br from-blue-500/5 to-transparent border border-blue-500/10 hover:border-blue-500/20 hover:shadow-sm transition-all duration-200">
                    <div className="p-2 rounded-md bg-blue-500/10 flex-shrink-0">
                      <Mail className="h-5 w-5 text-blue-600 mt-0.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Email Address</p>
                      <p className="text-base font-semibold mt-1 break-all">{companyEmail}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-lg bg-gradient-to-br from-green-500/5 to-transparent border border-green-500/10 hover:border-green-500/20 hover:shadow-sm transition-all duration-200">
                    <div className="p-2 rounded-md bg-green-500/10 flex-shrink-0">
                      <Phone className="h-5 w-5 text-green-600 mt-0.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Phone Number</p>
                      <p className="text-base font-semibold mt-1">{companyPhone}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-gradient-to-br from-purple-500/5 to-transparent border border-purple-500/10 hover:border-purple-500/20 hover:shadow-sm transition-all duration-200">
                    <div className="p-2 rounded-md bg-purple-500/10 flex-shrink-0">
                      <MapPin className="h-5 w-5 text-purple-600 mt-0.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Address</p>
                      <p className="text-base font-semibold mt-1">{companyAddress}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-lg bg-gradient-to-br from-orange-500/5 to-transparent border border-orange-500/10 hover:border-orange-500/20 hover:shadow-sm transition-all duration-200">
                    <div className="p-2 rounded-md bg-orange-500/10 flex-shrink-0">
                      <FileText className="h-5 w-5 text-orange-600 mt-0.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Tax ID / Registration</p>
                      <p className="text-base font-semibold mt-1">{companyTaxId}</p>
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
          <Card className="border-primary/20 hover:border-primary/40 hover:shadow-md transition-all duration-200 cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5">
                  <Building2 className="h-7 w-7 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Company Status</p>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-2xl font-bold">Active</p>
                    <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-500/20 hover:border-blue-500/40 hover:shadow-md transition-all duration-200 cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-500/5">
                  <FileText className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Registration Date</p>
                  <p className="text-2xl font-bold mt-1">Jan 15, 2024</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-500/20 hover:border-purple-500/40 hover:shadow-md transition-all duration-200 cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-gradient-to-br from-purple-500/20 to-purple-500/5">
                  <Mail className="h-7 w-7 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Verified Status</p>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-2xl font-bold">Verified</p>
                    <span className="text-2xl">✓</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageBackground>
  );
}
