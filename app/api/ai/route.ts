import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { validatePlan } from "@/lib/validator";
import { COMPONENT_SCHEMAS } from "@/lib/componentSchema";
import { buildJSX } from "@/lib/jsxBuilder";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `
You are a UI Planning Agent.

Your job is to convert user intent into a structured JSON UI plan.

STRICT RULES:
- Output ONLY valid JSON.
- No markdown.
- No explanations.
- Must include:
  - "layout"
  - "components"
- layout must be one of: "stack", "grid", "flex"
- components must be an array.
- Each component must include:
  - "type"
  - optional "props"
  - optional "children" (array)

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
    const body = await req.json();
    const user = body?.user;

    if (!user || typeof user !== "string") {
      return NextResponse.json(
        { error: "Invalid user input" },
        { status: 400 }
      );
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: user },
      ],
      response_format: { type: "json_object" },
      temperature: 0.2, // 🔒 lower randomness for determinism
    });

    const content = completion.choices[0].message.content;

    if (!content) {
      return NextResponse.json(
        { error: "No response from model" },
        { status: 500 }
      );
    }

    let parsed;

    try {
      parsed = JSON.parse(content);
    } catch {
      return NextResponse.json(
        {
          error: "Model returned invalid JSON",
          raw: content,
        },
        { status: 500 }
      );
    }

    // 🔒 Validate structured plan
    const validation = validatePlan(parsed);

    if (!validation.valid) {
      return NextResponse.json(
        {
          error: "Plan validation failed",
          details: validation.errors,
          raw: parsed,
        },
        { status: 400 }
      );
    }

    // 🔥 Deterministic JSX generation
    const code = buildJSX(parsed);

    return NextResponse.json({
      plan: parsed,
      code,
    });

  } catch (error: any) {
    return NextResponse.json(
      {
        error: error?.message || "Unexpected server error",
      },
      { status: 500 }
    );
  }
}
