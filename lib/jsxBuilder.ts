import { UIPlan, ComponentNode } from "@/types/plan";

function renderComponent(node: ComponentNode, indent = 2): string {
  const space = " ".repeat(indent);
  const nextSpace = " ".repeat(indent + 2);

  const propsString = node.props
    ? Object.entries(node.props)
        .map(([key, value]) => {
          if (typeof value === "string") {
            return `${key}="${value}"`;
          }
          if (typeof value === "boolean") {
            return value ? key : "";
          }
          if (Array.isArray(value) || typeof value === "object") {
            return `${key}={${JSON.stringify(value)}}`;
          }
          return `${key}={${value}}`;
        })
        .filter(Boolean)
        .join(" ")
    : "";

  if (!node.children || node.children.length === 0) {
    return `${space}<${node.type}${propsString ? " " + propsString : ""} />`;
  }

  const childrenString = node.children
    .map((child) => renderComponent(child, indent + 2))
    .join("\n");

  return `
${space}<${node.type}${propsString ? " " + propsString : ""}>
${childrenString}
${space}</${node.type}>`;
}

export function buildJSX(plan: UIPlan): string {
  const layoutClass =
    plan.layout === "stack"
      ? "flex flex-col gap-4"
      : plan.layout === "grid"
      ? "grid gap-4"
      : "flex gap-4";

  const components = plan.components
    .map((component) => renderComponent(component))
    .join("\n");

  return `
import {
  Button,
  Card,
  Input,
  Modal,
  Navbar,
  Sidebar,
  Table,
  Chart
} from "@/components/ui-library";

export default function GeneratedUI() {
  return (
    <div className="${layoutClass} p-6">
${components}
    </div>
  );
}
`;
}
