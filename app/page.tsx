"use client";

import { useState } from "react";
import { Card, Button, Modal, Input, Navbar } from "@/components/ui-library";

export default function Home() {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        brand="AI UI Generator"
        items={[
          { label: "Dashboard" },
          { label: "Settings" },
        ]}
        actions={<Button size="sm">Login</Button>}
      />

      <div className="p-10">
        <Card title="Settings" variant="elevated">
          <Button onClick={() => setOpen(true)}>Open Modal</Button>
        </Card>
      </div>

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
