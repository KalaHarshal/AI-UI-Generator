import { UIPlan } from "@/types/plan";

// ✅ FIX: Accept previousPlan to support "Incremental Edits" [cite: 79]
export async function generateUI(
  userInput: string, 
  previousPlan: UIPlan | null
): Promise<{ plan: UIPlan; code: string; explanation: string }> {
  
  // We do NOT send the system prompt from the client. 
  // The backend (api/route.ts) holds the strict "Planner" & "Explainer" prompts.
  const response = await fetch("/api/ai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user: userInput,
      previousPlan: previousPlan, // ✅ Critical for iteration
    }),
  });

  const data = await response.json();

  if (data.error) {
    throw new Error(data.error);
  }

  // Returns the full artifact set required by the assignment
  return {
    plan: data.plan,
    code: data.code,
    explanation: data.explanation,
  };
}