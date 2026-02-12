import { UIPlan, ComponentNode } from "@/types/plan";

// Helper to check if a value looks like a ComponentNode
function isComponentNode(value: any): boolean {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof value.type === "string" &&
    !Array.isArray(value)
  );
}

// Main recursive render function
function renderComponent(node: ComponentNode | string, indent = 6): string {
  const space = " ".repeat(indent);

  // 1. Handle raw text strings immediately
  if (typeof node === "string") {
    return `${space}${node}`;
  }

  const props = { ...node.props };

  // 2. SAFETY: Extract children from props to avoid crashes
  let extractedChildren: (ComponentNode | string)[] = [];

  if (props.children) {
    if (typeof props.children === "string") {
      extractedChildren.push(props.children);
    } else if (Array.isArray(props.children)) {
      extractedChildren.push(...props.children);
    } else if (typeof props.children === "object") {
      // Handle single object children
      extractedChildren.push(props.children);
    }
    delete props.children; // Remove from props object
  }

  // 3. Build props string (handling nested components recursively)
  const propsString = Object.keys(props).length > 0
    ? Object.entries(props)
        .map(([key, value]) => {
          if (typeof value === "string") return `${key}="${value}"`;
          
          if (typeof value === "boolean") return value ? key : `${key}={false}`;
          
          // If a prop contains a ComponentNode, render it as JSX
          if (isComponentNode(value)) {
            const renderedNode = renderComponent(value as ComponentNode, 0).trim();
            return `${key}={${renderedNode}}`;
          }

          // Default: Stringify arrays or unknown objects
          if (Array.isArray(value) || typeof value === "object") {
            return `${key}={${JSON.stringify(value)}}`;
          }
          
          return `${key}={${value}}`;
        })
        .filter(Boolean)
        .join(" ")
    : "";

  const tagWithProps = `${node.type}${propsString ? " " + propsString : ""}`;

  // 4. Combine all children
  const allChildren = [
    ...extractedChildren,
    ...(node.children || [])
  ];

  // 5. Render self-closing tag if empty
  if (allChildren.length === 0) {
    return `${space}<${tagWithProps} />`;
  }

  // 6. Recursively render children blocks
  const childrenBlocks = allChildren
    .map((child) => renderComponent(child, indent + 2))
    .join("\n");

  return `${space}<${tagWithProps}>\n${childrenBlocks}\n${space}</${node.type}>`;
}

export function buildJSX(plan: UIPlan): string {
  const layoutClass =
    plan.layout === "stack"
      ? "flex flex-col gap-4"
      : plan.layout === "grid"
      ? "grid gap-4"
      : "flex gap-4"; // Default for Sidebars

  const components = plan.components
    .map((component) => renderComponent(component, 6))
    .join("\n");

  // Removed p-6 to allow full-screen sidebars.
  return `function GeneratedUI() {
  return (
    <div className="${layoutClass} min-h-screen w-full bg-gray-50">
${components}
    </div>
  );
}`;
}