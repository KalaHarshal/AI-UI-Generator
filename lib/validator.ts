import { COMPONENT_SCHEMAS } from "./componentSchema";
import { UIPlan, ComponentNode } from "@/types/plan";

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

// ✅ FIX 1: Remove "className" to strictly enforce the assignment's "Prohibited" list.
// The AI must use specific 'variant' props, not arbitrary CSS.
const GLOBAL_ALLOWED_PROPS: string[] = []; 

export function validatePlan(plan: UIPlan): ValidationResult {
  const errors: string[] = [];

  if (!plan.layout || !["stack", "grid", "flex"].includes(plan.layout)) {
    errors.push("Invalid layout type.");
  }

  if (!Array.isArray(plan.components)) {
    errors.push("Components must be an array.");
  } else {
    plan.components.forEach((component, index) => {
      validateComponent(component, `components[${index}]`, errors);
    });
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

function validateComponent(
  component: ComponentNode | string, // Allow string type here for recursion safety
  path: string,
  errors: string[]
) {
  // ✅ FIX 2: Safely ignore text nodes (strings)
  if (typeof component === "string") {
    return;
  }

  if (!component.type) {
    errors.push(`${path}: Missing component type`);
    return;
  }

  // Check if component type exists in schema
  if (!(component.type in COMPONENT_SCHEMAS)) {
    errors.push(`${path}: Invalid component type "${component.type}"`);
    return;
  }

  const schema =
    COMPONENT_SCHEMAS[
      component.type as keyof typeof COMPONENT_SCHEMAS
    ];

  if (component.props) {
    Object.keys(component.props).forEach((propKey) => {
      // Check against specific schema (Global props are now empty/strict)
      if (
        !(propKey in schema.props) &&
        !GLOBAL_ALLOWED_PROPS.includes(propKey)
      ) {
        errors.push(
          `${path}: Invalid prop "${propKey}" for ${component.type}`
        );
      }
    });
  }

  if (component.children) {
    component.children.forEach((child, index) => {
      validateComponent(child, `${path}.children[${index}]`, errors);
    });
  }
}