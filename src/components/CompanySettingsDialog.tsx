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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function CompanySettingsDialog() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const handleOpenCompany = () => {
    setLocation("/company-overview");
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleOpenCompany}
          className="h-10 w-10"
          data-testid="button-company-settings"
        >
          <Building2 className="h-[18px] w-[18px]" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Company</p>
      </TooltipContent>
    </Tooltip>
  );
}
