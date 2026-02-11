"use client";

import { Sidebar, Navbar, Card, Table } from "@/components/ui-library";

export default function Home() {
  const columns = [
  { key: "name", header: "Name" },
  { key: "email", header: "Email" },
];


  const data = [
    { name: "Harshal", email: "harshal@example.com" },
    { name: "Alex", email: "alex@example.com" },
  ];

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
          <Card title="Users" variant="elevated">
            <Table columns={columns} data={data} striped />
          </Card>
        </div>
      </div>
    </div>
  );
}
