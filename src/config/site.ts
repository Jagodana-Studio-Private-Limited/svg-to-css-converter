export const siteConfig = {
  name: "SVG to CSS Converter",
  title: "SVG to CSS Converter — Inline SVG as background-image, mask, or data URI",
  description:
    "Convert SVG markup to CSS background-image data URIs, Base64 or URL-encoded. Get copy-ready CSS for backgrounds, masks, and list-style-image instantly.",
  url: "https://svg-to-css-converter.tools.jagodana.com",
  ogImage: "/opengraph-image",

  headerIcon: "Code",
  brandAccentColor: "#6366f1",

  keywords: [
    "svg to css",
    "svg data uri",
    "inline svg css",
    "svg background image css",
    "svg to data uri online",
    "convert svg to css background-image",
    "svg mask-image css",
    "svg base64 css",
    "svg url encode css",
    "css background svg inline",
  ],
  applicationCategory: "DeveloperApplication",

  themeColor: "#3b82f6",

  creator: "Jagodana",
  creatorUrl: "https://jagodana.com",
  twitterHandle: "@jagodana",

  socialProfiles: [
    "https://twitter.com/jagodana",
    "https://github.com/Jagodana-Studio-Private-Limited",
    "https://www.linkedin.com/company/jagodana",
  ],

  links: {
    github:
      "https://github.com/Jagodana-Studio-Private-Limited/svg-to-css-converter",
    website: "https://jagodana.com",
  },

  footer: {
    about:
      "SVG to CSS Converter transforms your SVG markup into ready-to-use CSS data URIs. Eliminate extra HTTP requests by inlining SVGs directly in your stylesheets — no server uploads, 100% client-side.",
    featuresTitle: "Features",
    features: [
      "URL-encoded & Base64 output",
      "background-image, mask-image, list-style-image",
      "SVG optimization before encoding",
      "Live preview + size comparison",
    ],
  },

  hero: {
    badge: "100% Client-Side · No Uploads",
    titleLine1: "Convert SVG to",
    titleGradient: "CSS Data URIs",
    subtitle:
      "Paste your SVG markup and get copy-ready CSS for background-image, mask-image, and list-style-image — URL-encoded or Base64. Optimizes SVG, compares sizes, and shows a live preview.",
  },

  featureCards: [
    {
      icon: "🔗",
      title: "Data URI Output",
      description:
        "Instantly convert SVG to URL-encoded or Base64 data URIs for use in CSS background-image properties.",
    },
    {
      icon: "🎭",
      title: "Multiple CSS Properties",
      description:
        "Get ready-to-copy CSS for background-image, mask-image, and list-style-image with a single paste.",
    },
    {
      icon: "⚡",
      title: "Optimized & Compared",
      description:
        "SVG is cleaned up before encoding. See size comparisons between URL-encoded and Base64 to pick the smallest.",
    },
  ],

  relatedTools: [
    {
      name: "Favicon Generator",
      url: "https://favicon-generator.tools.jagodana.com",
      icon: "🎨",
      description: "Generate all favicon sizes + manifest from any image.",
    },
    {
      name: "Color Palette Explorer",
      url: "https://color-palette-explorer.tools.jagodana.com",
      icon: "🎭",
      description: "Extract color palettes from any image.",
    },
    {
      name: "CSS Gradient Generator",
      url: "https://css-gradient-generator.tools.jagodana.com",
      icon: "🌈",
      description: "Create beautiful CSS gradients visually.",
    },
    {
      name: "Regex Playground",
      url: "https://regex-playground.tools.jagodana.com",
      icon: "🧪",
      description: "Build, test & debug regular expressions in real-time.",
    },
    {
      name: "Screenshot Beautifier",
      url: "https://screenshot-beautifier.tools.jagodana.com",
      icon: "📸",
      description: "Transform screenshots into beautiful images.",
    },
    {
      name: "Logo Maker",
      url: "https://logo-maker.tools.jagodana.com",
      icon: "✏️",
      description: "Create a professional logo in 60 seconds.",
    },
  ],

  howToSteps: [
    {
      name: "Paste your SVG",
      text: "Copy your SVG markup and paste it into the input area. The tool accepts raw SVG code.",
      url: "",
    },
    {
      name: "Choose encoding",
      text: "Select URL-encoded or Base64 encoding. The tool shows both with a size comparison so you can pick the smaller one.",
      url: "",
    },
    {
      name: "Copy the CSS",
      text: "Click the copy button next to any CSS output — background-image, mask-image, or list-style-image — and paste it directly into your stylesheet.",
      url: "",
    },
  ],
  howToTotalTime: "PT1M",

  faq: [
    {
      question: "Why inline SVG as a CSS data URI?",
      answer:
        "Inlining SVGs as data URIs eliminates extra HTTP requests, prevents flash of unstyled content (FOUC) on icons, and keeps your assets self-contained in the stylesheet. It's especially useful for small icons and UI elements.",
    },
    {
      question: "Should I use URL-encoded or Base64?",
      answer:
        "URL-encoded is usually smaller for SVG because SVG is text-based. Base64 adds ~33% overhead. This tool shows both sizes so you can compare and pick the best option for your case.",
    },
    {
      question: "Is my SVG data sent to a server?",
      answer:
        "No. Everything happens in your browser. Your SVG never leaves your machine — there are no server uploads or API calls.",
    },
    {
      question: "What SVG optimization does the tool do?",
      answer:
        "The tool removes unnecessary whitespace, XML declarations, comments, and redundant attributes before encoding. This produces smaller data URIs without changing how the SVG renders.",
    },
    {
      question: "Can I use data URI SVGs in all browsers?",
      answer:
        "Yes. CSS data URIs with SVG are supported in all modern browsers including Chrome, Firefox, Safari, and Edge. They've been widely supported since IE9.",
    },
  ],

  pages: {
    "/": {
      title:
        "SVG to CSS Converter — Inline SVG as background-image, mask, or data URI",
      description:
        "Convert SVG markup to CSS background-image data URIs, Base64 or URL-encoded. Get copy-ready CSS for backgrounds, masks, and list-style-image instantly.",
      changeFrequency: "weekly" as const,
      priority: 1,
    },
  },
} as const;

export type SiteConfig = typeof siteConfig;
