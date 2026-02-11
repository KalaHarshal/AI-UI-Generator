export type ComponentType =
  | "Button"
  | "Card"
  | "Input"
  | "Modal"
  | "Navbar"
  | "Sidebar"
  | "Table"
  | "Chart";

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
      children: "string",
    },
  },

  Card: {
    name: "Card",
    props: {
      title: "string",
      subtitle: "string",
      variant: ["default", "bordered", "elevated"],
      padding: ["none", "sm", "md", "lg"],
      children: "node",
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
      children: "node",
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
};
