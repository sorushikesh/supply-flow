import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

export function CompanySettingsDialog() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const handleOpenCompany = () => {
    setLocation("/company-overview");
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleOpenCompany}
      className="gap-1.5 h-8 px-2.5 font-medium hover:bg-accent transition-all text-xs"
      data-testid="button-company-settings"
    >
      <Building2 className="h-3.5 w-3.5" />
      <span className="hidden lg:inline">Company</span>
    </Button>
  );
}
