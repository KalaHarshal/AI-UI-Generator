export interface ComponentNode {
  type: string;
  props: Record<string, any>;
  children?: (ComponentNode | string)[]; // Can be nested components OR text strings
}

export interface UIPlan {
  layout: "stack" | "grid" | "flex";
  components: ComponentNode[];
}