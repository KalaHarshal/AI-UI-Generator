export type ComponentType =
  | "Button"
  | "Card"
  | "Input"
  | "Modal"
  | "Navbar"
  | "Sidebar"
  | "Table"
  | "Chart"
  | "Container" // ✅ ADDED: This fixes the validation error
  // Native HTML primitives
  | "div"
  | "span"
  | "p"
  | "h1"
  | "h2"
  | "h3";

export interface ComponentSchema {
  name: ComponentType;
  props: Record<string, any>;
}

export const COMPONENT_SCHEMAS: Record<ComponentType, ComponentSchema> = {
  Button: {
    name: "Button",
    props: {
      variant: ["primary", "secondary", "danger", "ghost"],
      size: ["sm", "md", "lg"],
      disabled: "boolean",
    },
  },

  Card: {
    name: "Card",
    props: {
      title: "string",
      subtitle: "string",
      variant: ["default", "bordered", "elevated"],
      padding: ["none", "sm", "md", "lg"],
      footer: "node",
    },
  },

  Input: {
    name: "Input",
    props: {
      label: "string",
      type: ["text", "email", "password", "number", "search"],
      placeholder: "string",
      error: "string",
      disabled: "boolean",
    },
  },

  Modal: {
    name: "Modal",
    props: {
      title: "string",
      size: ["sm", "md", "lg", "xl"],
      footer: "node",
    },
  },

  Navbar: {
    name: "Navbar",
    props: {
      brand: "string",
      variant: ["light", "dark"],
      items: "array",
      actions: "node",
    },
  },

  Sidebar: {
    name: "Sidebar",
    props: {
      title: "string",
      width: ["sm", "md", "lg"],
      items: "array",
      footer: "node",
    },
  },

  Table: {
    name: "Table",
    props: {
      columns: "array",
      data: "array",
      striped: "boolean",
      hoverable: "boolean",
    },
  },

  Chart: {
    name: "Chart",
    props: {
      data: "array",
      height: ["sm", "md", "lg"],
    },
  },

  // ✅ ADDED CONTAINER DEFINITION
  Container: {
    name: "Container",
    props: {
      layout: ["flex", "grid"],
      columns: [2, 3, 4], // For grid layouts
      gap: ["sm", "md", "lg"],
    },
  },

  // --- HTML PRIMITIVES ---
  div: {
    name: "div",
    props: {},
  },
  span: {
    name: "span",
    props: {},
  },
  p: {
    name: "p",
    props: {},
  },
  h1: {
    name: "h1",
    props: {},
  },
  h2: {
    name: "h2",
    props: {},
  },
  h3: {
    name: "h3",
    props: {},
  },
};