🧠 AI UI Generator (Deterministic Agent)

A "Claude-Code" style AI agent that converts natural language intent into working, deterministic React UI code.

This project was built as part of the Assignment.

📸 Replace the image below with your own screenshot named preview.png
<img width="1919" height="1039" alt="image" src="https://github.com/user-attachments/assets/bacf73ef-2ab5-415f-a2e1-272eca7d81a4" />

🚀 Demo

🔗 Live Demo: https://ai-ui-generator-cyan.vercel.app/

🎯 Goal

The objective was to build an AI agent that generates UI deterministically.

Unlike traditional LLM code generators that hallucinate arbitrary CSS, external libraries, or invalid props, this system is:

Strictly bound to a Fixed Component Library

Unable to invent components

Unable to invent props

Prohibited from generating arbitrary CSS

The output is predictable, validated, and safe.

✨ Key Features
✅ Safe & Deterministic

The AI selects only from a whitelisted component system

No arbitrary CSS

No className

No style={{}}

No custom component creation

🧠 Multi-Step Agent Architecture

Structured flow:

Planner → Validator → Generator → Explainer


Ensures correctness and prevents hallucination.

🔁 Incremental Editing

The agent maintains previous JSON layout state.

Example:

"Add a chart to that card"

"Insert a table below the stats"

It modifies the existing layout instead of regenerating from scratch.

🖥 Live Preview + Code

Split-pane interface:

Chat panel

Editable JSX code (Monaco Editor)

Live interactive preview

📊 Robust Data Handling

If the user does not provide data:

Charts auto-generate realistic mock data

Tables auto-populate structured sample rows

🛡 Guardrails

If a user requests something outside constraints (e.g., "Make sidebar red"):

The system politely refuses

Explains why arbitrary styling is not allowed

Maintains design consistency

🏗️ Architecture & Agent Design

Backend Entry:

app/api/ai/route.ts

1️⃣ Planner (Reasoning Engine)

Model: gpt-4o-mini (JSON Mode)

Input:

User prompt

Previous JSON layout state

Output:

Pure JSON UI tree

Constraint:

Must strictly adhere to COMPONENT_SCHEMAS

Example output shape:

{
  "type": "Container",
  "props": { "layout": "grid" },
  "children": [...]
}


No JSX is generated here — only structured data.

2️⃣ Validator (Safety Layer)

File:

lib/validator.ts


Responsibilities:

Verify component exists in whitelist

Validate props against schema

Enforce strict type checking

Reject hallucinated fields

If invalid:

The plan is rejected

The AI is prompted to retry

This prevents:

className

style

Unknown props

Unknown components

3️⃣ Generator (Deterministic Renderer)

File:

lib/jsxBuilder.ts


This step:

Is NOT LLM-based

Is a pure function

Converts JSON → JSX string

Guarantees:

Syntactically valid React code

Exact match to validated plan

Zero hallucination risk

4️⃣ Explainer (UX Enhancement)

A lightweight LLM call that:

Explains layout decisions

Improves user understanding

Example:

"I used a Grid Container to align the stats side-by-side for visual clarity."

🧱 Component System

The AI operates under a strict "No-CSS" principle.

It selects semantic components — not styles.

✅ Available Components

Sidebar

Navbar

Container (Grid / Flex layouts)

Card

Table (Auto-mocked data)

Chart (Bar charts, auto-mocked)

Button

Input

Modal

❌ Prohibited

className="..."

style={{ ... }}

External libraries

New component definitions

Inline CSS

Arbitrary Tailwind classes

🛠️ Technical Stack
Frontend

Next.js 14 (App Router)

React

Tailwind CSS (App shell only)

Editor

Monaco Editor (@monaco-editor/react)

AI

OpenAI API

gpt-4o-mini with JSON mode

Validation

Custom schema validation logic

🚀 Getting Started
1️⃣ Clone the Repository
git clone https://github.com/yourusername/ai-ui-generator.git
cd ai-ui-generator

2️⃣ Install Dependencies
npm install
# or
yarn install

3️⃣ Environment Setup

Create a .env.local file in the root directory:

OPENAI_API_KEY=sk-your-api-key-here

4️⃣ Run the Application
npm run dev


Open:

http://localhost:3000

🧪 Testing the Agent

Try these prompts:

🧩 Complex Layout
Create a dashboard with a sidebar, a title, and a 3-column stats area.

📊 Mock Data Generation
Add a Recent Activity table below the stats.


Observe auto-populated table data.

🛡 Safety Guardrail
Change the background of the sidebar to red.


Observe graceful refusal.

⚠️ Known Limitations

Limited component library (~10 components)

Mostly presentation/stateless components

Sidebar optimized for desktop dashboards

Limited design system flexibility

🔮 Future Improvements

Drag-and-drop visual builder for manual plan editing

Integrate zod for stricter runtime validation

Streaming responses for faster UI updates

Expand component library (Forms, Tabs, Filters)

Improved mobile-first layout logic

📌 Why This Matters

Most AI code generators optimize for creativity.

This system optimizes for:

Predictability

Safety

Determinism

Structural correctness

Production reliability

It demonstrates how AI agents can be constrained into safe, enterprise-ready UI systems.

📄 License

MIT License
