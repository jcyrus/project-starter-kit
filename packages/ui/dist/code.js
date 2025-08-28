"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Code = Code;
const jsx_runtime_1 = require("react/jsx-runtime");
function Code({ children, className, }) {
    return (0, jsx_runtime_1.jsx)("code", { className: className, children: children });
}
