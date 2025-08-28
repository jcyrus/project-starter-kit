"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Card = Card;
const jsx_runtime_1 = require("react/jsx-runtime");
function Card({ className, title, children, href, }) {
    return ((0, jsx_runtime_1.jsxs)("a", { className: className, href: `${href}?utm_source=create-turbo&utm_medium=basic&utm_campaign=create-turbo"`, rel: "noopener noreferrer", target: "_blank", children: [(0, jsx_runtime_1.jsxs)("h2", { children: [title, " ", (0, jsx_runtime_1.jsx)("span", { children: "->" })] }), (0, jsx_runtime_1.jsx)("p", { children: children })] }));
}
