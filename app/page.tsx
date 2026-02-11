import { Card, Button } from "@/components/ui-library";

export default function Home() {
  return (
    <div className="p-10">
      <Card title="Test Card" subtitle="Subtitle" variant="elevated">
        <Button>Click Me</Button>
      </Card>
    </div>
  );
}
