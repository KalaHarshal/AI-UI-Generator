import { Card, Button, Input } from "@/components/ui-library";

export default function Home() {
  return (
    <div className="p-10">
      <Card title="Login Form" variant="elevated">
        <div className="flex flex-col gap-4">
          <Input label="Email" type="email" placeholder="Enter email" />
          <Input label="Password" type="password" />
          <Button>Login</Button>
        </div>
      </Card>
    </div>
  );
}
