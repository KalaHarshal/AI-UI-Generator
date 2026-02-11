"use client";

import { useState } from "react";

export default function Home() {
  const [code, setCode] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  return (
    <div className="flex h-screen">
      
      {/* Left Panel - Chat */}
      <div className="w-1/3 border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200 font-semibold">
          AI Chat
        </div>

        <div className="flex-1 p-4 overflow-y-auto space-y-2">
          {messages.map((msg, index) => (
            <div
              key={index}
              className="bg-gray-100 p-2 rounded text-sm"
            >
              {msg}
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={() => {
              setMessages([...messages, "Test message"]);
            }}
            className="bg-black text-white px-4 py-2 rounded"
          >
            Test Chat
          </button>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex flex-col">

        {/* Code Editor Placeholder */}
        <div className="flex-1 border-b border-gray-200 p-4">
          <pre className="text-xs bg-gray-50 h-full overflow-auto p-4">
            {code || "// Generated code will appear here"}
          </pre>
        </div>

        {/* Preview Placeholder */}
        <div className="flex-1 p-4">
          <div className="border border-gray-200 h-full flex items-center justify-center text-gray-400">
            Live Preview
          </div>
        </div>

      </div>
    </div>
  );
}
