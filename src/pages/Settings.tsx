import { useState } from "react";
import { PageBackground } from "@/components/PageBackground";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Keyboard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Shortcut {
  id: string;
  action: string;
  keys: string;
  description: string;
}

const defaultShortcuts: Shortcut[] = [
  { id: "1", action: "Show Shortcuts", keys: "Ctrl+Shift+?", description: "Display keyboard shortcuts menu" },
  { id: "2", action: "Quick Actions", keys: "Ctrl+K", description: "Open quick actions menu" },
  { id: "3", action: "Search", keys: "Ctrl+F", description: "Focus search input" },
  { id: "4", action: "New Purchase Order", keys: "Ctrl+Shift+P", description: "Create new purchase order" },
  { id: "5", action: "New Sales Order", keys: "Ctrl+Shift+S", description: "Create new sales order" },
  { id: "6", action: "New Invoice", keys: "Ctrl+Shift+I", description: "Create new invoice" },
  { id: "7", action: "Dashboard", keys: "Ctrl+D", description: "Navigate to dashboard" },
  { id: "8", action: "Settings", keys: "Ctrl+,", description: "Open settings" },
];

export default function Settings() {
  const { toast } = useToast();
  const [shortcuts, setShortcuts] = useState<Shortcut[]>(defaultShortcuts);

  return (
    <PageBackground>
      <div className="relative z-10 p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground">
            View application settings and keyboard shortcuts
          </p>
        </div>

        <div className="grid gap-6">
          {/* Keyboard Shortcuts */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Keyboard className="h-5 w-5" />
                    Keyboard Shortcuts
                  </CardTitle>
                  <CardDescription>
                    View available keyboard shortcuts for quick actions
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {shortcuts.map((shortcut, index) => (
                  <div key={shortcut.id}>
                    {index > 0 && <Separator className="my-4" />}
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="font-medium">{shortcut.action}</div>
                        <div className="text-sm text-muted-foreground">
                          {shortcut.description}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge
                          variant="secondary"
                          className="px-3 py-1.5 font-mono text-sm"
                        >
                          {shortcut.keys}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* General Settings */}
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Configure general application preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Input id="language" value="English" readOnly className="max-w-xs" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Input id="timezone" value="UTC-5:00 (Eastern)" readOnly className="max-w-xs" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateFormat">Date Format</Label>
                  <Input id="dateFormat" value="YYYY-MM-DD" readOnly className="max-w-xs" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>
                Manage notification preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Email Notifications</div>
                    <div className="text-sm text-muted-foreground">
                      Receive notifications via email
                    </div>
                  </div>
                  <Badge variant="secondary">Enabled</Badge>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Push Notifications</div>
                    <div className="text-sm text-muted-foreground">
                      Receive browser push notifications
                    </div>
                  </div>
                  <Badge variant="secondary">Enabled</Badge>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Desktop Notifications</div>
                    <div className="text-sm text-muted-foreground">
                      Show desktop notifications for important events
                    </div>
                  </div>
                  <Badge variant="outline">Disabled</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageBackground>
  );
}
