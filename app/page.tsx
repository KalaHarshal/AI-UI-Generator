"use client";

import { useState } from "react";
import { Card, Button, Modal, Input } from "@/components/ui-library";

export default function Home() {
  const [open, setOpen] = useState(false);

  return (
    <div className="p-10">
      <Card title="Settings" variant="elevated">
        <Button onClick={() => setOpen(true)}>Open Modal</Button>
      </Card>

      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        title="Settings"
      >
        <div className="flex flex-col gap-4">
          <Input label="Username" />
          <Input label="Email" type="email" />
        </div>
      </Modal>
    </div>
  );
}
