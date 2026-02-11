import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { validatePlan } from "@/lib/validator";
import { COMPONENT_SCHEMAS } from "@/lib/componentSchema";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `
You are a UI Planning Agent.

STRICT RULES:
- Output ONLY valid JSON.
- No markdown.
- No explanations.
- Must include:
  - "layout"
  - "components"
- layout must be one of: "stack", "grid", "flex"
- components must be an array.

Allowed Components:
${Object.keys(COMPONENT_SCHEMAS).join(", ")}

Example valid output:

{
  "layout": "stack",
  "components": [
    {
      "type": "Card",
      "props": {
        "title": "Example"
      },
      "children": [
        {
          "type": "Button",
          "props": {
            "children": "Click me"
          }
        }
      ]
    }
  ]
}
`;

export async function POST(req: NextRequest) {
  try {
    const { user } = await req.json();

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: user },
      ],
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0].message.content;

    if (!content) {
      return NextResponse.json(
        { error: "No response from model" },
        { status: 500 }
      );
    }

    const parsed = JSON.parse(content);

    const validation = validatePlan(parsed);

    if (!validation.valid) {
      return NextResponse.json(
        {
          error: "Plan validation failed",
          details: validation.errors,
          raw: parsed
        },
        { status: 400 }
      );
    }

    return NextResponse.json({ plan: parsed });

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Unexpected error" },
      { status: 500 }
    );
  }
}
