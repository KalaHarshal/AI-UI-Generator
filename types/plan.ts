export interface ComponentNode {
  type: string;
  props?: Record<string, any>;
  children?: ComponentNode[];
}

export interface UIPlan {
  layout: "stack" | "grid" | "flex";
  components: ComponentNode[];
}
