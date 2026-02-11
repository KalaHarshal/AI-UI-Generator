"use client";

import { Sidebar, Navbar, Card } from "@/components/ui-library";

export default function Home() {
  return (
    <div className="flex min-h-screen">
      <Sidebar
        title="Dashboard"
        items={[
          { label: "Overview", active: true },
          { label: "Users" },
          { label: "Settings" },
        ]}
      />

      <div className="flex-1">
        <Navbar brand="AI UI Generator" />

        <div className="p-8">
          <Card title="Welcome" variant="elevated">
            Sidebar layout working.
          </Card>
        </div>
      </div>
    </div>
  );
}
