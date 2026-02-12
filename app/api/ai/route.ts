import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { validatePlan } from "@/lib/validator";
import { buildJSX } from "@/lib/jsxBuilder";
import { COMPONENT_SCHEMAS } from "@/lib/componentSchema";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SCHEMA_STRING = JSON.stringify(COMPONENT_SCHEMAS, null, 2);

// ==========================================
// 1. PLANNER PROMPT
// Strict architectural constraints + Refusal Logic
// ==========================================
const PLANNER_PROMPT = `
You are a deterministic UI Planning Agent.

You must strictly follow the component prop schemas.

CRITICAL BEHAVIOR:
- You MUST return the FULL, exhaustive JSON tree on every single request.
- Preserve all existing components from the "Previous Plan". DO NOT return partial updates. 
- If you omit a component, it will be deleted from the user's UI.
- If no "Previous Plan" is provided, create the UI from scratch.

OUTPUT FORMAT:
Return ONLY valid JSON. No markdown.
{
  "layout": "stack" | "grid" | "flex",
  "components": ComponentNode[]
}

ComponentNode format:
{
  "type": string,
  "props"?: object,
  "children"?: (ComponentNode | string)[]
}

CRITICAL RULES (THE "GUARDRAILS"):
- **NO ARBITRARY STYLES:** You CANNOT change colors, fonts, borders, or spacing beyond what is defined in the component "variant" or "size" props.
- **NO "style" PROP:** Never use the "style" prop. It is strictly forbidden.
- **NO "className" PROP:** Never use "className". It is strictly forbidden.
- If the user asks for a specific color (e.g., "make it red"), **IGNORE THE COLOR REQUEST**. Do not try to implement it. Just return the standard component.

LAYOUT & COMPOSITION STRATEGY:
- **Root Layout:** If using a Sidebar, the root "layout" MUST be "flex".
- **Internal Layouts:** To place items side-by-side (like 3 stat cards), YOU MUST USE A "Container" COMPONENT with layout="grid" and columns=3.
- Do NOT stack small cards vertically; use a Container to organize them.

DATA POPULATION RULES:
- If the user requests a Chart/Table but provides no data, YOU MUST GENERATE REALISTIC MOCK DATA.
- Do NOT return empty arrays for data props.
- For Tables: Ensure data keys roughly match column headers (case-insensitive).

ALLOWED COMPONENT SCHEMAS (STRICT):
${SCHEMA_STRING}
`;

// 2. EXPLAINER PROMPT
// Explains the "Why" behind the decisions.
// ==========================================
const EXPLAINER_PROMPT = `
You are a UI/UX Expert. 
You have generated a UI plan based on a user's request.

CRITICAL RULE: 
- Explain ONLY what is explicitly present in the "Generated Plan" JSON.
- If the user requested a style change (e.g., "red background") that you ignored due to constraints, politely explain: "Custom styles are not supported by the design system, so I used the standard layout."
- Keep it under 2 sentences. Talk like a designer.
`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const user = body?.user;
    const previousPlan = body?.previousPlan;

    if (!user || typeof user !== "string") {
      return NextResponse.json(
        { error: "Invalid user input" },
        { status: 400 }
      );
    }

    const messages: any[] = [
      { role: "system", content: PLANNER_PROMPT },
      {
        role: "user",
        content: `User Request:\n${user}\n\nPrevious Plan:\n${
          previousPlan ? JSON.stringify(previousPlan, null, 2) : "None"
        }`,
      },
    ];

    const MAX_RETRIES = 2;
    let attempt = 0;
    let finalPlan = null;
    let lastErrors: string[] = [];
    let lastRawOutput = "";

    while (attempt <= MAX_RETRIES) {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        temperature: 0.2,
        response_format: { type: "json_object" },
        messages: messages,
      });

      const content = completion.choices[0].message.content;
      if (!content) throw new Error("No response from model");

      lastRawOutput = content;
      let parsed;

      try {
        parsed = JSON.parse(content);
      } catch {
        lastErrors = ["Failed to parse JSON."];
        messages.push({ role: "assistant", content });
        messages.push({
          role: "user",
          content: "Your response was not valid JSON. Please fix it.",
        });
        attempt++;
        continue;
      }

      // Validate against the schema
      const validation = validatePlan(parsed);

      if (validation.valid) {
        finalPlan = parsed;
        break;
      } else {
        lastErrors = validation.errors;
        messages.push({ role: "assistant", content });
        messages.push({
          role: "user",
          content: `Validation failed:\n- ${lastErrors.join("\n- ")}\n\nFix these errors. DO NOT use className. DO NOT use style. DO NOT invent props.`,
        });
        attempt++;
      }
    }

    if (!finalPlan) {
      return NextResponse.json(
        {
          error: "Plan validation failed after multiple attempts.",
          details: lastErrors,
          rawModelOutput: lastRawOutput,
        },
        { status: 400 }
      );
    }

    const code = buildJSX(finalPlan);

    const explanationCompletion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: EXPLAINER_PROMPT },
        {
          role: "user",
          content: `User Request: "${user}"\n\nGenerated Plan:\n${JSON.stringify(
            finalPlan,
            null,
            2
          )}`,
        },
      ],
    });

    const explanation =
      explanationCompletion.choices[0].message.content ||
      "UI updated successfully.";

    return NextResponse.json({
      plan: finalPlan,
      code,
      explanation,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Unexpected server error" },
      { status: 500 }
    );
  }
}