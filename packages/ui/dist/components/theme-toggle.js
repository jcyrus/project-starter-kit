"use client";
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThemeToggle = ThemeToggle;
const jsx_runtime_1 = require("react/jsx-runtime");
const lucide_react_1 = require("lucide-react");
const next_themes_1 = require("next-themes");
const button_1 = require("@workspace/ui/components/button");
function ThemeToggle() {
    const { setTheme, theme } = (0, next_themes_1.useTheme)();
    return ((0, jsx_runtime_1.jsxs)(button_1.Button, { variant: "outline", size: "icon", onClick: () => setTheme(theme === "light" ? "dark" : "light"), children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Sun, { className: "h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" }), (0, jsx_runtime_1.jsx)(lucide_react_1.Moon, { className: "absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" }), (0, jsx_runtime_1.jsx)("span", { className: "sr-only", children: "Toggle theme" })] }));
}
