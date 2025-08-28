import React from "react";
export interface TestButtonProps {
    children: React.ReactNode;
    variant?: "primary" | "secondary";
    size?: "sm" | "md" | "lg";
    onClick?: () => void;
}
export declare function TestButton({ children, variant, size, onClick, }: TestButtonProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=test-button.d.ts.map