AI UI Generator
Deterministic Natural Language → React UI Agent

A structured AI agent that converts natural language UI intent into validated, deterministic React UI code using a fixed component system.

Built as part of the Assignment.

Preview
<img width="1919" height="1039" alt="image" src="https://github.com/user-attachments/assets/df36ff31-03c0-43f8-9ea5-f27323de9108" />


Application:
https://ai-ui-generator-cyan.vercel.app/

Overview

Traditional AI code generators often hallucinate:

Arbitrary CSS

Unknown props

Non-existent components

External libraries

This system eliminates that behavior.

Instead of free-form generation, the agent:

Plans a structured UI in JSON

Validates it against a strict schema

Deterministically renders JSX

Explains its reasoning

The output is predictable, validated, and safe.

Core Objective

Build an AI agent that:

Converts natural language → structured layout

Is strictly bound to a fixed component library

Prevents hallucinated props and styling

Supports incremental editing

Produces guaranteed-valid React JSX

Architecture

Backend entry point:

app/api/ai/route.ts


The system follows a controlled pipeline:

Planner → Validator → Generator → Explainer

1. Planner (LLM – JSON Only)

Model: gpt-4o-mini (JSON Mode)

Input

User prompt

Previous JSON layout state

Output

Pure JSON layout tree

Example:

{
  "type": "Container",
  "props": {
    "layout": "grid",
    "columns": 3
  },
  "children": []
}


The planner never generates JSX — only structured data.

2. Validator (Schema Enforcement)

File:

lib/validator.ts


Responsibilities:

Ensure component exists in whitelist

Validate props against schema definitions

Enforce strict typing

Reject unknown fields

Reject styling props

Prevents:

className

style

Arbitrary Tailwind classes

Unknown components

Unknown props

If validation fails, the planner retries.

3. Generator (Deterministic Renderer)

File:

lib/jsxBuilder.ts


This step:

Is NOT LLM-based

Is a pure function

Converts JSON → JSX string

Guarantees:

Syntactically valid React

Exact match to validated plan

Zero hallucination risk

4. Explainer (Reasoning Layer)

A lightweight LLM call that:

Explains layout decisions

Improves transparency

Justifies structural choices

Example:

A grid layout was used to align the stats side-by-side for better visual hierarchy.

Component System

The AI operates under a strict No-CSS Principle.

It selects semantic components — never styles.

Available Components

Sidebar

Navbar

Container (Grid / Flex)

Card

Table (auto-mocked data)

Chart (bar charts with mock data)

Button

Input

Modal

Explicitly Prohibited

className

style={{}}

Inline CSS

Arbitrary Tailwind classes

External UI libraries

New component definitions

If a user requests:

Change the sidebar background to red


The system politely refuses.

Key Capabilities
Deterministic Generation

All output strictly conforms to schema.

Incremental Editing

Maintains previous JSON state.

Examples:

Add a chart below the stats
Insert a table inside that card
Add a modal with a form


Only relevant parts of the layout are modified.

Automatic Mock Data

If no data is provided:

Tables generate structured sample rows

Charts generate realistic metrics

Live Development Interface

Chat panel

Monaco code editor

Real-time React preview

Technical Stack
Frontend

Next.js 14 (App Router)

React

Tailwind CSS (application shell only)

Editor

Monaco Editor

AI

OpenAI API

gpt-4o-mini (JSON mode)

Validation

Custom schema validation logic

Local Development
1. Clone
git clone https://github.com/KalaHarshal/AI-UI-Generator.git
cd AI-UI-Generator

2. Install
npm install

3. Environment Variables

Create .env.local:

OPENAI_API_KEY=sk-your-key-here

4. Run
npm run dev


Open:

http://localhost:3000

Example Prompts
Complex Layout
Create a dashboard with a sidebar, a navbar, and three stat cards in a grid.

Incremental Editing
Add a chart below the stats.

Mock Data
Add a recent activity table.

Guardrail Test
Change the sidebar background to red.


Expected behavior: graceful refusal.

Known Limitations

Limited component library

Mostly presentation components

Desktop-optimized sidebar

No advanced form state handling

No streaming responses

Future Improvements

Drag-and-drop visual plan editor

Zod-based runtime schema validation

Streaming planner responses

Expanded component library

Improved mobile responsiveness

Design Philosophy

This project prioritizes:

Determinism over creativity

Structural correctness over flexibility

Guardrails over arbitrary styling

Production reliability over visual freedom

It demonstrates how AI agents can be constrained into safe, enterprise-ready UI systems.

License

MIT License
