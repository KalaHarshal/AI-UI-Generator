import { UIPlan } from "@/types/plan";
import { COMPONENT_SCHEMAS } from "@/lib/componentSchema";

const SYSTEM_PROMPT = `
You are a UI Planning Agent.

Your job is to convert user intent into a structured JSON UI plan.

STRICT RULES:
- Output ONLY valid JSON.
- Do NOT include explanations.
- Do NOT include markdown.
- Do NOT generate React code.
- Only use components from the allowed list.
- Only use props defined in the schema.
- No inline styling.
- No custom components.

Allowed Components:
${Object.keys(COMPONENT_SCHEMAS).join(", ")}

Layout options:
- stack
- grid
- flex

Output format:

{
  "layout": "stack | grid | flex",
  "components": [
    {
      "type": "ComponentName",
      "props": { ... },
      "children": [ ... ]
    }
  ]
}
`;

export async function plannerAgent(
  userInput: string
): Promise<UIPlan> {
  const response = await fetch("/api/ai", {
    method: "POST",
    body: JSON.stringify({
      system: SYSTEM_PROMPT,
      user: userInput,
    }),
  });

  const data = await response.json();

  return data.plan as UIPlan;
}
