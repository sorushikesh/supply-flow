import { useState } from "react";
import { FormModal } from "../FormModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function FormModalExample() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");

  return (
    <div className="p-4">
      <Button onClick={() => setOpen(true)}>Open Modal</Button>
      <FormModal
        open={open}
        onOpenChange={setOpen}
        title="Add New Item"
        description="Enter the details for the new item."
        onSubmit={() => {
          console.log("Submitted:", name);
          setOpen(false);
          setName("");
        }}
        submitLabel="Save Item"
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Item Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter item name"
            />
          </div>
        </div>
      </FormModal>
    </div>
  );
}
