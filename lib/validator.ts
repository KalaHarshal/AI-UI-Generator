import { COMPONENT_SCHEMAS } from "./componentSchema";
import { UIPlan, ComponentNode } from "@/types/plan";

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

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
  component: ComponentNode,
  path: string,
  errors: string[]
) {
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
      if (!(propKey in schema.props)) {
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
