"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

// Monaco must be dynamically loaded (no SSR)
const MonacoEditor = dynamic(
  () => import("@monaco-editor/react"),
  { ssr: false }
);

export default function Home() {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setMessages((prev) => [...prev, `🧑 ${userMessage}`]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user: userMessage }),
      });

      const data = await res.json();

      if (data.error) {
        setMessages((prev) => [
          ...prev,
          `❌ Error: ${data.error}`,
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          "🤖 UI generated successfully.",
        ]);
        setCode(data.code);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        "❌ Failed to connect to server.",
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen">

      {/* ================= LEFT PANEL ================= */}
      <div className="w-1/3 border-r border-gray-200 flex flex-col">

        <div className="p-4 border-b border-gray-200 font-semibold">
          AI Chat
        </div>

        <div className="flex-1 p-4 overflow-y-auto space-y-2 text-sm">
          {messages.map((msg, index) => (
            <div key={index} className="bg-gray-100 p-2 rounded">
              {msg}
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-gray-200 flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe your UI..."
            className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm"
          />
          <button
            onClick={handleSend}
            disabled={loading}
            className="bg-black text-white px-4 py-2 rounded text-sm disabled:opacity-50"
          >
            {loading ? "..." : "Send"}
          </button>
        </div>
      </div>

      {/* ================= RIGHT PANEL ================= */}
      <div className="flex-1 flex flex-col">

        {/* ========= CODE EDITOR ========= */}
        <div className="flex-1 border-b border-gray-200">
          <MonacoEditor
            height="100%"
            defaultLanguage="javascript"
            value={code}
            theme="vs-dark"
            onChange={(value) => setCode(value || "")}
            options={{
              fontSize: 13,
              minimap: { enabled: false },
              wordWrap: "on",
              scrollBeyondLastLine: false,
            }}
          />
        </div>

        {/* ========= LIVE PREVIEW ========= */}
        <div className="flex-1 p-4">
          <iframe
            className="w-full h-full border border-gray-200 rounded"
            sandbox="allow-scripts"
            srcDoc={`
              <html>
                <head>
                  <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
                  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
                  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
                  <style>
                    body { font-family: sans-serif; padding: 20px; }
                    .card { border: 1px solid #ddd; padding: 16px; border-radius: 8px; }
                    .button { padding: 8px 12px; background: black; color: white; border-radius: 6px; }
                  </style>
                </head>
                <body>
                  <div id="root"></div>

                  <script type="text/babel">

                    // ===== Deterministic Component Library =====
                    const Button = ({ children }) => (
                      <button className="button">{children}</button>
                    );

                    const Card = ({ title, children }) => (
                      <div className="card">
                        {title && <h3>{title}</h3>}
                        {children}
                      </div>
                    );

                    const Input = ({ label }) => (
                      <div>
                        {label && <label>{label}</label>}
                        <input />
                      </div>
                    );

                    const Modal = ({ children }) => <div>{children}</div>;
                    const Navbar = ({ children }) => <div>{children}</div>;
                    const Sidebar = ({ children }) => <div>{children}</div>;
                    const Table = () => <div>Table</div>;
                    const Chart = () => <div>Chart</div>;

                    ${code}

                    ReactDOM.createRoot(document.getElementById("root")).render(
                      React.createElement(GeneratedUI)
                    );

                  </script>
                </body>
              </html>
            `}
          />
        </div>

      </div>
    </div>
  );
}
