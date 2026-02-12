"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
});

interface Version {
  id: string;
  prompt: string;
  plan: any;
  code: string;
  explanation: string;
  timestamp: number;
}

export default function Home() {
  const [versions, setVersions] = useState<Version[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);

  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [code, setCode] = useState("");
  const [plan, setPlan] = useState<any>(null);
  const [currentExplanation, setCurrentExplanation] = useState("");
  const [loading, setLoading] = useState(false);

  // Auto-scroll chat
  useEffect(() => {
    const chatBox = document.getElementById("chat-box");
    if (chatBox) chatBox.scrollTop = chatBox.scrollHeight;
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setMessages((prev) => [...prev, `👤 ${userMessage}`]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: userMessage,
          previousPlan: plan,
        }),
      });

      const data = await res.json();

      if (data.error) {
        setMessages((prev) => [...prev, `❌ ${data.error}`]);
        if (data.details) {
          console.error("Error details:", data.details);
        }
      } else {
        setMessages((prev) => [...prev, "🤖 UI generated successfully."]);

        setCode(data.code);
        setPlan(data.plan);
        setCurrentExplanation(data.explanation);

        const newVersion: Version = {
          id: crypto.randomUUID(),
          prompt: userMessage,
          plan: data.plan,
          code: data.code,
          explanation: data.explanation,
          timestamp: Date.now(),
        };

        const trimmed = versions.slice(0, currentIndex + 1);
        setVersions([...trimmed, newVersion]);
        setCurrentIndex(trimmed.length);
      }
    } catch (err: any) {
      setMessages((prev) => [...prev, `❌ Failed to connect to server: ${err.message}`]);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const rollbackTo = (index: number) => {
    const version = versions[index];
    setCurrentIndex(index);
    setCode(version.code);
    setPlan(version.plan);
    setCurrentExplanation(version.explanation);
  };

  // ==========================================
  // COMPONENT LIBRARY FOR PREVIEW
  // Matches TypeScript components exactly
  // ==========================================
  const PREVIEW_COMPONENT_LIB = `
    const Button = ({ variant = "primary", size = "md", disabled = false, children, type = "button" }) => {
      const base = "font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
      const variants = {
        primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 active:bg-blue-800",
        secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-400 active:bg-gray-400",
        danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 active:bg-red-800",
        ghost: "bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-400 active:bg-gray-200",
      };
      const sizes = {
        sm: "px-3 py-1.5 text-sm",
        md: "px-4 py-2 text-base",
        lg: "px-6 py-3 text-lg",
      };
      const disabledClass = disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer";
      return React.createElement("button", { 
        type,
        className: \`\${base} \${variants[variant]} \${sizes[size]} \${disabledClass}\`, 
        disabled 
      }, children);
    };

    const Card = ({ title, subtitle, variant = "default", padding = "md", children, footer }) => {
      const base = "rounded-lg bg-white";
      const variants = {
        default: "border border-gray-200",
        bordered: "border-2 border-gray-300",
        elevated: "shadow-lg border border-gray-100",
      };
      const paddings = {
        none: "p-0",
        sm: "p-3",
        md: "p-5",
        lg: "p-8",
      };
      return React.createElement("div", { className: \`\${base} \${variants[variant]} \${paddings[padding]}\` },
        (title || subtitle) && React.createElement("div", { className: "mb-4" },
          title && React.createElement("h3", { className: "text-xl font-semibold text-gray-900" }, title),
          subtitle && React.createElement("p", { className: "text-sm text-gray-600 mt-1" }, subtitle)
        ),
        React.createElement("div", {}, children),
        footer && React.createElement("div", { className: "mt-4 pt-4 border-t border-gray-200" }, footer)
      );
    };

    const Input = ({ label, type = "text", placeholder, error, disabled = false, required = false, value, onChange }) => 
      React.createElement("div", { className: "w-full" },
        label && React.createElement("label", { className: "block text-sm font-medium text-gray-700 mb-2" }, 
          label,
          required && React.createElement("span", { className: "text-red-500 ml-1" }, "*")
        ),
        React.createElement("input", { 
          type, disabled, placeholder, value, onChange, required,
          className: \`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all \${error ? "border-red-500" : "border-gray-300"} \${disabled ? "bg-gray-100 cursor-not-allowed text-gray-500" : "bg-white"}\`
        }),
        error && React.createElement("p", { className: "mt-1 text-sm text-red-600" }, error)
      );

    const Navbar = ({ brand, variant = "light", items = [], actions }) => {
      const variantClasses = {
        light: "bg-white border-b border-gray-200 text-gray-900",
        dark: "bg-gray-900 text-white border-b border-gray-800",
      };
      return React.createElement("nav", { className: \`w-full px-6 py-3 flex items-center justify-between \${variantClasses[variant]}\` },
        React.createElement("div", { className: "flex items-center gap-6" },
          brand && React.createElement("span", { className: "text-lg font-semibold" }, brand),
          React.createElement("div", { className: "flex items-center gap-4" },
            items.map((item, i) => React.createElement("button", { 
              key: i, 
              onClick: item.onClick,
              className: "text-sm hover:opacity-80 transition-opacity" 
            }, item.label))
          )
        ),
        actions && React.createElement("div", { className: "flex items-center gap-3" }, actions)
      );
    };

    const Sidebar = ({ title, width = "md", items, footer }) => {
      const widths = { sm: "w-48", md: "w-64", lg: "w-72" };
      return React.createElement("aside", { className: \`h-screen bg-white border-r border-gray-200 flex flex-col justify-between \${widths[width]}\` },
        React.createElement("div", {},
          title && React.createElement("div", { className: "px-5 py-4 border-b border-gray-200" },
            React.createElement("h2", { className: "text-lg font-semibold" }, title)
          ),
          React.createElement("nav", { className: "flex flex-col gap-1 p-3" },
            items && items.map((item, i) => React.createElement("button", { 
              key: i, 
              onClick: item.onClick,
              className: \`text-left px-3 py-2 rounded-md text-sm transition-colors \${item.active ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100 text-gray-700"}\`
            }, item.label))
          )
        ),
        footer && React.createElement("div", { className: "border-t border-gray-200 p-3" }, footer)
      );
    };
    
    const Table = ({ columns, data, striped = false, hoverable = true }) => 
      React.createElement("div", { className: "w-full overflow-x-auto" },
        React.createElement("table", { className: "min-w-full border border-gray-200 rounded-md overflow-hidden" },
          React.createElement("thead", { className: "bg-gray-100 border-b border-gray-200" },
            React.createElement("tr", {},
              columns?.map((col, i) => React.createElement("th", { 
                key: i, 
                className: "px-4 py-3 text-left text-sm font-semibold text-gray-700" 
              }, col.header))
            )
          ),
          React.createElement("tbody", {},
            data?.length === 0 
              ? React.createElement("tr", {},
                  React.createElement("td", { 
                    colSpan: columns?.length,
                    className: "px-4 py-8 text-center text-sm text-gray-500" 
                  }, "No data available")
                )
              : data?.map((row, i) => React.createElement("tr", { 
                  key: i,
                  className: \`border-b border-gray-200 \${striped && i % 2 === 1 ? "bg-gray-50" : ""} \${hoverable ? "hover:bg-gray-100 transition-colors" : ""}\`
                },
                  columns?.map((col, j) => React.createElement("td", { 
                    key: j, 
                    className: "px-4 py-3 text-sm text-gray-900" 
                  }, row[col.key] ?? "-"))
                ))
          )
        )
      );

    const Modal = ({ isOpen, onClose, title, children, footer, size = "md" }) => {
      const sizeClasses = {
        sm: "max-w-md",
        md: "max-w-lg",
        lg: "max-w-2xl",
        xl: "max-w-4xl",
      };
      
      if (!isOpen) return null;
      
      return React.createElement("div", { className: "fixed inset-0 z-50 flex items-center justify-center" },
        React.createElement("div", { 
          className: "absolute inset-0 bg-black bg-opacity-50 transition-opacity",
          onClick: onClose
        }),
        React.createElement("div", { className: \`relative bg-white rounded-lg shadow-xl \${sizeClasses[size]} w-full mx-4 transform transition-all\` },
          title && React.createElement("div", { className: "flex items-center justify-between p-5 border-b border-gray-200" },
            React.createElement("h2", { className: "text-xl font-semibold text-gray-900" }, title),
            React.createElement("button", { 
              onClick: onClose,
              className: "text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
            }, "✕")
          ),
          React.createElement("div", { className: "p-5" }, children),
          footer && React.createElement("div", { className: "flex items-center justify-end gap-3 p-5 border-t border-gray-200" }, footer)
        )
      );
    };

    const Chart = ({ data, height = "md" }) => {
      const heightStyles = {
        sm: "h-40",
        md: "h-56",
        lg: "h-72",
      };
      
      const getHeightClass = (value) => {
        if (value <= 20) return "h-1/5";
        if (value <= 40) return "h-2/5";
        if (value <= 60) return "h-3/5";
        if (value <= 80) return "h-4/5";
        return "h-full";
      };
      
      return React.createElement("div", { className: "bg-white border border-gray-200 rounded-lg p-5" },
        React.createElement("div", { className: \`w-full \${heightStyles[height]} flex items-end gap-4\` },
          data?.map((point, i) => React.createElement("div", { 
            key: i, 
            className: "flex flex-col items-center flex-1 h-full" 
          },
            React.createElement("div", { className: \`w-full bg-blue-500 rounded-t-md \${getHeightClass(point.value)}\` }),
            React.createElement("span", { className: "text-xs text-gray-600 mt-2" }, point.label)
          ))
        )
      );
    };
  `;

  return (
    <div className="flex h-screen bg-white">
      {/* ================= LEFT PANEL (CHAT) ================= */}
      <div className="w-[350px] border-r border-gray-200 flex flex-col bg-gray-50">
        <div className="p-4 border-b border-gray-200 font-bold text-lg bg-white">
          AI Studio
        </div>

        {/* Messages */}
        <div id="chat-box" className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-gray-500 text-sm mt-10">
              <p>Describe your UI to generate it.</p>
              <p className="text-xs mt-2">
                Example: "Create a login card with email, password, and a submit button."
              </p>
            </div>
          )}
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg text-sm max-w-[90%] ${
                msg.startsWith("👤")
                  ? "bg-white border border-gray-200 shadow-sm ml-auto"
                  : "bg-blue-50 text-blue-900 border border-blue-100"
              }`}
            >
              {msg}
            </div>
          ))}
        </div>

        {/* Explanation Card */}
        {currentExplanation && (
          <div className="p-4 bg-yellow-50 border-t border-b border-yellow-200 text-sm text-yellow-900">
            <span className="font-bold">💡 AI Reasoning:</span>
            <p className="mt-1 leading-relaxed">{currentExplanation}</p>
          </div>
        )}

        {/* Input */}
        <div className="p-4 bg-white border-t border-gray-200">
          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !loading && handleSend()}
              placeholder="Describe your UI..."
              disabled={loading}
              className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            />
            <button
              onClick={handleSend}
              disabled={loading}
              className="bg-black text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 disabled:opacity-50 transition-colors"
            >
              {loading ? "..." : "Send"}
            </button>
          </div>
        </div>
      </div>

      {/* ================= RIGHT PANEL (PREVIEW & CODE) ================= */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 bg-white">
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-500">
              Version <span className="font-mono text-black">{currentIndex + 1}</span> /{" "}
              {versions.length}
            </div>
            <div className="flex rounded-md shadow-sm">
              <button
                onClick={() => currentIndex > 0 && rollbackTo(currentIndex - 1)}
                disabled={currentIndex <= 0}
                className="px-3 py-1 text-xs border border-r-0 rounded-l hover:bg-gray-50 disabled:opacity-50"
              >
                ◀ Undo
              </button>
              <button
                onClick={() =>
                  currentIndex < versions.length - 1 && rollbackTo(currentIndex + 1)
                }
                disabled={currentIndex >= versions.length - 1}
                className="px-3 py-1 text-xs border rounded-r hover:bg-gray-50 disabled:opacity-50"
              >
                Redo ▶
              </button>
            </div>
          </div>
          <div className="text-xs text-gray-400 font-mono">Generated by AI-Agent</div>
        </div>

        {/* Split View */}
        <div className="flex-1 flex flex-col md:flex-row h-full overflow-hidden">
          {/* Code Editor */}
          <div className="w-full md:w-1/2 h-1/2 md:h-full border-r border-gray-200">
            <MonacoEditor
  height="100%"
  defaultLanguage="javascript"
  value={code || "// Code will appear here..."}
  theme="vs-light"
  onChange={(value) => setCode(value || "")} // ✅ 1. Update state on type
  options={{
    fontSize: 13,
    minimap: { enabled: false },
    wordWrap: "on",
    readOnly: false, // ✅ 2. Allow editing
    padding: { top: 16 },
  }}
/>
          </div>

          {/* Live Preview */}
          <div className="w-full md:w-1/2 h-1/2 md:h-full bg-gray-100 p-8 relative">
            <div className="absolute inset-4 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <iframe
                className="w-full h-full"
                title="Preview"
                sandbox="allow-scripts allow-same-origin"
                srcDoc={`
                  <!DOCTYPE html>
                  <html>
                    <head>
                      <script src="https://cdn.tailwindcss.com"></script>
                      <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
                      <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
                      <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
                    </head>
                    <body class="bg-white">
                      <div id="root"></div>
                      <script type="text/babel">
                        // --- COMPONENT LIBRARY ---
                        ${PREVIEW_COMPONENT_LIB}

                        // --- GENERATED UI CODE ---
                        ${code}

                        // --- RENDER ---
                        const root = ReactDOM.createRoot(document.getElementById("root"));
                        
                        if (typeof GeneratedUI !== 'undefined') {
                          try {
                            root.render(<GeneratedUI />);
                          } catch (e) {
                            root.render(
                              <div className="text-red-500 p-4 font-mono text-sm">
                                <div className="font-bold mb-2">Error rendering UI:</div>
                                <div>{e.message}</div>
                              </div>
                            );
                          }
                        } else {
                          root.render(
                            <div className="flex items-center justify-center h-screen text-gray-400 text-sm">
                              Enter a prompt to generate UI...
                            </div>
                          );
                        }
                      </script>
                    </body>
                  </html>
                `}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
