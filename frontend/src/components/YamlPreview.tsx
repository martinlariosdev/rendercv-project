"use client";

import { useMemo, useState } from "react";
import { useResumeStore } from "@/store/resumeStore";
import { serializeToYaml } from "@/lib/yamlSerializer";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import yaml from "react-syntax-highlighter/dist/esm/languages/hljs/yaml";
import { githubGist } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { Copy, Check } from "lucide-react";

SyntaxHighlighter.registerLanguage("yaml", yaml);

export default function YamlPreview() {
  const resumeData = useResumeStore((s) => s.resumeData);
  const [copied, setCopied] = useState(false);

  const yamlText = useMemo(() => serializeToYaml(resumeData), [resumeData]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(yamlText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-2">
        <span className="text-sm font-medium text-gray-600">YAML Output</span>
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700 hover:bg-gray-200"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3" /> Copied
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" /> Copy
            </>
          )}
        </button>
      </div>
      <div className="flex-1 overflow-auto bg-gray-50 p-0">
        <SyntaxHighlighter
          language="yaml"
          style={githubGist}
          customStyle={{
            margin: 0,
            padding: "1rem",
            background: "transparent",
            fontSize: "0.8125rem",
            lineHeight: 1.6,
            minHeight: "100%",
          }}
          wrapLongLines
        >
          {yamlText}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
