"use client";

import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Copy,
  Check,
  Trash2,
  FileCode,
  Maximize2,
  Image,
  ListOrdered,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToolEvents } from "@/lib/analytics";

// ─── Helpers ──────────────────────────────────────────────────────────

function optimizeSvg(raw: string): string {
  let s = raw.trim();
  // Remove XML declaration
  s = s.replace(/<\?xml[^?]*\?>\s*/gi, "");
  // Remove DOCTYPE
  s = s.replace(/<!DOCTYPE[^>]*>\s*/gi, "");
  // Remove comments
  s = s.replace(/<!--[\s\S]*?-->/g, "");
  // Collapse whitespace between tags
  s = s.replace(/>\s+</g, "><");
  // Trim leading/trailing whitespace inside the SVG
  s = s.trim();
  return s;
}

function urlEncodeSvg(svg: string): string {
  return svg
    .replace(/"/g, "'")
    .replace(/%/g, "%25")
    .replace(/#/g, "%23")
    .replace(/{/g, "%7B")
    .replace(/}/g, "%7D")
    .replace(/</g, "%3C")
    .replace(/>/g, "%3E")
    .replace(/\s+/g, " ");
}

function toBase64(svg: string): string {
  try {
    return btoa(unescape(encodeURIComponent(svg)));
  } catch {
    return btoa(svg);
  }
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  return `${(bytes / 1024).toFixed(1)} KB`;
}

// ─── Component ────────────────────────────────────────────────────────

const EXAMPLE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="12" cy="12" r="10"/>
  <path d="m9 12 2 2 4-4"/>
</svg>`;

type CSSProperty = "background-image" | "mask-image" | "list-style-image";

interface OutputSection {
  label: string;
  property: CSSProperty;
  icon: React.ReactNode;
}

const OUTPUT_SECTIONS: OutputSection[] = [
  {
    label: "background-image",
    property: "background-image",
    icon: <Image className="h-4 w-4" />,
  },
  {
    label: "mask-image",
    property: "mask-image",
    icon: <Maximize2 className="h-4 w-4" />,
  },
  {
    label: "list-style-image",
    property: "list-style-image",
    icon: <ListOrdered className="h-4 w-4" />,
  },
];

export function SvgToCssTool() {
  const [input, setInput] = useState("");
  const [encoding, setEncoding] = useState<"url" | "base64">("url");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const optimized = useMemo(() => {
    if (!input.trim()) return "";
    return optimizeSvg(input);
  }, [input]);

  const urlEncoded = useMemo(() => {
    if (!optimized) return "";
    return `data:image/svg+xml,${urlEncodeSvg(optimized)}`;
  }, [optimized]);

  const base64Encoded = useMemo(() => {
    if (!optimized) return "";
    return `data:image/svg+xml;base64,${toBase64(optimized)}`;
  }, [optimized]);

  const dataUri = encoding === "url" ? urlEncoded : base64Encoded;

  const urlSize = new Blob([urlEncoded]).size;
  const base64Size = new Blob([base64Encoded]).size;
  const originalSize = new Blob([input]).size;
  const optimizedSize = new Blob([optimized]).size;

  const getCssForProperty = useCallback(
    (property: CSSProperty) => {
      if (!dataUri) return "";
      if (property === "mask-image") {
        return `-webkit-mask-image: url("${dataUri}");\nmask-image: url("${dataUri}");\n-webkit-mask-repeat: no-repeat;\nmask-repeat: no-repeat;\n-webkit-mask-size: contain;\nmask-size: contain;`;
      }
      if (property === "list-style-image") {
        return `list-style-image: url("${dataUri}");`;
      }
      return `background-image: url("${dataUri}");\nbackground-repeat: no-repeat;\nbackground-size: contain;`;
    },
    [dataUri]
  );

  const copyToClipboard = useCallback(
    async (text: string, key: string) => {
      try {
        await navigator.clipboard.writeText(text);
        setCopiedKey(key);
        toast.success("Copied to clipboard!");
        ToolEvents.resultCopied();
        setTimeout(() => setCopiedKey(null), 2000);
      } catch {
        toast.error("Failed to copy");
      }
    },
    []
  );

  const handleClear = useCallback(() => {
    setInput("");
    toast("Input cleared");
  }, []);

  const handleLoadExample = useCallback(() => {
    setInput(EXAMPLE_SVG);
    ToolEvents.toolUsed("load-example");
  }, []);

  const hasSvg = optimized.length > 0;

  return (
    <div className="space-y-6">
      {/* Input Area */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label
            htmlFor="svg-input"
            className="text-sm font-medium flex items-center gap-2"
          >
            <FileCode className="h-4 w-4 text-brand" />
            SVG Input
          </label>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={handleLoadExample}>
              Load Example
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              disabled={!input}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Clear
            </Button>
          </div>
        </div>
        <textarea
          id="svg-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste your SVG markup here..."
          className="w-full h-48 rounded-xl border border-border/50 bg-muted/30 p-4 font-mono text-sm resize-y focus:outline-none focus:ring-2 focus:ring-brand/40 transition-shadow"
          spellCheck={false}
        />
      </div>

      {/* Stats Bar */}
      <AnimatePresence>
        {hasSvg && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-wrap items-center gap-3"
          >
            <Badge variant="secondary" className="text-xs">
              Original: {formatBytes(originalSize)}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              Optimized: {formatBytes(optimizedSize)}
            </Badge>
            <Badge
              variant="secondary"
              className={`text-xs ${
                encoding === "url"
                  ? "ring-2 ring-brand/40"
                  : ""
              }`}
            >
              URL-encoded: {formatBytes(urlSize)}
            </Badge>
            <Badge
              variant="secondary"
              className={`text-xs ${
                encoding === "base64"
                  ? "ring-2 ring-brand/40"
                  : ""
              }`}
            >
              Base64: {formatBytes(base64Size)}
            </Badge>
            {urlSize < base64Size ? (
              <Badge className="text-xs bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20">
                URL-encoded is {formatBytes(base64Size - urlSize)} smaller
              </Badge>
            ) : urlSize > base64Size ? (
              <Badge className="text-xs bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20">
                Base64 is {formatBytes(urlSize - base64Size)} smaller
              </Badge>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Encoding Toggle */}
      <AnimatePresence>
        {hasSvg && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            <Tabs
              value={encoding}
              onValueChange={(v) => {
                setEncoding(v as "url" | "base64");
                ToolEvents.toolUsed(`encoding-${v}`);
              }}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 max-w-xs">
                <TabsTrigger value="url">URL-encoded</TabsTrigger>
                <TabsTrigger value="base64">Base64</TabsTrigger>
              </TabsList>
            </Tabs>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Live Preview */}
      <AnimatePresence>
        {hasSvg && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="space-y-3"
          >
            <h3 className="text-sm font-medium">Live Preview</h3>
            <div className="rounded-xl border border-border/50 bg-muted/30 p-6 flex items-center justify-center min-h-[120px]">
              <div
                className="w-24 h-24"
                style={{
                  backgroundImage: `url("${dataUri}")`,
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "contain",
                  backgroundPosition: "center",
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CSS Outputs */}
      <AnimatePresence>
        {hasSvg && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="space-y-4"
          >
            <h3 className="text-sm font-medium">CSS Output</h3>

            <Tabs defaultValue="background-image" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                {OUTPUT_SECTIONS.map((section) => (
                  <TabsTrigger
                    key={section.property}
                    value={section.property}
                    className="flex items-center gap-1.5 text-xs sm:text-sm"
                  >
                    {section.icon}
                    <span className="hidden sm:inline">{section.label}</span>
                    <span className="sm:hidden">
                      {section.label.split("-").pop()}
                    </span>
                  </TabsTrigger>
                ))}
              </TabsList>

              {OUTPUT_SECTIONS.map((section) => {
                const css = getCssForProperty(section.property);
                const key = `${section.property}-${encoding}`;
                return (
                  <TabsContent
                    key={section.property}
                    value={section.property}
                    className="mt-4"
                  >
                    <div className="relative rounded-xl border border-border/50 bg-muted/30 overflow-hidden">
                      <div className="absolute top-3 right-3 z-10">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(css, key)}
                          className="h-8 px-3"
                        >
                          {copiedKey === key ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                          <span className="ml-1.5 text-xs">
                            {copiedKey === key ? "Copied" : "Copy"}
                          </span>
                        </Button>
                      </div>
                      <pre className="p-4 pr-24 text-sm font-mono overflow-x-auto whitespace-pre-wrap break-all text-foreground/80">
                        {css}
                      </pre>
                    </div>
                  </TabsContent>
                );
              })}
            </Tabs>

            {/* Raw Data URI */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-muted-foreground">
                  Raw Data URI
                </h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(dataUri, "raw-uri")}
                  className="h-8 px-3"
                >
                  {copiedKey === "raw-uri" ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                  <span className="ml-1.5 text-xs">
                    {copiedKey === "raw-uri" ? "Copied" : "Copy"}
                  </span>
                </Button>
              </div>
              <div className="rounded-xl border border-border/50 bg-muted/30 p-4 max-h-32 overflow-y-auto">
                <code className="text-xs font-mono break-all text-muted-foreground">
                  {dataUri}
                </code>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
